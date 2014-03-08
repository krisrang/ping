Ping.LoginRoute = Ping.Route.extend({
  renderTemplate: function() {
    this.render('login_required');
  },
  
  beforeModel: function() {
    if (!Ping.Settings.login_required) {
      this.transitionTo('welcome');
      return;
    }

    var self = this;
    Ember.run.next(function() {
      self.send('showLogin');
    });
  }
});
