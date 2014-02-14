Ping.InputTipView = Ping.View.extend({
  classNameBindings: [':tip', 'good', 'bad'],

  shouldRerender: Ping.View.renderIfChanged('validation'),
  bad: Em.computed.alias('validation.failed'),
  good: Em.computed.not('bad'),

  render: function(buffer) {
    var reason = this.get('validation.reason');
    if (reason) {
      var icon = this.get('good') ? 'fa-check' : 'fa-times';
      return buffer.push("<i class=\"fa " + icon + "\"></i> " + reason);
    }
  }
});

Ping.View.registerHelper('inputTip', Ping.InputTipView);