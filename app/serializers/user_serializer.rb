class UserSerializer < ApplicationSerializer
  attributes :id, :username, :status, :avatar_template, :previous_visit, 
             :last_seen, :days_visited, :admin

  def days_visited
    object.user_stat.days_visited
  end
end
