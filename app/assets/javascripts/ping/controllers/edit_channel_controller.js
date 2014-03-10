Ping.EditChannelController = Ping.Controller.extend(Ping.ModalFunctionality, {
  needs: ['modal'],
  nameError: null,
  
  editingName: Em.computed.equal('parameter', 'name'),
  editingPurpose: Em.computed.equal('parameter', 'purpose'),

  actions: {
    saveChannel: function() {
      var self = this,
          enteredName = this.get('name'),
          editingName = this.get('editingName'),
          editingPurpose = this.get('editingPurpose'),
          channel = this.get('model'),
          newName,
          newPurpose;
      
      if (editingName) {
        var fixedName = Ping.Utilities.parameterize(enteredName);
        
        if (enteredName !== fixedName) {
          this.set('name', fixedName);
          alert(I18n.t('channel.name.name_fixed'));
          return;
        }
      }
      
      if (editingName) newName = this.get('name');
      if (editingPurpose) newPurpose = this.get('purpose');

      return channel.update(newName, newPurpose).then(function() {
        self.send('closeModal');
        
        if (editingName) {
          Ping.URL.routeTo('/channels/' + channel.get('name'));
        } else {
          self.transitionToRoute('channel', channel);
        }
      }, function(result) {        
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
    this.set('name', this.get('model.name'));
    this.set('purpose', this.get('model.purpose'));
  },
  
  title: function() {
    var title = this.get('parameter') === 'name' ?
      I18n.t('channel.update_name') :
      I18n.t('channel.update_purpose');
    
    return title;
  }.property('parameter'),
  
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
    if (this.get('editingName') && this.get('nameValidation.failed')) return true;
    return false;
  }.property('name', 'nameValidation.failed', 'editingName')
});
