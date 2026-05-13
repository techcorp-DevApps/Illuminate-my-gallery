import { expect, test } from '@playwright/test';

test('admin booking and tracker updates reflected client-side', async ({ browser }) => {
  const adminContext = await browser.newContext();
  const clientContext = await browser.newContext();

  const adminPage = await adminContext.newPage();
  await adminPage.goto('/admin/bookings');
  await adminPage.getByRole('button', { name: 'Confirm Booking #1001' }).click();
  await adminPage.getByRole('button', { name: 'Update Tracker' }).click();

  const clientPage = await clientContext.newPage();
  await clientPage.goto('/portal/tracker');
  await clientPage.reload();

  await expect(clientPage.getByText('Booking #1001 - Confirmed')).toBeVisible();

  await adminContext.close();
  await clientContext.close();
});
