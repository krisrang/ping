var attr = DS.attr;

Ping.Message = DS.Model.extend({
  source: attr(),
  cooked: attr(),
  createdAt: attr('date'),
  updatedAt: attr('date'),
  channel: DS.belongsTo('channel', {async: true}),
  user: DS.belongsTo('user', {async: true})
});
