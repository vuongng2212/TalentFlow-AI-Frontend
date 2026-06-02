import { test, expect } from '@playwright/test';

test('login flow', async ({ page }) => {
  await page.goto('/login');
  
  // Fill in login form
  await page.fill('input[type="email"]', 'seed-admin@talentflow.invalid');
  await page.fill('input[type="password"]', 'SeedPassword123!');
  
  // Submit
  await page.click('button:has-text("Login")');
  
  // Should redirect to dashboard
  await expect(page).toHaveURL('/dashboard');
  
  // Check if Sidebar renders correctly
  await expect(page.locator('aside.sidebar')).toBeVisible();
  
  // Check if Admin link is visible for admin user
  await expect(page.locator('a:has-text("Settings")')).toBeVisible();
});
