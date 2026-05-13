import { defineWorkspace } from 'vitest/config';

export default defineWorkspace([
  'apps/api/vitest.config.ts',
  'apps/client/vitest.config.ts',
  'apps/admin/vitest.config.ts',
]);
