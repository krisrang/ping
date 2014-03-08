Ping.RestrictedUserRoute = Ping.Route.extend({
  beforeModel: function() {
    var loggedIn = this.get('currentUser.isLoggedIn');
    if (!loggedIn) this.transitionTo('login');
  }
});
