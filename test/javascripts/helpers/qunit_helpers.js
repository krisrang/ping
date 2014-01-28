function integration(name, lifecycle) {
  module("Integration: " + name, {
    setup: function() {
      Ping.reset();
      // sinon.stub(Discourse.ScrollingDOMMethods, "bindOnScroll");
      // sinon.stub(Discourse.ScrollingDOMMethods, "unbindOnScroll");
      // Ember.run(Ping, Ping.advanceReadiness);

      if (lifecycle && lifecycle.setup) {
        lifecycle.setup.call(this);
      }
    },

    teardown: function() {
      if (lifecycle && lifecycle.teardown) {
        lifecycle.teardown.call(this);
      }

      // Ping.reset();
      // Discourse.ScrollingDOMMethods.bindOnScroll.restore();
      // Discourse.ScrollingDOMMethods.unbindOnScroll.restore();
    }
  });
}

function asyncTestEmber(text, func) {
  asyncTest(text, function () {
    var self = this;
    Ember.run(function () {
      func.call(self);
    });
  });
}