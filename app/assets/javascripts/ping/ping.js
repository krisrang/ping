//= require ./helpers/i18n_helpers
//= require ./mixins/ajax
//= require_self

//= require_tree ./initializers
//= require_tree ./mixins
//= require ./store
//= require ./lib/computed
//= require ./views/view
//= require ./models/model
//= require ./routes/route
//= require ./routes/restricted_user_route
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

window.Ping = Ember.Application.createWithMixins(Ping.Ajax, {
  // LOG_TRANSITIONS: true,
  // LOG_TRANSITIONS_INTERNAL: true,
  // LOG_STACKTRACE_ON_DEPRECATION: true,
  // LOG_VIEW_LOOKUPS: true,
  // LOG_ACTIVE_GENERATION: true,

  // Helps with integration tests
  URL_FIXTURES: {},

  getURL: function(url) {
    // If it's a non relative URL, return it.
    if (url.indexOf('http') === 0) return url;

    return url;
  },

  start: function() {
    
  },

  authenticationComplete: function(options) {
    // TODO, how to dispatch this to the controller without the container?
    var loginController = Ping.__container__.lookup('controller:login');
    return loginController.authenticationComplete(options);
  },

  requiresRefresh: function(){
    var desired = Ping.get("desiredAssetVersion");
    return desired && Ping.get("currentAssetVersion") !== desired;
  }.property("currentAssetVersion", "desiredAssetVersion"),

  assetVersion: function(prop, val) {
    if(val) {
      if(this.get("currentAssetVersion")){
        this.set("desiredAssetVersion", val);
      } else {
        this.set("currentAssetVersion", val);
      }
    }
    return this.get("currentAssetVersion");
  }.property()
});
