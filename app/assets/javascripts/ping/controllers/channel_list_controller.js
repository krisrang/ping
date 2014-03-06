Ping.ChannelListController = Ping.ArrayController.extend(Ping.ModalFunctionality, {
  needs: ['modal'],
  sortProperties: ['name', 'createdAt'],
  sortAscending: true,
  isSearching: Em.computed.notEmpty('searchFilter'),

  actions: {
    cancelSearch: function() {
      this.set('searchFilter', null) ;
    }
  },
  
  showNoResults: function() {
    return this.get('isSearching') && this.blank('filteredContent');
  }.property('filteredContent', 'isSearching'),
  
  onShow: function() {
    this.set('controllers.modal.modalClass', 'channel-list-modal');
  },
  
  filteredContent: function() {
    var arrangedContent = this.get('arrangedContent'),
        filter = this.get('searchFilter');
         
    if (Em.isEmpty(filter)) return arrangedContent;

    return arrangedContent.filter(function(item) {
      return item.get('name').indexOf(filter) >= 0;
    });        
 }.property('arrangedContent.isLoaded', 'arrangedContent.@each', 'searchFilter'),
 
 openChannels: function() {
    var filteredContent = this.get('filteredContent');
    return filteredContent.filterBy('open');
 }.property('filteredContent.isLoaded', 'filteredContent.@each.open'),
 
 closedChannels: function() {
    var filteredContent = this.get('filteredContent');
    return filteredContent.filterBy('closed');        
 }.property('filteredContent.isLoaded', 'filteredContent.@each.open'),
  
  separateLists: function() {
    return !this.get('isSearching') && this.get('sortProperties.firstObject') === 'name';
  }.property('sortProperties', 'isSearching'),
  
  changeSort: function() {
    var sort = this.get('sortValue.value'),
        property = 'name',
        ascending = true;
    
    if (sort === 'createdat') property = 'createdAt';
    if (sort === 'membersdesc' || sort === 'membersasc') property = 'memberCount';
    if (sort === 'createdat' || sort === 'membersdesc') ascending = false;
    
    this.set('sortProperties', [property]);
    this.set('sortAscending', ascending);    
  }.observes('sortValue')  
});
