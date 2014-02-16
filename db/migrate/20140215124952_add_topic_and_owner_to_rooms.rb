class AddTopicAndOwnerToRooms < ActiveRecord::Migration
  def change
    add_column :rooms, :topic, :string
    add_column :rooms, :owner_id, :integer
    add_index :rooms, :owner_id
  end
end
