Ping.ComposerView = Ping.View.extend({
  classNames: 'channel-composer',
  
  focusComposer: function() {
    var self = this;

    Em.run.schedule('afterRender', function() {
      var textarea = self.$('textarea:first');
      if (textarea && textarea.focus) textarea.focus();
    });
  }.observes('controller.id'),
  
  didInsertElement: function() {
    var self = this;
    
    Em.run.schedule('afterRender', function() {
      self.$('textarea').autosize({ callback: Ember.run.bind(self, self.composerResized) });
    });
  },
  
  composerResized: function() {
    var height = this.$('textarea').outerHeight();
    this.$().css('height', height);
    this.$().trigger('resize');
  }
});
