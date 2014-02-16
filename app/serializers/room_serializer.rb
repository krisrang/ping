class RoomSerializer < ApplicationSerializer
  attributes :id, :name, :open, :topic, :owner_id
end
