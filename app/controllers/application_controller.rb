require 'current_user'

class ApplicationController < ActionController::Base
  include CurrentUser

  protect_from_forgery with: :null_session

  before_filter :preload_json

  def store_preloaded(key, json)
    @preloaded ||= {}
    @preloaded[key] = json.gsub("</", "<\\/")
  end

  def preload_json
    return if request.xhr?

    preload_anonymous_data

    if current_user
      preload_current_user_data
    end
  end

  private

  def preload_anonymous_data
    store_preloaded("settings", Settings.client_settings_json)
  end

  def preload_current_user_data
    store_preloaded("currentUser", MultiJson.dump(CurrentUserSerializer.new(current_user, root: false)))
  end
end
