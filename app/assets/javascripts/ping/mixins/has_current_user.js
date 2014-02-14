Ping.HasCurrentUser = Em.Mixin.create({
  currentUser: function() {
    return Ping.User.current();
  }.property().volatile()
});
