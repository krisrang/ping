class Room < ActiveRecord::Base
  validates_presence_of :name
  validates_uniqueness_of :name

  belongs_to :owner, class_name: 'User'
  has_many :messages, dependent: :destroy
  has_and_belongs_to_many :users

  attr_accessor :open

  def join(user)
    users << user unless users.include?(user)
    publish_join(user)
  end

  def leave(user)
    users.delete(user) if users.include?(user)
    publish_leave(user) 
  end

  def publish_join(user)
    Realtime.publish("/rooms/#{id}", {type: "join", user_id: user.id})
  end

  def publish_leave(user)
    Realtime.publish("/rooms/#{id}", {type: "leave", user_id: user.id})
  end
end
