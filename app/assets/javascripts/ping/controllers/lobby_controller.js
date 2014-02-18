Ping.LobbyController = Em.ArrayController.extend({
  sortProperties: ['name'],

  actions: {
    deleteRoom: function(room) {
      bootbox.confirm(I18n.t('confirm'), function(result) {
        if (!result) return;

        room.leave().then(function(){
          room.destroyRecord();
        });
      });
    }
  }
});
