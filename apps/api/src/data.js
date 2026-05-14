import bcrypt from 'bcryptjs';

export const db = {
  users: [
    {
      id: 'u-client-1',
      email: 'client@example.com',
      passwordHash: bcrypt.hashSync('ClientPass123!', 10),
      role: 'client',
      clientId: 'client-1'
    },
    {
      id: 'u-admin-1',
      email: 'admin@example.com',
      passwordHash: bcrypt.hashSync('AdminPass123!', 10),
      role: 'admin',
      clientId: null
    }
  ],
  portals: [
    { id: 'portal-1', client_id: 'client-1', name: 'Wedding Gallery' },
    { id: 'portal-2', client_id: 'client-2', name: 'Private Family Shoot' }
  ],
  signedDocuments: [
    { id: 'doc-1', client_id: 'client-1', title: 'Contract A' },
    { id: 'doc-2', client_id: 'client-2', title: 'Contract B' }
  ],
  galleries: [
    { id: 'gallery-1', client_id: 'client-1', title: 'Preview A' },
    { id: 'gallery-2', client_id: 'client-2', title: 'Preview B' }
  ],
  bookingManagement: [{ id: 'booking-1' }],
  contactAssignments: [{ id: 'contact-1' }],
  shootTrackers: [{ id: 'shoot-1' }]
};

export function findUserByEmail(email) {
  return db.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
}
