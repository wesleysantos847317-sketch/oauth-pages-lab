import { getCookieValue } from '../_shared/cookies.js';

export async function onRequest(context) {
  const request = context?.request ?? context;
  const userCookie = getCookieValue(request, 'oauth_user');

  if (!userCookie) {
    return new Response(JSON.stringify({ error: 'Não autenticado' }), {
      status: 401,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  try {
    const user = JSON.parse(userCookie);
    return new Response(
      JSON.stringify({
        user,
        authenticated: true,
      }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Cookie inválido' }), {
      status: 400,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}
