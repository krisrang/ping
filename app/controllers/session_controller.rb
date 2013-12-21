class SessionController < ApplicationController
  def new
  end

  def create
    params.require(:login)
    params.require(:password)

    login = params[:login].strip

    user = log_in(login, params[:password])

    if user
      redirect_back_or_to root_path
    else
      flash.now[:alert] = I18n.t('login.invalid')
      render action:'new'
    end
  end

  def destroy
  end
end
