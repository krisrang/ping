class AddFieldsToUsers < ActiveRecord::Migration
  def change
    add_column :users, :active, :boolean
    add_column :users, :last_seen, :datetime
    add_column :users, :last_ip, :inet
  end
end
