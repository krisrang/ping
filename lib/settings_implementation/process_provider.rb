module SettingsImplementation; end

class SettingsImplementation::ProcessProvider

  Setting = Struct.new(:name, :value, :data_type) unless defined? SettingsImplementation::ProcessProvider::Setting

  def initialize(defaults = {})
    @settings = {}
    @defaults = {}
    defaults.each do |name,(value,data_type)|
      @defaults[name] = Setting.new(name,value,data_type)
    end
  end

  def all
    (@defaults.merge @settings).values
  end

  def find(name)
    @settings[name] || @defaults[name]
  end

  def save(name, value, data_type)
    @settings[name] = Setting.new(name,value, data_type)
  end

  def destroy(name)
    @settings.delete(name)
  end

end
