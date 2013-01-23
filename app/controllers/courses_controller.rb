class CoursesController < ApplicationController

  def index
    @courses = Course.all

    # respond_to { |format|
    #   format.json { render :json => @courses }
    # }
    
    render :json => @courses 

  end

	def get
		course = CourseJob.new
		course.delay.scrape_courses
	end

end


=begin
	
		db = Sequel.connect(:adapter => 'pg', :user => 'atul', :host => 'localhost', :database => 'caesar', :password=>'')
    
    db.create_table! :courses do
      primary_key :id
      String :uniqueid
      String :dept
      String :course
      String :sec
      String :title
      String :days
      String :start_time
      String :end_time
      String :room
      String :instructor
      String :seats
      String :status
      String :datescraped
    end

    course_list = db[:courses]
	
=end