if Rails.env.production?
  require 'raven'

  Raven.configure do |config|
    config.dsn = Rails.application.secrets.raven
  end
end