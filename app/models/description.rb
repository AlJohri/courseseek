class Description < ActiveRecord::Base
  attr_accessible :unique_id, :overview
  belongs_to :course, :foreign_key => :unique_id, :primary_key => :unique_id
end