var attr = DS.attr;

Ping.User = DS.Model.extend({
  username: attr(),
  rooms: DS.hasMany('room'),

  path: Ping.computed.url('username_lower', "/users/%@"),

  username_lower: function() {
    return this.get('username').toLowerCase();
  }.property('username')
});
