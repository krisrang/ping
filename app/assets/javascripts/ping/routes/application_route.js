Ping.ApplicationRoute = Ember.Route.extend({
  setupController: function() {
    var currentUser = Ping.User.current();
    this.controllerFor('userbar').set('model', currentUser);
  }
});