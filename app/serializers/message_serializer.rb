class MessageSerializer < ApplicationSerializer
  attributes :id, :cooked, :source
  has_one :channel
  has_one :user
end
