export default {
  UI: {
    LABELS: {
      title: 'SAFE WebRTC Signalling',
      activePubName: 'Active public name',
      newVideoCall: 'New Video Call',
      invites: 'Invites',
    },
    BOOTSTRAP_MSG: {
      authorise: 'Authorising with Authenticator',
      authoriseFail: 'Failed to authorising with Authenticator',
      initialise: 'Initialising application',
      initialiseFail: 'Failed to initialise application',
      noPubNameFound: 'No public name found. Please register and try access this application.',
      fetchPublicName: 'Fetching Public Names',
      fetchPublicNameFail: 'Unable to fetching Public Names',
      fetchInvites: 'Fetching Invites',
      fetchInvitesFail: 'Unable to fetching Invites',
      activatePublicName: 'Activating public name',
      activatePublicNameFail: 'Failed to activate public name',
      connecting: 'Connecting with friend',
      connectingFail: 'Failed to connect with friend',
      invalidPublicName: 'Invalid Public Name',
      cantInviteYourself: 'Can\'t invite yourself' ,
    },
    DEFAULT_LOADING_DESC: 'Please wait...',
    CONN_MSGS: {
      INIT: 'Initialising connection',
      SEND_INVITE: 'Invite sent. Waiting for the remote peer to accept the connection',
      INVITE_ACCEPTED: 'Invite accepted. Establishing connection with remote',
      CALLING: 'Remote accepted the invite. Establishing connection with remote',
    },
    CONN_TIMER_INTERVAL: 2000,
    TIMER_INTERVAL: {
      FETCH_INVITES_POLL: 5000,
      CONNECTION_POLL: 4000,
    },
  },
  CONFIG: {
    SERVER: {
      iceServers: [
        { url: 'STUN_SERVER_URL' }, // fill STUN Server url
        {
          url: 'TURN_SERVER_URL', // fill turn server url
          credential: 'PASSWORD', // fill turn server password
          username: 'USERNAME' // fill turn server username
        },
      ]
    },
    OFFER: {
      offerToReceiveAudio: 1,
      offerToReceiveVideo: 1
    },
    MEDIA_OFFER: {
      audio: true,
      video: true
    },
  },
  USER_POSITION: {
    CALLER: 'CALLER',
    CALLEE: 'CALLEE',
  },
  CONN_STATE: {
    INIT: 'INIT',
    SEND_INVITE: 'SEND_INVITE',
    INVITE_ACCEPTED: 'INVITE_ACCEPTED',
    CALLING: 'CALLING',
    CONNECTED: 'CONNECTED',
  },
  NET_STATE: {
    INIT: 'Init',
    DISCONNECTED: 'Disconnected',
    CONNECTED: 'Connected',
    UNKNOWN: 'Unknown',
  },
  PERMISSIONS: {
    READ: 'Read',
    INSERT: 'Insert',
    UPDATE: 'Update',
  },
  MD_KEY: '@webrtcSignalSample',
  SELECTED_PUB_NAME_KEY: 'selected_pub_name',
  MD_META_KEY: '_metadata',
  TYPE_TAG: {
    CHANNEL: 15005,
    DNS: 15001,
  },
  CRYPTO_KEYS: {
    SEC_SIGN_KEY: '__SEC_SIGN_KEY__',
    PUB_SIGN_KEY: '__PUB_SIGN_KEY__',
    SEC_ENC_KEY: '__SEC_ENC_KEY__',
    PUB_ENC_KEY: '__PUB_ENC_KEY__',
  },
};
