Ping.ApplicationController = Em.Controller.extend({
  logo: function() {
    return assetPath("logo_w.png");
  }.property()
});