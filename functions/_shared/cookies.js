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

function cloneResponseWithCookie(response, cookieValue) {
  const headers = new Headers(response.headers);
  headers.append('Set-Cookie', cookieValue);

  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
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

  return cloneResponseWithCookie(response, parts.join('; '));
}

export function clearCookie(response, name, path = '/', options = {}) {
  const cookieOptions = {
    sameSite: 'Lax',
    httpOnly: true,
    secure: true,
    ...options,
  };

  const parts = [`${name}=`, `Path=${path}`, `Max-Age=0`];

  if (cookieOptions.sameSite) parts.push(`SameSite=${cookieOptions.sameSite}`);
  if (cookieOptions.httpOnly) parts.push('HttpOnly');
  if (cookieOptions.secure) parts.push('Secure');

  return cloneResponseWithCookie(response, parts.join('; '));
}
