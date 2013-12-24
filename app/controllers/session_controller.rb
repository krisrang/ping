class SessionController < ApplicationController
  def new
  end

  def create
    params.require(:login)
    params.require(:password)

    login = params[:login].strip
    user = User.authenticate(login, params[:password])

    if !user
      invalid_credentials
      return
    end

    user.email_confirmed? ? login(user) : not_activated(user)
  end

  def destroy
  end

  private

  def invalid_credentials
    render json: {error: I18n.t("login.invalid")}
  end

  def not_activated(user)
    render json: {
      error: I18n.t("login.not_activated"),
      reason: 'not_activated'
    }
  end

  def login(user)
    log_in_user(user)
    render json: user
  end
end


