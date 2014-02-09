module CurrentUser
  def self.auth_cookie?(env)
    Ping.current_user_provider.new(env).auth_cookie?
  end

  def self.lookup_from_env(env)
    Ping.current_user_provider.new(env).current_user
  end

  # can be used to pretend current user does no exist, for CSRF attacks
  def clear_current_user
    @current_user_provider = Ping.current_user_provider.new({})
  end

  def log_in_user(user)
    current_user_provider.log_in_user(user, session, cookies)
  end

  def log_out_user
    current_user_provider.log_out_user(session, cookies)
  end

  def api?
    current_user_provider.api?
  end

  def current_user
    current_user_provider.current_user
  end

  private

  def current_user_provider
    @current_user_provider ||= Ping.current_user_provider.new(request.env)
  end
end
