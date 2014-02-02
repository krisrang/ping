class CurrentUserSerializer < UserSerializer

  attributes :admin?, :no_password

  def no_password
    true
  end

  def include_no_password?
    !object.has_password?
  end
end
