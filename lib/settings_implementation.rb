require_dependency 'enum'
require_dependency 'settings_implementation/db_provider'

module SettingsImplementation
  def provider=(val)
    @provider = val
    refresh!
  end

  def provider
    @provider ||= SettingsImplementation::DbProvider.new(Settings)
  end

  def provider
    @provider ||= SettingsImplementation::DbProvider.new(Settings)
  end

  def types
    @types ||= Enum.new(:string, :time, :fixnum, :float, :bool, :null, :enum)
  end

  def mutex
    @mutex ||= Mutex.new
  end

  def current
    @@container ||= {}
  end

  def defaults
    @defaults ||= {}
  end

  def enums
    @enums ||= {}
  end

  def setting(name_arg, default = nil, opts = {})
    name = name_arg.to_sym
    mutex.synchronize do
      self.defaults[name] = default
      current_value = current.has_key?(name) ? current[name] : default
      if opts[:enum]
        enum = opts[:enum]
        enums[name] = enum.is_a?(String) ? enum.constantize : enum
      end
      setup_methods(name, current_value)
    end
  end

  def client_setting(name, default = nil, opts = {})
    setting(name, default, opts)
    @@client_settings ||= []
    @@client_settings << name
  end

  def client_settings
    @@client_settings
  end

  def settings_hash
    result = {}
    @defaults.each do |s, v|
      result[s] = send(s).to_s
    end
    result
  end

  def client_settings_json
    Rails.cache.fetch(SettingsImplementation.client_settings_cache_key, expires_in: 30.minutes) do
      client_settings_json_uncached
    end
  end

  def client_settings_json_uncached
    MultiJson.dump(Hash[*@@client_settings.map{|n| [n, self.send(n)]}.flatten])
  end

  # Retrieve all settings
  def all_settings
    @defaults
      .map do |s, v|
        value = send(s)
        type = types[get_data_type(s, value)]
        {setting: s,
         description: description(s),
         default: v,
         type: type.to_s,
         value: value.to_s}
      end
  end

  def description(setting)
    I18n.t("site_settings.#{setting}")
  end

  def self.client_settings_cache_key
    "client_settings_json"
  end

  # refresh all the site settings
  def refresh!
    mutex.synchronize do
      # ensure_listen_for_changes
      old = current

      all_settings = provider.all
      new_hash =  Hash[*(all_settings.map{|s| [s.name.intern, convert(s.value,s.data_type)]}.to_a.flatten)]

      # add defaults
      new_hash = defaults.merge(new_hash)
      changes,deletions = diff_hash(new_hash, old)

      if deletions.length > 0 || changes.length > 0
        @current = new_hash
        changes.each do |name, val|
          setup_methods name, val
        end
        deletions.each do |name,val|
          setup_methods name, defaults[name]
        end
      end

      Rails.cache.delete(SettingsImplementation.client_settings_cache_key)
    end
  end


  # def ensure_listen_for_changes
  #   unless @subscribed
  #     MessageBus.subscribe("/site_settings") do |message|
  #       process_message(message)
  #     end
  #     @subscribed = true
  #   end
  # end

  # def process_message(message)
  #   data = message.data
  #   if data["process"] != process_id
  #     begin
  #       @last_message_processed = message.global_id
  #       MessageBus.on_connect.call(message.site_id)
  #       refresh!
  #     ensure
  #       MessageBus.on_disconnect.call(message.site_id)
  #     end
  #   end
  # end

  def process_id
    @@process_id ||= SecureRandom.uuid
  end

  def remove_override!(name)
    provider.destroy(name)
    current[name] = defaults[name]
  end

  def add_override!(name,val)
    type = get_data_type(name, defaults[name])

    if type == types[:bool] && val != true && val != false
      val = (val == "t" || val == "true") ? 't' : 'f'
    end

    if type == types[:fixnum] && !(Fixnum === val)
      val = val.to_i
    end

    if type == types[:null] && val != ''
      type = get_data_type(name, val)
    end

    if type == types[:enum]
      raise Ping::InvalidParameters.new(:value) unless enum_class(name).valid_value?(val)
    end

    provider.save(name, val, type)
    # @last_message_sent = MessageBus.publish('/site_settings', {process: process_id})
  end

  def has_setting?(name)
    defaults.has_key?(name.to_sym) || defaults.has_key?("#{name}?".to_sym)
  end

  def set(name, value)
    if has_setting?(name)
      self.send("#{name}=", value)
    else
      raise ArgumentError.new("No setting named #{name} exists")
    end
  end

  protected

  def diff_hash(new_hash, old)
    changes = []
    deletions = []

    new_hash.each do |name, value|
      changes << [name,value] if !old.has_key?(name) || old[name] != value
    end

    old.each do |name,value|
      deletions << [name,value] unless new_hash.has_key?(name)
    end

    [changes,deletions]
  end

  def get_data_type(name,val)
    return types[:null] if val.nil?
    return types[:enum] if enums[name]

    case val
    when String
      types[:string]
    when Fixnum
      types[:fixnum]
    when TrueClass, FalseClass
      types[:bool]
    else
      raise ArgumentError.new :val
    end
  end

  def convert(value, type)
    case type
    when types[:fixnum]
      value.to_i
    when types[:string], types[:enum]
      value
    when types[:bool]
      value == true || value == "t" || value == "true"
    when types[:null]
      nil
    end
  end


  def setup_methods(name, current_value)

    # trivial multi db support, we can optimize this later
    current[name] = current_value
    clean_name = name.to_s.sub("?", "")

    eval "define_singleton_method :#{clean_name} do
      c = @@container
      c = c[name] if c
      c
    end

    define_singleton_method :#{clean_name}? do
      #{clean_name}
    end

    define_singleton_method :#{clean_name}= do |val|
      add_override!(:#{name}, val)
      refresh!
    end
    "
  end

  def enum_class(name)
    enums[name]
  end
end