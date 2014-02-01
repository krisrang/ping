class DbConsistency
  include Sidekiq::Worker
  include Sidetiq::Schedulable

  recurrence { daily.hour_of_day(2) }

  def perform
    UserVisit.ensure_consistency!
  end
end