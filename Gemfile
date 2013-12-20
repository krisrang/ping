source 'https://rubygems.org'


gem 'rails', '4.1.0.beta1'

gem 'pg'

gem 'hiredis'
gem 'redis', :require => ["redis", "redis/connection/hiredis"]
gem 'redis-rails'

# ASSETS
gem 'jquery-rails'
gem 'less-rails'
gem 'bourbon'
gem 'sass-rails', '~> 4.0.0.rc1'
gem 'uglifier', '>= 1.3.0'
gem 'therubyracer', require: 'v8'
gem 'slim-rails'
gem 'ember-rails'
gem 'gemoji', github: 'github/gemoji'


# BACKEND
gem 'active_model_serializers'
gem 'bcrypt-ruby', '~> 3.1.2'
# gem 'jbuilder', '~> 1.2'


# DEV & TEST
group :test, :development do
  # dev helpers
  gem 'pry-rails'
  gem 'pry-nav'

  # rspec
  gem 'rspec-rails', '3.0.0.beta1', require: false
  gem 'shoulda', require: false
  
  # javascript tests
  gem 'qunit-rails'
  
  # test assisters
  gem 'mock_redis'
  gem 'timecop'
  gem 'mocha', require: false
  gem 'fabrication', require: false  
  gem 'simplecov', require: false
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
  gem 'fakeweb', '~> 1.3.0', require: false
end


# DEV
group :development do
  gem 'better_errors'
  gem 'binding_of_caller'
  
  gem 'guard'
  gem 'guard-rspec', github: 'jgorset/guard-rspec', branch: 'rspec-3.0.0'
end


# SERVERS
gem 'thin', require: false
gem 'puma', require: false
gem 'unicorn', require: false