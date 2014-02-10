class ExternalUsers < ActiveRecord::Migration
  def change
    add_column :users, :name, :string
    
    create_table :oauth2_user_infos do |t|
      t.integer :user_id, null: false
      t.string :uid,      null: false
      t.string :provider, null: false
      t.string :email
      t.string :name

      t.timestamps

      t.index [:uid, :provider], unique: true
    end

    create_table :github_user_infos do |t|
      t.integer :user_id,         null: false
      t.integer :github_user_id,  null: false
      t.string :screen_name,      null: false

      t.timestamps

      t.index :github_user_id,  unique: true
      t.index :user_id,         unique: true
    end

    create_table :twitter_user_infos do |t|
      t.integer :user_id,         null: false
      t.integer :twitter_user_id, null: false
      t.string :screen_name,      null: false

      t.timestamps

      t.index :twitter_user_id, unique: true
      t.index :user_id,         unique: true
    end

    create_table :facebook_user_infos do |t|
      t.integer :user_id,           null: false
      t.integer :facebook_user_id,  null: false
      t.string :username,           null: false
      t.string :first_name
      t.string :last_name
      t.string :email
      t.string :gender
      t.string :name
      t.string :link

      t.timestamps

      t.index :facebook_user_id,  unique: true
      t.index :user_id,           unique: true
    end

    create_table :user_open_ids do |t|
      t.integer :user_id, null: false
      t.string :email,    null: false
      t.string :url,      null: false
      t.boolean :active,  null: false

      t.timestamps

      t.index :url
    end

    create_table :google_user_infos do |t|
      t.integer :user_id,         null: false
      t.string :google_user_id,   null: false
      t.string :name,             null: false
      t.string :first_name
      t.string :last_name

      t.timestamps

      t.index :google_user_id,  unique: true
      t.index :user_id,         unique: true
    end
  end
end
