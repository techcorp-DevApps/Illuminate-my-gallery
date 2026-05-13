import Fastify from 'fastify';

const app = Fastify({ logger: true });

app.get('/health', async () => ({ status: 'ok' }));
app.get('/v1/clients', async () => ({ items: [] }));
app.get('/v1/bookings', async () => ({ items: [] }));

app.listen({ port: Number(process.env.PORT ?? 4000), host: '0.0.0.0' }).catch((error) => {
  app.log.error(error);
  process.exit(1);
});
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
