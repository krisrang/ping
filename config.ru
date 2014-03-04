# This file is used by Rack-based servers to start the application.

require ::File.expand_path('../config/environment',  __FILE__)
require 'realtime'

run Realtime.new_middleware(Rails.application)
