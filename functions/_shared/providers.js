export const providers = {
  github: {
    name: 'GitHub',
    clientId: 'demo-github-client-id',
    clientSecret: 'demo-github-client-secret',
    authorizeUrl: 'https://github.com/login/oauth/authorize',
    tokenUrl: 'https://github.com/login/oauth/access_token',
    userApiUrl: 'https://api.github.com/user',
    emailsApiUrl: 'https://api.github.com/user/emails',
    scope: 'read:user user:email',
    responseType: 'code',
  },
};

export function getProviderConfig(provider, env = {}) {
  const config = providers[provider];
  if (!config) return null;

  return {
    ...config,
    clientId: env.GITHUB_CLIENT_ID || config.clientId,
    clientSecret: env.GITHUB_CLIENT_SECRET || config.clientSecret || '',
  };
}

export function isSupportedProvider(provider) {
  return Boolean(providers[provider]);
}
