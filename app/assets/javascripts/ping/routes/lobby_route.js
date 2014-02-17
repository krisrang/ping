Ping.LobbyRoute = Ping.Route.extend({
  model: function() {
    return this.store.findAll('room');
  }
});
