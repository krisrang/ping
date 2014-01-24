module AuthHelpers
  def log_in(fabricator=nil)
    user = Fabricate(fabricator || :user)
    log_in_user(user)
    user
  end

  def log_in_user(user)
    provider = Ping.current_user_provider.new(request.env)
    provider.log_in_user(user,session,cookies)
  end
end
