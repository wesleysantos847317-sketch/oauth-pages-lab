export async function onRequest(context) {
  const request = context?.request ?? context ?? new Request('http://localhost/api/health');

  void request;

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
