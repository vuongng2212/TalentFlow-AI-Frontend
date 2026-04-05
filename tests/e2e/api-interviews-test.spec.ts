import { test, expect } from '@playwright/test';

test.describe('Interviews API Tests', () => {
  let headers: Record<string, string>;
  let jobId: string;
  let candidateId: string;
  let applicationId: string;
  let adminUserId: string;

  // Setup: Login and create required data (Job -> Candidate -> Application)
  test.beforeAll(async ({ request }) => {
    // 1. Login
    const loginRes = await request.post('http://localhost:8080/api/v1/auth/login', {
      data: { email: 'seed-admin@talentflow.invalid', password: 'SeedPassword123!' }
    });
    
    const cookieHeader = loginRes.headers()['set-cookie'] || '';
    const cookieString = cookieHeader.split(',').map(c => c.split(';')[0]).join('; ');
    headers = { 'Cookie': cookieString, 'Content-Type': 'application/json' };
    
    const loginData = await loginRes.json();
    adminUserId = loginData.data.user.id;

    // 2. Get a Job
    const jobsRes = await request.get('http://localhost:8080/api/v1/jobs', { headers });
    const jobsData = await jobsRes.json();
    jobId = jobsData.data.data[0]?.id;

    if (!jobId) {
      // Create one if none exists
      const newJobRes = await request.post('http://localhost:8080/api/v1/jobs', {
        headers,
        data: {
          title: 'Test Job for Interview',
          employmentType: 'FULL_TIME',
          status: 'OPEN'
        }
      });
      const newJobData = await newJobRes.json();
      jobId = newJobData.data.id;
    }

    // 3. Get a Candidate
    const candRes = await request.get('http://localhost:8080/api/v1/candidates', { headers });
    const candData = await candRes.json();
    candidateId = candData.data.data[0]?.id;

    if (!candidateId) {
        throw new Error("No candidates found in DB. Seed DB first.");
    }

    // 4. Create an Application
    const appRes = await request.post('http://localhost:8080/api/v1/applications', {
      headers,
      data: {
        jobId,
        coverLetter: 'Great candidate'
      }
    });
    
    if(!appRes.ok()) {
        console.log("App creation failed", await appRes.text())
        // Try to find an existing application
        const existAppRes = await request.get('http://localhost:8080/api/v1/applications', { headers });
        const existAppData = await existAppRes.json();
        applicationId = existAppData.data.data[0]?.id;
    } else {
        const appData = await appRes.json();
        applicationId = appData.data.id;
    }
  });

  test.describe('CRUD Operations', () => {
    let createdInterviewId: string;

    test('Should create an interview', async ({ request }) => {
      test.skip(!applicationId, 'Setup failed: No application ID');
      
      const scheduledAt = new Date();
      scheduledAt.setDate(scheduledAt.getDate() + 2); // 2 days from now

      const response = await request.post('http://localhost:8080/api/v1/interviews', {
        headers,
        data: {
          applicationId,
          interviewerId: adminUserId,
          scheduledAt: scheduledAt.toISOString(),
          duration: 60,
          type: 'VIDEO',
          location: 'https://meet.google.com/test',
          notes: 'Test interview'
        }
      });
      
      if (!response.ok()) {
        console.log('Create interview failed:', await response.text());
      }
      expect(response.ok()).toBeTruthy();
      const data = await response.json();
      createdInterviewId = data.data.id;
      expect(createdInterviewId).toBeDefined();
    });

    test('Should update an interview', async ({ request }) => {
      test.skip(!createdInterviewId, 'Create interview failed');
      
      const newTime = new Date();
      newTime.setDate(newTime.getDate() + 3);

      const response = await request.patch(`http://localhost:8080/api/v1/interviews/${createdInterviewId}`, {
        headers,
        data: {
          scheduledAt: newTime.toISOString(),
          status: 'COMPLETED',
          notes: 'Great candidate'
        }
      });
      
      if (!response.ok()) {
        console.log('Update interview failed:', await response.text());
      }
      expect(response.ok()).toBeTruthy();
      const data = await response.json();
      expect(data.data.status).toBe('COMPLETED');
    });

    test('Should delete an interview', async ({ request }) => {
      test.skip(!createdInterviewId, 'Create interview failed');
      
      const response = await request.delete(`http://localhost:8080/api/v1/interviews/${createdInterviewId}`, {
        headers
      });
      
      if (!response.ok()) {
        console.log('Delete interview failed:', await response.text());
      }
      expect(response.ok()).toBeTruthy();
    });
  });
});
