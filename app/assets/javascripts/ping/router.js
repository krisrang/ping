Ping.Router.map(function() {
  this.resource('lobby', { path: '/' });
  this.resource('preferences');
    
  this.resource('room1');
  this.resource('room2');
});

Ping.Router.reopen({location: 'history'});
