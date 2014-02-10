Ping.View = Ember.View.extend(Ping.Presence, {});

Ping.View.reopenClass({

  /**
    Register a view helper for ease of use

    @method registerHelper
    @param {String} helperName the name of the helper
    @param {Ember.View} helperClass the view that will be inserted by the helper
  **/
  registerHelper: function(helperName, helperClass) {
    Ember.Handlebars.registerHelper(helperName, function(options) {
      var hash = options.hash,
          types = options.hashTypes;

      Ping.Utilities.normalizeHash(hash, types);
      return Ember.Handlebars.helpers.view.call(this, helperClass, options);
    });
  },

  /**
    Returns an observer that will re-render if properties change. This is useful for
    views where rendering is done to a buffer manually and need to know when to trigger
    a new render call.

    @method renderIfChanged
    @params {String} propertyNames*
    @return {Function} observer
  **/
  renderIfChanged: function() {
    var args = Array.prototype.slice.call(arguments, 0);
    args.unshift(function () { this.rerender(); });
    return Ember.observer.apply(this, args);
  }

});
