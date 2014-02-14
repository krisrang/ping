Ping.PreferencesRoute = Ping.Route.extend({
  model: function() {
    return Ping.User.current();
  }
});