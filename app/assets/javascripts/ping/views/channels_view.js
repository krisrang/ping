Ping.ChannelsView = Ping.View.extend({
  extraMargin: function() {
    var margin = 20;
    
    margin += this.get('controller.controllers.appbar.appbarVisible') ? 110 : 42;
    margin += this.get('controller.controllers.userbar.userbarVisible') ? 120 : 50;
    return margin;
  }.property('controller.controllers.appbar.appbarVisible', 'controller.controllers.userbar.userbarVisible'),
  
  didInsertElement: function() {
    $(window).on('resize', Ember.run.bind(this, this.setMaxHeight));
    this.setMaxHeight();
  },
  
  setMaxHeight: function() {
    var windowHeight = $(window).height(),
        margin = this.get('extraMargin');
    
    this.$('.channels').css('max-height', windowHeight - margin);
  }.observes('extraMargin')
});
