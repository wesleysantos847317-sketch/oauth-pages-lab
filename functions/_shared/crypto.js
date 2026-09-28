export function createNonce(length = 32) {
  const values = new Uint8Array(length);
  crypto.getRandomValues(values);

  return Array.from(values)
    .map((byte) => byte.toString(16).padStart(2, '0'))
    .join('');
}

export function generateState(length = 16) {
  return createNonce(length);
}

export async function createCodeChallenge(verifier) {
  const encoder = new TextEncoder();
  const data = encoder.encode(verifier);
  const hash = await crypto.subtle.digest('SHA-256', data);

  return btoa(String.fromCharCode(...new Uint8Array(hash)))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/g, '');
}
