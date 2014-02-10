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

  client_setting(:enable_local_logins, true)
  client_setting(:enable_local_account_create, true)

  client_setting(:enable_google_logins, true)
  client_setting(:enable_persona_logins, false)
  client_setting(:enable_twitter_logins, true)
  client_setting(:enable_facebook_logins, true)
  client_setting(:enable_github_logins, false)

  # https://developers.facebook.com/
  setting(:facebook_app_id,     Rails.env.development? ? ENV['FACEBOOK_ID'] : '')
  setting(:facebook_app_secret, Rails.env.development? ? ENV['FACEBOOK_SECRET'] : '')

  # https://github.com/settings/applications/
  setting(:github_client_id,      Rails.env.development? ? ENV['GITHUB_ID'] : '')
  setting(:github_client_secret,  Rails.env.development? ? ENV['GITHUB_SECRET'] : '')

  # https://apps.twitter.com/
  setting(:twitter_consumer_key,    Rails.env.development? ? ENV['TWITTER_ID'] : '')
  setting(:twitter_consumer_secret, Rails.env.development? ? ENV['TWITTER_SECRET'] : '')

  # https://code.google.com/apis/console/
  setting(:google_key,    Rails.env.development? ? ENV['GOOGLE_ID'] : '')
  setting(:google_secret, Rails.env.development? ? ENV['GOOGLE_SECRET'] : '')
  
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
