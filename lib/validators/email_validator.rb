class EmailValidator < ActiveModel::EachValidator

  def validate_each(record, attribute, value)
    if (setting = Settings.email_domains_whitelist).present?
      unless email_in_restriction_setting?(setting, value)
        record.errors.add(attribute, I18n.t(:'user.email.not_allowed'))
      end
    elsif (setting = Settings.email_domains_blacklist).present?
      if email_in_restriction_setting?(setting, value)
        record.errors.add(attribute, I18n.t(:'user.email.not_allowed'))
      end
    end
    # if record.errors[attribute].blank? and ScreenedEmail.should_block?(value)
    #   record.errors.add(attribute, I18n.t(:'user.email.blocked'))
    # end
  end

  def email_in_restriction_setting?(setting, value)
    domains = setting.gsub('.', '\.')
    regexp = Regexp.new("@(#{domains})", true)
    value =~ regexp
  end

end