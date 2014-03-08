Ping.ChannelController = Ping.ObjectController.extend({
  owned: function() {
    return this.get('owner.id') === this.get('currentUser.id');
  }.property('owner'),
  
  actions: {
    sendMessage: function() {
      console.log(this.get('message'));
    },
    
    changeTopic: function() {
      var topic = this.get('channelTopic'),
          channel = this.get('model');
          
      channel.set('topic', topic);
      channel.save();
      
      this.set('channelTopic', '');
      $('.channel-name').dropdown('toggle');
    }
  }
});