require_dependency 'auth/current_user_provider'

module Ping
  class InvalidAccess < StandardError; end
  class InvalidParameters < StandardError; end
  
  def self.git_version
    return $git_version if $git_version

    begin
      $git_version ||= `git rev-parse HEAD`.strip
    rescue
      $git_version = "unknown"
    end
  end

  def self.current_user_provider
    @current_user_provider || Auth::CurrentUserProvider
  end

  def self.current_user_provider=(val)
    @current_user_provider = val
  end
end