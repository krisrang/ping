Ping.PasswordStrength = Ping.Model.extend({
  className: function() {
    return 'score-' + this.get('score');
  }.property('score'),

  message: function() {
    return I18n.t('user.password.time') + this.get('crack_time');
  }.property('crack_time', 'score'),

  hint: function() {
    var score = this.get('score'),
        hint = "";

    switch(score) {
      case 4:
        hint = I18n.t('user.password.very_strong');
        break;
      case 3:
        hint = I18n.t('user.password.strong');
        break;
      case 2:
        hint = I18n.t('user.password.medium');
        break;
      case 1:
        hint = I18n.t('user.password.weak');
        break;
      default:
        hint = I18n.t('user.password.very_weak');
    }

    return I18n.t('user.password.yours_is') + hint;
  }.property('score'),
});
