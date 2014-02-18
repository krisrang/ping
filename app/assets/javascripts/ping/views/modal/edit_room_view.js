Ping.EditRoomView = Ping.ModalBodyView.extend({
  templateName: 'modal/edit_room',

  title: function() {
    var key = 'edit_room.title_edit';
    if (this.get('controller.model.isNew')) return I18n.t('edit_room.title_new');

    return I18n.t(key);
  }.property('controller.model'),

  didInsertElement: function() {
    this._super();

    // allows the submission of the form when pressing 'ENTER' on *any* text input field
    // but only when the submit button is enabled
    var controller = this.get('controller');
    Em.run.schedule('afterRender', function() {
      $("input[type='text'], input[type='password']").keydown(function(e) {
        if (controller.get('submitDisabled') === false && e.keyCode === 13) {
          controller.send('saveRoom');
          e.preventDefault();
        }
      });
    });
  }
});
