Ping.ChannelsController = Ping.ArrayController.extend({
  needs: ['application', 'appbar', 'userbar'],
  sortProperties: ['name'],
  sortAscending: true
});