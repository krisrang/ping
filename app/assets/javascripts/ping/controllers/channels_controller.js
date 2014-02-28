Ping.ChannelsController = Ping.ArrayController.extend({
  needs: ['appbar', 'userbar'],
  sortProperties: ['name'],
  sortAscending: true
});