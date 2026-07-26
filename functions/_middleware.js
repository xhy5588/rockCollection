/** Force COOP/COEP so SharedArrayBuffer works (iOS Safari + mobile Chrome). */
export async function onRequest(context) {
  const response = await context.next();
  const headers = new Headers(response.headers);
  headers.set("Cross-Origin-Opener-Policy", "same-origin");
  headers.set("Cross-Origin-Embedder-Policy", "credentialless");
  headers.set("Cross-Origin-Resource-Policy", "same-origin");
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
}
