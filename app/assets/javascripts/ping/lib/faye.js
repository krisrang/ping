Ping.Faye = (function(){
  var faye = new Faye.Client('/faye', {
    timeout: 60,
    retry: 5
  });

  // faye.addExtension({
  //   outgoing: function(message, callback) {
  //     message.ext = message.ext || {};
  //     message.ext.csrfToken = $('meta[name=csrf-token]').attr('content');
  //     callback(message);
  //   }
  // });

  return faye;
})();
