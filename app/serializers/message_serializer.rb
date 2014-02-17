class MessageSerializer < ApplicationSerializer
  attributes :id, :cooked, :source, :created_at
  has_one :room
  has_one :user
end
