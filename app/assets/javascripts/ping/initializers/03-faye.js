Ember.Application.initializer({
  name: 'faye',

  initialize: function(container) {
    var faye = Ping.Faye,
        controller = container.lookup('controller:application');

    faye.on('transport:down', function(){ controller.set('connected', false); });
    faye.on('transport:up', function(){ controller.set('connected', true); });

    faye.subscribe("/global/asset-version", function(version){
      Ping.set("assetVersion", version);

      if (Ping.get("requiresRefresh")) {
        bootbox.alert(I18n.lookup("assets_changed_confirm"), function(){
          document.location.reload();
        });
      }
    });
  }
});
