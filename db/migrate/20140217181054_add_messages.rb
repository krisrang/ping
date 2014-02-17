class AddMessages < ActiveRecord::Migration
  def change
    create_table :messages do |t|
      t.text :source, null: false
      t.text :cooked, null: false
      t.integer :user_id, null: false
      t.integer :room_id, null: false

      t.timestamps

      t.index :user_id
      t.index :room_id
    end
  end
end
