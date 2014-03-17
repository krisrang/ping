require 'current_user'

class ApplicationController < ActionController::Base
  include CurrentUser  

  # before_filter :authorize_miniprof
  before_filter :preload_json
  before_filter :redirect_to_login_if_required

  protect_from_forgery

  def handle_unverified_request
    # NOTE: API key is secret, having it invalidates the need for a CSRF token
    unless api?
      super
      clear_current_user
      render text: "['BAD CSRF']", status: 403
    end
  end

  class RenderEmpty < Exception; end
  rescue_from RenderEmpty do
    render_empty
  end

  def store_preloaded(key, json)
    @preloaded ||= {}
    @preloaded[key] = json.gsub('</', '<\\/')
  end

  def preload_json
    return if request.xhr?

    preload_anonymous_data

    preload_current_user_data if current_user
  end

  private

  def preload_anonymous_data
    store_preloaded('settings', Settings.client_settings_json)
  end

  def preload_current_user_data
    user = MultiJson.dump(CurrentUserSerializer.new(current_user, root: false))
    store_preloaded('currentUser', user)
    
    channels = Channel.all.includes([:users, :owner, :messages])
    open_channels = current_user.channels.select(:id).map(&:id).uniq
    channels.each { |c| c.open = open_channels.include?(c.id) }
    
    channels_serialized = ActiveModel::ArraySerializer.new(channels, root: 'channels', embed: true)
    store_preloaded('channels', MultiJson.dump(channels_serialized))
  end

  def ensure_logged_in
    fail Ping::NotLoggedIn unless current_user.present?
  end

  def redirect_back_or_default(default)
    return redirect_to(session[:return_to]) if session[:return_to].present?

    redirect_to default
  end

  def check_xhr
    # bypass xhr check on PUT / POST / DELETE provided api key is there, otherwise calling api is annoying
    return if !request.get? && api_key_valid?
    render_empty unless ((request.format && request.format.json?) || request.xhr?)
  end

  def render_empty
    render 'channels/empty'
  end

  def render_json_dump(obj)
    render json: MultiJson.dump(obj)
  end

  def redirect_to_login_if_required
    return if current_user || (request.format.json? && api_key_valid?)

    redirect_to :login if Settings.login_required?
  end

  def success_json
    {success: 'OK'}
  end

  def failed_json
    {failed: 'FAILED'}
  end

  def fetch_user_from_params
    param = params[:username].downcase
    param.gsub!(/\.json$/, '')

    user = User.where("username_lower = ? OR id = ?", param, params[:username].to_i).first
    raise Ping::NotFound.new if user.blank?

    # guardian.ensure_can_see!(user)
    user
  end
  
  def authorize_miniprof
    if current_user && current_user.admin?
      Rack::MiniProfiler.authorize_request
    end
  end

  protected

  # TODO: implement
  def api_key_valid?
    false
    # request["api_key"] && ApiKey.where(key: request["api_key"]).exists?
  end
end
