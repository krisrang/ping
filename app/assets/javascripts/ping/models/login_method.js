Ping.LoginMethod = Ember.Object.extend({
  title: function(){
    return this.get("titleOverride") || I18n.t("login." + this.get("name") + ".title");
  }.property(),

  message: function(){
    return this.get("messageOverride") || I18n.t("login." + this.get("name") + ".message");
  }.property()
});

Ping.LoginMethod.reopenClass({
  register: function(method){
    if(this.methods){
      this.methods.pushObject(method);
    } else {
      this.preRegister = this.preRegister || [];
      this.preRegister.push(method);
    }
  },

  all: function(){
    if (this.methods) { return this.methods; }

    var methods = this.methods = Em.A();

    /*
     * enable_google_logins etc.
     * */

    [ "google",
      "facebook",
      "twitter",
      "github"
    ].forEach(function(name){
      if(Ping.Settings["enable_" + name + "_logins"]){

        var params = {name: name, icon: name};

        if(name === "google") {
          params.frameWidth = 850;
          params.frameHeight = 500;
          params.icon = "google-plus";
        }

        methods.pushObject(Ping.LoginMethod.create(params));
      }
    });

    if (this.preRegister){
      this.preRegister.forEach(function(method){
        methods.pushObject(method);
      });
      delete this.preRegister;
    }
    return methods;
  }.property()
});

