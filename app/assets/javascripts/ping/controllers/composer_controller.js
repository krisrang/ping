Ping.ComposerController = Ping.ObjectController.extend({
  actions: {
    sendMessage: function() {
      var source = this.get('message'),
          channel = this.get('model');
      
      this.set('message', '');
      
      var data = {
        source: source,
        channel_id: channel.get('id')
      };
          
      Ping.ajax('/messages', { type: 'POST', data: { message: data }}).then(function(){
                
      }, function() {
        
      });
    }
  }
});
