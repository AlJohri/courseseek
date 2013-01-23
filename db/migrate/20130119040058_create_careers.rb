class CreateCareers < ActiveRecord::Migration

  def change
    
    create_table :careers do |t|
    	t.string "career", :limit => 4
    	t.string "title"    	
    end

  	hash_careers = {
			"SPCG" => "Communication Grad",
			"CNED" => "Continuing Education",
			"CGRD" => "Continuing Education Grad",
			"CNCR" => "Continuing Noncredit",
			"EDG"	 => "Education Grad",
			"MGMT" => "J L Kellogg School Management",
			"JRNG" => "Journalism Grad",
			"EMP"	 => "Kellogg Executive Masters Prog",
			"LAW"	 => "Law",
			"ENGG" => "McCormick Engg Grad",
			"MUSG" => "Music Grad",
			"NDGR" => "Non-Degree",
			"PT" => "Physical Therapy",
			"PA" => "Physician Assistant",
			"PO" => "Prosthetics Orthotics",
			"TGS" => "The Graduate School",
			"UGRD" => "Undergraduate",
		}    

    hash_careers.each { |key, value|
    	Career.create :career => key, :title => value
    }
  end

end