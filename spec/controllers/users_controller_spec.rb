require 'spec_helper'

describe UsersController do
  before do
    UsersController.any_instance.stubs(:honeypot_value).returns(nil)
    UsersController.any_instance.stubs(:challenge_value).returns(nil)
  end

  describe '#create' do
    before do
      @user = Fabricate.build(:user)
      @user.password = "strongpassword"
    end

    def post_user
      xhr :post, :create, user: {
        username: @user.username,
        password: "strongpassword",
        email: @user.email
      }, format: :json
    end

    context 'when creating a non active user (unconfirmed email)' do
      it 'enqueues a signup email' do
        UserEmailer.expects(:perform_async).with(:signup, anything())
        post_user
      end

      it 'indicates the user is not active in the response' do
        post_user
        expect(JSON.parse(response.body)['active']).to be_false
      end

      context "and 'must approve users' site setting is enabled" do
        before { Settings.expects(:must_approve_users).returns(true) }

        it 'does not enqueue an email' do
          UserEmailer.expects(:perform_async).never
          post_user
        end

        it 'does not login the user' do
          post_user
          expect(session[:current_user_id]).to be_blank
        end

        it 'indicates the user is not active in the response' do
          post_user
          expect(JSON.parse(response.body)['active']).to be_false
        end

        it "shows the 'waiting approval' message" do
          post_user
          expect(JSON.parse(response.body)['message']).to eq(
            I18n.t 'login.wait_approval'
          )
        end
      end
    end

    context 'when creating an active user (confirmed email)' do
      before { User.any_instance.stubs(:active?).returns(true) }

      it "shows the 'active' message" do
        post_user
        expect(JSON.parse(response.body)['message']).to eq(
          I18n.t 'login.active'
        )
      end

      it "should be logged in" do
        post_user
        session[:current_user_id].should be_present
      end

      it 'indicates the user is active in the response' do
        post_user
        expect(JSON.parse(response.body)['active']).to be_true
      end

      # context 'authentication records for' do

      #   before do
      #     Settings.expects(:must_approve_users).returns(true)
      #   end

      #   it 'should create twitter user info if required' do
      #     Settings.stubs(:enable_twitter_logins?).returns(true)
      #     twitter_auth = { twitter_user_id: 42, twitter_screen_name: "bruce" }
      #     auth = session[:authentication] = {}
      #     auth[:authenticator_name] = 'twitter'
      #     auth[:extra_data] = twitter_auth
      #     TwitterUserInfo.expects(:create)

      #     post_user
      #   end
      # end
    end

    context 'after success' do
      before { post_user }

      it 'should succeed' do
        should respond_with(:success)
      end

      it 'has the proper JSON' do
        json = JSON::parse(response.body)
        json["success"].should be_true
      end

      it 'should not result in an active account' do
        User.where(username: @user.username).first.active.should be_false
      end
    end

    shared_examples 'honeypot fails' do
      it 'should not create a new user' do
        expect {
          xhr :post, :create, create_params.merge({format: :json})
        }.to_not change { User.count }
      end

      it 'should not send an email' do
        UserEmailer.any_instance.expects(:perform_async).never
        xhr :post, :create, create_params.merge({format: :json})
      end

      it 'should say it was successful' do
        xhr :post, :create, create_params.merge({format: :json})
        json = JSON::parse(response.body)
        json["success"].should be_true
      end
    end

    context 'when honeypot value is wrong' do
      before do
        UsersController.any_instance.stubs(:honeypot_value).returns('abc')
      end
      let(:create_params) { { user: { username: @user.username, password: "strongpassword", email: @user.email, password_confirmation: 'wrong' } } }
      include_examples 'honeypot fails'
    end

    context 'when challenge answer is wrong' do
      before do
        UsersController.any_instance.stubs(:challenge_value).returns('abc')
      end
      let(:create_params) { { user: { username: @user.username, password: "strongpassword", email: @user.email, challenge: 'abc' } } }
      include_examples 'honeypot fails'
    end

    shared_examples 'failed signup' do
      it 'should not create a new User' do
        expect { xhr :post, :create, create_params.merge({format: :json}) }.to_not change { User.count }
      end

      it 'should report failed' do
        xhr :post, :create, create_params.merge({format: :json})
        json = JSON::parse(response.body)
        json["success"].should_not be_true
      end
    end

    context 'when password is blank' do
      let(:create_params) { { user: { username: @user.username, password: "", email: @user.email } } }
      include_examples 'failed signup'
    end

    context 'when password param is missing' do
      let(:create_params) { { user: { username: @user.username, email: @user.email } } }
      include_examples 'failed signup'
    end

  end
end
