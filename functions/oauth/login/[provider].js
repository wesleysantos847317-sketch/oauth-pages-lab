import { generateState } from '../../_shared/crypto.js';
import { setCookie } from '../../_shared/cookies.js';
import { isSupportedProvider } from '../../_shared/providers.js';
import { buildAuthorizeUrl } from '../../_shared/oidc.js';

export async function onRequest(context) {
  const { request, params } = context;
  const provider = params.provider;

  if (!isSupportedProvider(provider)) {
    return new Response(JSON.stringify({ error: 'Provider inválido' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const state = generateState();
  const challenge = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(state));
  const codeChallenge = btoa(String.fromCharCode(...new Uint8Array(challenge)))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/g, '');

  const authorizeUrl = buildAuthorizeUrl(provider, request, state, codeChallenge);
  const response = Response.redirect(authorizeUrl, 302);

  return setCookie(response, `oauth_state_${provider}`, state, {
    httpOnly: true,
    secure: true,
    path: '/',
    sameSite: 'Lax',
  });
}
