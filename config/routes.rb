require 'sidekiq/web'
require 'sidetiq/web'

require_dependency 'admin_constraint'

USERNAME_ROUTE_FORMAT = /[A-Za-z0-9\_]+/ unless defined? USERNAME_ROUTE_FORMAT

Rails.application.routes.draw do
  mount Sidekiq::Web => '/sidekiq', constraints: AdminConstraint.new
  
  resources :session, id: USERNAME_ROUTE_FORMAT, only: [:create, :destroy] do
    collection do
      post 'forgot_password'
    end
  end

  get "session/csrf" => "session#csrf"

  post 'login' => 'static#enter'
  get 'login' => 'static#show', id: 'login'

  root 'home#index'
end
