Ember.Application.initializer({
  name: 'currentUser',

  initialize: function(container) {
    var store = container.lookup('store:main');
    var json = Preloader.get('currentUser');
    store.pushPayload('user', {users: [json]});
    var user = store.findById('user', json.id);
    Ping.set('currentUserId', json.id.toString());

    container.lookup('controller:currentUser').set('content', user);
    container.typeInjection('controller', 'currentUser', 'controller:currentUser');
    container.typeInjection('route', 'currentUser', 'controller:currentUser');
  }
});