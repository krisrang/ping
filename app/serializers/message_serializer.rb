class MessageSerializer < ApplicationSerializer
  attributes :id, :cooked, :source, :created_at
  has_one :channel
  has_one :user
end
