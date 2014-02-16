Ping.NewRoomController = Ping.Controller.extend(Ping.ModalFunctionality, {
  needs: ['modal'],

  rejectedNames: Em.A([]),

  actions: {
    saveRoom: function() {
      var self = this;
      var room = this.store.createRecord('room', {
        name: this.get('name'),
        topic: this.get('topic')
      });

      return room.save().then(function(result) {
        self.get('currentUser.rooms').pushObject(result);

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
  },

  nameValidation: function() {
    // If blank, fail without a reason
    if (this.blank('name')) return Ping.InputValidation.create({ failed: true });

    var name = this.get('name');

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
    if (name.length > 18) {
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
  }.property('name', 'rejectedNames.@each'),

  submitDisabled: function() {
    if (this.get('nameValidation.failed')) return true;
    return false;
  }.property('name', 'nameValidation.failed')
});
