class RoomSerializer < ApplicationSerializer
  attributes :id, :name, :open, :topic
  has_many :messages
  has_one :user

  def user
    object.owner
  end
end
