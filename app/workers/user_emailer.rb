class UserEmailer
  include Sidekiq::Worker

  def perform(type, opts = {})
    markdown = Redcarpet::Markdown.new(Redcarpet::Render::HTML, 
                                       autolink: true,
                                       space_after_headers: true)

    user = User.find(opts["user_id"])
    vars = { site_name: Settings.title, 
             base_url: Ping.base_url, 
             email_token: opts["email_token"]
           }

    subject = I18n.t("user_mailer.#{type}.subject", vars)
    text = markdown.render(I18n.t("user_mailer.#{type}.text", vars))
    UserMailer.email(user, { subject: subject, text: text }).deliver
  end
end
