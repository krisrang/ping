Ping.ApplicationController = Em.Controller.extend({
  logo: function() {
    return assetPath("logo.png");
  }.property()
});