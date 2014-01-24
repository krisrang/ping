class UserEmailer
  include Sidekiq::Worker

  def perform(type, opts={})
    puts 'Doing hard work'
  end
end