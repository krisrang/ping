class ApplicationShallowSerializer < ActiveModel::Serializer
  embed :ids, include: false
  attributes :created_at, :updated_at
end
