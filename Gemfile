source 'https://rubygems.org'
ruby '2.1.0'

gem 'rails', '4.1.0.rc1'

gem 'pg'

gem 'hiredis'
gem 'redis', require: ['redis', 'redis/connection/hiredis']
gem 'redis-rails'

gem 'faye'
gem 'faye-redis'
gem 'message_bus'

# FRONTEND
gem 'jquery-rails'
gem 'less-rails'
gem 'sass-rails'
gem 'bourbon'
gem 'uglifier'
gem 'therubyracer', require: 'v8'
gem 'slim-rails'
gem 'ember-rails'
gem 'emoji'
gem 'simple_form'

# BACKEND
gem 'sidekiq'
gem 'sidekiq-failures'
gem 'sidetiq'
gem 'sinatra', require: nil
gem 'sentry-raven', github: 'getsentry/raven-ruby'
gem 'active_model_serializers'
gem 'bcrypt-ruby'
gem 'oj'
gem 'redcarpet'
gem 'fast_xor'
gem 'lru_redux'
gem 'omniauth'
gem 'omniauth-openid'
gem 'openid-redis-store'
gem 'omniauth-facebook'
gem 'omniauth-twitter'
gem 'omniauth-github'
gem 'omniauth-google-oauth2'
gem 'omniauth-oauth2', require: false
# abandoned gem hard to tell what is going on, multiple PRs upstream being ignored:
# https://twitter.com/samsaffron/status/412372111710109696
# we use: gem 'omniauth-browserid', git: 'https://github.com/samsaffron/omniauth-browserid.git', branch: 'observer_api'
gem 'omniauth-browserid-discourse', require: 'omniauth-browserid'
gem 'postmark-rails'
gem 'rack-protection'
gem 'rack-cors', require: false

# DEV & TEST
group :test, :development do
  # dev helpers
  gem 'pry-rails'
  gem 'pry-nav'

  # rspec
  gem 'rspec-rails', require: false
  gem 'shoulda', require: false
  
  # javascript tests
  gem 'qunit-rails'
  
  # test assisters
  gem 'mock_redis'
  gem 'timecop'
  gem 'mocha', require: false
  gem 'fabrication', require: false  
  gem 'simplecov', require: false
  gem 'coveralls', require: false
  gem 'certified', require: false
  
  # test backend
  gem 'rb-fsevent', require: RUBY_PLATFORM =~ /darwin/i ? 'rb-fsevent' : false
  gem 'rb-inotify', '~> 0.9', require: RUBY_PLATFORM =~ /linux/i ? 'rb-inotify' : false

  # spring
  gem 'spring'
  gem 'spring-commands-rspec'
end

# TEST
group :test do
  gem 'fakeweb', require: false
end

# DEV
group :development do
  gem 'better_errors'
  gem 'binding_of_caller'
  
  gem 'guard'
  gem 'guard-rspec'
  gem 'terminal-notifier-guard'
end

group :production do
  gem 'rails_12factor'
end

# SERVERS
gem 'thin', require: false
gem 'puma', require: false
gem 'unicorn', require: false
