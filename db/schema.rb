# encoding: UTF-8
# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 20140209202746) do

  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "email_tokens", force: true do |t|
    t.integer  "user_id",                    null: false
    t.string   "email",                      null: false
    t.string   "token",                      null: false
    t.boolean  "confirmed",  default: false, null: false
    t.boolean  "expired",    default: false, null: false
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  add_index "email_tokens", ["token"], name: "index_email_tokens_on_token", using: :btree

  create_table "settings", force: true do |t|
    t.string   "name",       null: false
    t.integer  "data_type",  null: false
    t.text     "value"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "user_stats", id: false, force: true do |t|
    t.integer "user_id",                           null: false
    t.boolean "has_custom_avatar", default: false, null: false
    t.integer "days_visited",      default: 0,     null: false
  end

  create_table "user_visits", force: true do |t|
    t.integer "user_id",    null: false
    t.date    "visited_at", null: false
  end

  create_table "users", force: true do |t|
    t.string   "username",       limit: 20,                 null: false
    t.string   "username_lower", limit: 20,                 null: false
    t.string   "email",                                     null: false
    t.string   "auth_token",     limit: 32
    t.boolean  "active"
    t.datetime "last_seen"
    t.inet     "last_ip"
    t.boolean  "admin",                     default: false, null: false
    t.datetime "previous_visit"
    t.string   "password_hash",  limit: 64
    t.string   "salt",           limit: 32
  end

end
