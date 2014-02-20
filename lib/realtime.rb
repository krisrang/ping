require_dependency 'realtime/csrf'
require_dependency 'realtime/user_tracker'

module Realtime
  def self.publish(channel, data)
    faye.publish(channel, data)
  end

  def self.middleware_opts
    { mount: '/faye', timeout: 25, engine: RailsRedis.new_faye_engine,
      extensions: [Realtime::Csrf.new, Realtime::UserTracker.new] }
  end

  private

  def self.faye
    Faye.ensure_reactor_running!
    @faye ||= Faye::Client.new("http://localhost:#{ENV['PORT']}/faye")
  end
end