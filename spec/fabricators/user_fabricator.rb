Fabricator(:user) do
  username { sequence(:username) { |i| "bruce#{i}" } }
  email { sequence(:email) { |i| "bruce#{i}@wayne.com" } }
  password 'alfredismybro'
  ip_address { sequence(:ip_address) { |i| "99.232.23.#{i%254}"} }
end