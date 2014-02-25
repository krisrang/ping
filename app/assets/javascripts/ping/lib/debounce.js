Ping.debounce = function(func, wait) {
  var self, args;
  var later = function() {
    func.apply(self, args);
  };

  return function() {
    self = this;
    args = arguments;

    Ember.run.debounce(null, later, wait);
  };
};

Ping.debouncePromise = function(func, wait) {
  var self, args, promise;
  var later = function() {
    func.apply(self, args).then(function (funcResult) {
      promise.resolve(funcResult);
    });
  };

  return function() {
    self = this;
    args = arguments;
    promise = Ember.Deferred.create();

    Ember.run.debounce(null, later, wait);

    return promise;
  };
};
