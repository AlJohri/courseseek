class CoursesController < ApplicationController

	def get
		course = CourseJob.new
		course.scrape_courses
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