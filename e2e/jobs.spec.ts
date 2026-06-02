import { test, expect } from '@playwright/test';

test.describe('Jobs Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
    await page.fill('input[type="email"]', 'seed-admin@talentflow.invalid');
    await page.fill('input[type="password"]', 'SeedPassword123!');
    await page.click('button:has-text("Login")');
    await expect(page).toHaveURL('/dashboard');
  });

  test('Jobs list, view detail, and edit modal', async ({ page }) => {
    // Navigate to Jobs
    await page.click('a:has-text("Jobs")');
    await expect(page).toHaveURL('/jobs');
    await expect(page.locator('h1:has-text("Jobs")')).toBeVisible();

    // Verify Create Job button
    await expect(page.locator('button:has-text("Create Job")')).toBeVisible();

    // Navigate to Job details
    await page.click('tr:has-text("Senior Backend Engineer")');
    await expect(page).toHaveURL(/\/jobs\/.+/);
    
    // Verify Job details rendered
    await expect(page.locator('h1:has-text("Senior Backend Engineer")')).toBeVisible();
    await expect(page.locator('button:has-text("Edit")')).toBeVisible();
    await expect(page.locator('button:has-text("Close Job")')).toBeVisible();

    // Open Edit Modal
    await page.click('button:has-text("Edit")');
    
    // Check Modal rendered
    const modal = page.locator('div[role="dialog"]:not([data-nextjs-dialog])');
    await expect(modal).toBeVisible();
    await expect(modal.locator('h2:has-text("Edit Job")')).toBeVisible();
    await expect(modal.locator('input[name="title"]')).toHaveValue('Senior Backend Engineer');

    // Close Modal
    await modal.locator('button:has-text("Cancel")').click();
    await expect(modal).not.toBeVisible();
  });
});
