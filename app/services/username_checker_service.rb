class UsernameCheckerService
  def check_username(username)
    if username && username.length > 0
      validator = UsernameValidator.new(username)
      if !validator.valid_format?
        {errors: validator.errors}
      else
        check_username_locally(username)
      end
    end
  end

  def check_username_locally(username)
    if User.username_available?(username)
      { available: true }
    else
      { available: false, suggestion: UserNameSuggester.suggest(username) }
    end
  end
end
