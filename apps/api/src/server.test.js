process.env.START_SERVER = 'false';
import test from 'node:test';
import assert from 'node:assert/strict';
import app from './server.js';

test('GET /healthz returns ok', async () => {
  const server = app.listen(0);
  const addr = server.address();
  const res = await fetch(`http://127.0.0.1:${addr.port}/healthz`);
  const data = await res.json();
  assert.equal(res.status, 200);
  assert.equal(data.status, 'ok');
  server.close();
});
