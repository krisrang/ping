Dir["#{Rails.root}/lib/patches/*.rb"].each do |f|
  require(f)
end
