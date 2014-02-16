Ping.LobbyController = Em.ArrayController.extend({
  sortProperties: ['name'],

  actions: {
    deleteRoom: function(room) {
      room.destroyRecord();
      // room.save();
    }
  }
});
