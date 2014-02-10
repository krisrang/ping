Ping.UserbarController = Em.ObjectController.extend({
  actions: {
    logout: function() {
      Ping.logout();
    }
  }
});