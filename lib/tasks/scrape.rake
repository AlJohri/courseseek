task :scrape do
	course = CourseJob.new
	course.scrape_courses
end