Coursica::Application.routes.draw do
  root :to => "caesar#index"
  match ':controller(/:action(/:id(.:format)))'
end
