require 'sidekiq/web'
require 'sidetiq/web'

require_dependency 'admin_constraint'

USERNAME_ROUTE_FORMAT = /[A-Za-z0-9\_]+/ unless defined? USERNAME_ROUTE_FORMAT

Rails.application.routes.draw do
  mount Sidekiq::Web => '/sidekiq', constraints: AdminConstraint.new

  resources :rooms do
    member do
      post :join
      post :leave
    end
  end

  resources :messages

  get 'preferences' => 'default#empty'  
  
  resources :session, id: USERNAME_ROUTE_FORMAT, only: [:new, :create, :destroy] do
    collection do
      get 'csrf'
      post 'forgot_password'
    end
  end

  post 'login' => 'static#enter'
  get 'login' => 'static#show', id: 'login'
  get 'signup' => 'static#show'
  get 'forgot' => 'session#forgot'
  get 'users/hp' => 'users#get_honeypot_value'

  resources :users, except: [:show, :update, :destroy] do
    collection do
      get 'check_username'
    end
  end

  get 'users/:username' => 'users#show', as: 'userpage', constraints: {username: USERNAME_ROUTE_FORMAT}
  get 'users/activate-account/:token' => 'users#activate_account'
  get 'users/password-reset/:token' => 'users#password_reset'
  put 'users/password-reset/:token' => 'users#password_reset', as: 'submit_password_reset'

  match '/auth/:provider/callback', to: 'users/omniauth_callbacks#complete', via: [:get, :post]
  match '/auth/failure', to: 'users/omniauth_callbacks#failure', via: [:get, :post]

  root 'default#index'
end
