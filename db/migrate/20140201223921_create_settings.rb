class CreateSettings < ActiveRecord::Migration
  def change
    create_table :settings do |t|
      t.string  :name,      null: false
      t.integer :data_type, null: false
      t.text    :value

      t.timestamps
    end
  end
end
