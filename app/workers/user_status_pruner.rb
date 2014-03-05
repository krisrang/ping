class UserStatusPruner
  include Sidekiq::Worker
  include Sidetiq::Schedulable

  recurrence { minutely(5) }

  def perform
    time = DateTime.now
    userids = []
    
    $redis.keys("userstatusexpire*").each do |key|
      expire = DateTime.parse($redis.get(key))
      userids << key.sub("userstatusexpire:", "").to_i if expire <= time
    end
    
    userids.each do |id|
      User.find(id).status = :offline
    end
  end
end