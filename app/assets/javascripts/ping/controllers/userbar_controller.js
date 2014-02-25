Ping.UserbarController = Ping.Controller.extend({
  userbarClass: '',
  userbarVisible: false,

  actions: {
    toggleUserbar: function() {
      if (this.get('userbarVisible')) {
        this.set('userbarClass', '');
      } else {
        this.set('userbarClass', 'open');
      }

      this.set('userbarVisible', !this.get('userbarVisible'));
    }
  }
});