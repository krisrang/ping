Ping.ChannelsView = Ping.View.extend({  
  classNames: ['channels'],
  
  didInsertElement: function() {
    var self = this;
    
    Em.run.schedule('afterRender', function() {
      self.fixScrollbar();
    });
  },
  
  fixScrollbar: function() {
    if (!Modernizr.cssscrollbar) {
      this.$().perfectScrollbar({ suppressScrollX: true });
    }
  },
  
  updateScrollbar: function() {
    var self = this;
    
    Em.run.schedule('afterRender', function() {
      if (!Modernizr.cssscrollbar) self.$().perfectScrollbar('update');
    });    
  }.observes('controller.model.@each')
});
