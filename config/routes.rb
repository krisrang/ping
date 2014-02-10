require 'sidekiq/web'
require 'sidetiq/web'

require_dependency 'admin_constraint'

USERNAME_ROUTE_FORMAT = /[A-Za-z0-9\_]+/ unless defined? USERNAME_ROUTE_FORMAT

Rails.application.routes.draw do
  mount Sidekiq::Web => '/sidekiq', constraints: AdminConstraint.new

  resources :rooms
  resources :users

  get "users/activate-account/:token" => "users#activate_account"
  get "users/password-reset/:token" => "users#password_reset"
  put "users/password-reset/:token" => "users#password_reset", as: 'submit_password_reset'
  
  resources :session, id: USERNAME_ROUTE_FORMAT, only: [:new, :create, :destroy] do
    collection do
      get 'csrf'
      post 'forgot_password'
    end
  end

  get 'signup' => 'users#new'
  get 'login' => 'session#new'
  get 'forgot' => 'session#forgot'

  root 'home#index'
end
