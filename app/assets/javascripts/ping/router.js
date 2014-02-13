Ping.Router.map(function() {
  this.route('lobby', { path: '/' });
  this.route('preferences');
  
  this.resource('room', { path: '/rooms/:room_id' });
});

Ping.Router.reopen({location: 'history'});
