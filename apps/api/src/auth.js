import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { findUserByEmail } from './data.js';

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-change-me';
const EXPIRES_IN = '1h';

export function authenticate(email, password) {
  const user = findUserByEmail(email);
  if (!user) return null;
  const ok = bcrypt.compareSync(password, user.passwordHash);
  if (!ok) return null;
  return signSession(user);
}

export function signSession(user) {
  return jwt.sign(
    { sub: user.id, role: user.role, clientId: user.clientId, email: user.email },
    JWT_SECRET,
    { expiresIn: EXPIRES_IN, issuer: 'illuminate-api', audience: 'illuminate-apps' }
  );
}

export function requireAuth(req, res, next) {
  const authHeader = req.headers.authorization || '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;
  if (!token) return res.status(401).json({ error: 'Unauthorized' });
  try {
    req.auth = jwt.verify(token, JWT_SECRET, { issuer: 'illuminate-api', audience: 'illuminate-apps' });
    return next();
  } catch {
    return res.status(401).json({ error: 'Unauthorized' });
  }
}

export function requireRole(...roles) {
  return (req, res, next) => {
    if (!req.auth || !roles.includes(req.auth.role)) {
      return res.status(403).json({ error: 'Forbidden' });
    }
    return next();
  };
}

export function requireClientOwnership(getClientId) {
  return (req, res, next) => {
    if (!req.auth) return res.status(401).json({ error: 'Unauthorized' });
    if (req.auth.role === 'admin') return next();
    const resourceClientId = getClientId(req);
    if (req.auth.clientId !== resourceClientId) {
      return res.status(403).json({ error: 'Forbidden' });
    }
    return next();
  };
}
