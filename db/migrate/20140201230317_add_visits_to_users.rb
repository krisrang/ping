class AddVisitsToUsers < ActiveRecord::Migration
  def change
    add_column :users, :previous_visit, :datetime

    create_table :user_visits do |t|
      t.integer :user_id,     null: false
      t.date    :visited_at,  null: false
    end

    create_table :user_stats, id: false, primary_key: :user_id do |t|
      t.integer :user_id,           null: false
      t.boolean :has_custom_avatar, null: false, default: false
      t.integer :days_visited,      null: false, default: 0
    end

    execute "ALTER TABLE user_stats ADD PRIMARY KEY (user_id);"
  end
end
