class CreateUsers < ActiveRecord::Migration
  def change
    create_table :users do |t|
      t.string :username,         null: false, limit: 20
      t.string :username_lower,   null: false, limit: 20
      t.string :email,            null: false
      t.string :auth_token,       limit: 32
      t.string :password_digest
    end
  end
end
