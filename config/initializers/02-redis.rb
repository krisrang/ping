require "#{Rails.root}/lib/rails_redis"
$redis = RailsRedis.new

if defined?(Spring)
  Spring.after_fork do
    $redis = RailsRedis.new
    Ping::Application.config.cache_store.reconnect
    MessageBus.after_fork
  end
end