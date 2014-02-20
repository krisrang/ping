Ember.Application.initializer({
  name: 'assetVersion',

  initialize: function() {
    Ping.Faye.subscribe("/global/asset-version", function(version){
      Ping.set("assetVersion", version);

      if (Ping.get("requiresRefresh")) {
        bootbox.confirm(I18n.lookup("assets_changed_confirm"), function(result){
          if (result) document.location.reload();
        });
      }
    });
  }
});
