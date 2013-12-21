Rails.application.routes.draw do
  resources :session, only: [:new, :create, :destroy]

  root 'rooms#index'
end
