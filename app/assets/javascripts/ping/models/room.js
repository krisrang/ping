var attr = DS.attr;

Ping.Room = DS.Model.extend({
  name: attr(),
  topic: attr(),
  open: attr('boolean'),
  owner: DS.belongsTo('user'),

  join: function() {
    if (this.get('open')) return;

    var self = this;
    return Ping.ajax('/rooms/' + this.get('id') + '/join', { type: 'POST' }).then(function() {
      self.set('open', true);
    });
  },

  leave: function() {
    this.set('open', false);
    return Ping.ajax('/rooms/' + this.get('id') + '/leave', { type: 'POST' });
  },

  className: function() {
    return 'room-' + this.get('id');
  }.property('id')
});
