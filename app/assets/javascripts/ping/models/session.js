/**
  A data model representing current session data. You can put transient
  data here you might want later. It is not stored or serialized anywhere.
**/
Ping.Session = Ping.Model.extend({
  init: function() {
    // this.set('initial', {});
  }
});

Ping.Session.reopenClass(Ping.Singleton);
