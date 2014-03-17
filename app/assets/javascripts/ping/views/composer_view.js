Ping.ComposerView = Ping.View.extend({
  classNames: 'channel-composer',
  
  focusComposer: function() {
    var self = this;

    Em.run.schedule('afterRender', function() {
      var textarea = self.$('textarea:first');
      textarea.focus();      
      
    });
  }.observes('controller.id'),
  
  didInsertElement: function() {
    var self = this,
        controller = this.get('controller');
    
    Em.run.schedule('afterRender', function() {
      self.$('textarea').autosize({ callback: Ember.run.bind(self, self.composerResized) });
      
      self.$('textarea').keydown(function(e) {
        if (e.keyCode === 13 && !e.shiftKey) {
          controller.send('sendMessage');
          e.preventDefault();
        }
      });
    });
  },
  
  composerResized: function() {
    var height = this.$('textarea').outerHeight();
    this.$().css('height', height);
    this.$().trigger('resize');
  }
});
