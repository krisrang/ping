Ping.ModalBodyView = Ping.View.extend({

  // Focus on first element
  didInsertElement: function() {
    var self = this;

    $('#ping-modal').modal('show');

    $('#ping-modal').one("hide", function () {
      self.get("controller").send("closeModal");
    });

    $('#modal-alert').hide();

    // if (!Discourse.Mobile.mobileView) {
      Em.run.schedule('afterRender', function() {
        self.$('input:first').focus();
      });
    // }

    var title = this.get('title');
    if (title) {
      this.set('controller.controllers.modal.title', title);
    }
  },

  flashMessageChanged: function() {
    var flashMessage = this.get('controller.flashMessage');
    if (flashMessage) {
      var messageClass = flashMessage.get('messageClass') || 'success';
      var $alert = $('#modal-alert').hide().removeClass('alert-error', 'alert-success');
      $alert.addClass("alert alert-" + messageClass).html(flashMessage.get('message'));
      $alert.fadeIn();
    }
  }.observes('controller.flashMessage')
});
