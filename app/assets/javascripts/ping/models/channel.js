var attr = DS.attr;

Ping.Channel = DS.Model.extend({
  name: attr(),
  topic: attr(),
  purpose: attr(),
  // open: attr('boolean'),
  createdAt: attr('date'),
  owner: DS.belongsTo('user'),
  messages: DS.hasMany('message'),
  users: DS.hasMany('user'),
  
  closed: Em.computed.not('open'),

  init: function() {
    this._super();
    this.on('didLoad', this, this.loaded);
  },
  
  loaded: function() {
    this.subscribe();
    
    if (Preloader.get('openChannels').contains(this.get('id'))) {
      this.set('open', true);
      this.userJoined(Ping.get('currentUserId'));
    }
  },

  join: function() {
    this.subscribe();
    this.userJoined(Ping.get('currentUserId'));

    if (this.get('open')) return Em.RSVP.resolve();

    var self = this;
    return Ping.ajax('/channels/' + this.get('id') + '/join', { type: 'POST' }).then(function() {
      self.set('open', true);
    });
  },

  leave: function() {
    this.unsubscribe();
    this.userLeft(Ping.get('currentUserId'));

    if (!this.get('open')) return Em.RSVP.resolve();

    var self = this;
    return Ping.ajax('/channels/' + this.get('id') + '/leave', { type: 'POST' }).then(function() {
      self.set('open', false);
    });
  },

  subscribe: function() {
    if (this.get('subscription')) return;

    var subscription = Ping.Faye.subscribe('/channels/' + this.get('id'), 
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
        case 'join':
          this.userJoined(message.user_id.toString());
          break;
        case 'leave':
          this.userLeft(message.user_id.toString());
          break;
        case 'message':
          this.newMessage(message.message);
          break;
      }
    }
  },

  userJoined: function(id) {
    var users = this.get('users');
    if (users.getEach('id').contains(id)) return;

    this.store.find('user', id).then(function(user) {
      users.pushObject(user);
    });
  },

  userLeft: function(id) {
    var users = this.get('users');
    this.store.find('user', id).then(function(user) {
      users.removeObject(user);
    });
  },

  newMessage: function(message) {
    console.log(message);
  },
  
  memberCount: function() {
    var users = this.get('users');
    return users.filterBy('online').length;
  }.property('users.@each.online')
});
