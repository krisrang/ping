class CreateRooms < ActiveRecord::Migration
  def change
    create_table :rooms do |t|
      t.string :name, null: false

      t.timestamps
    end

    create_join_table :rooms, :users
  end
end
