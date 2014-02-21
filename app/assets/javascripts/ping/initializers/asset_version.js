Ember.Application.initializer({
  name: 'assetVersion',

  initialize: function(container) {
    var faye = Ping.Faye,
        controller = container.lookup('controller:application');

    faye.on('transport:down', function(){ controller.set('connected', false); });
    faye.on('transport:up', function(){ controller.set('connected', true); });

    faye.subscribe("/global/asset-version", function(version){
      Ping.set("assetVersion", version);

      if (Ping.get("requiresRefresh")) {
        bootbox.confirm(I18n.lookup("assets_changed_confirm"), function(result){
          if (result) document.location.reload();
        });
      }
    });
  }
});
