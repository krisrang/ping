module Realtime
  class UserTracker
    def incoming(message, request, callback)       
      data = message['data']
      
      if message['channel'] == '/meta/disconnect'
        user = CurrentUser.lookup_from_env(request.env)
        user.status = :offline
      end
      
      if data && data['type'] == 'userstatus'
        user = CurrentUser.lookup_from_env(request.env)
        user.status = data['status'].to_sym
      end
      
      callback.call(message)
    end
  end
end
