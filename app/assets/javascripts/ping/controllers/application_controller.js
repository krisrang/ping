Ping.ApplicationController = Em.Controller.extend({
  needs: 'userbar',

  logo: function() {
    return assetPath("logo_w.png");
  }.property()
});