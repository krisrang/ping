Ping.PreferencesRoute = Ember.Route.extend({
  setupController: function() {
    var currentUser = Ping.User.current();
    this.set('controller.model', currentUser);
  }
});