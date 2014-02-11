Ping.User = Em.Object.extend({
  path: Ping.computed.url('username_lower', "/users/%@"),

  username_lower: function() {
    return this.get('username').toLowerCase();
  }.property('username'),

  statusImage: function() {
    return assetPath('icon_' + this.get('status') + '.png');
  }.property('status'),

  statusText: function() {
    var status = this.get('status');
    if (status == 'dnd') status = "do not disturb";
    return status.capitalize();
  }.property('status')
});

Ping.User.reopenClass(Ping.Singleton, {
  createCurrent: function() {
    var userJson = Preloader.get('currentUser');
    if (userJson) { return Ping.User.create(userJson); }
    return null;
  },

  create: function(obj) {
    var result = this._super.apply(this, arguments);
    result.set('status', 'available');
    return result;
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