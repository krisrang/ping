Ping.RoomRoute = Ping.Route.extend({
  model: function(params) {
    return this.store.find('room', params.room_id);
  },

  afterModel: function(room) {
    if (!room) return this.transitionTo('lobby');

    room.join();
    this.controllerFor('application').set('room', room.get('id'));
  },

  setupController: function(controller, model) {
    var content = Em.A([]);
    for (var i = 0; i < 100; i++) {
      content.pushObject(Em.Object.create({message: "Item " + i}));
    }

    model.set('messages', content);
    controller.set('model', model);
  }
});
