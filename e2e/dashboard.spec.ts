import { test, expect } from '@playwright/test';

test('dashboard page flow', async ({ page }) => {
  // Login first
  await page.goto('/login');
  await page.fill('input[type="email"]', 'seed-admin@talentflow.invalid');
  await page.fill('input[type="password"]', 'SeedPassword123!');
  await page.click('button:has-text("Login")');
  await expect(page).toHaveURL('/dashboard');

  // Verify dashboard main sections
  await expect(page.locator('h1:has-text("Good morning")')).toBeVisible();
  await expect(page.locator('h2:has-text("Top Performing Jobs")')).toBeVisible();
  await expect(page.locator('h2:has-text("Pipeline Breakdown")')).toBeVisible();
  
  // Verify stats cards are present (Open Positions, Total Applications, Candidates Database, Hired / Offer)
  await expect(page.locator('text=Open Positions')).toBeVisible();
  await expect(page.locator('text=Total Applications')).toBeVisible();
  await expect(page.locator('text=Candidates Database')).toBeVisible();
  await expect(page.locator('text=Hired / Offer')).toBeVisible();

  // Test navigation via links on dashboard
  await page.click('a:has-text("View all jobs")');
  await expect(page).toHaveURL('/jobs');
});
