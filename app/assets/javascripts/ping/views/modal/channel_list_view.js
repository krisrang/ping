Ping.ChannelListView = Ping.ModalBodyView.extend({
  templateName: 'modal/channel_list',
  title: I18n.t('channel_list.title'),
  createTitle: I18n.t('channel_list.create'),
  createAction: 'editChannel'
});
