import express from 'express';
import { authenticate, requireAuth, requireClientOwnership, requireRole } from './auth.js';
import { db } from './data.js';

export const app = express();
app.use(express.json());

app.post('/auth/login', (req, res) => {
  const { email, password } = req.body || {};
  const token = authenticate(email, password);
  if (!token) return res.status(401).json({ error: 'Invalid credentials' });
  return res.json({ accessToken: token, tokenType: 'Bearer', expiresIn: 3600 });
});

app.get('/portal/:clientId/records', requireAuth, requireClientOwnership((req) => req.params.clientId), (req, res) => {
  const records = db.portals.filter((p) => p.client_id === req.params.clientId);
  res.json(records);
});

app.get('/admin/bookings', requireAuth, requireRole('admin'), (req, res) => res.json(db.bookingManagement));
app.get('/admin/contact-assignments', requireAuth, requireRole('admin'), (req, res) => res.json(db.contactAssignments));
app.get('/admin/shoot-trackers', requireAuth, requireRole('admin'), (req, res) => res.json(db.shootTrackers));

app.get('/signed-documents/:id', requireAuth, (req, res, next) => {
  const doc = db.signedDocuments.find((d) => d.id === req.params.id);
  if (!doc) return res.status(404).json({ error: 'Not found' });
  req.resource = doc;
  return next();
}, requireClientOwnership((req) => req.resource.client_id), (req, res) => res.json(req.resource));

app.get('/galleries/:id', requireAuth, (req, res, next) => {
  const gallery = db.galleries.find((g) => g.id === req.params.id);
  if (!gallery) return res.status(404).json({ error: 'Not found' });
  req.resource = gallery;
  return next();
}, requireClientOwnership((req) => req.resource.client_id), (req, res) => res.json(req.resource));

if (import.meta.url === `file://${process.argv[1]}`) {
  app.listen(3000, () => console.log('API listening on :3000'));
}
