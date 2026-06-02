import { test, expect } from '@playwright/test';

test('team page flow', async ({ page }) => {
  // Login first
  await page.goto('/login');
  await page.fill('input[type="email"]', 'seed-admin@talentflow.invalid');
  await page.fill('input[type="password"]', 'SeedPassword123!');
  await page.click('button:has-text("Login")');
  await expect(page).toHaveURL('/dashboard');

  // Go to team page
  await page.goto('/team');
  await expect(page).toHaveURL('/team');
  
  // Check if team page renders correctly
  await expect(page.locator('h1:has-text("Team Directory")')).toBeVisible();
  
  // Wait for table to load
  await expect(page.locator('table')).toBeVisible();
});
