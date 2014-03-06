Ping.ChannelListItemController = Ping.ObjectController.extend({
  channelDetail: function() {
    var username = this.get('owner.username'),
        createdAt = this.get('createdAt');
        
    createdAt = Ping.Formatter.shortDate(createdAt);        
    return I18n.t('created_by_on', { by: username, on: createdAt });
  }.property('createdAt', 'owner.username')
});
