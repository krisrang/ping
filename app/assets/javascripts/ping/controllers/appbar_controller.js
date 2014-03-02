Ping.AppbarController = Ping.Controller.extend({  
  title: function() {
    return Ping.Settings.title;
  }.property().readOnly()
});