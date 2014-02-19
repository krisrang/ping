Ping.LobbyRoomController = Ping.ObjectController.extend({
  owned: function() {
    return this.get('owner.id') === this.get('currentUser.id');
  }.property('owner')
});
