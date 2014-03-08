Ping.Route = Em.Route.extend({
  /**
    NOT called every time we enter a route on Ping.
    Only called the FIRST time we enter a route.
    So, when going from one topic to another, activate will only be called on the
    TopicRoute for the first topic.

    @method activate
  **/
  activate: function() {
    this._super();
    Em.run.scheduleOnce('afterRender', Ping.Route, 'cleanDOM');
  }
});


Ping.Route.reopenClass({
  cleanDOM: function() {
    // Close mini profiler
    $('.profiler-results .profiler-result').remove();

    // Close some elements that may be open
    $('[data-toggle="dropdown"]').parent().removeClass('open');
    // close the lightbox
    // if ($.magnificPopup && $.magnificPopup.instance) { $.magnificPopup.instance.close(); }

    // Remove any link focus
    $('a').blur();

    // Ping.set('notifyCount',0);
  },
  
  /**
    Shows a modal

    @method showModal
  **/
  showModal: function(router, name, model, param) {
    var className = name.dasherize() + '-modal';
    router.controllerFor('modal').set('modalClass', className);
    router.render(name, {into: 'modal', outlet: 'modalBody'});
    var controller = router.controllerFor(name);
    if (controller) {
      if (controller && controller.onShow) controller.onShow();
      
      controller.set('model', model);
      controller.set('parameter', param);
      controller.set('flashMessage', null);
    }
  }
});
