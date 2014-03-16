Ping.Router.map(function() {
  this.route('welcome', { path: '/' });
  this.route('signup');
  this.route('login');
  this.route('forgot');
  this.route('preferences');
  
  this.resource('channel', { path: '/channels/:channel_name' });
  this.resource('user', { path: '/users/:username' });
});

Ping.Router.reopen({location: 'history'});
