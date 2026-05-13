import { expect, test } from '@playwright/test';

test('contract inbox -> sign -> documents move', async ({ page }) => {
  await page.goto('/portal/contracts');
  await page.getByRole('button', { name: 'Open Contract' }).click();
  await page.getByRole('button', { name: 'Sign Contract' }).click();

  await expect(page.getByText('Status: Signed')).toBeVisible();
  await page.goto('/portal/documents');
  await expect(page.getByText('Signed Contract.pdf')).toBeVisible();
});
