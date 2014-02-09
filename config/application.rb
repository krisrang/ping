require File.expand_path('../boot', __FILE__)

require 'rails/all'

# Require the gems listed in Gemfile, including any gems
# you've limited to :test, :development, or :production.
Bundler.require(*Rails.groups)

module Ping
  class Application < Rails::Application
    require 'ping'    

    # Custom directories with classes and modules you want to be autoloadable.
    config.autoload_paths += Dir["#{config.root}/app/serializers"]
    config.autoload_paths += Dir["#{config.root}/lib/validators/"]
    config.autoload_paths += Dir["#{config.root}/app/"]

    config.assets.precompile += ['vendor.js', 'preloader.js', 'static.js']    

    config.handlebars.templates_root = 'ping/templates'
    config.ember.variant = :development

    # per https://www.owasp.org/index.php/Password_Storage_Cheat_Sheet
    # config.pbkdf2_iterations = 64000
    # config.pbkdf2_algorithm = "sha256"

    # route all exceptions via our router
    config.exceptions_app = self.routes

    require 'rails_redis'    
    # Use redis for our cache
    config.cache_store = RailsRedis.new_redis_store

    # http cache upstream
    config.action_dispatch.rack_cache = nil

    config.middleware.use Faye::RackAdapter, mount: '/faye', timeout: 25, 
                                             engine: RailsRedis.new_faye_engine

    # Settings in config/environments/* take precedence over those specified here.
    # Application configuration should go into files in config/initializers
    # -- all .rb files in that directory are automatically loaded.

    # Set Time.zone default to the specified zone and make Active Record auto-convert to this zone.
    # Run "rake -D time" for a list of tasks for finding time zone names. Default is UTC.
    # config.time_zone = 'Central Time (US & Canada)'

    # The default locale is :en and all translations from config/locales/*.rb,yml are auto loaded.
    # config.i18n.load_path += Dir[Rails.root.join('my', 'locales', '*.{rb,yml}').to_s]
    # config.i18n.default_locale = :de
    
    config.generators do |g|
      g.test_framework :rspec
    end
  end
end
