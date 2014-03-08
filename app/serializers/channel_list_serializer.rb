class ChannelListSerializer < ApplicationSerializer
  attributes :id, :name, :open, :topic, :purpose, :owner_id
  has_many :messages
  has_many :users
  has_one :user

  def user
    object.owner
  end
end
