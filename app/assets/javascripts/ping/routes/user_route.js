Ping.UserRoute = Ping.RestrictedUserRoute.extend({
  model: function(params) {
    // If we're viewing the currently logged in user, return that object instead
    var currentUser = this.get('currentUser');
    if (currentUser && (params.username.toLowerCase() === currentUser.get('username_lower'))) {
      return currentUser;
    }

    // return Ping.User.create({username: params.username});
  },
  
  serialize: function(model) {
    return {
      username: model.get('username_lower')
    };
  },

  afterModel: function() {
    // return this.modelFor('user').findDetails();
  }
});
