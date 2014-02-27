if Rails.env.production? && Rails.application.secrets.raven
  require 'raven'

  Raven.configure do |config|
    config.dsn = Rails.application.secrets.raven
  end
end
