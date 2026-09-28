import { clearCookie, getCookieValue, setCookie } from '../../_shared/cookies.js';
import { getProviderConfig, isSupportedProvider } from '../../_shared/providers.js';

async function githubUserFromToken(accessToken) {
  const response = await fetch('https://api.github.com/user', {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      Accept: 'application/vnd.github+json',
      'User-Agent': 'oauth-pages-lab',
    },
  });

  if (!response.ok) {
    throw new Error('Erro ao buscar usuário do GitHub');
  }

  const user = await response.json();
  return {
    name: user.name || user.login,
    email: user.email || `${user.login}@github.local`,
    provider: 'github',
  };
}

export async function onRequest(context) {
  const { request, params, env } = context;
  const provider = params.provider;

  if (!isSupportedProvider(provider)) {
    return new Response(JSON.stringify({ error: 'Provider inválido' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const url = new URL(request.url);
  const code = url.searchParams.get('code');
  const state = url.searchParams.get('state');
  const storedState = getCookieValue(request, `oauth_state_${provider}`);
  const isSecure = new URL(request.url).protocol === 'https:';

  if (!state || !storedState || state !== storedState) {
    return new Response('Estado inválido ou não encontrado.', { status: 400 });
  }

  let payload;

  if (provider === 'github' && (!env.GITHUB_CLIENT_ID || env.GITHUB_CLIENT_ID === 'demo-github-client-id')) {
    payload = {
      name: 'Usuário Demo GitHub',
      email: 'github-user@example.com',
      provider: 'github',
    };
  } else {
    const config = getProviderConfig(provider, env);
    const tokenResponse = await fetch(config.tokenUrl, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded',
        'User-Agent': 'oauth-pages-lab',
      },
      body: new URLSearchParams({
        client_id: config.clientId,
        client_secret: config.clientSecret,
        code,
        redirect_uri: new URL(`/oauth/callback/${provider}`, request.url).toString(),
      }),
    });

    const tokenData = await tokenResponse.json();
    if (!tokenResponse.ok || !tokenData.access_token) {
      return new Response(JSON.stringify({ error: 'Falha ao autenticar com o GitHub.' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    payload = await githubUserFromToken(tokenData.access_token);
  }

  const redirectResponse = Response.redirect(`${new URL('/', request.url).toString()}`, 302);
  const withUserCookie = setCookie(redirectResponse, 'oauth_user', JSON.stringify(payload), {
    httpOnly: true,
    secure: isSecure,
    path: '/',
    sameSite: 'Lax',
  });

  return clearCookie(withUserCookie, `oauth_state_${provider}`, '/', { secure: isSecure });
}
