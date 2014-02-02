Ping.StaticController = Em.Controller.extend({
  path: null,

  // showLoginButton: function() {
  //   return this.get('path') === '/login';
  // }.property('path'),

  loadPath: function(path) {
    var self = this;

    this.setProperties({
      path: path,
      content: null
    });

    // Load from <noscript> if we have it.
    var $preloaded = $("noscript[data-path=\"" + path + "\"]");
    if ($preloaded.length) {
      var text = $preloaded.text();
      text = text.match(/<!--preload-content:-->((?:.|[\n\r])*)<!--:preload-content-->/)[1];
      this.set('content', text);
    } else {
      return Ping.ajax(path, {dataType: 'html'}).then(function (result) {
        self.set('content', result);
      });
    }
  }
});

Ping.StaticController.reopenClass({
  PAGES: ['login'],
  CONFIGS: {}
});
