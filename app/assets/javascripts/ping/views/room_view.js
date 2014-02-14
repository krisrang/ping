Ping.RoomView = Ping.View.extend({
  classNames: ['room'],
  classNameBindings: ['roomClass'],

  roomClass: function() {
    return 'room-' + this.get('controller.id');
  }.property('controller.id')
});
