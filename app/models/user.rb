class User < ActiveRecord::Base
  has_secure_password

  has_many :email_tokens, dependent: :destroy

  after_create :create_email_token
  before_save :update_username_lower

  def self.find_by_username_or_email(username_or_email)
    if username_or_email.include?('@')
      find_by_email(username_or_email)
    else
      find_by_username(username_or_email)
    end
  end

  def self.find_by_email(email)
    # TODO: proper email downcasing
    where(email: email.downcase).first
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

  def self.token_length
    16
  end

  def email_confirmed?
    email_tokens.where(email: email, confirmed: true).present? || email_tokens.empty?
  end

  def activate
    email_token = self.email_tokens.active.first
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

  # TODO: implement
  def update_last_seen!(now=Time.zone.now)
    # now_date = now.to_date
    # # Only update last seen once every minute
    # redis_key = "user:#{id}:#{now_date}"
    # return unless $redis.setnx(redis_key, "1")

    # $redis.expire(redis_key, SiteSetting.active_user_rate_limit_secs)
    # update_previous_visit(now)
    # # using update_column to avoid the AR transaction
    # update_column(:last_seen_at, now)
  end

  def update_username_lower
    self.username_lower = username.downcase
  end

  def create_email_token
    email_tokens.create(email: email)
  end
end