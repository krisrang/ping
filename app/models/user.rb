require_dependency 'pbkdf2'
require_dependency 'email'
require_dependency 'user_name_suggester'

class User < ActiveRecord::Base
  has_many :email_tokens, dependent: :destroy
  has_many :user_visits, dependent: :destroy

  has_one :facebook_user_info, dependent: :destroy
  has_one :twitter_user_info, dependent: :destroy
  has_one :github_user_info, dependent: :destroy
  has_one :google_user_info, dependent: :destroy
  has_one :oauth2_user_info, dependent: :destroy
  has_one :user_stat, dependent: :destroy

  before_save :update_username_lower
  before_save :ensure_password_is_hashed
  after_create :create_email_token
  after_create :create_user_stat

  validates_presence_of :username
  validate :username_validator
  validates :email, presence: true, uniqueness: true
  validates :email, email: true, if: :email_changed?
  validate :password_validator

  EMAIL = %r{([^@]+)@([^\.]+)}

  def self.find_by_username_or_email(username_or_email)
    if username_or_email.include?('@')
      find_by_email(username_or_email)
    else
      find_by_username(username_or_email)
    end
  end

  def self.find_by_email(email)
    # TODO: proper email downcasing
    where(email: Email.downcase(email)).first
  end

  def self.find_by_username(username)
    where(username_lower: username.downcase).first
  end

  def self.authenticate(login, password)
    user = find_by_username_or_email(login)
    user && user.authenticate(password)
  end
  
  def self.generate_token
    SecureRandom.hex(User.token_length)
  end

  def self.username_length
    3..15
  end

  def self.token_length
    16
  end

  def self.suggest_name(email)
    return "" unless email
    name = email.split(/[@\+]/)[0]
    name = name.gsub(".", " ")
    name.titleize
  end

  def self.username_available?(username)
    lower = username.downcase
    User.where(username_lower: lower).blank?
  end

  def self.gravatar_template(email)
    email_hash = self.email_hash(email)
    "//www.gravatar.com/avatar/#{email_hash}.png?s={size}&r=pg&d=identicon"
  end

  def self.email_hash(email)
    Digest::MD5.hexdigest(email.strip.downcase)
  end

  def email_hash
    User.email_hash(email)
  end

  def avatar_template
    User.gravatar_template(email)
  end

  def password=(password)
    # special case for passwordless accounts
    @raw_password = password unless password.blank?
  end

  def password
    '' # so that validator doesn't complain that a password attribute doesn't exist
  end

  def password_required!
    @password_required = true
  end

  def password_required?
    !!@password_required
  end

  def has_password?
    password_hash.present?
  end

  def username_validator
    username_format_validator || begin
      lower = username.downcase
      existing = User.where(username_lower: lower).first
      if username_changed? && existing && existing.id != self.id
        errors.add(:username, I18n.t(:'user.username.unique'))
      end
    end
  end

  def username_format_validator
    UsernameValidator.perform_validation(self, 'username')
  end

  def password_validator
    PasswordValidator.new(attributes: :password)
      .validate_each(self, :password, @raw_password)
  end

  def confirm_password?(password)
    return false unless password_hash && salt
    self.password_hash == hash_password(password, salt)
  end

  def email_confirmed?
    email_tokens.where(email: email, confirmed: true).present? || 
      email_tokens.empty?
  end

  def activate
    email_token = email_tokens.active.first
    if email_token
      EmailToken.confirm(email_token.token)
    else
      self.active = true
      save
    end
  end

  def update_ip_address!(new_ip_address)
    unless last_ip == new_ip_address || new_ip_address.blank?
      update_column(:last_ip, new_ip_address)
    end
  end

  def visit_record_for(date)
    user_visits.where(visited_at: date).first
  end

  def update_visit_record!(date)
    create_visit_record!(date) unless visit_record_for(date)
  end

  def create_user_stat
    stat = UserStat.new
    stat.user_id = id
    stat.save!
  end

  def create_visit_record!(date, posts_read = 0)
    user_stat.update_column(:days_visited, user_stat.days_visited + 1)
    user_visits.create!(visited_at: date)
  end

  def update_last_seen!(now = Time.zone.now)
    now_date = now.to_date
    # Only update last seen once every minute
    redis_key = "user:#{id}:#{now_date}"
    return unless $redis.setnx(redis_key, '1')

    $redis.expire(redis_key, Settings.active_user_rate_limit_secs)
    update_previous_visit(now)
    # using update_column to avoid the AR transaction
    update_column(:last_seen, now)
  end

  def update_username_lower
    self.username_lower = username.downcase
  end

  def create_email_token
    email_tokens.create(email: email)
  end

  def seen_before?
    last_seen.present?
  end

  private

  def ensure_password_is_hashed
    if @raw_password
      self.salt = SecureRandom.hex(16)
      self.password_hash = hash_password(@raw_password, salt)
    end
  end

  def hash_password(password, salt)
    Pbkdf2.hash_password(password, salt, Rails.configuration.pbkdf2_iterations, Rails.configuration.pbkdf2_algorithm)
  end

  def previous_visit_at_update_required?(timestamp)
    seen_before? && (last_seen < (timestamp - Settings.previous_visit_timeout_hours.hours))
  end

  def update_previous_visit(timestamp)
    update_visit_record!(timestamp.to_date)
    if previous_visit_at_update_required?(timestamp)
      update_column(:previous_visit, last_seen)
    end
  end
end
