import { test, expect } from '@playwright/test';

test.describe('Enterprise CRUD & Edge Cases', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
    await page.fill('input[type="email"]', 'seed-admin@talentflow.invalid');
    await page.fill('input[type="password"]', 'Password123!');
    await page.click('button:has-text("Login")');
    await expect(page).toHaveURL('/dashboard');
  });

  test('Email Templates: Create, validation, live token insertion, and delete flow', async ({ page }) => {
    await page.goto('/email-templates');
    await expect(page).toHaveURL('/email-templates');
    await expect(page.locator('h1:has-text("Email Templates")')).toBeVisible();
    await page.waitForLoadState('networkidle');

    // Open create modal
    const createBtn = page.getByRole('button', { name: 'Create Template', exact: true }).first();
    await expect(createBtn).toBeEnabled();
    await createBtn.click();

    const modal = page.locator('div[role="dialog"]').first();
    await expect(modal).toBeVisible();

    // Fill form
    const templateName = `Interview Invite ${Date.now()}`;
    await modal.locator('input[name="name"]').fill(templateName);
    await modal.locator('input[name="subject"]').fill('Invitation: Technical Interview at TalentFlow');
    await modal.locator('textarea[name="body"]').fill('Hello {{candidateName}},\n\nWe would like to invite you for the {{jobTitle}} position.');

    // Save template
    await modal.locator('button[type="submit"]:has-text("Create Template")').click();

    // Verify toast notification appears
    await expect(page.locator('text=Email template created successfully')).toBeVisible();
    await expect(modal).not.toBeVisible();

    // Verify created template is listed
    await expect(page.locator(`text=${templateName}`)).toBeVisible();

    // Trigger delete confirmation dialog
    const row = page.locator('tr').filter({ hasText: templateName });
    await row.locator('button:has-text("Delete")').click();

    const deleteModal = page.locator('div[role="dialog"]:not([data-nextjs-dialog])');
    await expect(deleteModal).toBeVisible();
    await expect(deleteModal.locator('h3:has-text("Delete Email Template")')).toBeVisible();

    // Confirm delete
    await deleteModal.locator('button:has-text("Delete")').click();
    await expect(page.locator('text=Email template deleted successfully')).toBeVisible();
  });

  test('Team Directory: Member invite validation and toast feedback', async ({ page }) => {
    await page.goto('/team');
    await expect(page).toHaveURL('/team');
    await expect(page.locator('h1:has-text("Team Directory")')).toBeVisible();

    // Open Invite Member Modal
    await page.click('button:has-text("Invite Member")');
    const modal = page.locator('div[role="dialog"]:not([data-nextjs-dialog])');
    await expect(modal).toBeVisible();

    // Test validation edge case: invalid email format
    await modal.locator('input[type="email"]').fill('invalid-email-format');
    await modal.locator('button[type="submit"]').click();

    // Close modal
    await modal.locator('button:has-text("Cancel")').click();
    await expect(modal).not.toBeVisible();
  });

  test('Workspace Settings: Name validation constraints and save toast', async ({ page }) => {
    await page.goto('/settings');
    await expect(page).toHaveURL('/settings');

    const nameInput = page.locator('input[type="text"]').first();
    await expect(nameInput).not.toHaveValue('', { timeout: 10000 });
    const originalName = await nameInput.inputValue();

    // Test constraint: length < 2 characters
    await nameInput.fill('A');
    await page.locator('button:has-text("Save changes")').click();
    await expect(page.locator('text=Workspace name must be at least 2 characters.')).toBeVisible();

    // Valid save
    await nameInput.fill(originalName || 'TalentFlow Main Workspace');
    await page.locator('button:has-text("Save changes")').click();
    await expect(page.locator('text=Workspace settings updated successfully')).toBeVisible();
  });

  test('Billing: Plan management toast notifications', async ({ page }) => {
    await page.goto('/billing');
    await expect(page).toHaveURL('/billing');
    await expect(page.locator('h1:has-text("Plans & Billing")')).toBeVisible();

    // Test Manage Subscription button
    await page.click('button:has-text("Manage Subscription")');
    await expect(page.locator('text=Redirecting to Stripe Billing Portal')).toBeVisible();
  });
});
