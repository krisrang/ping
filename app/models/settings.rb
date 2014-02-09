require_dependency 'settings_implementation'

class Settings < ActiveRecord::Base
  extend SettingsImplementation

  validates_presence_of :name
  validates_presence_of :data_type

  client_setting(:title, 'Ping')
  client_setting(:hostname, Rails.env.development? ? 'localhost' : '')
  client_setting(:port, Rails.env.development? ? '5000' : '')
  client_setting(:use_https, false)

  client_setting(:login_required, true)
  
  setting(:active_user_rate_limit_secs, 60)
  setting(:previous_visit_timeout_hours, 1)

  setting(:email_domains_whitelist, '')
  setting(:email_domains_blacklist, '')
  setting(:email_from, 'mail@ping.com')

  setting(:min_password_length, 8)
  setting(:must_approve_users, false)

  setting(:enable_long_polling, true)
  setting(:long_polling_interval, 15000)
end
