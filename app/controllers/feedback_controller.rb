class FeedbackController < ApplicationController
	def submit_feedback

		feedback_type = params[:fbtype]
  		feedback_text = params[:feedback]

		Feedback.create(:type => feedback_type,
						:feedback => feedback_text)
		redirect_to("/")
	end
end