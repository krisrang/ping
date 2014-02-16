Ping.ApplicationRoute = Ember.Route.extend({
  actions: {
    newRoom: function() {
      Ping.Route.showModal(this, 'newRoom');
    },

    showKeyboardShortcutsHelp: function() {
      Ping.Route.showModal(this, 'keyboardShortcutsHelp');
    },

    closeModal: function() {
      this.render('hide_modal', {into: 'modal', outlet: 'modalBody'});
    },

    hideModal: function() {
      $('#ping-modal').modal('hide');
    },

    showModal: function() {
      $('#ping-modal').modal('show');
    },

    joinRoom: function(room) {
      this.transitionTo('room', room);
    },

    leaveRoom: function(room) {
      room.leave();

      if (this.get('controller.room') === room.get('id')) {
        this.transitionTo('lobby');
      }
    }
  },

  setupController: function(controller) {
    var self = this,
        faye = Ping.Faye;
        
    faye.on('transport:down', function(){ controller.set('connected', false); });
    faye.on('transport:up', function(){ controller.set('connected', true); });

    var list = this.store.findAll('room');
    self.controllerFor('rooms').set('content', list);
  }
});
