Ping.InputTipView = Ping.View.extend({
  classNameBindings: [':tip', ':help-block', ':input-tip', 'validationClass', 'shownClass'],

  shouldRerender: Ping.View.renderIfChanged('validation'),
  bad: Em.computed.alias('validation.failed'),
  good: Em.computed.not('bad'),

  validationClass: function() {
    var reason = this.get('validation.reason');
    if (reason) return this.get('good') ? 'good' : 'bad';
  }.property('validation'),

  shownClass: function() {
    var reason = this.get('validation.reason'),
        help = this.get('helpKey');

    if (!reason && !help) return 'hidden';
  }.property('validation', 'helpKey'),

  render: function(buffer) {
    var reason = this.get('validation.reason'),
        help = this.get('helpKey');

    if (reason) {      
      var icon = this.get('good') ? 'fa-check' : 'fa-times';
      return buffer.push("<i class=\"fa " + icon + "\"></i> " + reason);
    } else if (help) {
      var string = I18n.t(help);
      return buffer.push("<label>" + string + "</label>");
    }
  }
});

Ping.View.registerHelper('inputTip', Ping.InputTipView);