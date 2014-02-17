class Message < ActiveRecord::Base
  validates_presence_of :cooked, :source, :user, :room

  belongs_to :user
  belongs_to :room
end