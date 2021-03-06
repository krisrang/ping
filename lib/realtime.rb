require_dependency 'realtime/csrf'
require_dependency 'realtime/user_tracker'
require_dependency 'realtime/data_sync'

module Realtime
  def self.publish(channel, data)
    get_client.publish(channel, data)
  end
  
  def self.new_middleware(app)
    faye = Faye::RackAdapter.new(app, middleware_opts)    
    # faye.on(:disconnect) do |client|
    #   puts "Disconnect #{client}"
    # end
    
    @bayeux = faye
  end

  def self.middleware_opts
    { mount: '/faye', timeout: 60, engine: RailsRedis.new_faye_engine,
      extensions: [Realtime::UserTracker.new, Realtime::DataSync.new] }
  end

  private

  def self.get_client
    @client ||= (@bayeux || fake_middleware_client).try(:get_client)
  end
  
  def self.fake_middleware_client
    Faye.ensure_reactor_running!
    new_middleware(nil)
  end
  
  def self.full_client
    Faye.ensure_reactor_running!
    Faye::Client.new("http://localhost:#{Settings.port || 5000}/faye")
  end
end