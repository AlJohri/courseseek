Courseseek::Application.routes.draw do
  root :to => "caesar#index"

  get "logout" => "sessions#destroy", :as => "logout"
  get "login" => "sessions#new", :as => "login"
  get "signup" => "users#new", :as => "signup"

  get "submit_feedback" => "feedback#submit_feedback"

  resources :users
  resources :sessions
  match ':controller(/:action(/:id(.:format)))'

# https://github.com/rails/rails/issues/10091#issuecomment-15917805
# Put this at the end of your config/routes.rb
# if Rails.env.development?
#   app = ActionDispatch::Static.new(
#     lambda{ |env| [404, { 'X-Cascade' => 'pass'}, []] },
#     Rails.application.config.paths['public'].first,
#     Rails.application.config.static_cache_control
#   )

#   mount app, :at => '/', :as => :public
# end
  
end



