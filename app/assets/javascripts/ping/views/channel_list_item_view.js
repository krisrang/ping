Ping.ChannelListItemView = Ping.View.extend({
  classNames: ['channel'],
  classNameBindings: ['controller.model.open:joined:joinable']
});
