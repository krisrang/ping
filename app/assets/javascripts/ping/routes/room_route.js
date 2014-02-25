Ping.RoomRoute = Ping.RestrictedUserRoute.extend({
  model: function(params) {
    return this.store.find('room', params.room_id);
  },

  afterModel: function(room) {
    if (!room) return this.transitionTo('lobby');

    room.join();
    this.controllerFor('application').set('room', room.get('id'));
  }
});
