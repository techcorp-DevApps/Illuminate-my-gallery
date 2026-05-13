import request from 'supertest';
import { describe, expect, it } from 'vitest';

import { buildServer } from '../server';

describe('api integration routes', () => {
  it.each(['/auth/login', '/bookings', '/contracts', '/gallery/selection'])(
    'returns 200 for %s',
    async (route) => {
      const app = buildServer();
      const response = await request(app).get(route);

      expect(response.status).toBe(200);
    },
  );
});
