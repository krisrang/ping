class ChannelsController < ApplicationController
  before_filter :check_xhr
  
  def index
    channels = Channel.all.includes([:users, :owner, :messages])
    render json: channels
  end

  def create
    channel = Channel.new(channel_params)
    channel.owner = current_user

    if channel.save
      render json: channel
    else
      render json: { errors: { messages: channel.errors, values: channel_params } }, status: 422
    end
  end

  def update
    channel = Channel.find(params[:id])
    channel.update_attributes(channel_params)
    render json: channel
  end

  def show
    channel = Channel.find(params[:id]).includes([:users, :owner, :messages])
    render json: channel
  end  

  def join
    channel = Channel.find(params[:id])
    channel.join(current_user)
    render json: success_json
  end

  def leave
    channel = Channel.find(params[:id])
    channel.leave(current_user)
    render json: success_json
  end

  def destroy
    channel = Channel.find(params[:id])
    channel.destroy
    render json: success_json
  end

  private

  def channel_params
    params.require(:channel).permit(:name, :topic, :purpose)
  end
end