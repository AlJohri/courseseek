require_relative "../../app/jobs/course_job"
require_relative "../../app/jobs/description_job"

namespace :scrape do
	task :courses => :environment do
		course = CourseJob.new
		course.scrape_courses
	end
	task :descriptions => :environment do
		description = DescriptionJob.new
		description.scrape_descriptions
	end	
end