begin
  Settings.refresh!
rescue ActiveRecord::StatementInvalid, PG::ConnectionBad
  # This will happen when migrating a new database or precompiling assets
end