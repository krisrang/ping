class UsersController < ApplicationController
  skip_before_filter :redirect_to_login_if_required
  before_filter :set_honeypots, only: [:new, :create]
  before_filter :respond_to_suspicious_request, only: [:create]

  layout 'static'

  def new
    @user = User.new
  end
  
  def create
    @user = User.new(user_params)

    authentication = UserAuthenticator.new(@user, session)
    authentication.start

    activation = UserActivator.new(@user, request, session, cookies)
    activation.start

    if @user.save
      authentication.finish
      activation.finish

      user_save_success(activation)
    else
      user_create_failed
    end
  end

  def activate_account
    expires_now

    if @user = EmailToken.confirm(params[:token])

      # Log in the user unless they need to be approved
      # if Guardian.new(@user).can_access_forum?
        log_in_user(@user)
      # else
      #   @needs_approval = true
      # end

    else
      flash.error = I18n.t('activation.already_done')
    end
    
    redirect_to root_path
  end

  private

  def set_honeypots
    @honeypot = honeypot_value
    @challenge = challenge_value.try(:reverse)
  end

  def honeypot_value
    Digest::SHA1.hexdigest("#{Rails.application.secrets.challenge}")[0, 15]
  end

  def challenge_value
    challenge = $redis.get('SECRET_CHALLENGE')
    unless challenge && challenge.length == 16 * 2
      challenge = SecureRandom.hex(16)
      $redis.set('SECRET_CHALLENGE', challenge)
    end

    challenge
  end

  def respond_to_suspicious_request
    if suspicious?(params)
      message = I18n.t('login.activate_email', email: params[:email])

      respond_to do |format|
        format.html { redirect_to :signup, notice: message }
        format.json do
          render json: { success: true, active: false, message:  message }
        end
      end
    end
  end

  def suspicious?(params)
    honeypot_or_challenge_fails?(params)
  end

  def honeypot_or_challenge_fails?(params)
    params[:password_confirmation] != @honeypot ||
      params[:challenge] != @challenge
  end

  def user_params
    params.require(:user).permit(:email, :password, :username)
  end

  def user_save_success(activation)
    json_response = { success: true, active: @user.active?,
                      message: activation.message }

    if @user.active?
      respond_to do |format|
        format.html { redirect_to root_path, notice: t('signup.success') }
        format.json { render json: json_response }
      end
    else
      respond_to do |format|
        format.html { redirect_to :login, notice: activation.message }
        format.json { render json: json_response }
      end
    end
  end

  def user_create_failed
    respond_to do |format|
      format.html { render :new }
      format.json do
        render json: { success: false, errors: @user.errors.to_hash }
      end
    end    
  end
end
