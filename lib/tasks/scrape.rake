require_relative "../../app/jobs/course_job"

task :scrape => :environment do
	course = CourseJob.new
	course.scrape_courses
end