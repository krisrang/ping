class UsersController < ApplicationController
  skip_before_filter :redirect_to_login_if_required
  before_filter :set_honeypots, only: [:new, :create]
  before_filter :respond_to_suspicious_request, only: [:create]

  layout 'static'

  def show
    @user = fetch_user_from_params
    user_serializer = UserSerializer.new(@user, root: 'user')

    respond_to do |format|
      format.html do
        store_preloaded("user_#{@user.username}", MultiJson.dump(user_serializer))
      end

      format.json do
        render_json_dump(user_serializer)
      end
    end
  end

  def new
    @user = User.new
    prepopulate_user
  end
  
  def create
    @user = User.new(user_params)
    prepopulate_user

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

  def password_reset
    expires_now

    @user = EmailToken.confirm(params[:token])

    if @user.blank?
      flash.error = I18n.t('password_reset.no_token')
    elsif request.put?
      fail Ping::InvalidParameters, :password unless params[:user][:password].present?
      @user.password = params[:user][:password]
      @user.password_required!
      if @user.save
        logon_after_password_reset
        redirect_to root_path
      end      
    end
  end

  def check_username
    params.require(:username)
    username = params[:username]

    target_user = user_from_params_or_current_user

    # The special case where someone is changing the case of their own username
    if changing_case_of_own_username(target_user, username)
      render(json: { available: true })
      return
    end

    checker = UsernameCheckerService.new
    render json: checker.check_username(username)
  end

  private

  def user_from_params_or_current_user
    params[:for_user_id] ? User.find(params[:for_user_id]) : current_user
  end

  def changing_case_of_own_username(target_user, username)
    target_user and username.downcase == target_user.username.downcase
  end

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

  def prepopulate_user
    data = (!!flash[:external] || params[:provider]) && session[:authentication]
    
    if data
      @provider = data[:authenticator_name].titleize
      @email_valid = !!data[:email_valid]
      @user.email ||= data[:email] if @email_valid
      @user.username ||= data[:suggested][:username]
      @user.name ||= data[:suggested][:name]
    else
      session[:authentication] = nil
    end
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

  def logon_after_password_reset
    # message = if Guardian.new(@user).can_access_forum?
    #             # Log in the user
    #             log_on_user(@user)
    #             'password_reset.success'
    #           else
    #             @requires_approval = true
    #             'password_reset.success_unapproved'
    #           end

    log_in_user(@user)
    flash.notice = t('password_reset.success')
  end
end
