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

ActiveRecord::Schema.define(version: 20131224165342) do

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

  create_table "users", force: true do |t|
    t.string   "username",        limit: 20, null: false
    t.string   "username_lower",  limit: 20, null: false
    t.string   "email",                      null: false
    t.string   "auth_token",      limit: 32
    t.string   "password_digest"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.boolean  "active"
    t.datetime "last_seen"
    t.inet     "last_ip"
  end

end
