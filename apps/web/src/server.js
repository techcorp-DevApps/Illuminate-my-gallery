import express from 'express';

const app = express();
const port = Number(process.env.PORT || 3000);

app.get('/healthz', (_req, res) => {
  res.status(200).json({ status: 'ok', service: 'web' });
});

app.get('/readyz', (_req, res) => {
  res.status(200).json({ status: 'ready', service: 'web' });
});

app.get('/', (_req, res) => {
  res.status(200).send('<h1>Illuminate My Gallery</h1>');
});

const isDirectRun = process.argv[1] && process.argv[1].endsWith('server.js');

if (isDirectRun) {
  app.listen(port, '0.0.0.0', () => {
    console.log(`Web listening on ${port}`);
  });
}

export default app;
