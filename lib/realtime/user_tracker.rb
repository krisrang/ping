module Realtime
  class UserTracker
    # Leave user from all rooms on disconnect
    def incoming(message, request, callback)
      unless message['channel'] == '/meta/disconnect'
        return callback.call(message)
      end

      user = CurrentUser.lookup_from_env(request.env)
      user.rooms.each { |r| r.leave(user) }
      callback.call(message)
    end
  end
end