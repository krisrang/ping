/**
  A data model representing current session data. You can put transient
  data here you might want later. It is not stored or serialized anywhere.
**/
Ping.Session = Em.Object.extend({
  init: function() {
    this.set('highestSeenByTopic', {});
  }
});

Ping.Session.reopenClass(Ping.Singleton);
