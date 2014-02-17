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

ActiveRecord::Schema.define(version: 20140217181054) do

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

  create_table "facebook_user_infos", force: true do |t|
    t.integer  "user_id",          null: false
    t.integer  "facebook_user_id", null: false
    t.string   "username",         null: false
    t.string   "first_name"
    t.string   "last_name"
    t.string   "email"
    t.string   "gender"
    t.string   "name"
    t.string   "link"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  add_index "facebook_user_infos", ["facebook_user_id"], name: "index_facebook_user_infos_on_facebook_user_id", unique: true, using: :btree
  add_index "facebook_user_infos", ["user_id"], name: "index_facebook_user_infos_on_user_id", unique: true, using: :btree

  create_table "github_user_infos", force: true do |t|
    t.integer  "user_id",        null: false
    t.integer  "github_user_id", null: false
    t.string   "screen_name",    null: false
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  add_index "github_user_infos", ["github_user_id"], name: "index_github_user_infos_on_github_user_id", unique: true, using: :btree
  add_index "github_user_infos", ["user_id"], name: "index_github_user_infos_on_user_id", unique: true, using: :btree

  create_table "google_user_infos", force: true do |t|
    t.integer  "user_id",        null: false
    t.string   "google_user_id", null: false
    t.string   "name",           null: false
    t.string   "first_name"
    t.string   "last_name"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  add_index "google_user_infos", ["google_user_id"], name: "index_google_user_infos_on_google_user_id", unique: true, using: :btree
  add_index "google_user_infos", ["user_id"], name: "index_google_user_infos_on_user_id", unique: true, using: :btree

  create_table "messages", force: true do |t|
    t.text     "source",     null: false
    t.text     "cooked",     null: false
    t.integer  "user_id",    null: false
    t.integer  "room_id",    null: false
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  add_index "messages", ["room_id"], name: "index_messages_on_room_id", using: :btree
  add_index "messages", ["user_id"], name: "index_messages_on_user_id", using: :btree

  create_table "oauth2_user_infos", force: true do |t|
    t.integer  "user_id",    null: false
    t.string   "uid",        null: false
    t.string   "provider",   null: false
    t.string   "email"
    t.string   "name"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  add_index "oauth2_user_infos", ["uid", "provider"], name: "index_oauth2_user_infos_on_uid_and_provider", unique: true, using: :btree

  create_table "rooms", force: true do |t|
    t.string   "name",       null: false
    t.datetime "created_at"
    t.datetime "updated_at"
    t.string   "topic"
    t.integer  "owner_id"
  end

  add_index "rooms", ["name"], name: "index_rooms_on_name", unique: true, using: :btree
  add_index "rooms", ["owner_id"], name: "index_rooms_on_owner_id", using: :btree

  create_table "rooms_users", id: false, force: true do |t|
    t.integer "room_id", null: false
    t.integer "user_id", null: false
  end

  add_index "rooms_users", ["room_id"], name: "index_rooms_users_on_room_id", using: :btree
  add_index "rooms_users", ["user_id"], name: "index_rooms_users_on_user_id", using: :btree

  create_table "settings", force: true do |t|
    t.string   "name",       null: false
    t.integer  "data_type",  null: false
    t.text     "value"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "twitter_user_infos", force: true do |t|
    t.integer  "user_id",         null: false
    t.integer  "twitter_user_id", null: false
    t.string   "screen_name",     null: false
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  add_index "twitter_user_infos", ["twitter_user_id"], name: "index_twitter_user_infos_on_twitter_user_id", unique: true, using: :btree
  add_index "twitter_user_infos", ["user_id"], name: "index_twitter_user_infos_on_user_id", unique: true, using: :btree

  create_table "user_open_ids", force: true do |t|
    t.integer  "user_id",    null: false
    t.string   "email",      null: false
    t.string   "url",        null: false
    t.boolean  "active",     null: false
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  add_index "user_open_ids", ["url"], name: "index_user_open_ids_on_url", using: :btree

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
    t.string   "name"
  end

end
