class DescriptionJob

	# CONSTANTS
	
	BASE1 = "http://www.northwestern.edu/class-descriptions/"
	BASE2 = "http://www.northwestern.edu"
	EXT1 = "/index.json"
	EXT2 = ".json"

	def scrape_descriptions
		@agent = Mechanize.new
		terms = get_json("terms", "class-descriptions")
		terms.each { |term| 
			next if (term['id'].to_i < 4900) #4400 in production
			schools = get_json("schools", term['id'])
			next if (schools.empty?)
			schools.each { |school|
				subjects = get_json("subjects", term['id'], school['id'])
				next if (subjects.empty?)
				subjects.each { |subject| 
					courses = get_json("courses", subject['path'])
					next if (courses.empty?)
					courses.each { |course|
						sections = get_json("sections", course['path'])
						next if (sections.empty?)
						sections.each { |section|
							data = get_json("data", section['path'])
							next if (data.empty? or data['descriptions'].empty?)
	            description = Description.find_or_create_by_unique_id(section['id']) { |d|
	            	begin
	            		d.overview = data['descriptions'][0]['value']	
	            	rescue Exception => e
	            		puts data
	            		debugger
	            	end
	            	
	            	puts "#{section['id']} #{term['id']} #{school['id']} #{subject['abbv']} #{course['abbv']} #{section['name']} - Complete!"
	            }
							#puts "#{section['id']} #{term['id']} #{school['id']} #{subject['abbv']} #{course['abbv']} #{section['name']}"
							#data['descriptions'].each { |description|
								#puts "#{description['name']}: #{description['value']}"
							#}
						}
					}
				}
			}
		}
	end

	def get_json(type, *paths)
		case type
			when /^(terms)$/						; page = @agent.get(BASE1 + EXT1[1..-1])
			when /^(schools|subjects)$/ ; page = @agent.get(BASE1 + paths.join('/') + EXT1)
			when /^(courses|sections)$/ ; page = @agent.get(BASE2 + paths.join('/') + EXT1)
			when /^(data)$/							; page = @agent.get(BASE2 + paths.join('/') + EXT2)
		end
		text = page.body.gsub(/(var )?\w+\s?=\s?([\[\{])/, '\2').gsub(/\;\/\/<xml><\/xml>/, "").gsub(/\t/,"").gsub(/([^:{[,]])"([\w'\s]+)"([" ])/, '\1\2\3 ')
		return (text != "<xml/>") ? JSON.parse(text) : ""
	end	

end
