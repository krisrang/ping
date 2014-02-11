Ping.UserbarController = Em.Controller.extend({
  userbarClass: 'hidden',
  userbarVisible: false,

  hideUserbarIfOpen: function(e) {
    var target = $(e.target);    
    if (target.parent('#userbar, #userbar-select').length) return;

    if (this.get('userbarVisible')) {
      this.set('userbarClass', 'hidden');
      this.set('userbarVisible', false);
    }
  },

  actions: {
    logout: function() {
      Ping.logout();
    },

    toggleUserbar: function() {
      if (this.get('userbarVisible')) {
        this.set('userbarClass', 'hidden');
      } else {
        this.set('userbarClass', '');
      }

      this.set('userbarVisible', !this.get('userbarVisible'));
    },

    setStatus: function(status) {
      this.set('model.status', status);
    }
  }
});