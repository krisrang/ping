class Auth::GoogleAuthenticator < Auth::Authenticator

  def name
    "google"
  end

  def after_authenticate(auth_token)
    result = Auth::Result.new

    data = auth_token[:info]

    result.username = name = data["name"]
    result.email = email = data["email"]

    google_user_id = auth_token["uid"]
    first_name = data["first_name"]
    last_name = data["last_name"]

    result.extra_data = {
      google_user_id: google_user_id,
      google_name: name,
      first_name: first_name,
      last_name: last_name,
    }

    user_info = GoogleUserInfo.where(google_user_id: google_user_id).first

    if user_info
      user = user_info.user
    elsif user = User.find_by_email(email)
      user_info = GoogleUserInfo.create(
          user_id: user.id,
          name: name,
          first_name: first_name,
          last_name: last_name,
          google_user_id: google_user_id
      )
    end

    result.user = user
    result.email_valid = true

    result
  end

  def after_create_account(user, auth)
    data = auth[:extra_data]
    GoogleUserInfo.create(
      user_id: user.id,
      name: data[:google_name],
      first_name: data[:first_name],
      last_name: data[:last_name],
      google_user_id: data[:google_user_id]
    )
  end


  def register_middleware(omniauth)
    omniauth.provider :google_oauth2,
                      Settings.google_key,
                      Settings.google_secret,
                      { name: 'google',
                        scope: "userinfo.email, userinfo.profile" }
  end
end
