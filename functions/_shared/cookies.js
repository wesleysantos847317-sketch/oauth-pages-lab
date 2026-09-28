export function getCookieValue(request, name) {
  const cookieHeader = request.headers.get('Cookie') || '';
  const cookiePairs = cookieHeader.split(';').map((item) => item.trim());

  for (const pair of cookiePairs) {
    const [key, ...rest] = pair.split('=');
    if (key === name) {
      return decodeURIComponent(rest.join('='));
    }
  }

  return null;
}

export function setCookie(response, name, value, options = {}) {
  const cookieOptions = {
    path: '/',
    sameSite: 'Lax',
    httpOnly: true,
    secure: true,
    ...options,
  };

  const parts = [`${name}=${encodeURIComponent(value)}`];

  if (cookieOptions.maxAge) parts.push(`Max-Age=${cookieOptions.maxAge}`);
  if (cookieOptions.path) parts.push(`Path=${cookieOptions.path}`);
  if (cookieOptions.domain) parts.push(`Domain=${cookieOptions.domain}`);
  if (cookieOptions.sameSite) parts.push(`SameSite=${cookieOptions.sameSite}`);
  if (cookieOptions.httpOnly) parts.push('HttpOnly');
  if (cookieOptions.secure) parts.push('Secure');

  response.headers.append('Set-Cookie', parts.join('; '));
  return response;
}

export function clearCookie(response, name, path = '/') {
  response.headers.append('Set-Cookie', `${name}=; Path=${path}; HttpOnly; Secure; SameSite=Lax; Max-Age=0`);
  return response;
}
