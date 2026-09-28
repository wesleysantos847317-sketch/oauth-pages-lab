export async function onRequest() {
  return new Response(
    JSON.stringify({
      status: 'ok',
      service: 'oauth-pages-lab',
      timestamp: new Date().toISOString(),
    }),
    {
      headers: {
        'Content-Type': 'application/json',
      },
      status: 200,
    }
  );
}
