//= require ./mixins/ajax
//= require_self

//= require_tree ./mixins
//= require ./lib/computed
//= require ./views/view
//= require ./models/model
//= require ./router

//= require_tree ./lib
//= require_tree ./models
//= require_tree ./controllers
//= require_tree ./views
//= require_tree ./helpers
//= require_tree ./components
//= require_tree ./templates
//= require_tree ./routes
//= require_tree ./initializers

window.Ping = Ember.Application.createWithMixins(Ping.Ajax, {
  // Helps with integration tests
  URL_FIXTURES: {},

  getURL: function(url) {
    // If it's a non relative URL, return it.
    if (url.indexOf('http') === 0) return url;

    return url;
  },

  logout: function() {
    Ping.User.logout().then(function() {
      Ping.KeyValueStore.abandonLocal();
      window.location.pathname = Ping.getURL('/');
    });
  },

  start: function() {
    
  }
});
