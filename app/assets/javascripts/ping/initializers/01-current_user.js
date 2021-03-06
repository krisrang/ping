Ember.Application.initializer({
  name: 'currentUser',

  initialize: function(container) {
    var json = Preloader.get('currentUser'),
        store = container.lookup('store:main');

    if (!json) return;
    
    store.pushPayload('user', {users: [json]});
    Ping.set('currentUserId', json.id.toString());
    
    var user = store.getById('user', json.id);
    user.setStatus('online');
    user.startPing();

    container.lookup('controller:currentUser').set('content', user);
    container.typeInjection('controller', 'currentUser', 'controller:currentUser');
    container.typeInjection('route', 'currentUser', 'controller:currentUser');
  }
});