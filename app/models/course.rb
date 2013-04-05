class Course < ActiveRecord::Base
  attr_accessible :unique_id, :term, :subject, :number, :section, :title, :M, :T, :W, :R, :F, :start, :end, :room, :instructor, :seats, :status
  has_one :description, :foreign_key => :unique_id, :primary_key => :unique_id
end