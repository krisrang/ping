Ping.LobbyRoute = Ping.RestrictedUserRoute.extend({
  model: function() {
    return this.store.findAll('room');
  }
});
