class CreateInstitutions < ActiveRecord::Migration

  def change

    create_table :institutions do |t|
    	t.string "institution"
    	t.string "title"    	
    end

    hash_institutions = {
      "NWUNV" => "Northwestern University",
    }    

    hash_institutions.each { |key, value|
      Institution.create :institution => key, :title => value
    }

  end 

end