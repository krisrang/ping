Ember.Application.initializer({
  name: 'currentUser',

  initialize: function(container) {
    var store = container.lookup('store:main');
    var json = Preloader.get('currentUser');
    var user = store.createRecord('user', json);

    container.lookup('controller:currentUser').set('content', user);
    container.typeInjection('controller', 'currentUser', 'controller:currentUser');
    container.typeInjection('router', 'currentUser', 'controller:currentUser');
  }
});