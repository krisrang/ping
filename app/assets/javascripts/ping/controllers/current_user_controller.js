Ping.CurrentUserController = Ping.ObjectController.extend({
  isLoggedIn: function() {
    return this.get('content') && this.get('content').get('isLoaded');
  }.property('content.isLoaded'),

  logout: function() {
    var self = this;
    return Ping.ajax("/session/" + self.get('username'), {
      type: 'DELETE'
    }).then(function () {
      self.set('content', null);
      Ping.KeyValueStore.abandonLocal();
      window.location.pathname = Ping.getURL('/');
    });
  }
});
