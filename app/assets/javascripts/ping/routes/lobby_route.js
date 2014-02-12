Ping.LobbyRoute = Ember.Route.extend({
  setupController: function(controller) {
    controller.set('rooms', Ping.RoomList.current());
  }
});
