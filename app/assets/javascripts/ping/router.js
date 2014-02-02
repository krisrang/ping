Ping.Router.map(function() {
  this.resource('lobby', { path: '/' });
  
  this.resource('room1');
});

Ping.Router.reopen({location: 'history'});
