class RoomsController < ApplicationController
  before_filter :check_xhr, only: [:show]
  
  def index
    rooms = Room.all
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

  def update
    room = Room.find(params[:id])
    room.update_attributes(room_params)
    render json: room
  end

  def show
    room = Room.find(params[:id])
    render json: room, embed: true
  end  

  def join
    room = Room.find(params[:id])
    room.join(current_user)
    render json: success_json
  end

  def leave
    room = Room.find(params[:id])
    room.leave(current_user)
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