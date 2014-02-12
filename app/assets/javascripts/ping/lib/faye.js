Ping.Faye = (function(){
  var faye = new Faye.Client('/faye', {
    timeout: 60,
    retry: 5
  });

  return faye;
})();
