require_dependency 'settings_implementation'

class Settings < ActiveRecord::Base
  extend SettingsImplementation

  validates_presence_of :name
  validates_presence_of :data_type

  # client_setting(:abadadc, false)
  setting(:active_user_rate_limit_secs, 60)
  setting(:previous_visit_timeout_hours, 1)
end