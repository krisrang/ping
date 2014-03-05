var attr = DS.attr;

Ping.Message = DS.Model.extend({
  source: attr(),
  cooked: attr(),
  createdAt: attr('date'),
  channel: DS.belongsTo('channel'),
  user: DS.belongsTo('user')
});
