class ApplicationController < ActionController::Base
  protect_from_forgery
  #force_ssl

  def call_rake(task, options={})
  	options[:rails_env] ||= Rails.env
  	args = options.map { |n,v| "#{n.to_s.upcase} = '#{v}'" }
  	system "/usr/bin/rake #{task} #{args.join(' ')} --trace >> #{Rails.root}/log/rake.log &"
  end

  private

  def current_user
    @current_user ||= User.find(session[:user_id]) if session[:user_id]
  end
  helper_method :current_user  

end
