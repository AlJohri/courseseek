Coursica::Application.routes.draw do
  root :to => "caesar#index"

  get "logout" => "sessions#destroy", :as => "logout"
  get "login" => "sessions#new", :as => "login"
  get "signup" => "users#new", :as => "signup"

  resources :users
  resources :sessions
  match ':controller(/:action(/:id(.:format)))'
end

# https://github.com/rails/rails/issues/10091#issuecomment-15917805