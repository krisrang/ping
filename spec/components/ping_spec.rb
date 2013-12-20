require 'spec_helper'
require 'ping'

describe Ping do
  context 'git_version' do
    it "returns a version" do
      Ping.git_version.length.should eq 40
    end
  end
end
