Ping.CreateAccountController = Ping.Controller.extend(Ping.ModalFunctionality, {
  uniqueUsernameValidation: null,
  complete: false,
  accountPasswordConfirm: 0,
  accountChallenge: 0,
  formSubmitted: false,
  rejectedEmails: Em.A([]),

  resetForm: function() {
    this.setProperties({
      accountName: '',
      accountEmail: '',
      accountUsername: '',
      accountPassword: '',
      authOptions: null,
      complete: false,
      formSubmitted: false,
      rejectedEmails: Em.A([])
    });
  },

  submitDisabled: function() {
    if (this.get('formSubmitted')) return true;
    if (this.get('nameValidation.failed')) return true;
    if (this.get('emailValidation.failed')) return true;
    if (this.get('usernameValidation.failed')) return true;
    if (this.get('passwordValidation.failed')) return true;
    return false;
  }.property('nameValidation.failed', 'emailValidation.failed', 'usernameValidation.failed', 'passwordValidation.failed', 'formSubmitted'),

  passwordRequired: function() {
    return (this.blank('authOptions.auth_provider') || this.blank('authOptions.email_valid') || !this.get('authOptions.email_valid'));
  }.property('authOptions.auth_provider'),

  passwordInstructions: function() {
    return I18n.t('user.password.instructions', {count: Ping.Settings.min_password_length});
  }.property(),

  // Validate the name
  nameValidation: function() {
    // If blank, fail without a reason
    if (this.blank('accountName')) return Ping.InputValidation.create({ failed: true });

    if (this.get('accountPasswordConfirm') === 0) {
      this.fetchConfirmationValue();
    }

    // If too short
    if (this.get('accountName').length < 3) {
      return Ping.InputValidation.create({
        failed: true,
        reason: I18n.t('user.name.too_short')
      });
    }

    // Looks good!
    return Ping.InputValidation.create({
      ok: true,
      reason: I18n.t('user.name.ok')
    });
  }.property('accountName'),

  // Check the email address
  emailValidation: function() {
    // If blank, fail without a reason
    var email;
    if (this.blank('accountEmail')) {
      return Ping.InputValidation.create({
        failed: true
      });
    }

    email = this.get("accountEmail");

    if (this.get('rejectedEmails').contains(email)) {
      return Ping.InputValidation.create({
        failed: true,
        reason: I18n.t('user.email.invalid')
      });
    }

    if ((this.get('authOptions.email') === email) && this.get('authOptions.email_valid')) {
      return Ping.InputValidation.create({
        ok: true,
        reason: I18n.t('user.email.authenticated', {
          provider: this.get('authOptions.auth_provider')
        })
      });
    }

    if (Ping.Utilities.emailValid(email)) {
      return Ping.InputValidation.create({
        ok: true,
        reason: I18n.t('user.email.ok')
      });
    }

    return Ping.InputValidation.create({
      failed: true,
      reason: I18n.t('user.email.invalid')
    });
  }.property('accountEmail', 'rejectedEmails.@each'),

  emailValidated: function() {
    return this.get('authOptions.email') === this.get("accountEmail") && this.get('authOptions.email_valid');
  }.property('accountEmail', 'authOptions.email', 'authOptions.email_valid'),

  basicUsernameValidation: function() {
    this.set('uniqueUsernameValidation', null);

    // If blank, fail without a reason
    if (this.blank('accountUsername')) {
      return Ping.InputValidation.create({
        failed: true
      });
    }

    // If too short
    if (this.get('accountUsername').length < 3) {
      return Ping.InputValidation.create({
        failed: true,
        reason: I18n.t('user.username.too_short')
      });
    }

    // If too long
    if (this.get('accountUsername').length > 15) {
      return Ping.InputValidation.create({
        failed: true,
        reason: I18n.t('user.username.too_long')
      });
    }

    this.checkUsernameAvailability();
    // Let's check it out asynchronously
    return Ping.InputValidation.create({
      failed: true,
      reason: I18n.t('user.username.checking')
    });
  }.property('accountUsername'),

  shouldCheckUsernameMatch: function() {
    return !this.blank('accountUsername') && this.get('accountUsername').length > 2;
  },

  checkUsernameAvailability: Ping.debounce(function() {
    var _this = this;
    if (this.shouldCheckUsernameMatch()) {
      return Ping.User.checkUsername(this.get('accountUsername'), this.get('accountEmail')).then(function(result) {
        if (result.available) {          
          return _this.set('uniqueUsernameValidation', Ping.InputValidation.create({
            ok: true,
            reason: I18n.t('user.username.available')
          }));
        } else {
          if (result.suggestion) {
            return _this.set('uniqueUsernameValidation', Ping.InputValidation.create({
              failed: true,
              reason: I18n.t('user.username.not_available', result)
            }));
          } else if (result.errors) {
            return _this.set('uniqueUsernameValidation', Ping.InputValidation.create({
              failed: true,
              reason: result.errors.join(' ')
            }));
          }
        }
      });
    }
  }, 500),

  // Actually wait for the async name check before we're 100% sure we're good to go
  usernameValidation: function() {
    var basicValidation, uniqueUsername;
    basicValidation = this.get('basicUsernameValidation');
    uniqueUsername = this.get('uniqueUsernameValidation');
    if (uniqueUsername) {
      return uniqueUsername;
    }
    return basicValidation;
  }.property('uniqueUsernameValidation', 'basicUsernameValidation'),

  // Validate the password
  passwordValidation: function() {
    var password;
    if (!this.get('passwordRequired')) {
      return Ping.InputValidation.create({
        ok: true
      });
    }

    // If blank, fail without a reason
    password = this.get("accountPassword");
    if (this.blank('accountPassword')) {
      return Ping.InputValidation.create({ failed: true });
    }

    // If too short
    if (password.length < Ping.Settings.min_password_length) {
      return Ping.InputValidation.create({
        failed: true,
        reason: I18n.t('user.password.too_short')
      });
    }

    var strength = this.get('passwordStrength');

    if (strength.get('score') < 2) {
      return Ping.InputValidation.create({
        failed: true,
        reason: strength.get('hint')
      });
    } else {
      return Ping.InputValidation.create({
        ok: true,
        reason: strength.get('hint')
      });
    }

    // Looks good!
    return Ping.InputValidation.create({
      ok: true,
      reason: I18n.t('user.password.ok')
    });
  }.property('accountPassword', 'passwordStrength.score'),

  // Check password strength
  passwordStrength: function() {
    var password = this.get("accountPassword"),
        name = this.get('accountName') || "",
        username = this.get('accountUsername') || "",
        email = this.get('accountEmail') || "";
        
    if (this.blank('accountPassword')) {
      return Ping.PasswordStrength.create({ score: 0 });
    }

    var result = zxcvbn(password, [name, username, email]);
    return Ping.PasswordStrength.create({
      score: result.score,
      crack_time: result.crack_time_display
    });
  }.property('accountPassword', 'accountName', 'accountUsername', 'accountEmail'),

  fetchConfirmationValue: function() {
    var createAccountController = this;
    return Ping.ajax('/users/hp.json').then(function (json) {
      createAccountController.set('accountPasswordConfirm', json.value);
      createAccountController.set('accountChallenge', json.challenge.split("").reverse().join(""));
    });
  },

  actions: {
    createAccount: function() {
      this.set('formSubmitted', true);
      var self = this,      
          name = this.get('accountName'),
          email = this.get('accountEmail'),
          password = this.get('accountPassword'),
          username = this.get('accountUsername'),
          passwordConfirm = this.get('accountPasswordConfirm'),
          challenge = this.get('accountChallenge');

      var data = { 
        user: {
          name: name,
          email: email,
          password: password,
          username: username,
          password_confirmation: passwordConfirm,
          challenge: challenge
        }
      };

      return Ping.ajax("/users", { data: data, type: 'POST' }).then(function(result) {
        if (result.success) {
          self.flash(result.message);
          self.set('complete', true);
        } else {
          self.flash(result.message || I18n.t('create_account.failed'), 'error');
          if (result.errors && result.errors.email && result.errors.email.length > 0 && result.values) {
            self.get('rejectedEmails').pushObject(result.values.email);
          }
          self.set('formSubmitted', false);
        }
        if (result.active) {
          return window.location.reload();
        }
      }, function() {
        self.set('formSubmitted', false);
        return self.flash(I18n.t('create_account.failed'), 'error');
      });
    }
  }
});
