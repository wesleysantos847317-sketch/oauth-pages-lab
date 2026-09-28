import { createCodeChallenge, createNonce, generateState } from '../../_shared/crypto.js';
import { setCookie } from '../../_shared/cookies.js';
import { isDemoMode, isSupportedProvider } from '../../_shared/providers.js';
import { buildAuthorizeUrl } from '../../_shared/oidc.js';

export async function onRequest(context) {
  const { request, params, env } = context;
  const provider = params.provider;

  if (!isSupportedProvider(provider)) {
    return new Response(JSON.stringify({ error: 'Provider inválido' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const state = generateState();
  const isSecure = new URL(request.url).protocol === 'https:';
  const demoMode = isDemoMode(provider, env);

  let redirectUrl;
  let verifier;

  if (demoMode) {
    redirectUrl = new URL(`/oauth/callback/${provider}?code=demo-${provider}-code&state=${state}`, request.url).toString();
  } else {
    verifier = createNonce(64);
    const challenge = await createCodeChallenge(verifier);
    redirectUrl = buildAuthorizeUrl(provider, request, state, challenge, env);
  }

  let response = Response.redirect(redirectUrl, 302);
  response = setCookie(response, `oauth_state_${provider}`, state, {
    httpOnly: true,
    secure: isSecure,
    path: '/',
    sameSite: 'Lax',
  });

  if (!demoMode) {
    response = setCookie(response, `oauth_code_verifier_${provider}`, verifier, {
      httpOnly: true,
      secure: isSecure,
      path: '/',
      sameSite: 'Lax',
    });
  }

  return response;
}
