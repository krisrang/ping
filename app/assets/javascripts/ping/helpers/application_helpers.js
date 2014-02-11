/**
  Bound avatar helper.
  Will rerender whenever the "avatar_template" changes.

  @method boundAvatar
  @for Handlebars
**/
Ember.Handlebars.registerBoundHelper('boundAvatar', function(user, options) {
  return new Handlebars.SafeString(Ping.Utilities.avatarImg({
    size: options.hash.imageSize,
    avatarTemplate: Em.get(user, options.hash.template || 'avatar_template')
  }));
}, 'avatar_template');
