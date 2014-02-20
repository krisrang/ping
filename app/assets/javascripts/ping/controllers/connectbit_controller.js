Ping.ConnectbitController = Em.Controller.extend({
  needs: ['application'],

  isConnected: Em.computed.bool('controllers.application.connected'),

  icon: function() {
    if (this.get('isConnected')) return assetPath('icon_available.png');
    return assetPath('icon_away.png');
  }.property('isConnected'),

  message: function() {
    return I18n.t('connection.' + this.get('isConnected'));
  }.property('isConnected')
});
