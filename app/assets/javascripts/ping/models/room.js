var attr = DS.attr;

Ping.Room = DS.Model.extend({
  name: attr(),
  open: attr('boolean'),

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

  // save: function() {
  //   var self = this;

  //   return Ping.ajax('/rooms', { type: 'POST', data: {
  //     room: { name: this.get('name') }
  //   }}).then(function(result){
  //     if (result.room) {
  //       self.set('id', result.room.id);
  //     }
  //     return result;
  //   });
  // }
});

// Ping.Room.reopenClass({
//   findById: function(id) {
//     return Ember.Deferred.promise(function(promise) {
//       Ping.RoomList.current().then(function(list) {
//         promise.resolve(list.findBy('id', parseInt(id)));
//       });
//     });
//   }
// });
