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
        if (controller.get('submitDisabled') === false && e.keyCode === 13) {
          controller.send('saveChannel');
        }
      });
    });
  }
});
