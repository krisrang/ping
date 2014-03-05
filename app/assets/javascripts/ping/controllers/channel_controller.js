Ping.ChannelController = Ping.ObjectController.extend({
  owned: function() {
    return this.get('owner.id') === this.get('currentUser.id');
  }.property('owner'),
  
  actions: {
    sendMessage: function() {
      console.log(this.get('message'));
    },
    
    sendFile: function() {
      
    }
  }
});