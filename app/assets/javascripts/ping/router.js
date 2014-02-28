Ping.Router.map(function() {
  this.route('welcome', { path: '/' });
  this.route('signup');
  this.route('login');
  this.route('forgot');
  this.route('preferences');
  
  this.resource('room', { path: '/rooms/:room_id' });
});

Ping.Router.reopen({location: 'history'});
