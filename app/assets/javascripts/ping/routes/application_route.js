Ping.ApplicationRoute = Ember.Route.extend({
  actions: {
    joinRoom: function(room) {
      this.transitionTo('room', room);
    },

    leaveRoom: function(room) {
      room.leave();

      if (this.get('controller.room') == room.get('id')) {
        this.transitionTo('lobby');
      }
    }
  },

  setupController: function(controller) {
    var self = this,
        faye = Ping.Faye;
        
    faye.on('transport:down', function(){ controller.set('connected', false); });
    faye.on('transport:up', function(){ controller.set('connected', true); });

    var currentUser = Ping.User.current();
    this.controllerFor('userbar').set('currentUser', currentUser);

    Ping.RoomList.current().then(function(list) {
      self.controllerFor('rooms').set('rooms', list);
    });
  }
});
