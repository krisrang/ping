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
    
    channelList: function() {
      Ping.Route.showModal(this, 'channelList', this.store.all('channel'));
    },
    
    createChannel: function() {
      Ping.Route.showModal(this, 'createChannel');
    },

    editChannel: function(model, param) {
      Ping.Route.showModal(this, 'editChannel', model, param);
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

    joinChannel: function(channel) {
      this.send('closeModal');
      this.transitionTo('channel', channel);
    },

    leaveChannel: function(channel) {
      channel.leave();

      if (this.get('controller.channel') === channel.get('id')) {
        this.transitionTo('welcome');
      }
    },

    logout: function() {
      this.get('currentUser').logout();
    }
  },

  setupController: function(controller) {
    var self = this;
    
    if (!this.get('currentUser.isLoggedIn')) return;
    
    var list = this.store.all('channel');
    controller.set('model', list);
    self.controllerFor('channels').set('content', list);
    
    // switch to last loaded channel
    localforage.getItem('lastChannel').then(function(id){
      var channel = list.findBy('id', id);
      if (channel) self.transitionTo('channel', channel);
    });
  }
});
