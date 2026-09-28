import { clearCookie } from '../_shared/cookies.js';

export async function onRequest(request) {
  let response = Response.redirect(new URL('/', request.url).toString(), 302);
  response = clearCookie(response, 'oauth_user');
  response = clearCookie(response, 'oauth_state_google');
  response = clearCookie(response, 'oauth_state_github');
  return response;
}
