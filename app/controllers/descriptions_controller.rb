class DescriptionsController < ApplicationController

  def index
    @descriptions = Description.all

    # respond_to { |format|
    #   format.json { render :json => @courses }
    # }
    
    render :json => @descriptions 

  end	

	def get
		description = DescriptionJob.new
		description.delay.scrape_descriptions
	end

end