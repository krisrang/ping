class Message < ActiveRecord::Base
  validates_presence_of :cooked, :source, :user, :channel

  belongs_to :user
  belongs_to :channel
end