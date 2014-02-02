class SessionController < ApplicationController
  skip_before_filter :redirect_to_login_if_required

  layout 'login'

  def csrf
    render json: {csrf: form_authenticity_token }
  end
  
  def create
    params.permit(:login)
    params.permit(:password)

    login = params[:login].strip
    user = User.authenticate(login, params[:password])

    if !user
      invalid_credentials
      return
    end

    user.email_confirmed? ? log_in(user) : not_activated(user)
  end

  def forgot_password
    params.permit(:login)

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
    error = t("login.invalid")

    respond_to do |format|
      format.html { redirect_to :login, alert: error }
      format.json { render json: {error: error} }
    end
  end

  def not_activated(user)
    error = t("login.not_activated")

    respond_to do |format|
      format.html { redirect_to :login, alert: error }
      format.json { render json: {error: error, reason: 'not_activated'} }
    end
  end

  def log_in(user)
    log_in_user(user)

    respond_to do |format|
      format.html { redirect_back_or_default(root_path) }
      format.json { render json: user }
    end
  end
end


