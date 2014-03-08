Ping.ChannelView = Ping.View.extend({
  classNames: ['channel'],
  atBottom: true,
  
  didInsertElement: function() {
    var self = this,
        controller = this.get('controller');
    
    Em.run.schedule('afterRender', function() {
      self.fixScrollbar();
      self.messagesResized();
      self.$('.channel-composer').on('resize', Ember.run.bind(self, self.composerResized));
      self.$('.messagelist').on('scroll', Ember.run.bind(self, self.messagesScrolled));
      $('.menu-footer').on('click', function(e) { e.preventDefault(); e.stopPropagation();});
      
      $("input.channel-topic-input").keydown(function(e) {
        if (e.keyCode === 13) controller.send('changeTopic');
      });
    });
  },
  
  fixScrollbar: function() {
    if (!Modernizr.cssscrollbar) {
      this.$('.messagelist').perfectScrollbar({ suppressScrollX: true });
    }
  },
  
  composerResized: function() {
    var height = this.$('.channel-composer').outerHeight();
    this.$('.channel-messages').css('bottom', height);
    this.messagesResized();
  },
  
  messagesScrolled: function() {
    var messages = this.$('.messagelist');
    var bottom = messages.prop("scrollHeight") - messages.scrollTop() === messages.outerHeight();
    this.set('atBottom', bottom);
  },
  
  messagesResized: function(newchannel) {
    var self = this,
        messages = this.$('.messagelist');
    if (!messages) return;
    
    Em.run.schedule('afterRender', function() {
      self.$('.messagelist').perfectScrollbar('destroy');
      self.fixScrollbar();
      
      // scroll messages to bottom if user was at the bottom
      if (newchannel || self.get('atBottom')) {
        var toScroll = messages.prop("scrollHeight") - messages.outerHeight();
        messages.scrollTop(toScroll);
      }
    });
  }.observes('controller.content')
});
