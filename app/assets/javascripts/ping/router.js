Ping.Router.map(function() {
  var router = this;
  
  Ping.StaticController.PAGES.each(function (page) {
    router.route(page, { path: '/' + page });
  });

  this.resource('lobby', { path: '/' });
  
  this.resource('room1');
});

Ping.Router.reopen({location: 'history'});
