Ping.CurrentUserController = Ping.ObjectController.extend({
  isLoggedIn: function() {
    return this.get('content') && this.get('content').get('isLoaded');
  }.property('content.isLoaded'),
  
  isAdmin: function() {
    return this.get('content') && this.get('content').get('admin');
  }.property('isLoggedIn', 'content.admin'),

  logout: function() {
    var self = this;
    return Ping.ajax("/session/" + self.get('username'), {
      type: 'DELETE'
    }).then(function () {
      self.set('content', null);
      localforage.clear().then(function(){
        window.location.pathname = Ping.getURL('/');
      });      
    });
  }
});
