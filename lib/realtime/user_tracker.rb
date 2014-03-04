module Realtime
  class UserTracker
    # Leave user from all rooms on disconnect
    def incoming(message, request, callback)
      # puts message.inspect.to_s clientId
      # if message['channel'] == '/meta/connect'
      #   user = CurrentUser.lookup_from_env(request.env)
        
      # end
      
      # if message['channel'] == '/meta/disconnect'
      #   user = CurrentUser.lookup_from_env(request.env)
      #   user.rooms.each { |r| r.publish_leave(user) }
      # end
      
      callback.call(message)
    end
  end
end
