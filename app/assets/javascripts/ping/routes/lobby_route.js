Ping.LobbyRoute = Ember.Route.extend({
  model: function() {
    return Ping.RoomList.current();
  }
});
