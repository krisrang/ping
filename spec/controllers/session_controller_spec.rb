require 'spec_helper'

describe SessionController do
  describe '.create' do
    let(:user) { Fabricate(:user) }

    context 'when email has been confirmed' do
      it "raises an error when the login isn't present" do
        expect { post :create }.to raise_error(ActionController::ParameterMissing)
      end

      describe 'invalid password' do
        before do
          post :create, login: user.username, password: 'sssss'
        end

        it "should return an error with an invalid password" do
          flash[:alert].should eq(I18n.t('login.invalid'))
        end

        it "should not log user in" do
          controller.send(:logged_in?).should eq false
        end
      end

      describe 'success by username' do
        before do
          post :create, login: user.username, password: 'alfredismybro'
          user.reload
        end

        it 'sets a session id' do
          session[:current_user].should == user.id
        end

        it 'gives the user an auth token' do
          user.auth_token.should be_present
        end

        it 'sets a cookie with the auth token' do
          cookies.signed[:_t].should == user.auth_token
        end
      end

      describe 'also allow login by email' do
        before do
          post :create, login: user.email, password: 'alfredismybro'
        end

        it 'sets a session id' do
          session[:current_user].should == user.id
        end
      end

      context 'login has leading and trailing space' do
        let(:username) { " #{user.username} " }
        let(:email) { " #{user.email} " }

        it "strips spaces from the username" do
          post :create, login: username, password: 'alfredismybro'
          controller.send(:logged_in?).should eq true
        end

        it "strips spaces from the email" do
          post :create, login: email, password: 'alfredismybro'
          controller.send(:logged_in?).should eq true
        end
      end
    end

    context 'when email has not been confirmed' do
      def post_login
        post :create, login: user.email, password: 'alfredismybro'
      end

      it "doesn't log in the user" do
        post_login
        controller.send(:logged_in?).should eq false
      end

      it "shows the 'not activated' error message" do
        post_login
        response.body.should include(I18n.t('login.not_activated'))
      end
    end
  end
end