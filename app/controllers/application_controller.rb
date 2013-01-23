class ApplicationController < ActionController::Base
  protect_from_forgery

  def call_rake(task, options={})
  	options[:rails_env] ||= Rails.env
  	args = options.map { |n,v| "#{n.to_s.upcase} = '#{v}'" }
  	system "/usr/bin/rake #{task} #{args.join(' ')} --trace >> #{Rails.root}/log/rake.log &"
  end

end