Ping.UserRoute = Ping.Route.extend({
  model: function(params) {
    // If we're viewing the currently logged in user, return that object instead
    var currentUser = Ping.User.current();
    if (currentUser && (params.username.toLowerCase() === currentUser.get('username_lower'))) {
      return currentUser;
    }

    return Ping.User.create({username: params.username});
  },

  afterModel: function() {
    // return this.modelFor('user').findDetails();
  }
});
