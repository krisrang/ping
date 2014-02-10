# -*- encoding : utf-8 -*-
require_dependency 'email'
require_dependency 'enum'
require_dependency 'user_name_suggester'

class Users::OmniauthCallbacksController < ApplicationController

  BUILTIN_AUTH = [
    Auth::FacebookAuthenticator.new,
    Auth::GoogleAuthenticator.new,
    Auth::GithubAuthenticator.new,
    Auth::TwitterAuthenticator.new,
    Auth::PersonaAuthenticator.new,
  ]

  skip_before_filter :redirect_to_login_if_required

  layout false

  def self.types
    @types ||= Enum.new(:facebook, :twitter, :google, :yahoo, :github, :persona)
  end

  # need to be able to call this
  skip_before_filter :check_xhr

  # this is the only spot where we allow CSRF, our openid / oauth redirect
  # will not have a CSRF token, however the payload is all validated so its safe
  skip_before_filter :verify_authenticity_token, only: :complete

  def complete
    auth = request.env["omniauth.auth"]
    auth[:session] = session

    authenticator = self.class.find_authenticator(params[:provider])

    @data = authenticator.after_authenticate(auth)
    @data.authenticator_name = authenticator.name

    if @data.user
      user_found(@data.user)
    else
      session[:authentication] = @data.session_data
    end

    success
  # rescue StandardError
  #   failure
  end

  def failure
    alert = t("login.omniauth_error", strategy: params[:provider].titleize)
    redirect_to :login, alert: alert
  end

  def success    
    respond_to do |format|
      format.html do
        if @data.authenticated
          redirect_to(root_path)
        else
          flash[:external] = true
          redirect_to(:signup)
        end
      end
      format.json { render json: @data.to_client_hash }
    end
  end


  def self.find_authenticator(name)
    BUILTIN_AUTH.each do |authenticator|
      if authenticator.name == name
        fail Ping::InvalidAccess, "provider is not enabled" unless Settings.send("enable_#{name}_logins?")
        return authenticator
      end
    end

    fail Ping::InvalidAccess, "provider is not found"
  end

  protected

  def user_found(user)
    # automatically activate any account if a provider marked the email valid
    if !user.active && @data.email_valid
      user.toggle(:active).save
    end

    if user.active
      log_in_user(user)
      session[:authentication] = nil # don't carry around old auth info, perhaps move elsewhere
      @data.authenticated = true
    else
      if Settings.must_approve_users? && !user.approved?
        @data.awaiting_approval = true
      else
        @data.awaiting_activation = true
      end
    end

    # log on any account that is active with forum access
    # if Guardian.new(user).can_access_forum? && user.active
    #   log_on_user(user)
    #   session[:authentication] = nil # don't carry around old auth info, perhaps move elsewhere
    #   @data.authenticated = true
    # else
    #   if SiteSetting.must_approve_users? && !user.approved?
    #     @data.awaiting_approval = true
    #   else
    #     @data.awaiting_activation = true
    #   end
    # end
  end

end
