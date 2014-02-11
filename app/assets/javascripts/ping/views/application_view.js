Ping.ApplicationView = Ping.View.extend({
  click: function(e){
    this.get('controller.controllers.userbar').hideUserbarIfOpen(e);
  }
});
