Ping.RoomList = Ember.ArrayProxy.extend({
  load: function() {
    var self = this;
    
    return Preloader.getAndRemove("roomList", function() {
      return Ping.ajax("/rooms.json");
    }).then(function(result) {
      self.set('content', self.roomsFrom(result));
      return self;
    });
  },

  roomsFrom: function(result) {
    var rooms = Em.A(),
        openRooms = Preloader.get('openRooms') || [];

    result.rooms.each(function(r) {
      r.open = openRooms.any(r.id);
      rooms.pushObject(Ping.Room.create(r));
    });

    return rooms;
  }
});

Ping.RoomList.reopenClass(Ping.Singleton, {
  createCurrent: function() {
    var list = Ping.RoomList.create({content: []});

    return Ember.Deferred.promise(function(promise) {
      list.load().then(function() {
        promise.resolve(list);
      })
    });
  }
});
