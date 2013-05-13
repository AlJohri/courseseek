class CreateFeedbacks < ActiveRecord::Migration
  def change
    create_table :feedbacks do |t|
      t.string :type
      t.text :feedback

      t.timestamps
    end
  end
end
