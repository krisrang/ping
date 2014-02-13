Ping.Room = Ping.Model.extend({
  join: function() {
    if (this.get('open')) return;

    var self = this;
    Ping.ajax('/rooms/' + this.get('id') + '/join', { type: 'POST' }).then(function() {
      self.set('open', true);
    });
  },

  leave: function() {
    this.set('open', false);
    Ping.ajax('/rooms/' + this.get('id') + '/leave', { type: 'POST' });
  }
});

Ping.Room.reopenClass({
  findById: function(id) {
    return Ember.Deferred.promise(function(promise) {
      Ping.RoomList.current().then(function(list) {
        promise.resolve(list.findBy('id', parseInt(id)));
      })
    });;
  }
});
