Ping.ChannelRoute = Ping.RestrictedUserRoute.extend({
  model: function(params) {
    return this.store.all('channel').findBy('name', params.channel_name);
  },
  
  serialize: function(model) {
    return {
      channel_name: model.get('name')
    };
  },

  afterModel: function(channel) {
    if (!channel) return this.transitionTo('welcome');
    
    channel.join();
    this.controllerFor('application').set('channel', channel.get('id'));
    localforage.setItem('lastChannel', channel.get('id'));
  }
});
