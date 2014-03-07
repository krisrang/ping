Ping.CreateChannelView = Ping.ModalBodyView.extend({
  templateName: 'modal/create_channel',
  title: I18n.t('channel.create.title'),

  didInsertElement: function() {
    this._super();

    // allows the submission of the form when pressing 'ENTER' on *any* text input field
    // but only when the submit button is enabled
    var controller = this.get('controller');
    Em.run.schedule('afterRender', function() {
      $("input[type='text']").keydown(function(e) {
        if (e.keyCode === 13) {
          e.preventDefault();
          
          if (controller.get('submitDisabled') === false) {
            controller.send('createChannel');
          }        
        }
      });
    });
  }
});
