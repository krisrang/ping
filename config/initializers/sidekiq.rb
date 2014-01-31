sidekiq_redis = { url: $redis.url, namespace: 'sidekiq' }

Sidekiq.configure_server do |config|
  config.redis = sidekiq_redis
end

Sidetiq.configure do |config|
  # we only check for new jobs once every 2 seconds
  # to cut down on cpu cost
  config.resolution = 2
end

Sidekiq.configure_client { |config| config.redis = sidekiq_redis }
Sidekiq.logger.level = Logger::WARN