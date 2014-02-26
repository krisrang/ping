Ember.Application.initializer({
  name: 'csrf',

  initialize: function() {
    var session = Ping.Session;

    // Add a CSRF token to all AJAX requests
    session.currentProp('csrfToken', $('meta[name=csrf-token]').attr('content'));

    $.ajaxPrefilter(function(options, originalOptions, xhr) {
      if (!options.crossDomain) {
        xhr.setRequestHeader('X-CSRF-Token', session.currentProp('csrfToken'));
      }
    });
  }
});
