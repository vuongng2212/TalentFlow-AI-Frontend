import { test, expect } from '@playwright/test';

test.describe('Interviews Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
    await page.fill('input[type="email"]', 'seed-admin@talentflow.invalid');
    await page.fill('input[type="password"]', 'SeedPassword123!');
    await page.click('button:has-text("Login")');
    await expect(page).toHaveURL('/dashboard');
  });

  test('Interviews list, scheduling, and feedback form', async ({ page }) => {
    // Navigate to Interviews
    await page.click('a:has-text("Interviews")');
    await expect(page).toHaveURL('/interviews');
    await expect(page.locator('h1:has-text("Interview Queue")')).toBeVisible();

    // Verify interview cards are visible
    await expect(page.locator('h3:has-text("Seed Alice Nguyen")').first()).toBeVisible();

    // Open Schedule Interview Modal
    await page.click('button:has-text("Schedule Interview")');
    const modal = page.locator('div[role="dialog"]:not([data-nextjs-dialog])');
    await expect(modal).toBeVisible();
    await expect(modal.locator('h2:has-text("Schedule Interview")')).toBeVisible();

    // Close modal
    await modal.locator('button:has-text("Cancel")').click();
    await expect(modal).not.toBeVisible();

    // Test feedback form interaction
    await page.selectOption('select', { label: 'Strong hire' });
    await page.fill('textarea', 'Excellent system design skills.');
    await page.click('button:has-text("Save Feedback")');

    // Verify success message
    await expect(page.locator('text=Feedback submitted successfully!')).toBeVisible();
  });
});
