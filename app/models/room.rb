class Room < ActiveRecord::Base
  validates_presence_of :name
  validates_uniqueness_of :name

  belongs_to :owner, class_name: 'User'
  has_many :messages, dependent: :destroy
  has_and_belongs_to_many :users

  attr_accessor :open

  def join(user)
    unless users.include?(user)
      users << user
      return true
    end

    false
  end

  def leave(user)
    if users.include?(user)
      users.delete(user)
      return true
    end
    
    false
  end
end
