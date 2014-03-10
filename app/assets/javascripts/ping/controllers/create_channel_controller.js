Ping.CreateChannelController = Ping.Controller.extend(Ping.ModalFunctionality, {
  needs: ['modal'],
  nameError: null,

  actions: {
    saveChannel: function() {
      var self = this,
          enteredName = this.get('name'),
          channel;
      
      var fixedName = Ping.Utilities.parameterize(enteredName);
      
      if (enteredName !== fixedName) {
        this.set('name', fixedName);
        alert(I18n.t('channel.name.name_fixed'));
        return;
      } 

      channel = this.store.createRecord('channel', {
        name: this.get('name'),
        purpose: this.get('purpose'),
        user: this.get('currentUser.model')
      });

      return channel.save().then(function() {
        self.set('name', null);
        self.set('purpose', null);
        self.send('closeModal');        
        self.transitionToRoute('channel', channel);
      }, function(result) {
        channel.deleteRecord();

        if (result.errors && result.errors.messages.name) {
          self.set('nameError', result.errors.messages.name);
        } else {
          self.flash(I18n.t('channel.create.failed'), 'warning');
        }
      });
    }
  },

  onShow: function() {
    this.set('controllers.modal.modalClass', 'channel-modal');
  },

  nameValidation: function() {
    // If blank, fail without a reason
    if (this.blank('name')) return Ping.InputValidation.create({ failed: true });

    var name = this.get('name'),
        error = this.get('nameError');

    if (error) {
      this.set('nameError', null);
      return Ping.InputValidation.create({
        failed: true,
        reason: error
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
  }.property('name', 'nameError'),

  submitDisabled: function() {
    if (this.get('nameValidation.failed')) return true;
    return false;
  }.property('name', 'nameValidation.failed')
});
