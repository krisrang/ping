Ping.Faye = (function(){
  var faye = new Faye.Client('/faye', {
    timeout: 120,
    retry: 5
  });

  faye.on('transport:down', function(){ Ping.set('connected', false); });
  faye.on('transport:up', function(){ Ping.set('connected', true); });

  // faye.addExtension({
  //   outgoing: function(message, callback) {
  //     message.ext = message.ext || {};
  //     message.ext.csrfToken = $('meta[name=csrf-token]').attr('content');
  //     callback(message);
  //   }
  // });

  return faye;
})();
