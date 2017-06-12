import pkg from '../package.json';

export default {
  typeTag: 15001,
  keyTar: {
    service: 'WEB_HOST_MANAGER',
    account: 'SAFE_USER'
  },
  appInfo: {
    data: {
      id: pkg.identifier,
      scope: null,
      name: pkg.name,
      vendor: pkg.author.name
    },
    opt: {
      own_container: false
    },
    permissions: {
      _public: [
        'Read',
        'Insert',
        'Update',
        'Delete',
        'ManagePermissions'
      ],
      _publicNames: [
        'Read',
        'Insert',
        'Update',
        'Delete',
        'ManagePermissions'
      ]
    }
  },
  accessContainers: {
    public: '_public',
    publicNames: '_publicNames'
  },
  authResponseType: {
    containers: 'containers',
    revoked: 'revoked'
  }
};
