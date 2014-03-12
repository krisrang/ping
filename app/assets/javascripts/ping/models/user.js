var attr = DS.attr;

Ping.User = DS.Model.extend({
  name: attr(),
  username: attr(),
  email: attr(),
  password: attr(),
  passwordConfirm: attr(),
  challenge: attr(),
  avatar_template: attr(),
  status: attr(),
  admin: attr('boolean'),
  previous_visit: attr('date'),
  last_seen: attr('date'),
  days_visited: attr('number'),
  createdAt: attr('date'),
  updatedAt: attr('date'),
  channels: DS.hasMany('channel', {async: true}),
  messages: DS.hasMany('message', {async: true}),

  path: Ping.computed.url('username_lower', "/users/%@"),
  online: Ping.computed.isNot('status', 'offline'),
  
  pingResponded: true,
  
  init: function() {
    this._super();
    this.on('didLoad', this, this.loaded);
  },
  
  loaded: function() {
    this.subscribe();
  },
  
  startPing: function() {
    var self = this;
        
    setTimeout(function() {
      self.ping();
      self.startPing();
    }, 1000*60);
  },
  
  ping: function() {
    var self = this;
    
    if (!this.get('pingResponded')) return;
    this.set('pingResponded', false);
    
    Ping.Faye.publish('/users/' + this.get('id'), 
        { type: 'userstatus', status: this.get('status') }).then(function() {
          self.set('pingResponded', true);
        });
  },
  
  subscribe: function() {
    if (this.get('subscription')) return;

    var subscription = Ping.Faye.subscribe('/users/' + this.get('id'), 
      $.proxy(this.receive, this));
    this.set('subscription', subscription);
  },

  unsubscribe: function() {
    var subscription = this.get('subscription');
    if (subscription && subscription.cancel) {
      subscription.cancel();
      this.set('subscription', null);
    }
  },

  receive: function(message) {
    if (message.type) {
      switch(message.type) {
        case 'userstatus':
          this.statusReceived(message.status);
          break;
      }
    }
  },
  
  statusReceived: function(status) {
    this.set('status', status);
  },
  
  setStatus: function(status) {
    this.set('status', status);
    Ping.Faye.publish('/users/' + this.get('id'), 
      { type: 'userstatus', status: this.get('status') });
  },

  username_lower: function() {
    return this.get('username').toLowerCase();
  }.property('username')
});


Ping.User.reopenClass({
  checkUsername: function(username, email, forUserId) {
    return Ping.ajax('/users/check_username', {
      data: { username: username, email: email, for_user_id: forUserId }
    });
  }
});
