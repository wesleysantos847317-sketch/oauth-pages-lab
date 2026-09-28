import { clearCookie, getCookieValue, setCookie } from '../../_shared/cookies.js';
import { getProviderConfig, isSupportedProvider } from '../../_shared/providers.js';

async function loadGitHubUser(accessToken) {
  const userResponse = await fetch('https://api.github.com/user', {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      Accept: 'application/vnd.github+json',
      'User-Agent': 'oauth-pages-lab',
    },
  });

  if (!userResponse.ok) {
    throw new Error(`Erro ao buscar usuário do GitHub: ${userResponse.status}`);
  }

  const user = await userResponse.json();
  const emailUrl = 'https://api.github.com/user/emails';
  let email = user.email || '';

  if (!email) {
    const emailResponse = await fetch(emailUrl, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: 'application/vnd.github+json',
        'User-Agent': 'oauth-pages-lab',
      },
    });

    if (emailResponse.ok) {
      const emailList = await emailResponse.json();
      const primaryEmail = emailList.find((entry) => entry.primary && entry.verified) || emailList[0];
      email = primaryEmail?.email || '';
    }
  }

  return {
    name: user.name || user.login,
    email: email || `${user.login}@github.local`,
    login: user.login,
    avatar: user.avatar_url,
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
  const incomingState = url.searchParams.get('state');
  const code = url.searchParams.get('code');
  const storedState = getCookieValue(request, `oauth_state_${provider}`);
  const isSecure = new URL(request.url).protocol === 'https:';

  if (!incomingState || !storedState || incomingState !== storedState) {
    return new Response('Estado inválido ou não encontrado.', { status: 400 });
  }

  let payload;

  if (provider === 'github') {
    const config = getProviderConfig(provider, env);
    const verifier = getCookieValue(request, `oauth_code_verifier_${provider}`);
    const redirectUri = env.APP_URL ? new URL(`/oauth/callback/${provider}`, env.APP_URL).toString() : new URL(`/oauth/callback/${provider}`, request.url).toString();

    if (!code) {
      return new Response('Código de autorização ausente.', { status: 400 });
    }

    if (config.clientId === 'demo-github-client-id' || !config.clientSecret || config.clientSecret === 'demo-github-client-secret') {
      payload = {
        name: `Usuário Demo ${provider.toUpperCase()}`,
        email: `${provider}-user@example.com`,
        provider,
      };
    } else {
      if (!verifier) {
        return new Response('Verificador PKCE não encontrado.', { status: 400 });
      }

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
          redirect_uri: redirectUri,
          code_verifier: verifier,
        }),
      });

      const tokenData = await tokenResponse.json();
      if (!tokenResponse.ok || !tokenData.access_token) {
        return new Response(JSON.stringify({ error: tokenData?.error_description || 'Falha ao trocar código por token.' }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        });
      }

      payload = await loadGitHubUser(tokenData.access_token);
    }
  } else {
    payload = {
      name: `Usuário Demo ${provider.toUpperCase()}`,
      email: `${provider}-user@example.com`,
      provider,
    };
  }

  const redirectResponse = Response.redirect(`${new URL('/', request.url).toString()}`, 302);
  const withUserCookie = setCookie(redirectResponse, 'oauth_user', JSON.stringify(payload), {
    httpOnly: true,
    secure: isSecure,
    path: '/',
    sameSite: 'Lax',
  });

  let cleaned = clearCookie(withUserCookie, `oauth_state_${provider}`, '/', { secure: isSecure });
  cleaned = clearCookie(cleaned, `oauth_code_verifier_${provider}`, '/', { secure: isSecure });

  return cleaned;
}
