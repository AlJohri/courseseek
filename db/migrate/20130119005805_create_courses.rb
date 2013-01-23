class CreateCourses < ActiveRecord::Migration
  def change
    create_table :courses do |t|
        t.string "unique_id"
        t.string "term"
        t.string "subject"
        t.string "number"
        t.string "section"
        t.string "title"
        t.boolean "M"
        t.boolean "T"
        t.boolean "W"
        t.boolean "R"
        t.boolean "F"
        t.string "start"
        t.string "end"
        t.string "room"
        t.string "instructor"
        t.integer "seats"
        t.string "status"
        t.timestamps
    end
    add_index :courses, :unique_id, :unique => true
  end
end

#t.datetime "created_at"
#t.datetime "updated_at"

# :limit => size, :default => value, :null => true/false, :precision => number, :scale => number

#http://stackoverflow.com/questions/1517303/how-to-use-mysql-index-columns