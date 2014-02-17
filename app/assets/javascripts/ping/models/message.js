var attr = DS.attr;

Ping.Message = DS.Model.extend({
  source: attr(),
  cooked: attr(),
  createdAt: attr('date'),
  room: DS.belongsTo('room'),
  user: DS.belongsTo('user')
});
