class NewUsersRoomsTable < ActiveRecord::Migration
  def change
    drop_join_table :rooms, :users
    create_join_table :rooms, :users do |t|
      t.index [:user_id, :room_id], unique: true
    end
  end
end
