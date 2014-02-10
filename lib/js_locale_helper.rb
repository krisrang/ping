module JsLocaleHelper
  def self.output_locale(locale, translations = nil)
    locale_str = locale.to_s

    # load default translations
    translations ||= YAML::load(File.open("#{Rails.root}/config/locales/client.#{locale_str}.yml"))

    message_formats = strip_out_message_formats!(translations[locale_str]['js'])

    result = generate_message_format(message_formats, locale_str)

    result << "I18n.translations = #{translations.to_json};\n"
    result << "I18n.locale = '#{locale_str}';\n"
    # loading moment here cause we must customize it
    result << File.read("#{Rails.root}/lib/javascripts/moment.js")
    result << moment_locale(locale_str)
    result << moment_formats
    result
  end

  def self.moment_formats
    result = ""
    result << moment_format_function('short_date_no_year')
    result << moment_format_function('short_date')
    result << moment_format_function('long_date')
    result << "moment.fn.relativeAge = function(opts){ return Ping.Formatter.relativeAge(this.toDate(), opts)};\n"
  end

  def self.moment_format_function(name)
    format = I18n.t("dates." << name)
    result = "moment.fn.#{name.camelize(:lower)} = function(){ return this.format('#{format}'); };\n"
  end

  def self.moment_locale(locale_str)
    filename = Rails.root + "lib/javascripts/moment_locale/#{locale_str}.js"
    if File.exists?(filename)
      File.read(filename) << "\n"
    end || ""
  end

  def self.generate_message_format(message_formats, locale_str)
    formats = message_formats.map{|k,v| k.inspect << " : " << compile_message_format(locale_str ,v)}.join(" , ")

    result = "MessageFormat = {locale: {}};\n"

    filename = Rails.root + "lib/javascripts/locale/#{locale_str}.js"
    filename = Rails.root + "lib/javascripts/locale/en.js" unless File.exists?(filename)

    result << File.read(filename) << "\n"

    result << "I18n.messageFormat = (function(formats){
      var f = formats;
      return function(key, options) {
        var fn = f[key];
        if(fn){
          try {
            return fn(options);
          } catch(err) {
            return err.message;
          }
        } else {
          return 'Missing Key: ' + key
        }
        return f[key](options);
      };
    })({#{formats}});"
  end

  def self.compile_message_format(locale, format)
    ctx = V8::Context.new
    ctx.load(Rails.root + 'lib/javascripts/messageformat.js')
    path = Rails.root + "lib/javascripts/locale/#{locale}.js"
    ctx.load(path) if File.exists?(path)
    ctx.eval("mf = new MessageFormat('#{locale}');")
    ctx.eval("mf.precompile(mf.parse(#{format.inspect}))")

  rescue V8::Error => e
    message = "Invalid Format: " << e.message
    "function(){ return #{message.inspect};}"
  end

  def self.strip_out_message_formats!(hash, prefix = "", rval = {})
    if Hash === hash
      hash.each do |k,v|
        if Hash === v
          rval.merge!(strip_out_message_formats!(v, prefix + (prefix.length > 0 ? "." : "") << k, rval))
        elsif k.to_s().end_with?("_MF")
          rval[prefix + (prefix.length > 0 ? "." : "") << k] = v
          hash.delete(k)
        end
      end
    end
    rval
  end
end
