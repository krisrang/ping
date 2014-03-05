require_dependency 'realtime/csrf'
require_dependency 'realtime/user_tracker'

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
    { mount: '/faye', timeout: 25, engine: RailsRedis.new_faye_engine,
      extensions: [Realtime::UserTracker.new] }
  end

  private

  def self.get_client
    @client ||= (@bayeux || fake_middleware_client).try(:get_client)
  end
  
  def self.fake_middleware_client
    Faye.ensure_reactor_running!
    new_middleware(nil)
  end
end