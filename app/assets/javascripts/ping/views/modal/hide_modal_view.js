/**
  An empty view for when we want to close a modal.
**/
Ping.HideModalView = Ping.ModalBodyView.extend({
  // No rendering!
  render: function() { },

  didInsertElement: function() {
    $('#ping-modal').modal('hide');
  }
});
