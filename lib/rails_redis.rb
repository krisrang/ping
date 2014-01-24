class RailsRedis
  def self.raw_connection(config = nil)
    config ||= self.config
    redis_opts = {host: config['host'], port: config['port'], db: config['db']}
    redis_opts[:password] = config['password'] if config['password']
    Redis.new(redis_opts)
  end

  def self.config
    @config ||= YAML.load(ERB.new(File.new("#{Rails.root}/config/redis.yml").read).result)[Rails.env]

    unless @config
      puts '', "Redis config for environment '#{Rails.env}' was not found in #{Rails.root}/config/redis.yml."
      puts "Did you forget to do RAILS_ENV=production?"
      puts "Check your redis.yml and make sure it has configuration for the environment you're trying to use.", ''
      raise 'Redis config not found'
    end

    @config
  end

  def self.url(config)
    "redis://#{(':' + config['password'] + '@') if config['password']}#{config['host']}:#{config['port']}/#{config['db']}"
  end

  def self.new_redis_store
    redis_store = ActiveSupport::Cache::RedisStore.new(self.url(self.config))
    redis_store
  end

  def initialize
    @config = RailsRedis.config
    @redis = RailsRedis.raw_connection(@config)
  end

  def url
    self.class.url(@config)
  end

  def method_missing(meth, *args, &block)
    if @redis.respond_to?(meth)
      @redis.send(meth, *args, &block)
    else
      super
    end
  end
end