var PingLogin = {
  
  // Required fields

  setupRequiredCheck: function() {
    PingLogin.requiredFormChecker();
    $('form .form-group input[required]').on('input', PingLogin.requiredFormChecker);
  },

  requiredFormChecker: function() {
    var fields = $('form .form-group input[required]');
    var filled = true;

    if (fields.length > 0) {
      filled = _.all(fields, function(input) {
        return $(input).val().trim().length > 0;
      });
    }

    $('input[type=submit]').prop('disabled', !filled);
  }
};

$(function() {
  $('form .form-group:first input').focus();

  PingLogin.setupRequiredCheck();
});