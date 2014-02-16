Ping.ApplicationController = Em.Controller.extend({
  connected: false,

  logout: function() {
    this.get('currentUser').logout();
  }
});