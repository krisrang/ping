var attr = DS.attr;

Ping.User = DS.Model.extend({
  name: attr(),
  username: attr(),
  email: attr(),
  password: attr(),
  passwordConfirm: attr(),
  challenge: attr(),
  avatar_template: attr(),
  previous_visit: attr('date'),
  last_seen: attr('date'),
  days_visited: attr('number'),
  rooms: DS.hasMany('room'),
  messages: DS.hasMany('message'),

  path: Ping.computed.url('username_lower', "/users/%@"),

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
