var attr = DS.attr;

Ping.Channel = DS.Model.extend({
  name: attr(),
  topic: attr(),
  purpose: attr(),
  open: attr('boolean'),
  createdAt: attr('date'),
  updatedAt: attr('date'),
  owner: DS.belongsTo('user', {async: true}),
  messages: DS.hasMany('message', {async: true}),
  users: DS.hasMany('user', {async: true}),
  
  closed: Em.computed.not('open'),
  path: Ping.computed.url('id', "/channels/%@"),

  init: function() {
    this._super();
    this.on('didLoad', this, this.loaded);
  },
  
  loaded: function() {
    this.subscribe();
  },

  join: function() {
    if (this.get('open')) return Em.RSVP.resolve();
    
    this.userJoined(Ping.get('currentUserId'));    

    var self = this;
    return Ping.ajax(this.get('path') + '/join', { type: 'POST' }).
      then(function() { self.set('open', true); });
  },

  leave: function() {
    if (!this.get('open')) return Em.RSVP.resolve();
    
    this.userLeft(Ping.get('currentUserId'));    

    var self = this;
    return Ping.ajax(this.get('path') + '/leave', { type: 'POST' }).
      then(function() { self.set('open', false); });
  },

  subscribe: function() {
    if (this.get('subscription')) return;

    var subscription = Ping.Faye.subscribe(this.get('path'), 
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
  }.property('users.@each.online'),
  
  update: function(name, purpose) {
    var self = this,
        updateData = {};
    
    if (name) updateData.name = name;
    if (purpose) updateData.purpose = purpose;
    
    return Ping.ajax(this.get('path'), { 
      type: 'PATCH', data: { channel: updateData }
    }).then(function(){
      if (name) self.set('name', name);
      if (purpose) self.set('purpose', purpose);
    });
  },
  
  setTopic: function(topic) {
    var self = this;
    
    return Ping.ajax(this.get('path'), { 
      type: 'PATCH', data: { channel: { topic: topic } }
    }).then(function(){
      self.set('topic', topic);
    });
  }
});
