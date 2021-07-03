module.exports = async () => {
  const actions = [
    {
      section: 'plugins',
      displayName: 'Access the Acoustic Newsletters',
      uid: 'access-permission',
      pluginName: 'acoustic-newsletters',
    },
    {
      section: 'plugins',
      displayName: 'Edit',
      uid: 'edit-permission',
      pluginName: 'acoustic-newsletters',
    },
    {
      section: 'plugins',
      displayName: 'Send',
      uid: 'send-permission',
      pluginName: 'acoustic-newsletters',
    },
  ];

  await strapi.admin.services.permission.actionProvider.registerMany(actions);
}