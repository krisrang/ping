class UserVisit < ActiveRecord::Base

  # A count of visits in the last month by day
  def self.by_day(sinceDaysAgo=30)
    where("visited_at >= ?", sinceDaysAgo.days.ago).group(:visited_at).order(:visited_at).count
  end

  def self.ensure_consistency!
    exec_sql <<SQL
    UPDATE user_stats u set days_visited =
    (
      SELECT COUNT(*) FROM user_visits v WHERE v.user_id = u.user_id
    )
    WHERE days_visited <>
    (
      SELECT COUNT(*) FROM user_visits v WHERE v.user_id = u.user_id
    )
SQL
  end
end