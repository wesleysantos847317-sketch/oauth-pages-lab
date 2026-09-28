import { generateState } from '../../_shared/crypto.js';
import { setCookie } from '../../_shared/cookies.js';
import { getProviderConfig, isSupportedProvider } from '../../_shared/providers.js';

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
  const config = getProviderConfig(provider, env);
  const redirectUri = new URL(`/oauth/callback/${provider}`, request.url).toString();

  const isDemoMode = !env.GITHUB_CLIENT_ID || env.GITHUB_CLIENT_ID === 'demo-github-client-id';

  if (isDemoMode) {
    const response = Response.redirect(`${new URL(`/oauth/callback/${provider}?code=demo-github-code&state=${state}`, request.url).toString()}`, 302);
    return setCookie(response, `oauth_state_${provider}`, state, {
      httpOnly: true,
      secure: isSecure,
      path: '/',
      sameSite: 'Lax',
    });
  }

  const paramsUrl = new URLSearchParams({
    client_id: config.clientId,
    redirect_uri: redirectUri,
    response_type: 'code',
    scope: config.scope,
    state,
  });

  const authorizeUrl = `${config.authorizeUrl}?${paramsUrl.toString()}`;
  const response = Response.redirect(authorizeUrl, 302);

  return setCookie(response, `oauth_state_${provider}`, state, {
    httpOnly: true,
    secure: isSecure,
    path: '/',
    sameSite: 'Lax',
  });
}
