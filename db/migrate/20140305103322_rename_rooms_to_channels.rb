class RenameRoomsToChannels < ActiveRecord::Migration
  def change
    rename_table :rooms, :channels
    add_column :channels, :purpose, :string
    change_column :channels, :name, :string, null: false, limit: 20
    
    drop_join_table :rooms, :users
    create_join_table :channels, :users do |t|
      t.index [:user_id, :channel_id], unique: true
    end
    
    rename_column :messages, :room_id, :channel_id
  end
end
