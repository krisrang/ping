class RoomsController < ApplicationController
  before_filter :check_xhr, only: [:show]
  
  def index
    rooms = Room.all
    render json: rooms
  end

  def create
    room = Room.create(params[:room])
    render json: room
  end

  def join
    room = Room.find(params[:id])
    current_user.rooms << room
    render json: success_json
  end

  def leave
    room = Room.find(params[:id])
    current_user.rooms.delete room
    render json: success_json
  end

  def show
  end
end