Ping.ApplicationRoute = Ember.Route.extend({
  actions: {
    showLogin: function() {
      Ping.Route.showModal(this, 'login');
      this.controllerFor('login').resetForm();
    },

    showCreateAccount: function() {
      Ping.Route.showModal(this, 'createAccount');
    },

    showForgotPassword: function() {
      Ping.Route.showModal(this, 'forgotPassword');
    },

    showNotActivated: function(props) {
      Ping.Route.showModal(this, 'notActivated');
      this.controllerFor('notActivated').setProperties(props);
    },

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
    },

    logout: function() {
      this.get('currentUser').logout();
    }
  },

  setupController: function(controller) {
    if (!this.get('currentUser.isLoggedIn')) return;
    
    var list = this.store.findAll('room');
    controller.set('model', list);
    this.controllerFor('roomlist').set('content', list);    
  }
});
