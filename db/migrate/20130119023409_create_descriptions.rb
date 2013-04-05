class CreateDescriptions < ActiveRecord::Migration
  def change
    create_table :descriptions do |t|
			t.string "unique_id"
			t.text "overview"
    end
  end
end

# qtr: Winter 2013
# lmod: 1/24/13 06:01 pm
# name: 20434
# title	MUSIC CONDUCT 326-0-20 Basic Conducting
# topic	""
# meet_t: MoWeFr 10:00AM - 11:50AM
# meet_l: Pick-Staiger Rehearsal Room
# descriptions
# 	name: Overview of Class
# 	value: Contact the department for further information
# instructors
# 	instructor_name: Daniel Farris
# 	instructor_phone: 847/491-4751
# 	instructor_addr: REGENSTEIN 60 Arts Circle Dr, Evanston IL
# enrl_requirement: ::
# class_attributes: ""
