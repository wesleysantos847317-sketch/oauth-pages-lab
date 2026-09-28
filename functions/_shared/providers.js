export const providers = {
  google: {
    name: 'Google',
    clientId: 'demo-google-client-id',
    authorizeUrl: 'https://accounts.google.com/o/oauth2/v2/auth',
    scope: 'openid email profile',
    responseType: 'code',
  },
  github: {
    name: 'GitHub',
    clientId: 'demo-github-client-id',
    authorizeUrl: 'https://github.com/login/oauth/authorize',
    scope: 'read:user user:email',
    responseType: 'code',
  },
};

export function isSupportedProvider(provider) {
  return Boolean(providers[provider]);
}
