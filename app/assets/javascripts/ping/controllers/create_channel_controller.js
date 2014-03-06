Ping.CreateChannelController = Ping.ObjectController.extend(Ping.ModalFunctionality, {
  needs: ['modal'],

  rejectedNames: Em.A([]),

  actions: {
    createChannel: function() {
      var self = this,
          channel = this.get('model');

      channel.set('user', this.get('currentUser.model'));

      return channel.save().then(function() {
        self.send('closeModal');
        self.transitionToRoute('channel', channel);
      }, function(result) {
        if (result.errors && result.errors.values.name) {
          self.get('rejectedNames').pushObject(result.errors.values.name);
        } else {
          self.flash(I18n.t('new_room.failed'), 'warning');
        }
      });
    }
  },

  onShow: function() {
    this.set('controllers.modal.modalClass', 'new-channel-modal');
  },

  nameValidation: function() {
    // If blank, fail without a reason
    if (this.blank('name')) return Ping.InputValidation.create({ failed: true });

    var name = this.get('name');

    if (this.get('rejectedNames').contains(name)) {
      return Ping.InputValidation.create({
        failed: true,
        reason: I18n.t('channel.name.unique')
      });
    }

    // If too short
    if (name.length < 3) {
      return Ping.InputValidation.create({
        failed: true,
        reason: I18n.t('channel.name.too_short')
      });
    }

    // If too long
    if (name.length > 20) {
      return Ping.InputValidation.create({
        failed: true,
        reason: I18n.t('channel.name.too_long')
      });
    }

    // Looks good!
    return Ping.InputValidation.create({
      ok: true,
      reason: I18n.t('channel.name.ok')
    });
  }.property('name', 'rejectedNames.@each'),

  submitDisabled: function() {
    if (this.get('nameValidation.failed')) return true;
    return false;
  }.property('name', 'nameValidation.failed')
});
