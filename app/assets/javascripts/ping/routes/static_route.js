Ping.StaticController.PAGES.each(function(page) {

  Ping[page.capitalize() + "Route"] = Em.Route.extend({

    renderTemplate: function() {
      this.render('static');
    },

    setupController: function() {
      var config_key = Ping.StaticController.CONFIGS[page];
      if (config_key && Ping.Settings[config_key].length > 0) {
        Ping.URL.redirectTo(Ping.Settings[config_key]);
      } else {
        this.controllerFor('static').loadPath("/" + page);
      }
    }

  });
});
