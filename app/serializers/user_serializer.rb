class UserSerializer < ApplicationSerializer
  attributes :id, :username, :avatar_template, :previous_visit, :last_seen, :days_visited

  def days_visited
    object.user_stat.days_visited
  end
end
