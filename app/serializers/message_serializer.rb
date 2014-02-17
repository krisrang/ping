class MessageSerializer < ApplicationSerializer
  attributes :id, :cooked, :source
  has_one :room
  has_one :user
end
