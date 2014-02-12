Ping.PreferencesRoute = Ember.Route.extend({
  model: function() {
    return Ping.User.current();
  }
});