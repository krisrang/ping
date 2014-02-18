Ping.Route = Em.Route.extend({
  /**
    NOT called every time we enter a route on Ping.
    Only called the FIRST time we enter a route.
    So, when going from one topic to another, activate will only be called on the
    TopicRoute for the first topic.

    @method activate
  **/
  // activate: function() {
  //   this._super();
  // }
});


Ping.Route.reopenClass({
  /**
    Shows a modal

    @method showModal
  **/
  showModal: function(router, name, model) {
    router.controllerFor('modal').set('modalClass', null);
    router.render(name, {into: 'modal', outlet: 'modalBody'});
    var controller = router.controllerFor(name);
    if (controller) {
      if (model) {
        controller.set('model', model);
      }
      if(controller && controller.onShow) {
        controller.onShow();
      }
      controller.set('flashMessage', null);
    }
  }
});
