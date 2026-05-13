import test from 'node:test';
import assert from 'node:assert/strict';
import request from 'supertest';
import { app } from '../src/server.js';

async function login(email, password) {
  const res = await request(app).post('/auth/login').send({ email, password });
  assert.equal(res.status, 200);
  return res.body.accessToken;
}

test('seed users can authenticate', async () => {
  const clientToken = await login('client@example.com', 'ClientPass123!');
  const adminToken = await login('admin@example.com', 'AdminPass123!');
  assert.ok(clientToken);
  assert.ok(adminToken);
});

test('client can only access own portal records', async () => {
  const token = await login('client@example.com', 'ClientPass123!');
  const own = await request(app).get('/portal/client-1/records').set('Authorization', `Bearer ${token}`);
  assert.equal(own.status, 200);
  const other = await request(app).get('/portal/client-2/records').set('Authorization', `Bearer ${token}`);
  assert.equal(other.status, 403);
});

test('admin-only endpoints reject client and allow admin', async () => {
  const clientToken = await login('client@example.com', 'ClientPass123!');
  const adminToken = await login('admin@example.com', 'AdminPass123!');

  const deny = await request(app).get('/admin/bookings').set('Authorization', `Bearer ${clientToken}`);
  assert.equal(deny.status, 403);

  const allow = await request(app).get('/admin/bookings').set('Authorization', `Bearer ${adminToken}`);
  assert.equal(allow.status, 200);
});

test('signed documents and galleries enforce strict ownership', async () => {
  const token = await login('client@example.com', 'ClientPass123!');

  const docOK = await request(app).get('/signed-documents/doc-1').set('Authorization', `Bearer ${token}`);
  assert.equal(docOK.status, 200);

  const docDeny = await request(app).get('/signed-documents/doc-2').set('Authorization', `Bearer ${token}`);
  assert.equal(docDeny.status, 403);

  const galleryOK = await request(app).get('/galleries/gallery-1').set('Authorization', `Bearer ${token}`);
  assert.equal(galleryOK.status, 200);

  const galleryDeny = await request(app).get('/galleries/gallery-2').set('Authorization', `Bearer ${token}`);
  assert.equal(galleryDeny.status, 403);
});

test('unauthorized requests are rejected', async () => {
  const res = await request(app).get('/admin/bookings');
  assert.equal(res.status, 401);
});
