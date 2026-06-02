# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: jobs.spec.ts >> Jobs Flow >> Jobs list, view detail, and edit modal
- Location: e2e/jobs.spec.ts:12:7

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: locator('div[role="dialog"]:not([data-nextjs-dialog])').locator('h2:has-text("Edit Job")')
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 5000ms
  - waiting for locator('div[role="dialog"]:not([data-nextjs-dialog])').locator('h2:has-text("Edit Job")')

```

```yaml
- complementary:
  - link "TF TalentFlow AI":
    - /url: /
  - text: Current Tenant Acme Corp HQ
  - navigation:
    - text: Recruitment
    - link "Dashboard":
      - /url: /dashboard
      - img
      - text: Dashboard
    - link "Jobs":
      - /url: /jobs
      - img
      - text: Jobs
    - link "Candidates":
      - /url: /candidates
      - img
      - text: Candidates
    - link "Interviews":
      - /url: /interviews
      - img
      - text: Interviews
    - link "Billing":
      - /url: /billing
      - img
      - text: Billing
    - text: Admin
    - link "Team Management":
      - /url: /team
      - img
      - text: Team Management
    - link "Settings":
      - /url: /settings
      - img
      - text: Settings
  - text: S
  - strong: Seed System Admin Updated
  - paragraph: ADMIN
- main:
  - text: Jobs /
  - strong: Senior Backend Engineer
  - button "Edit"
  - button "Close Job"
  - heading "Senior Backend Engineer OPEN" [level=1]
  - paragraph: Ho Chi Minh City · Engineering · 2 applicants
  - button "Overview"
  - button "Applicants (1)"
  - button "Pipeline Config"
  - heading "Description" [level=3]
  - paragraph: Build scalable backend services for ATS workflows and hiring automation.
  - heading "Requirements" [level=3]
  - list:
    - listitem: 3+ years experience with Node.js or NestJS
    - listitem: Strong SQL and data modeling skills
    - listitem: Experience with message queues and distributed systems
  - text: AI ✦ rubric
  - paragraph: High-fit candidates should show reusable systems work, not only feature delivery. Penalize portfolios without accessibility evidence.
  - complementary:
    - heading "Job Metadata" [level=2]
    - paragraph:
      - strong: "Location:"
      - text: Ho Chi Minh City
    - paragraph:
      - strong: "Type:"
      - text: FULL TIME
    - paragraph:
      - strong: "Salary:"
      - text: $2,500 - $4,000
    - paragraph:
      - strong: "Department:"
      - text: Engineering
    - paragraph:
      - strong: "Created by:"
      - text: Seed Lead Recruiter
    - paragraph:
      - strong: "Created:"
      - text: 6/1/2026
    - separator
    - heading "Stage Mix" [level=3]
    - paragraph: Applied 1 · Screening 0 · Interview 0 · Offer 0 · Rejected 0
  - dialog "Edit Requisition":
    - heading "Edit Requisition" [level=2]
    - button "✕"
    - text: Status *
    - combobox:
      - option "Draft"
      - option "Open" [selected]
      - option "Closed"
    - text: Job Title *
    - textbox: Senior Backend Engineer
    - text: Department *
    - textbox: Engineering
    - text: Location *
    - textbox: Ho Chi Minh City
    - text: Type *
    - combobox:
      - option "Full Time" [selected]
      - option "Part Time"
      - option "Contract"
      - option "Internship"
    - text: Min Salary (USD)
    - spinbutton: "2500"
    - text: Max Salary (USD)
    - spinbutton: "4000"
    - text: Description
    - textbox: Build scalable backend services for ATS workflows and hiring automation.
    - text: Requirements (one per line)
    - textbox: 3+ years experience with Node.js or NestJS Strong SQL and data modeling skills Experience with message queues and distributed systems
    - button "Cancel"
    - button "Save Changes"
- alert
```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test';
  2  | 
  3  | test.describe('Jobs Flow', () => {
  4  |   test.beforeEach(async ({ page }) => {
  5  |     await page.goto('/login');
  6  |     await page.fill('input[type="email"]', 'seed-admin@talentflow.invalid');
  7  |     await page.fill('input[type="password"]', 'SeedPassword123!');
  8  |     await page.click('button:has-text("Login")');
  9  |     await expect(page).toHaveURL('/dashboard');
  10 |   });
  11 | 
  12 |   test('Jobs list, view detail, and edit modal', async ({ page }) => {
  13 |     // Navigate to Jobs
  14 |     await page.click('a:has-text("Jobs")');
  15 |     await expect(page).toHaveURL('/jobs');
  16 |     await expect(page.locator('h1:has-text("Jobs")')).toBeVisible();
  17 | 
  18 |     // Verify Create Job button
  19 |     await expect(page.locator('button:has-text("Create Job")')).toBeVisible();
  20 | 
  21 |     // Navigate to Job details
  22 |     await page.click('tr:has-text("Senior Backend Engineer")');
  23 |     await expect(page).toHaveURL(/\/jobs\/.+/);
  24 |     
  25 |     // Verify Job details rendered
  26 |     await expect(page.locator('h1:has-text("Senior Backend Engineer")')).toBeVisible();
  27 |     await expect(page.locator('button:has-text("Edit")')).toBeVisible();
  28 |     await expect(page.locator('button:has-text("Close Job")')).toBeVisible();
  29 | 
  30 |     // Open Edit Modal
  31 |     await page.click('button:has-text("Edit")');
  32 |     
  33 |     // Check Modal rendered
  34 |     const modal = page.locator('div[role="dialog"]:not([data-nextjs-dialog])');
  35 |     await expect(modal).toBeVisible();
> 36 |     await expect(modal.locator('h2:has-text("Edit Job")')).toBeVisible();
     |                                                            ^ Error: expect(locator).toBeVisible() failed
  37 |     await expect(modal.locator('input[name="title"]')).toHaveValue('Senior Backend Engineer');
  38 | 
  39 |     // Close Modal
  40 |     await modal.locator('button:has-text("Cancel")').click();
  41 |     await expect(modal).not.toBeVisible();
  42 |   });
  43 | });
  44 | 
```