Ping.URL = Em.Object.createWithMixins({
  routeTo: function(path) {

    if(Ping.get("requiresRefresh")){
      document.location.href = path;
      return;
    }

    path = path.replace(/https?\:\/\/[^\/]+/, '');

    // Be wary of looking up the router. In this case, we have links in our
    // HTML, say form compiled markdown posts, that need to be routed.
    var router = this.get('router');
    router.router.updateURL(path);
    return router.handleURL(path);
  },

  queryParams: Em.computed.alias('router.location.queryParams'),

  redirectTo: function(url) {
    window.location = Ping.getURL(url);
  },

  isInternal: function(url) {
    if (url && url.length) {
      if (url.indexOf('/') === 0) { return true; }
      if (url.indexOf(this.origin()) === 0) { return true; }
      if (url.replace(/^http/, 'https').indexOf(this.origin()) === 0) { return true; }
      if (url.replace(/^https/, 'http').indexOf(this.origin()) === 0) { return true; }
    }
    return false;
  },

  origin: function() {
    return window.location.origin;
  },

  router: function() {
    return Ping.__container__.lookup('router:main');
  }.property(),

  controllerFor: function(name) {
    return Ping.__container__.lookup('controller:' + name);
  }
});
