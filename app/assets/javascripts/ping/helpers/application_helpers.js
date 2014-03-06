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


/**
  Nicely format a date without binding or returning HTML

  @method rawDate
  @for Handlebars
**/
Handlebars.registerHelper('rawDate', function(property, options) {
  var dt = new Date(Ember.Handlebars.get(this, property, options));
  return Ping.Formatter.longDate(dt);
});

/**
  Live refreshing age helper

  @method unboundAge
  @for Handlebars
**/
Handlebars.registerHelper('unboundAge', function(property, options) {
  var dt = new Date(Ember.Handlebars.get(this, property, options));
  return new Handlebars.SafeString(Ping.Formatter.autoUpdatingRelativeAge(dt));
});

/**
  Live refreshing age helper, with a tooltip showing the date and time

  @method unboundAgeWithTooltip
  @for Handlebars
**/
Handlebars.registerHelper('unboundAgeWithTooltip', function(property, options) {
  var dt = new Date(Ember.Handlebars.get(this, property, options));
  return new Handlebars.SafeString(Ping.Formatter.autoUpdatingRelativeAge(dt, {title: true}));
});


/**
  Display logic for dates. It is unbound in Ember but will use jQuery to
  update the dates on a regular interval.

  @method unboundDate
  @for Handlebars
**/
Handlebars.registerHelper('unboundDate', function(property, options) {
  var leaveAgo;
  if (property.hash) {
    if (property.hash.leaveAgo) {
      leaveAgo = property.hash.leaveAgo === "true";
    }
    if (property.hash.path) {
      property = property.hash.path;
    }
  }

  var val = Ember.Handlebars.get(this, property, options);
  if (val) {
    var date = new Date(val);
    return new Handlebars.SafeString(Ping.Formatter.autoUpdatingRelativeAge(date, {format: 'medium', title: true, leaveAgo: leaveAgo}));
  }
});

Ember.Handlebars.registerBoundHelper('date', function(dt) {
  return new Handlebars.SafeString(Ping.Formatter.autoUpdatingRelativeAge(new Date(dt), {format: 'medium', title: true }));
});
