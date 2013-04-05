class CoursesController < ApplicationController

  def index

    #render :json => Course.connection.select_all("SELECT * FROM public.courses, public.descriptions 
    #  WHERE courses.unique_id = descriptions.unique_id;")

    render :json => Course.connection.select_all("SELECT courses.*, descriptions.overview FROM public.courses LEFT JOIN public.descriptions
ON courses.unique_id = descriptions.unique_id;")

    #courses = Course.joins
    #render :text => Course.reflect_on_all_associations(:has_one)
    #descriptions = Description.all
    #@test = Cousrse.scoped

    # respond_to { |format|
    #   format.json { render :json => @courses }
    # }
    
    #render :json => @courses
    #render :json => @descriptions
    #render :json => @test

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