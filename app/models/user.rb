class User < ActiveRecord::Base
  has_secure_password

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

  private

  def update_username_lower
    self.username_lower = username.downcase
  end
end