class RoomSerializer < ApplicationSerializer
  attributes :id, :name, :open, :topic, :owner_id
  has_many :messages
  has_many :users
  has_one :user

  def user
    object.owner
  end
end
