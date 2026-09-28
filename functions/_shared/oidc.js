import { providers } from './providers.js';

export function buildAuthorizeUrl(provider, request, state, codeChallenge) {
  const config = providers[provider];
  if (!config) {
    throw new Error(`Provider não suportado: ${provider}`);
  }

  const redirectUri = new URL(`/oauth/callback/${provider}`, request.url).toString();
  const params = new URLSearchParams({
    client_id: config.clientId,
    redirect_uri: redirectUri,
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
