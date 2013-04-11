require File.expand_path('../boot', __FILE__)

require 'rails/all'

if defined?(Bundler)
  # If you precompile assets before deploying to production, use this line
  Bundler.require(*Rails.groups(:assets => %w(development test)))
  # If you want your assets lazily compiled in production, use this line
  #Bundler.require(:default, :assets, Rails.env)
end

module Coursica
  class Application < Rails::Application

    config.generators do |g|
      
      
    end

    config.assets.initialize_on_precompile = false

    config.autoload_paths += Dir["#{config.root}/lib/**/"]
    config.autoload_paths += Dir["#{config.root}/app/jobs/**/"]

    # config.plugins = [ :exception_notification, :ssl_requirement, :all ]
    # config.active_record.observers = :cacher, :garbage_collector, :forum_observer
    # config.time_zone = 'Central Time (US & Canada)'
    # config.i18n.load_path += Dir[Rails.root.join('my', 'locales', '*.{rb,yml}').to_s]
    # config.i18n.default_locale = :en

    config.encoding = "utf-8"

    # Configure sensitive parameters which will be filtered from the log file.
    config.filter_parameters += [:password]

    config.active_support.escape_html_entities_in_json = true

    # Enforce whitelist mode for mass assignment.
    config.active_record.whitelist_attributes = true

    # Enable the asset pipeline
    config.assets.enabled = true

    # Version of your assets, change this if you want to expire all your assets
    config.assets.version = '1.0'
  end
end


=begin

 config.assets.precompile

 http://guides.rubyonrails.org/asset_pipeline.html

 For faster asset precompiles, you can partially load your application by setting config.assets.initialize_on_precompile 
 to false in config/application.rb, though in that case templates cannot see application objects or methods. 
 Heroku requires this to be false.

   
=end
