import 'server-only';
import { AuthServerError } from './authServerError';

export async function readAuthRequest(request: Request): Promise<unknown> {
  const origin = request.headers.get('origin');
  const target = new URL(request.url);
  // Next may normalize the internal URL host. Host reflects the browser origin;
  // unlike forwarding headers it cannot be supplied by browser JavaScript.
  target.host = request.headers.get('host') || target.host;
  if (
    origin !== target.origin ||
    request.headers.get('sec-fetch-site') === 'cross-site'
  ) {
    throw new AuthServerError(
      'Request origin is not allowed.',
      403,
      'forbidden',
    );
  }
  const contentType = request.headers
    .get('content-type')
    ?.split(';')[0]
    ?.trim();
  if (contentType !== 'application/json') {
    throw new AuthServerError('Send a JSON request.', 415, 'request');
  }
  const reader = request.body?.getReader();
  if (!reader)
    throw new AuthServerError('Missing request body.', 400, 'request');
  const chunks: Uint8Array[] = [];
  let size = 0;
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    size += value.byteLength;
    if (size > 8192) {
      await reader.cancel();
      throw new AuthServerError('Request body is too large.', 413, 'request');
    }
    chunks.push(value);
  }
  const bytes = new Uint8Array(size);
  let offset = 0;
  for (const chunk of chunks) {
    bytes.set(chunk, offset);
    offset += chunk.length;
  }
  try {
    return JSON.parse(new TextDecoder().decode(bytes)) as unknown;
  } catch {
    throw new AuthServerError('Invalid JSON request.', 400, 'request');
  }
}
