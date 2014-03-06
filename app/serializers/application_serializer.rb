class ApplicationSerializer < ActiveModel::Serializer
  embed :ids, include: true
  attributes :created_at, :updated_at
end
