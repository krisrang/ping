Ping.ComposerView = Ping.View.extend({
  focusComposer: function() {
    var self = this;

    Em.run.schedule('afterRender', function() {
      var textarea = self.$('textarea:first');
      if (textarea && textarea.focus) textarea.focus();
    });
  }.observes('controller.id')
});
