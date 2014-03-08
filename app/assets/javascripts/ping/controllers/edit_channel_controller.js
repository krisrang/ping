Ping.EditChannelController = Ping.Controller.extend(Ping.ModalFunctionality, {
  needs: ['modal'],
  nameError: null,

  actions: {
    saveChannel: function() {
      var self = this,
          model = this.get('model'),
          enteredName = this.get('name'),
          showName = this.get('showName'),
          showPurpose = this.get('showPurpose'),
          channel;
      
      if (showName) {
        var fixedName = Ping.Utilities.parameterize(enteredName);
        
        if (enteredName !== fixedName) {
          this.set('name', fixedName);
          alert(I18n.t('channel.name.name_fixed'));
          return;
        }
      }

      channel = model || this.store.createRecord('channel', {
        name: this.get('name'),
        purpose: this.get('purpose'),
        user: this.get('currentUser.model')
      });
      
      if (model && showName) channel.set('name', this.get('name'));
      if (model && showPurpose) channel.set('purpose', this.get('purpose'));

      return channel.save().then(function() {
        self.send('closeModal');
        
        if (model && showName) {
          Ping.URL.routeTo('/channels/' + channel.get('name'));
        } else {
          self.transitionToRoute('channel', channel);
        }
      }, function(result) {
        if (model) {
          channel.rollbackChanges();
        } else {
          channel.deleteRecord();
        }
        
        if (result.errors && result.errors.messages.name) {
          self.set('nameError', result.errors.messages.name);
        } else {
          self.flash(I18n.t('channel.save.failed'), 'warning');
        }
      });
    }
  },

  onShow: function() {
    this.set('controllers.modal.modalClass', 'channel-modal');
  },
  
  title: function() {
    var title = I18n.t('channel.create.title');
    
    if (this.get('parameter') === 'name') title = I18n.t('channel.update_name');
    if (this.get('parameter') === 'purpose') title = I18n.t('channel.update_purpose');
    
    return title;
  }.property('model', 'parameter'),
  
  saveText: function() {
    return this.get('model') ? I18n.t('save') : I18n.t('create');
  }.property('model', 'parameter'),
  
  showName: function() {
    if (!this.get('model')) return true;
    return this.get('model') && this.get('parameter') === 'name';
  }.property('model', 'parameter'),
  
  showPurpose: function() {
    if (!this.get('model')) return true;
    return this.get('model') && this.get('parameter') === 'purpose';
  }.property('model', 'parameter'),

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
    if (this.get('showName') && this.get('nameValidation.failed')) return true;
    return false;
  }.property('name', 'nameValidation.failed', 'showName')
});
