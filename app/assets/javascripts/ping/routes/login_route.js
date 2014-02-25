Ping.LoginRoute = Ping.Route.extend({
  renderTemplate: function() {
    this.render('static');
  }
});

Ping.LoginRoute.reopen({
  beforeModel: function() {
    if (!Ping.Settings.login_required) {
      this.transitionTo('lobby');
      return;
    }

    var self = this;
    Ember.run.next(function() {
      self.send('showLogin');
    });
  }
});
