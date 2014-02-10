begin
  Settings.refresh!
rescue ActiveRecord::StatementInvalid
  # This will happen when migrating a new database
end