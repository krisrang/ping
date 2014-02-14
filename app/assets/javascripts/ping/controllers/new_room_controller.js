Ping.NewRoomController = Ping.Controller.extend(Ping.ModalFunctionality, {
  needs: ['modal'],

  rejectedNames: Em.A([]),

  actions: {
    saveRoom: function() {
      var self = this,
          room = this.get('model');

      if (this.blank('model.name')) return;

      return room.save().then(function() {
        self.send('closeModal');
        Em.run.later(room, function(){
          $('#roomlist .room-' + this.get('id')).addClass('animated flash');
        }, 200);
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
    this.set('controllers.modal.modalClass', 'new-room-modal');
    this.set('model', this.store.createRecord('room'));
  },

  nameValidation: function() {
    // If blank, fail without a reason
    if (this.blank('model.name')) return Ping.InputValidation.create({ failed: true });

    var name = this.get('model.name');

    if (this.get('rejectedNames').contains(name)) {
      return Ping.InputValidation.create({
        failed: true,
        reason: I18n.t('room.name.unique')
      });
    }

    // If too short
    if (name.length < 3) {
      return Ping.InputValidation.create({
        failed: true,
        reason: I18n.t('room.name.too_short')
      });
    }

    // If too long
    if (name.length > 10) {
      return Ping.InputValidation.create({
        failed: true,
        reason: I18n.t('room.name.too_long')
      });
    }

    // Looks good!
    return Ping.InputValidation.create({
      ok: true,
      reason: I18n.t('room.name.ok')
    });
  }.property('model.name', 'rejectedNames.@each'),

  submitDisabled: function() {
    if (this.get('nameValidation.failed')) return true;
    return false;
  }.property('model.name', 'nameValidation.failed')
});
