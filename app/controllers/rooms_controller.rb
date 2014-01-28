class RoomsController < ApplicationController
  def index
    c = env['faye.client']

    c.publish '/foo', 'test'
  end
end