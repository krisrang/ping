Ping.AppbarController = Ping.Controller.extend({
  appbarClass: '',
  appbarVisible: false,
  
  title: function() {
    return Ping.Settings.title;
  }.property().readOnly(),
  
  actions: {
    toggleAppbar: function() {
      if (this.get('appbarVisible')) {
        this.set('appbarClass', '');
      } else {
        this.set('appbarClass', 'open');
      }

      this.toggleProperty('appbarVisible');
    }
  }
});