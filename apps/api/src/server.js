import express from 'express';

const app = express();
const port = Number(process.env.PORT || 8080);

app.get('/healthz', (_req, res) => {
  res.status(200).json({ status: 'ok', service: 'api' });
});

app.get('/readyz', (_req, res) => {
  res.status(200).json({ status: 'ready', service: 'api' });
});

app.get('/api/v1/ping', (_req, res) => {
  res.status(200).json({ message: 'pong' });
});

const isDirectRun = process.argv[1] && process.argv[1].endsWith('server.js');

if (isDirectRun) {
  app.listen(port, '0.0.0.0', () => {
    console.log(`API listening on ${port}`);
  });
}

export default app;
