class SwitchToPbkdf < ActiveRecord::Migration
  def change
    remove_column :users, :password_digest

    add_column :users, :password_hash, :string, limit: 64
    add_column :users, :salt, :string, limit: 32
  end
end
