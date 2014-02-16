//= require ./helpers/i18n_helpers
//= require ./mixins/ajax
//= require_self

//= require ./store
//= require_tree ./mixins
//= require ./lib/computed
//= require ./views/view
//= require ./models/model
//= require ./routes/route
//= require ./controllers/controller
//= require ./controllers/object_controller
//= require ./controllers/array_controller
//= require ./views/modal/modal_body_view
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

  start: function() {
    
  }
});
