import { test, expect } from '@playwright/test';

test.describe('API Health and Auth Tests', () => {
  test('Backend health check', async ({ request }) => {
    const response = await request.get('http://localhost:8080/health');
    expect(response.ok()).toBeTruthy();
    const data = await response.json();
    expect(data.status).toBe(200);
  });

  test('Login with admin credentials', async ({ request }) => {
    const response = await request.post('http://localhost:8080/api/v1/auth/login', {
      data: {
        email: 'seed-admin@talentflow.invalid',
        password: 'SeedPassword123!'
      }
    });
    
    expect(response.ok()).toBeTruthy();
    const data = await response.json();
    
    // Log response to see structure
    console.log('Login Response:', JSON.stringify(data, null, 2));
    
    // The backend uses HTTP-only cookies for token, so they are in response headers
    // but not in the response body.
    const headers = response.headers();
    const setCookie = headers['set-cookie'];
    
    expect(setCookie).toBeDefined();
    expect(setCookie).toContain('access_token');
    expect(setCookie).toContain('refresh_token');
    
    expect(data.data.user).toBeDefined();
    expect(data.data.user.email).toBe('seed-admin@talentflow.invalid');
  });
});
