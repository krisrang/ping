module SettingsImplementation; end

class SettingsImplementation::DbProvider

  def initialize(model)
    @model = model
  end

  def all
    return [] unless table_exists?

    @model.select([:name, :data_type, :value]).all
  end

  def find(name)
    return nil unless table_exists?

    @model.select([:name, :data_type, :value]).where(name: name).first
  end

  def save(name, value, data_type)

    return unless table_exists?

    count = @model.where({
      name: name
    }).update_all({
      name: name,
      value: value,
      data_type: data_type,
      updated_at: Time.now
    })

    if count == 0
      @model.create!(name: name, value: value, data_type: data_type)
    end

    true
  end

  def destroy(name)
    return unless table_exists?

    @model.where(name: name).destroy_all
  end

  protected

  # table is not in the db yet, initial migration, etc
  def table_exists?
    @table_exists = ActiveRecord::Base.connection.table_exists? @model.table_name unless @table_exists
    @table_exists
  end

end
