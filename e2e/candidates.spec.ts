import { test, expect } from '@playwright/test';

test.describe('Candidates Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
    await page.fill('input[type="email"]', 'seed-admin@talentflow.invalid');
    await page.fill('input[type="password"]', 'SeedPassword123!');
    await page.click('button:has-text("Login")');
    await expect(page).toHaveURL('/dashboard');
  });

  test('Candidates list, upload CV, and dossier view', async ({ page }) => {
    // Navigate to Candidates
    await page.click('a:has-text("Candidates")');
    await expect(page).toHaveURL('/candidates');
    await expect(page.locator('h1:has-text("Applications")')).toBeVisible();

    // Verify Upload CV button
    await expect(page.locator('button:has-text("Upload CV")')).toBeVisible();

    // Open Upload CV Modal
    await page.click('button:has-text("Upload CV")');
    const modal = page.locator('div[role="dialog"]:not([data-nextjs-dialog])');
    await expect(modal).toBeVisible();
    await expect(modal.locator('h2:has-text("Upload Candidate CV")')).toBeVisible();
    await expect(modal.locator('button:has-text("Cancel")')).toBeVisible();
    await modal.locator('button:has-text("Cancel")').click();
    await expect(modal).not.toBeVisible();

    // View specific candidate dossier
    // Assuming Charlie Le is in the list
    await page.click('tr:has-text("Seed Charlie Le")');
    await expect(page).toHaveURL(/\/candidates\/.+/);

    // Verify Candidate dossier renders
    await expect(page.locator('h1:has-text("Seed Charlie Le")')).toBeVisible();
    await expect(page.locator('h2:has-text("Application Info")')).toBeVisible();
    await expect(page.locator('button:has-text("Schedule Interview")')).toBeVisible();

    // Click Schedule Interview from dossier to check modal
    await page.click('button:has-text("Schedule Interview")');
    const scheduleModal = page.locator('div[role="dialog"]:not([data-nextjs-dialog])');
    await expect(scheduleModal).toBeVisible();
    await expect(scheduleModal.locator('h2:has-text("Schedule Interview")')).toBeVisible();
    await scheduleModal.locator('button:has-text("Cancel")').click();
    await expect(scheduleModal).not.toBeVisible();
  });
});
