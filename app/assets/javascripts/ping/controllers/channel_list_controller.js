Ping.ChannelListController = Ping.ObjectController.extend(Ping.ModalFunctionality, {
  needs: ['modal'],

  actions: {
  },

  onShow: function() {
    this.set('controllers.modal.modalClass', 'channel-list-modal');
  }
});
