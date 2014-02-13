Ping.RoomRoute = Ember.Route.extend({
  model: function(params) {
    return Ping.Room.findById(params.room_id);
  },

  afterModel: function(room, transition) {
    if (!room) return this.transitionTo('lobby');

    room.join();
    this.controllerFor('application').set('room', room.get('id'));
  }
});
