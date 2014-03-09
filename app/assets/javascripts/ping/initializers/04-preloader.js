Ember.Application.initializer({
  name: 'channelPreload',

  initialize: function(container) {
    var json = Preloader.get('channels'),
        store = container.lookup('store:main');

    if (!json) return;
    
    store.pushPayload('channel', json);
  }
});