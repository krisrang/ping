Ping.ChannelsView = Ping.View.extend({  
  didInsertElement: function() {
    $(window).on('resize', Ember.run.bind(this, this.setMaxHeight));
    this.setMaxHeight();
  },
  
  setMaxHeight: function() {
    var windowHeight = $(window).height();
    this.$('.channels').css('max-height', windowHeight - 20);
  }
});
