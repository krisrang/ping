sidekiq_redis = { url: $redis.url, namespace: 'sidekiq' }

Sidekiq.configure_server do |config|
  config.redis = sidekiq_redis
end

Sidetiq.configure do |config|
  # check for new jobs once every second
  config.resolution = 1
end

Sidekiq.configure_client { |config| config.redis = sidekiq_redis }
Sidekiq.logger.level = Logger::WARN