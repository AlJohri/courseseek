class Course < ActiveRecord::Base
  attr_accessible :unique_id, :term, :subject, :number, :section, :title, :M, :T, :W, :R, :F, :start, :end, :room, :instructor, :seats, :status
end
