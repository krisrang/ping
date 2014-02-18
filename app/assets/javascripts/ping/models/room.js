var attr = DS.attr;

Ping.Room = DS.Model.extend({
  name: attr(),
  topic: attr(),
  open: attr('boolean'),
  user: DS.belongsTo('user'),
  messages: DS.hasMany('message'),

  join: function() {
    if (this.get('open')) return Em.RSVP.resolve();

    var self = this;
    return Ping.ajax('/rooms/' + this.get('id') + '/join', { type: 'POST' }).then(function() {
      self.set('open', true);
    });
  },

  leave: function() {
    if (!this.get('open')) return Em.RSVP.resolve();

    this.set('open', false);
    return Ping.ajax('/rooms/' + this.get('id') + '/leave', { type: 'POST' });
  },

  className: function() {
    return 'room-' + this.get('id');
  }.property('id')
});
