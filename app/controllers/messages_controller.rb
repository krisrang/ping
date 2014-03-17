class MessagesController < ApplicationController
  def index
    messages = Message.all
    render json: messages
  end

  def create
    message = Message.new(message_params)
    message.user = current_user
    message.cooked = message.source

    if message.save
      Realtime.publish("/channels/#{message.channel.id}", {type: "message", message: message})
      render json: message
    else
      render json: { errors: { messages: message.errors, values: message_params } }, status: 422
    end
  end

  def show
    message = Message.find(params[:id])
    render json: message
  end  

  def destroy
    message = Message.find(params[:id])
    message.destroy
    render json: message
  end

  private

  def message_params
    params.require(:message).permit(:source, :channel_id)
  end
end