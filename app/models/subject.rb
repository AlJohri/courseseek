class Subject < ActiveRecord::Base
  attr_accessible :subject, :title
  #@subjects = Subject.all
end