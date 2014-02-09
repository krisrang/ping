class UserActivator
  attr_reader :user, :request, :session, :cookies, :message

  def initialize(user, request, session, cookies)
    @user = user
    @session = session
    @cookies = cookies
    @request = request
    @settings = Settings
    @message = nil
  end

  def start
  end

  def finish
    @message = activator.activate
  end

  private

  def activator
    factory.new(user, request, session, cookies)
  end

  def factory
    if @settings.must_approve_users?
      ApprovalActivator
    elsif !user.active?
      EmailActivator
    else
      LoginActivator
    end
  end
end

class ApprovalActivator < UserActivator
  def activate
    I18n.t('login.wait_approval')
  end
end

class EmailActivator < UserActivator
  def activate
    UserEmailer.perform_async(:signup, { user_id: user.id,
                              email_token: user.email_tokens.first.token } )
    I18n.t('login.activate_email', email: user.email)
  end
end

class LoginActivator < UserActivator
  include CurrentUser

  def activate
    log_in_user(user)
    I18n.t('login.active')
  end
end
