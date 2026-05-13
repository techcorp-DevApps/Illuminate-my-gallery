import { expect, test } from '@playwright/test';

test('client login and private portal access', async ({ page }) => {
  await page.goto('/login');
  await page.getByLabel('Email').fill('client@example.com');
  await page.getByLabel('Password').fill('password');
  await page.getByRole('button', { name: 'Sign in' }).click();

  await expect(page).toHaveURL(/portal/);
  await expect(page.getByRole('heading', { name: 'Private Client Portal' })).toBeVisible();
});
