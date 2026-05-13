import Fastify from 'fastify';

const app = Fastify({ logger: true });

app.get('/health', async () => ({ status: 'ok' }));
app.get('/v1/clients', async () => ({ items: [] }));
app.get('/v1/bookings', async () => ({ items: [] }));

app.listen({ port: Number(process.env.PORT ?? 4000), host: '0.0.0.0' }).catch((error) => {
  app.log.error(error);
  process.exit(1);
});
