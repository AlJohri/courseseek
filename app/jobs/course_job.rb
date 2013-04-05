class CourseJob

	@authenticated = false

	def authenticate(username = ENV['user'], password = ENV['pass'])
		@agent = Mechanize.new
		@username = ENV['user']
		@password = ENV['pass']
		#@agent.agent.http.ca_file = 'cacert.pem'
		@agent.agent.ssl_version = "SSLv3"
		page = @agent.get('https://ses.ent.northwestern.edu/psp/s9prod/?cmd=login')
		login_form = page.form('login')
		login_form.set_fields(:userid => username) #ARGV[0]
		login_form.set_fields(:pwd => password) #ARGV[1]
		login_form.action = 'https://ses.ent.northwestern.edu/psp/caesar/?cmd=?languageCd=ENG'
		page = @agent.submit(login_form, login_form.buttons.first)
		@authenticated = true
	end
	
	def scrape_courses()
		if (@authenticated != true)
			authenticate
		end
		authenticate

		error_counter = 0

		@subjects = Subject.all
    
		@subjects.each { |row|

			doc = @agent.get('https://ses.ent.northwestern.edu/psc/caesar_6/EMPLOYEE/HRMS/c/SA_LEARNER_SERVICES.CLASS_SEARCH.GBL?Page=SSR_CLSRCH_ENTRY').parser
			icsid = doc.xpath("//*[@id='ICSID']/@value").text
			icelementnum = doc.xpath("//*[@id='ICElementNum']/@value").text
			icstatenum = doc.xpath("//*[@id='ICStateNum']/@value").text

			institution = "NWUNV"
			subject = row.subject #ARGV[0]
			match_type = "E"
			career = "UGRD"
			open_course_only = "N"
			term = "4490"

			ajax_headers = { 'Content-Type' => 'application/x-www-form-urlencoded; charset=utf-8'}
			params = {
				"ICAction" => "CLASS_SRCH_WRK2_SSR_PB_CLASS_SRCH",
				"ICSID" => icsid,
				"ICElementNum" => icelementnum,
				"ICStateNum" => icstatenum,
				"DERIVED_SSTSNAV_SSTS_MAIN_GOTO$26$" => "9999",
				"CLASS_SRCH_WRK2_INSTITUTION$49$" => institution,
				"CLASS_SRCH_WRK2_STRM$52$"=> term,
				"CLASS_SRCH_WRK2_SUBJECT$65$"=> subject,
				"CLASS_SRCH_WRK2_CATALOG_NBR$73$" => "",
				"CLASS_SRCH_WRK2_SSR_EXACT_MATCH1" => match_type,
				"CLASS_SRCH_WRK2_ACAD_CAREER" => career,
				"CLASS_SRCH_WRK2_SSR_OPEN_ONLY$chk" => open_course_only,
				"DERIVED_SSTSNAV_SSTS_MAIN_GOTO$152$"=>"9999"
			}

			response = @agent.post('https://ses.ent.northwestern.edu/psc/caesar_4/EMPLOYEE/HRMS/c/SA_LEARNER_SERVICES.CLASS_SEARCH.GBL', params, ajax_headers)
			doc  = Nokogiri::HTML(response.body)

			error = doc.search("span[id^='DERIVED_CLSMSG_ERROR_TEXT']/text()")
			courses = doc.search("span[id^='DERIVED_CLSRCH_DESCR200$']/text()").to_a

			partsCounter = 0

      if (error.empty?)
			  courses.each_with_index { |x,i| 
          courses[i] = CGI.unescapeHTML(courses[i].to_s).delete!("^\u{0000}-\u{007F}")
          courses[i] =~ /(^\w+)(\s+)(\d+-\d+) - (.*)/

          department = $1
          number = $3
          title = $4
					parts = doc.search("div[id='win6div$ICField108GP$" + i.to_s + "'] > table > tr > td[2] > span[3]/text()").to_s.gsub(/1.*of\s/, "").to_i

          parts.times { |x|
          	uniqueid_sec = doc.search("a[id='DERIVED_CLSRCH_SSR_CLASSNAME_LONG$" + partsCounter.to_s + "']").text
          	uniqueid_sec =~ /(\w+)-\w+\((\d+)\)/
          	section = $1
          	unique_id = $2

          	days_time = doc.search("span[id='MTG_DAYTIME$" + partsCounter.to_s + "']").text
          	if (days_time != "TBA")
	          	days_time =~ /^(\w+) (\d\d?:\d\d(AM|PM)) - (\d\d?:\d\d(AM|PM))/
						 	days = $1
						 	start_time = $2
						 	end_time = $4
						else
							days = "TBA"
							start_time = "TBA"
							end_time = "TBA"
						end

          	room = doc.search("span[id='MTG_ROOM$" + partsCounter.to_s + "']").text
          	instructor = doc.search("span[id='MTG_INSTR$" + partsCounter.to_s + "']").text
          	dates = doc.search("span[id='MTG_TOPIC$" + partsCounter.to_s + "']").text
          	seats = doc.search("span[id='NW_DERIVED_SS3_AVAILABLE_SEATS$" + partsCounter.to_s + "']").text
          	status = doc.search("div[id='win6divDERIVED_CLSRCH_SSR_STATUS_LONG$" + partsCounter.to_s + "'] > div > img")[0]['alt']

            # http://stackoverflow.com/questions/452859/inserting-multiple-rows-in-a-single-sql-query
            # course_list.insert(:uniqueid => uniqueid, :dept => department, :course => course, :sec => sec, :title => title, :days => days, :start_time => start_time, :end_time => end_time, :room => room, :instructor => instructor, :seats => seats, :status => status, :datescraped => datescraped)
            
            mo = days.include? ("Mo")
            tu = days.include? ("Tu")
            we = days.include? ("We")
            th = days.include? ("Th")
            fr = days.include? ("Fr")

            course = Course.find_or_create_by_unique_id(unique_id) { |c|
            	c.term = term
            	c.subject = subject
            	c.number = number
            	c.section = section
            	c.title = title
            	c.M = mo ? 1 : 0
            	c.T = tu ? 1 : 0
            	c.W = we ? 1 : 0
            	c.R = th ? 1 : 0
            	c.F = fr ? 1 : 0
            	c.start = start_time
            	c.end = end_time
            	c.room = room
            	c.instructor = instructor
            	c.seats = seats
            	c.status = status
            }

          	partsCounter+=1
          }
          
        }
      else
      	error = error.to_s
      	error = error.gsub("The search returns no results that match the criteria specified.", "No courses this quarter.")
      	error = error.gsub("Your search will exceed the maximum limit of 200 sections.  Specify additional criteria to continue.", "Exceeds maximum limit.")
        error_counter+=1
        print "[" + error_counter.to_s + "] " + subject + ": "
        if (error.include? "No courses this quarter.")
          puts error
        elsif (error.include? "Exceeds maximum limit.")
          puts error#.yellow
        else
        	puts error#.red
        end
      end
		}
	end

	def backup_database()
		exec '/usr/local/bin/mysqldump -u atul --databases caesar > caesar.sql'
	end

end
