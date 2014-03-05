Ping.ModalController = Ping.Controller.extend({
  actions: {
    modalCreate: function() {
      this.send(this.get('createAction'));
    }
  }
});