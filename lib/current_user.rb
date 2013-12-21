module CurrentUser
  TOKEN_COOKIE ||= "_t"

  def self.included(klass)
    klass.class_eval do
      include InstanceMethods
    end
  end

  module InstanceMethods
    def require_login
      if !logged_in?
        session[:return_to_url] = request.url if request.get?
        not_authenticated
      end
    end

    def redirect_back_or_to(url, flash_hash = {})
      redirect_to(session[:return_to_url] || url, :flash => flash_hash)
      session[:return_to_url] = nil
    end

    def log_in_user(user)
      session[:current_user] = user.id
      @current_user = user

      unless user.auth_token && user.auth_token.length == user_class.token_length*2
        user.auth_token = user_class.generate_token
        user.save!
      end

      cookies.signed.permanent[TOKEN_COOKIE] = { value: user.auth_token, httponly: true }
    end

    def log_out
      if logged_in?
        @current_user = current_user if @current_user.nil?
        cookies.delete(TOKEN_COOKIE)
        before_logout!(@current_user)
        reset_session
        after_logout!
        @current_user = nil
      end
    end

    # TODO: api auth
    def is_api?
    end

    def logged_in?
      !!current_user
    end

    def log_in(login, password)
      @current_user = nil
      user = user_class.authenticate(login, password)
      if user 
        old_session = session.dup.to_hash
        reset_session
        old_session.each_pair do |k,v|
          session[k.to_sym] = v
        end
        form_authenticity_token

        log_in_user(user)
        after_login!(user)
        current_user
      else
        after_failed_login!(user)
        nil
      end
    end

    def current_user
      if @current_user == false
        false
      else
        @current_user ||= login_from_session || login_from_cookie #|| login_from_other_sources
      end
    end

    def current_user=(user)
      @current_user = user
    end

    def not_authenticated
      redirect_to root_path
    end

    # Overwrite Rails' handle unverified request
    def handle_unverified_request
      cookies[TOKEN_COOKIE] = nil
      @current_user = nil
      super # call the default behaviour which resets the session
    end

    protected

    def login_from_session
      @current_user = (user_class.find(session[:current_user]) if session[:current_user]) || false
    rescue ActiveRecord::RecordNotFound
      return false
    end

    def login_from_cookie
      token = cookies.signed[TOKEN_COOKIE]
      if token && token.length == user_class.token_length*2
        user = user_class.where(auth_token: token).first
        login_user(user)
      else
        @current_user = false
      end
    end

    def user_class
      @user_class ||= User
    end

    def after_login!(user)    
    end

    def after_failed_login!(user)    
    end

    def before_logout!(user)
    end

    def after_logout!    
    end    
  end
end

