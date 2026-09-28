import { clearCookie, getCookieValue, setCookie } from '../../_shared/cookies.js';
import { isSupportedProvider } from '../../_shared/providers.js';

export async function onRequest(context) {
  const { request, params } = context;
  const provider = params.provider;

  if (!isSupportedProvider(provider)) {
    return new Response(JSON.stringify({ error: 'Provider inválido' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const url = new URL(request.url);
  const incomingState = url.searchParams.get('state');
  const storedState = getCookieValue(request, `oauth_state_${provider}`);

  if (!incomingState || !storedState || incomingState !== storedState) {
    return new Response('Estado inválido ou não encontrado.', { status: 400 });
  }

  const payload = {
    name: `Usuário Demo ${provider.toUpperCase()}`,
    email: `${provider}-user@example.com`,
    provider,
  };

  const redirectResponse = Response.redirect(`${new URL('/', request.url).toString()}`, 302);
  const withUserCookie = setCookie(redirectResponse, 'oauth_user', JSON.stringify(payload), {
    httpOnly: true,
    secure: true,
    path: '/',
    sameSite: 'Lax',
  });

  return clearCookie(withUserCookie, `oauth_state_${provider}`);
}
