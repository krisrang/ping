class SessionController < ApplicationController
  skip_before_filter :redirect_to_login_if_required
  
  def csrf
    render json: {csrf: form_authenticity_token }
  end
  
  def create
    params.require(:login)
    params.require(:password)

    login = params[:login].strip

    if user = User.find_by_username_or_email(login)
      # If their password is correct
      unless user.confirm_password?(params[:password])
        invalid_credentials
        return
      end

      # If the site requires user approval and the user is not approved yet
      if login_not_approved_for?(user)
        login_not_approved
        return
      end
    else
      invalid_credentials
      return
    end

    user.email_confirmed? ? log_in(user) : not_activated(user)
  rescue ActionController::ParameterMissing
    invalid_credentials
  end

  def forgot_password
    params.require(:login)

    user = User.find_by_username_or_email(params[:login])
    if user.present?
      email_token = user.email_tokens.create(email: user.email)
      UserEmailer.perform_async(:forgot_password, {user_id: user.id, email_token: email_token.token})
    end
    # always render ok so we don't leak information
    forgot_success
  rescue ActionController::ParameterMissing
    forgot_success
  end

  def destroy
    reset_session
    log_out_user
    render nothing: true
  end

  private

  def login_not_approved_for?(user)
    Settings.must_approve_users? && !user.approved? && !user.admin?
  end

  def login_not_approved
    render json: {error: t("login.not_approved")}
  end

  def invalid_credentials
    render json: {error: t("login.invalid")}
  end

  def not_activated(user)
    render json: {error: t("login.not_activated"), reason: 'not_activated'}
  end

  def log_in(user)
    log_in_user(user)
    render json: user
  end

  def forgot_success
    render json: {result: "ok"}
  end
end
