Ping.LobbyController = Em.ArrayController.extend({
  sortProperties: ['name'],

  actions: {
    renameRoom: function(room) {
      bootbox.prompt(I18n.t('lobby.rename'), function(result) {                
        if (!Em.isEmpty(result)) {
          room.set('name', result);
          room.save();
        }
      });
    },

    deleteRoom: function(room) {
      room.leave().then(function(){
        room.destroyRecord();
      });
    }
  }
});
