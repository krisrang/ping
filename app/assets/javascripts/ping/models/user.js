Ping.User = Em.Object.extend({
  path: Ping.computed.url('username_lower', "/users/%@"),

  username_lower: function() {
    return this.get('username').toLowerCase();
  }.property('username')
});

Ping.User.reopenClass(Ping.Singleton, {
  createCurrent: function() {
    var userJson = Preloader.get('currentUser');
    if (userJson) { return Ping.User.create(userJson); }
    return null;
  },

  logout: function() {
    var userClass = this;
    return Ping.ajax("/session/" + Ping.User.currentProp('username'), {
      type: 'DELETE'
    }).then(function () {
      userClass.currentUser = null;
    });
  }
});