import { getProviderConfig } from './providers.js';

export function buildAuthorizeUrl(provider, request, state, codeChallenge, env = {}) {
  const config = getProviderConfig(provider, env);
  if (!config) {
    throw new Error(`Provider não suportado: ${provider}`);
  }

  const baseUrl = env.APP_URL ? new URL(`/oauth/callback/${provider}`, env.APP_URL).toString() : new URL(`/oauth/callback/${provider}`, request.url).toString();
  const params = new URLSearchParams({
    client_id: config.clientId,
    redirect_uri: baseUrl,
    response_type: config.responseType,
    scope: config.scope,
    state,
  });

  if (codeChallenge) {
    params.set('code_challenge', codeChallenge);
    params.set('code_challenge_method', 'S256');
  }

  return `${config.authorizeUrl}?${params.toString()}`;
}
