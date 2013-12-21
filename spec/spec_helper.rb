require 'rubygems'

if ENV['COVERAGE']
  require 'simplecov'
  SimpleCov.start
end

require 'coveralls'
Coveralls.wear!

require 'fabrication'
require 'mocha/api'
require 'certified'

require 'fakeweb'
FakeWeb.allow_net_connect = %r[^https?://coveralls.io]


# This file is copied to spec/ when you run 'rails generate rspec:install'
ENV["RAILS_ENV"] ||= 'test'
require File.expand_path("../../config/environment", __FILE__)
require 'rspec/rails'
require 'rspec/autorun'
require 'shoulda'

# Requires supporting ruby files with custom matchers and macros, etc,
# in spec/support/ and its subdirectories.
Dir[Rails.root.join("spec/support/**/*.rb")].each { |f| require f }

# Checks for pending migrations before tests are run.
# If you are not using ActiveRecord, you can remove this line.
ActiveRecord::Migration.check_pending! if defined?(ActiveRecord::Migration)

RSpec.configure do |config|
  config.fail_fast = ENV['RSPEC_FAIL_FAST'] == "1"
  config.mock_framework = :mocha
  config.order = 'random'

  # If you're not using ActiveRecord, or you'd prefer not to run each of your
  # examples within a transaction, remove the following line or assign false
  # instead of true.
  config.use_transactional_fixtures = true

  # If true, the base class of anonymous controllers will be inferred
  # automatically. This will be the default behavior in future versions of
  # rspec-rails.
  config.infer_base_class_for_anonymous_controllers = false
end

def freeze_time(now=Time.now)
  DateTime.stubs(:now).returns(DateTime.parse(now.to_s))
  Time.stubs(:now).returns(Time.parse(now.to_s))
end

# Spring.after_fork do
#   # $redis.client.reconnect
#   # Rails.cache.reconnect
#   # MessageBus.after_fork
# end