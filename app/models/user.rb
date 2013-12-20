class User < ActiveRecord::Base
  def self.generate_token
    SecureRandom.hex(User.token_length)
  end

  def self.token_length
    16
  end
end