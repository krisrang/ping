require 'spec_helper'
require_dependency 'settings_implementation/db_provider'

describe SettingsImplementation::DbProvider do

  def expect_same_setting(actual, expected)
    expect(actual.name).to eq(expected.name)
    expect(actual.value).to eq(expected.value)
    expect(actual.data_type).to eq(expected.data_type)
  end

  let :provider do
    SettingsImplementation::DbProvider.new(Settings)
  end

  # integration test, requires db access
  it "act correctly" do
    setting = Struct.new(:name, :value, :data_type)

    Settings.destroy_all

    expect(provider.all.length).to eq(0)
    expect(provider.find("test")).to eq(nil)


    provider.save("test", "one", 1)
    found = provider.find("test")

    expect_same_setting(found, setting.new("test", "one", 1))

    provider.save("test", "two", 2)
    found = provider.find("test")

    expect_same_setting(found, setting.new("test", "two", 2))

    provider.save("test2", "three", 3)

    all = provider.all.sort{|a,b| a.name <=> b.name}

    expect_same_setting(all[0], setting.new("test", "two", 2))
    expect_same_setting(all[1], setting.new("test2", "three", 3))
    expect(all.length).to eq(2)

    provider.destroy("test")
    expect(provider.all.length).to eq(1)
  end
end
