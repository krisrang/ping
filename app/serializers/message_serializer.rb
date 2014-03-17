class MessageSerializer < ApplicationSerializer
  attributes :id, :cooked, :source, :channel_id
  has_one :user
  
  def include_user?
    !!options[:embed]
  end
end
