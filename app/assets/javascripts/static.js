var PingLogin = {
  requiredFormChecker: function() {
    var filled = $('.form-group input').toArray().all(function(input) {
      return $(input).val().trim().length > 0;
    });

    $('input[type=submit]').prop('disabled', !filled);
  }
};

$(function() {
  $('form .form-group:first input').focus();

  PingLogin.requiredFormChecker();
  $('form.all-required .form-group input').on('input', PingLogin.requiredFormChecker);
});