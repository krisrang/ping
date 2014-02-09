require 'spec_helper'

describe SessionController do

  describe '.create' do

    let(:user) { Fabricate(:user) }

    context 'when email is confirmed' do
      before do
        token = user.email_tokens.where(email: user.email).first
        EmailToken.confirm(token.token)
      end

      # it "raises an error when the login isn't present" do
      #   lambda { xhr :post, :create }.should raise_error(ActionController::ParameterMissing)
      # end

      describe 'invalid password' do
        it "should return an error with an invalid password" do
          xhr :post, :create, login: user.username, password: 'sssss', format: :json
          ::JSON.parse(response.body)['error'].should be_present
        end
      end

      describe 'success by username' do
        before do
          xhr :post, :create, login: user.username, password: 'alfredismybro'
          user.reload
        end

        it 'sets a session id' do
          session[:current_user_id].should == user.id
        end

        it 'gives the user an auth token' do
          user.auth_token.should be_present
        end

        it 'sets a cookie with the auth token' do
          cookies[:_t].should == user.auth_token
        end
      end

      describe 'also allow login by email' do
        before do
          xhr :post, :create, login: user.email, password: 'alfredismybro'
        end

        it 'sets a session id' do
          session[:current_user_id].should == user.id
        end
      end

      context 'login has leading and trailing space' do
        let(:username) { " #{user.username} " }
        let(:email) { " #{user.email} " }

        it "strips spaces from the username" do
          xhr :post, :create, login: username, password: 'alfredismybro', format: :json
          ::JSON.parse(response.body)['error'].should_not be_present
        end

        it "strips spaces from the email" do
          xhr :post, :create, login: email, password: 'alfredismybro', format: :json
          ::JSON.parse(response.body)['error'].should_not be_present
        end
      end
    end

    context 'when email has not been confirmed' do
      def post_login
        xhr :post, :create, login: user.email, password: 'alfredismybro', format: :json
      end

      it "doesn't log in the user" do
        post_login
        session[:current_user_id].should be_blank
      end

      it "shows the 'not activated' error message" do
        post_login
        expect(JSON.parse(response.body)['error']).to eq(
          I18n.t 'login.not_activated'
        )
      end
    end
  end

  describe '.destroy' do
    before do
      @user = log_in
      xhr :delete, :destroy, id: @user.username
    end

    it 'removes the session variable' do
      session[:current_user_id].should be_blank
    end


    it 'removes the auth token cookie' do
      cookies[:_t].should be_blank
    end
  end

  describe '.forgot_password' do

    # it 'raises an error without a username parameter' do
    #   lambda { xhr :post, :forgot_password }.should raise_error(ActionController::ParameterMissing)
    # end

    context 'for a non existant username' do
      it "doesn't generate a new token for a made up username" do
        lambda { xhr :post, :forgot_password, login: 'made_up'}.should_not change(EmailToken, :count)
      end

      it "doesn't enqueue an email" do
        UserEmailer.expects(:perform_async).with(:forgot_password, anything).never
        xhr :post, :forgot_password, login: 'made_up'
      end
    end

    context 'for an existing username' do
      let(:user) { Fabricate(:user) }

      it "generates a new token for a made up username" do
        lambda { xhr :post, :forgot_password, login: user.username}.should change(EmailToken, :count)
      end

      it "enqueues an email" do
        UserEmailer.expects(:perform_async).with(:forgot_password, has_entries(user_id: user.id))
        xhr :post, :forgot_password, login: user.username
      end
    end
  end
end
