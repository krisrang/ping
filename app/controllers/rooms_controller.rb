class RoomsController < ApplicationController
  before_filter :check_xhr, only: [:show]
  
  def index
    rooms = Room.all
    open = current_user.rooms.select(:id).map(&:id)
    rooms.each { |r| r.open = open.include?(r.id) }

    render json: rooms
  end

  def create
    room = Room.new(room_params)
    room.owner = current_user

    if room.save
      render json: room
    else
      render json: { errors: { messages: room.errors, values: room_params } }, status: 422
    end
  end

  def show
    room = Room.find(params[:id])
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

  def destroy
    room = Room.find(params[:id])
    room.destroy
    render json: room
  end

  private

  def room_params
    params.require(:room).permit(:name, :topic)
  end
end