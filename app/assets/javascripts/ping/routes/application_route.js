Ping.ApplicationRoute = Ember.Route.extend({
  actions: {
    joinRoom: function(room) {
      this.transitionTo('room', room);
    },

    leaveRoom: function(room) {
      room.set('open', false);

      if (this.get('controller.room') == room.get('id')) {
        this.transitionTo('lobby');
      }
    }
  },

  setupController: function(controller) {
    var faye = Ping.Faye;
    faye.on('transport:down', function(){ controller.set('connected', false); });
    faye.on('transport:up', function(){ controller.set('connected', true); });

    var currentUser = Ping.User.current();
    this.controllerFor('userbar').set('currentUser', currentUser);

    this.controllerFor('rooms').set('rooms', Ping.RoomList.current());
  }
});
