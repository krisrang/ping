//= require ./env
//= require ./mixins/ajax
//= require_self

//= require ./store
//= require_tree ./mixins
//= require_tree ./lib
//= require_tree ./models
//= require_tree ./controllers
//= require_tree ./views
//= require_tree ./helpers
//= require_tree ./components
//= require_tree ./templates
//= require ./router
//= require_tree ./routes

window.Ping = Ember.Application.createWithMixins(Ping.Ajax, {
  // Helps with integration tests
  URL_FIXTURES: {},

  getURL: function(url) {
    // If it's a non relative URL, return it.
    if (url.indexOf('http') === 0) return url;

    var u = (Ping.BaseUri === undefined ? "/" : Ping.BaseUri);
    if (u[u.length-1] === '/') {
      u = u.substring(0, u.length-1);
    }
    if (url.indexOf(u) !== -1) return url;
    return u + url;
  },

  start: function() {
    
  }
});