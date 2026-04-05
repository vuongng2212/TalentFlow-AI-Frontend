import { test, expect } from '@playwright/test';

test.describe('CRUD APIs Tests', () => {
  let headers: Record<string, string>;
  let cookieHeader: string;
  let adminUserId: string;

  // Setup: Login to get token for all tests
  test.beforeAll(async ({ request }) => {
    const response = await request.post('http://localhost:8080/api/v1/auth/login', {
      data: {
        email: 'seed-admin@talentflow.invalid',
        password: 'SeedPassword123!'
      }
    });
    
    expect(response.ok()).toBeTruthy();
    
    const responseHeaders = response.headers();
    cookieHeader = responseHeaders['set-cookie'] || '';
    
    // Extract access_token cookie properly
    const cookieString = cookieHeader.split(',').map(c => c.split(';')[0]).join('; ');
    
    headers = {
      'Cookie': cookieString,
      'Content-Type': 'application/json'
    };
    
    const data = await response.json();
    adminUserId = data.data.user.id;
  });

  test.describe('Jobs API', () => {
    let createdJobId: string;

    test('Should create a job', async ({ request }) => {
      const response = await request.post('http://localhost:8080/api/v1/jobs', {
        headers,
        data: {
          title: 'Senior Test Engineer',
          department: 'Engineering',
          location: 'Remote',
          employmentType: 'FULL_TIME',
          description: 'Test job description for E2E testing.',
          requirements: { skills: ['Playwright', 'TypeScript'], experience: '3+ years' },
          salaryMin: 100000,
          salaryMax: 150000,
          status: 'OPEN'
        }
      });
      
      if (!response.ok()) {
        console.log('Create job failed:', await response.text());
      }
      expect(response.ok()).toBeTruthy();
      const data = await response.json();
      expect(data.data.title).toBe('Senior Test Engineer');
      createdJobId = data.data.id;
    });

    test('Should get list of jobs', async ({ request }) => {
      const response = await request.get('http://localhost:8080/api/v1/jobs', {
        headers
      });
      
      if (!response.ok()) {
        console.log('Get jobs failed:', await response.text());
      }
      expect(response.ok()).toBeTruthy();
      const data = await response.json();
      expect(Array.isArray(data.data.data)).toBeTruthy();
      expect(data.data.data.length).toBeGreaterThan(0);
    });

    test('Should get job by ID', async ({ request }) => {
      test.skip(!createdJobId, 'Job creation failed');
      
      const response = await request.get(`http://localhost:8080/api/v1/jobs/${createdJobId}`, {
        headers
      });
      
      if (!response.ok()) {
        console.log('Get job by ID failed:', await response.text());
      }
      expect(response.ok()).toBeTruthy();
      const data = await response.json();
      expect(data.data.id).toBe(createdJobId);
      expect(data.data.title).toBe('Senior Test Engineer');
    });

    test('Should update a job', async ({ request }) => {
      test.skip(!createdJobId, 'Job creation failed');
      
      const response = await request.put(`http://localhost:8080/api/v1/jobs/${createdJobId}`, {
        headers,
        data: {
          title: 'Lead Test Engineer'
        }
      });
      
      if (!response.ok()) {
        console.log('Update job failed:', await response.text());
      }
      expect(response.ok()).toBeTruthy();
      const data = await response.json();
      expect(data.data.title).toBe('Lead Test Engineer');
    });

    test('Should delete a job', async ({ request }) => {
      test.skip(!createdJobId, 'Job creation failed');
      
      const response = await request.delete(`http://localhost:8080/api/v1/jobs/${createdJobId}`, {
        headers
      });
      
      if (!response.ok()) {
        console.log('Delete job failed:', await response.text());
      }
      expect(response.ok()).toBeTruthy();
      
      // Verify deletion
      const getResponse = await request.get(`http://localhost:8080/api/v1/jobs/${createdJobId}`, {
        headers
      });
      expect(getResponse.ok()).toBeFalsy();
      expect(getResponse.status()).toBe(404);
    });
  });

  test.describe('Users API', () => {
    test('Should get list of users', async ({ request }) => {
      const response = await request.get('http://localhost:8080/api/v1/users', {
        headers
      });
      
      if (!response.ok()) {
        console.log('Get users failed:', await response.text());
      }
      expect(response.ok()).toBeTruthy();
      const data = await response.json();
      expect(Array.isArray(data.data.data)).toBeTruthy();
    });

    test('Should get current user profile', async ({ request }) => {
      const response = await request.get('http://localhost:8080/api/v1/auth/me', {
        headers
      });

      if (!response.ok()) {
        console.log('Get profile failed:', await response.text());
      }
      expect(response.ok()).toBeTruthy();
      const data = await response.json();
      expect(data.data.user.email).toBe('seed-admin@talentflow.invalid');
    });
    
    test('Should update user', async ({ request }) => {
      const response = await request.patch(`http://localhost:8080/api/v1/users/${adminUserId}`, {
        headers,
        data: {
          fullName: 'Updated Admin Name'
        }
      });
      
      if (!response.ok()) {
        console.log('Update user failed:', await response.text());
      }
      expect(response.ok()).toBeTruthy();
      const data = await response.json();
      expect(data.data.fullName).toBe('Updated Admin Name');
      
      // Revert back
      await request.patch(`http://localhost:8080/api/v1/users/${adminUserId}`, {
        headers,
        data: {
          fullName: 'Seed System Admin'
        }
      });
    });
  });
});
