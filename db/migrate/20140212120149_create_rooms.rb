class CreateRooms < ActiveRecord::Migration
  def change
    create_table :rooms do |t|
      t.string :name, null: false

      t.timestamps

      t.index :name, unique: true
    end

    create_join_table :rooms, :users do |t|
      t.index :user_id
      t.index :room_id
    end
  end
end
