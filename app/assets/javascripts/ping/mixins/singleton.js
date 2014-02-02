Ping.Singleton = Em.Mixin.create({

  current: function() {
    if (!this._current) {
      this._current = this.createCurrent();
    }

    return this._current;
  },

  createCurrent: function() {
    return this.create({});
  },

  currentProp: function(property, value) {
    var instance = this.current();
    if (!instance) { return; }

    if (typeof(value) !== "undefined") {
      instance.set(property, value);
      return value;
    } else {
      return instance.get(property);
    }
  }

});


