var attr = DS.attr;

Ping.Message = DS.Model.extend({
  source: attr(),
  cooked: attr(),
  createdAt: attr('date'),
  room: DS.belongsTo('room'),
  user: DS.belongsTo('user')
});

// Ping.Message.url = "/messages";
// Ping.Message.rootKey = "message";
// Ping.Message.collectionKey = "messages";
// Ping.Message.adapter = Ping.Store;
