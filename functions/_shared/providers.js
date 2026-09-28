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
  if (!config) {
    return null;
  }

  const envKey = provider.toUpperCase();

  return {
    ...config,
    clientId: env[`${envKey}_CLIENT_ID`] || config.clientId,
    clientSecret: env[`${envKey}_CLIENT_SECRET`] || config.clientSecret || '',
  };
}

export function isDemoMode(provider, env = {}) {
  const config = getProviderConfig(provider, env);
  if (!config) {
    return false;
  }

  const envKey = provider.toUpperCase();
  const envClientId = env[`${envKey}_CLIENT_ID`];

  return !envClientId || config.clientId.startsWith('demo-') || !config.clientSecret;
}

export function isSupportedProvider(provider) {
  return Boolean(providers[provider]);
}
