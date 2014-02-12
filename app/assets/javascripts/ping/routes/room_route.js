Ping.RoomRoute = Ember.Route.extend({
  model: function(params) {
    var rooms = Ping.RoomList.current();
    var room = rooms.findBy('id', params.room_id);
    return room;
  },

  afterModel: function(room, transition) {
    if (!room) return transition.abort();

    room.set('open', true);
    this.controllerFor('application').set('room', room.get('id'));
  }
});
