Ping.ChannelView = Ping.View.extend({
  classNames: ['channel'],
  classNameBindings: ['sidebarOpen:open:closed', 'userlistOpen:show-users'],
  atBottom: true,
  sidebarOpen: false,
  userlistOpen: false,
  
  actions: {
    toggleSidebar: function() {
      this.toggleProperty('sidebarOpen');
      localforage.setItem('sidebarOpen', this.get('sidebarOpen'));
    },
    
    toggleUsers: function() {
      this.toggleProperty('userlistOpen');
    }
  },
  
  didInsertElement: function() {
    var self = this,
        controller = this.get('controller');
        
    localforage.getItem('sidebarOpen').then(function(open) {
      self.set('sidebarOpen', open);
    });
    
    Em.run.schedule('afterRender', function() {
      var topicInput = self.$("input.channel-topic-input");
      self.fixScrollbar();
      self.messagesChanged();
      self.$('.channel-composer').on('resize', Ember.run.bind(self, self.composerResized));
      self.$('.messagelist').on('scroll', Ember.run.bind(self, self.messagesScrolled));
      self.$('.menu-footer').on('click', function(e) { e.preventDefault(); e.stopPropagation();});
      
      self.$('.channel-header').on('show.bs.dropdown', function(){
        topicInput.val(controller.get('model.topic'));
      });
      
      self.$('.channel-header').on('shown.bs.dropdown', function(){
        topicInput.focus(function(){ this.select(); });
        topicInput.focus();
      });
      
      topicInput.keydown(function(e) {
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
    this.messagesChanged();
  },
  
  messagesScrolled: function() {
    var messages = this.$('.messagelist');
    var bottom = messages.prop("scrollHeight") - messages.scrollTop() === messages.outerHeight();
    this.set('atBottom', bottom);
  },
  
  messagesChanged: function() {
    var self = this,
        messages = this.$('.messagelist');
    if (!messages) return;
    
    Em.run.schedule('afterRender', function() {
      self.$('.messagelist').perfectScrollbar('destroy');
      self.fixScrollbar();
      
      // scroll messages to bottom if user was at the bottom
      if (self.get('atBottom')) {
        var toScroll = messages.prop("scrollHeight") - messages.outerHeight();
        messages.scrollTop(toScroll);
      }
    });
  }.observes('controller.model', 'controller.model.messages.@each')
});
