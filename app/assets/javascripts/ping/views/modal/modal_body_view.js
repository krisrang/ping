Ping.ModalBodyView = Ping.View.extend({

  // Focus on first element
  didInsertElement: function() {
    var self = this,
        controller = this.get('controller');

    $('#ping-modal').modal('show');

    $('#ping-modal').one('hidden.bs.modal', function () {
      controller.send("closeModal");
    });

    $('#modal-alert').hide();

    Em.run.schedule('afterRender', function() {
      self.$('input:first').focus();
      
      if ($('#ping-modal').hasClass('fade')) {
        Em.run.later(self, function(){ this.$('input:first').focus(); }, 200);
      }
    });

    var title = this.get('title');
    if (title) this.set('controller.controllers.modal.title', title);
    
    var createTitle = this.get('createTitle');
    this.set('controller.controllers.modal.createTitle', createTitle);
    
    var createAction = this.get('createAction');
    this.set('controller.controllers.modal.createAction', createAction);
  },

  willDestroy: function() {
    var controller = this.get('controller');
    if (controller.onClose) controller.onClose();
    this._super();
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
