Ping.ChannelController = Ping.ObjectController.extend({
  owned: function() {
    return this.get('owner.id') === this.get('currentUser.id');
  }.property('owner'),
  
  actions: {
    sendMessage: function() {
      console.log(this.get('message'));
    },
    
    changeTopic: function() {
      var self = this,
          topic = this.get('channelTopic'),
          channel = this.get('model');
          
      channel.setTopic(topic).then(
        function() {
          self.set('channelTopic', '');
          $('.channel-name').dropdown('toggle');
        }, function() {
          bootbox.alert(I18n.t('channel.topic.failed'));
      });      
    }
  }
});