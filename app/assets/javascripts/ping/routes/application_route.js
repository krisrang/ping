Ping.ApplicationRoute = Ember.Route.extend({
  actions: {
    newRoom: function() {
      Ping.Route.showModal(this, 'editRoom', this.store.createRecord('room'));
    },

    editRoom: function(room) {
      if (room.get('owner.id') !== this.get('currentUser.id')) return;
      Ping.Route.showModal(this, 'editRoom', room);
    },

    deleteRoom: function(room) {
      if (room.get('owner.id') !== this.get('currentUser.id')) return;
      bootbox.confirm(I18n.t('confirm'), function(result) {
        if (!result) return;

        room.leave().then(function(){
          room.destroyRecord();
        });
      });
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

  model: function() {
    return this.store.findAll('room');
  },

  setupController: function(controller, model) {
    controller.set('model', model);
    this.controllerFor('roomlist').set('content', model);    
  }
});
