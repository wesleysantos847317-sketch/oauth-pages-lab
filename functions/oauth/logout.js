import { clearCookie } from '../_shared/cookies.js';

export async function onRequest(context) {
  const request = context?.request ?? context ?? new Request('http://localhost/oauth/logout');
  const isSecure = new URL(request.url).protocol === 'https:';
  let response = Response.redirect(new URL('/', request.url).toString(), 302);

  response = clearCookie(response, 'oauth_user', '/', { secure: isSecure });
  response = clearCookie(response, 'oauth_state_github', '/', { secure: isSecure });

  return response;
}
