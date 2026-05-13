import type { IncomingMessage, ServerResponse } from 'node:http';
import { createServer } from 'node:http';

function handler(req: IncomingMessage, res: ServerResponse): void {
  if (req.url === '/health') {
    res.statusCode = 200;
    res.end('ok');
    return;
  }

  const routes: Record<string, string> = {
    '/auth/login': 'auth ok',
    '/bookings': 'bookings ok',
    '/contracts': 'contracts ok',
    '/gallery/selection': 'gallery ok',
  };

  if (req.url && routes[req.url]) {
    res.statusCode = 200;
    res.end(routes[req.url]);
    return;
  }

  res.statusCode = 404;
  res.end('not found');
}

export function buildServer() {
  return createServer(handler);
}
