class CreateTerms < ActiveRecord::Migration

  def change

    create_table :terms do |t|
    	t.integer "unique_id" # 4 digits
    	t.string "title"
    end  	

	  terms = {
			"4000" => "2000 Fall",
			"4005" => "2000-01 Academic Year",
			"4040" => "2001 Fall",
			"4020" => "2001 Spring",
			"4030" => "2001 Summer",
			"4010" => "2001 Winter",
			"4045" => "2001-02 Academic Year",
			"4080" => "2002 Fall",
			"4060" => "2002 Spring",
			"4070" => "2002 Summer",
			"4050" => "2002 Winter",
			"4085" => "2002-03 Academic Year",
			"4120" => "2003 Fall",
			"4100" => "2003 Spring",
			"4110" => "2003 Summer",
			"4090" => "2003 Winter",
			"4125" => "2003-04 Academic Year",
			"4160" => "2004 Fall",
			"4140" => "2004 Spring",
			"4150" => "2004 Summer",
			"4130" => "2004 Winter",
			"4165" => "2004-05 Academic Year",
			"4200" => "2005 Fall",
			"4180" => "2005 Spring",
			"4190" => "2005 Summer",
			"4170" => "2005 Winter",
			"4205" => "2005-06 Academic Year",
			"4240" => "2006 Fall",
			"4220" => "2006 Spring",
			"4230" => "2006 Summer",
			"4210" => "2006 Winter",
			"4245" => "2006-07 Academic Year",
			"4280" => "2007 Fall",
			"4260" => "2007 Spring",
			"4270" => "2007 Summer",
			"4250" => "2007 Winter",
			"4285" => "2007-08 Academic Year",
			"4320" => "2008 Fall",
			"4300" => "2008 Spring",
			"4310" => "2008 Summer",
			"4290" => "2008 Winter",
			"4325" => "2008-09 Academic Year",
			"4360" => "2009 Fall",
			"4340" => "2009 Spring",
			"4350" => "2009 Summer",
			"4330" => "2009 Winter",
			"4365" => "2009-10 Academic Year",
			"4400" => "2010 Fall",
			"4380" => "2010 Spring",
			"4390" => "2010 Summer",
			"4370" => "2010 Winter",
			"4405" => "2010-2011 Academic Year",
			"4440" => "2011 Fall",
			"4420" => "2011 Spring",
			"4430" => "2011 Summer",
			"4410" => "2011 Winter",
			"4445" => "2011-2012 Academic Year",
			"4480" => "2012 Fall",
			"4460" => "2012 Spring",
			"4470" => "2012 Summer",
			"4450" => "2012 Winter",
			"4485" => "2012-2013 Academic Year",
			"4500" => "2013 Spring",
			"4510" => "2013 Summer",
			"4490" => "2013 Winter",
		}

    terms.each { |key, value|
    	Term.create :unique_id => key, :title => value
    }

  end

end
