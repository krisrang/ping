class UserMailer < ActionMailer::Base
  default from: Settings.email_from

  def email(user, opts = {})
    mail to: user.email, subject: opts[:subject] do |format|
      # format.html { render 'another_template' }
      format.text { render text: opts[:text] }
    end
  end
end
