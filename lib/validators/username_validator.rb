# TODO: simplify this
class UsernameValidator
  # Public: Perform the validation of a field in a given object
  # it adds the errors (if any) to the object that we're giving as parameter
  #
  # object - Object in which we're performing the validation
  # field_name - name of the field that we're validating
  #
  # Example: UsernameValidator.perform_validation(user, 'name')
  def self.perform_validation(object, field_name)
    validator = UsernameValidator.new(object.send(field_name))
    unless validator.valid_format?
      validator.errors.each { |e| object.errors.add(field_name.to_sym, e) }
    end
  end

  def initialize(username)
    @username = username
    @errors = []
  end
  attr_accessor :errors
  attr_reader :username

  def user
    @user ||= User.new(user)
  end

  def valid_format?
    username_exist?
    username_length_min?
    username_length_max?
    username_char_valid?
    username_first_char_valid?
    errors.empty?
  end

  private

  def username_exist?
    return unless errors.empty?
    errors << I18n.t(:'user.username.blank') unless username
  end

  def username_length_min?
    return unless errors.empty?
    if username.length < User.username_length.begin
      errors << I18n.t(:'user.username.short', min: User.username_length.begin)
    end
  end

  def username_length_max?
    return unless errors.empty?
    if username.length > User.username_length.end
      errors << I18n.t(:'user.username.long', max: User.username_length.end)
    end
  end

  def username_char_valid?
    return unless errors.empty?
    if username =~ /[^A-Za-z0-9_]/
      errors << I18n.t(:'user.username.characters')
    end
  end

  def username_first_char_valid?
    return unless errors.empty?
    if username[0] =~ /[^A-Za-z0-9]/
      errors << I18n.t(:'user.username.must_begin_with_alphanumeric')
    end
  end
end
