require_dependency 'auth/current_user_provider'

module Ping
  class InvalidAccess < StandardError; end
  class InvalidParameters < StandardError; end
  class NotLoggedIn < StandardError; end
  class NotFound < StandardError; end
  
  def self.git_version
    return $git_version if $git_version

    begin
      $git_version ||= ENV['GIT_REV'] || `git rev-parse HEAD`.strip
    rescue
      $git_version = "unknown"
    end
  end

  def self.authenticators
    Users::OmniauthCallbacksController::BUILTIN_AUTH
  end

  def self.current_user_provider
    @current_user_provider || Auth::CurrentUserProvider
  end

  def self.current_user_provider=(val)
    @current_user_provider = val
  end

  def self.current_hostname
    Settings.hostname
  end

  def self.base_url
    default_port = 80
    protocol = "http"

    if Settings.use_https?
      protocol = "https"
      default_port = 443
    end

    result = "#{protocol}://#{current_hostname}"

    port = Settings.port.present? && Settings.port.to_i > 0 ? Settings.port.to_i : default_port

    result << ":#{Settings.port}" if port != default_port
    result
  end

  def self.assets_digest
    @assets_digest ||= begin
      digest = Digest::MD5.hexdigest(ActionView::Base.assets_manifest.assets.values.sort.join)
      channel = "/global/asset-version"

      Realtime.publish(channel, digest)
      digest
    end
  end
end