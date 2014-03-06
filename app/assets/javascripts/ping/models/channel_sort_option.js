Ping.ChannelSortOption = Ping.Model.extend({});

Ping.ChannelSortOption.reopenClass({
  all: function(){
    if (this.sortOptions) { return this.sortOptions; }

    var sortOptions = this.sortOptions = Em.A();
    
    [ "name",
      "createdat",
      "membersdesc",
      "membersasc"
    ].forEach(function(value){
      var params = {label: I18n.t('channel_list.sort_' + value), value: value};

      sortOptions.pushObject(Ping.ChannelSortOption.create(params));
    });

    return sortOptions;
  }.property()
});

