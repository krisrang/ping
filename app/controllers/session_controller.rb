class SessionController < ApplicationController

  def csrf
    render json: {csrf: form_authenticity_token }
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

    user.email_confirmed? ? log_in(user) : not_activated(user)
  end

  def forgot_password
    params.require(:login)

    user = User.find_by_username_or_email(params[:login])
    if user.present?
      email_token = user.email_tokens.create(email: user.email)
      UserEmailer.perform_async(:forgot_password, {user_id: user.id, email_token: email_token.token})
    end
    # always render ok so we don't leak information
    render json: {result: "ok"}
  end

  def destroy
    reset_session
    log_out_user
    render nothing: true
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

  def log_in(user)
    log_in_user(user)
    render json: user
  end
end


