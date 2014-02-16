class Room < ActiveRecord::Base
  validates_presence_of :name
  validates_uniqueness_of :name

  belongs_to :owner, class_name: 'User'
  has_and_belongs_to_many :users

  attr_accessor :open
end