class CaesarController < ApplicationController
  def index
  	
  end

  def submit_feedback
  	feedback_type = params[:fbtype]
  	feedback = params[:feedback]

  	redirect_to("/")
  end
end