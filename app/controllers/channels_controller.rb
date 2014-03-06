class ChannelsController < ApplicationController
  before_filter :check_xhr, only: [:show]
  
  def index
    if params[:name]
      channels = Channel.where(name: params[:name])
      render json: channels
      return
    end
    
    channels = Channel.all.includes([:users, :owner, :messages])
    render json: channels, each_serializer: ChannelListSerializer
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
    channel = Channel.find(params[:id])
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
    render json: channel
  end

  private

  def channel_params
    params.require(:channel).permit(:name, :topic, :purpose)
  end
end