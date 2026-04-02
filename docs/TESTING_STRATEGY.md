# Testing Strategy - TalentFlow AI

**Project:** TalentFlow AI Backend
**Framework:** Jest + Supertest
**Target Coverage:** 80% overall, 90% critical paths
**Last Updated:** 2026-02-01

---

## 📋 Table of Contents

- [Overview](#overview)
- [Test Pyramid](#test-pyramid)
- [What to Test](#what-to-test)
- [Mocking Strategies](#mocking-strategies)
- [Unit Testing](#unit-testing)
- [Integration Testing](#integration-testing)
- [E2E Testing](#e2e-testing)
- [Test Data Management](#test-data-management)
- [CI/CD Integration](#cicd-integration)
- [Coverage Goals](#coverage-goals)

---

## 🎯 Overview

### Testing Philosophy

> **"Write tests that give you confidence, not just coverage"**

Chúng ta test để:

1. ✅ **Prevent bugs** - Catch lỗi trước khi deploy
2. ✅ **Enable refactoring** - Tự tin refactor code
3. ✅ **Document behavior** - Tests = living documentation
4. ✅ **Fast feedback** - Phát hiện lỗi nhanh khi code

### Testing Tools

| Tool                | Purpose                  | Version |
| ------------------- | ------------------------ | ------- |
| **Jest**            | Test runner, assertions  | 29.x    |
| **Supertest**       | HTTP assertions (E2E)    | 6.x     |
| **@nestjs/testing** | NestJS testing utilities | 10.x    |
| **faker-js**        | Generate fake test data  | 8.x     |

---

## 🔺 Test Pyramid

```
              /\
             /E2E\         10% - E2E Tests (Slow, High confidence)
            /______\
           /        \
          /Integration\    20% - Integration Tests (Medium speed)
         /____________\
        /              \
       /   Unit Tests   \  70% - Unit Tests (Fast, Low confidence)
      /__________________\
```

### Breakdown

| Type            | % Coverage | Speed                 | When to Write                |
| --------------- | ---------- | --------------------- | ---------------------------- |
| **Unit**        | 70%        | ⚡ Fast (ms)          | Always - test business logic |
| **Integration** | 20%        | ⚡⚡ Medium (seconds) | Test module interactions     |
| **E2E**         | 10%        | 🐢 Slow (seconds)     | Test critical user flows     |

### Why This Ratio?

- **70% Unit**: Fast feedback, test logic in isolation
- **20% Integration**: Test real database, Kafka interactions
- **10% E2E**: Test complete flows (login → create job → upload CV)

---

## ✅ What to Test

### ✅ DO Test:

1. **Business Logic**

   ```typescript
   // ✅ Test this
   calculateMatchScore(candidate, job) {
     // Complex algorithm
   }
   ```

2. **Validation Logic**

   ```typescript
   // ✅ Test this
   validateEmail(email: string): boolean
   ```

3. **Error Handling**

   ```typescript
   // ✅ Test this
   if (!user) throw new NotFoundException();
   ```

4. **Edge Cases**

   ```typescript
   // ✅ Test: empty array, null, undefined, large numbers
   ```

5. **Critical Paths**
   - Authentication (login, signup, JWT refresh)
   - Job CRUD
   - File upload
   - Kafka events

### ❌ DON'T Test:

1. **Framework Code**

   ```typescript
   // ❌ Don't test NestJS decorators
   @Controller('jobs')
   @Get()
   ```

2. **Third-party Libraries**

   ```typescript
   // ❌ Don't test Prisma, Kafka, bcrypt
   await prisma.job.create(...)
   ```

3. **Trivial Code**

   ```typescript
   // ❌ Don't test simple getters
   getName() { return this.name; }
   ```

4. **Constants**
   ```typescript
   // ❌ Don't test constants
   const MAX_FILE_SIZE = 10 * 1024 * 1024;
   ```

---

## 🎭 Mocking Strategies

### 1. Mock Prisma Service

```typescript
// Create mock
const mockPrismaService = {
  job: {
    create: jest.fn(),
    findUnique: jest.fn(),
    findMany: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
  user: {
    create: jest.fn(),
    findUnique: jest.fn(),
  },
};

// Use in tests
const module: TestingModule = await Test.createTestingModule({
  providers: [
    JobService,
    {
      provide: PrismaService,
      useValue: mockPrismaService,
    },
  ],
}).compile();
```

### 2. Mock Kafka Service

```typescript
const mockKafkaService = {
  emit: jest.fn().mockResolvedValue(undefined),
  subscribe: jest.fn(),
};

// Use in tests
{
  provide: KafkaService,
  useValue: mockKafkaService,
}
```

### 3. Mock S3 Storage Service

```typescript
const mockStorageService = {
  upload: jest.fn().mockResolvedValue("https://s3.amazonaws.com/file.pdf"),
  delete: jest.fn().mockResolvedValue(undefined),
  getSignedUrl: jest.fn().mockResolvedValue("https://signed-url"),
};
```

### 4. Mock JWT Service

```typescript
const mockJwtService = {
  sign: jest.fn().mockReturnValue("mock-token"),
  verify: jest.fn().mockReturnValue({ userId: "123", role: "RECRUITER" }),
};
```

---

## 🧪 Unit Testing

### Structure

```typescript
// src/modules/jobs/jobs.service.spec.ts
import { Test, TestingModule } from "@nestjs/testing";
import { JobService } from "./jobs.service";
import { PrismaService } from "@app/database";

describe("JobService", () => {
  let service: JobService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        JobService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<JobService>(JobService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("createJob", () => {
    it("should create a job successfully", async () => {
      // Arrange
      const createJobDto = {
        title: "Senior Developer",
        description: "We are hiring...",
        status: "DRAFT",
      };
      const expectedJob = { id: "123", ...createJobDto };

      jest.spyOn(prisma.job, "create").mockResolvedValue(expectedJob);

      // Act
      const result = await service.createJob(createJobDto, "user-id");

      // Assert
      expect(result).toEqual(expectedJob);
      expect(prisma.job.create).toHaveBeenCalledWith({
        data: {
          ...createJobDto,
          createdById: "user-id",
        },
      });
    });

    it("should throw BadRequestException for invalid title", async () => {
      // Arrange
      const invalidDto = { title: "ab", description: "Test" }; // Too short

      // Act & Assert
      await expect(service.createJob(invalidDto, "user-id")).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe("getJobById", () => {
    it("should return job when found", async () => {
      // Arrange
      const mockJob = { id: "123", title: "Developer" };
      jest.spyOn(prisma.job, "findUnique").mockResolvedValue(mockJob);

      // Act
      const result = await service.getJobById("123");

      // Assert
      expect(result).toEqual(mockJob);
    });

    it("should throw NotFoundException when job not found", async () => {
      // Arrange
      jest.spyOn(prisma.job, "findUnique").mockResolvedValue(null);

      // Act & Assert
      await expect(service.getJobById("invalid-id")).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
```

### Best Practices

1. **AAA Pattern** (Arrange, Act, Assert)

   ```typescript
   it('should do something', async () => {
     // Arrange - Setup data, mocks
     const input = { ... };

     // Act - Call the function
     const result = await service.doSomething(input);

     // Assert - Verify results
     expect(result).toEqual(expected);
   });
   ```

2. **One Assertion Per Test** (nếu có thể)

   ```typescript
   // ✅ Good
   it("should return user email", () => {
     expect(user.email).toBe("test@test.com");
   });

   it("should return user name", () => {
     expect(user.fullName).toBe("John Doe");
   });

   // ❌ Bad (testing multiple things)
   it("should return user", () => {
     expect(user.email).toBe("test@test.com");
     expect(user.fullName).toBe("John Doe");
     expect(user.role).toBe("RECRUITER");
   });
   ```

3. **Descriptive Test Names**

   ```typescript
   // ✅ Good
   it("should throw NotFoundException when job does not exist", () => {});

   // ❌ Bad
   it("should throw error", () => {});
   it("test1", () => {});
   ```

---

## 🔗 Integration Testing

### Database Integration Tests

```typescript
// test/integration/job.service.integration.spec.ts
import { Test } from "@nestjs/testing";
import { PrismaService } from "@app/database";

describe("JobService Integration", () => {
  let prisma: PrismaService;
  let service: JobService;

  beforeAll(async () => {
    // Use test database
    process.env.DATABASE_URL =
      "postgresql://postgres:password@localhost:5432/talentflow_test";

    const module = await Test.createTestingModule({
      providers: [JobService, PrismaService],
    }).compile();

    prisma = module.get(PrismaService);
    service = module.get(JobService);

    // Clean database
    await prisma.$executeRawUnsafe("TRUNCATE TABLE jobs CASCADE");
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it("should create and retrieve job from real database", async () => {
    // Create job (real DB write)
    const job = await service.createJob(
      {
        title: "Developer",
        description: "Test job",
      },
      "user-id",
    );

    // Retrieve job (real DB read)
    const retrieved = await service.getJobById(job.id);

    expect(retrieved.title).toBe("Developer");
  });
});
```

### Kafka Integration Tests

```typescript
// test/integration/kafka.integration.spec.ts
describe("Kafka Integration", () => {
  let kafkaService: KafkaService;
  let consumer: Consumer;

  beforeAll(async () => {
    // Connect to test Kafka instance
    kafkaService = new KafkaService({
      brokers: ["localhost:9092"],
    });

    await kafkaService.connect();
  });

  it("should publish and consume message", async () => {
    const testMessage = { candidateId: "123", fileUrl: "test.pdf" };
    let receivedMessage;

    // Subscribe to topic
    await kafkaService.subscribe("cv.uploaded", (message) => {
      receivedMessage = message;
    });

    // Publish message
    await kafkaService.emit("cv.uploaded", testMessage);

    // Wait for consumption
    await new Promise((resolve) => setTimeout(resolve, 1000));

    expect(receivedMessage).toEqual(testMessage);
  });
});
```

---

## 🌐 E2E Testing

### Full Flow Tests

```typescript
// test/e2e/auth.e2e-spec.ts
import { Test } from "@nestjs/testing";
import { INestApplication } from "@nestjs/common";
import * as request from "supertest";
import { AppModule } from "../src/app.module";

describe("Authentication (E2E)", () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe("/auth/signup (POST)", () => {
    it("should register new user", () => {
      return request(app.getHttpServer())
        .post("/auth/signup")
        .send({
          email: "newuser@test.com",
          password: "SecurePass123!",
          fullName: "Test User",
          role: "RECRUITER",
        })
        .expect(201)
        .expect((res) => {
          expect(res.body.data.user.email).toBe("newuser@test.com");
          expect(res.body.data.accessToken).toBeDefined();
          expect(res.body.data.refreshToken).toBeDefined();
        });
    });

    it("should reject weak password", () => {
      return request(app.getHttpServer())
        .post("/auth/signup")
        .send({
          email: "test@test.com",
          password: "123", // Too weak
          fullName: "Test",
        })
        .expect(400)
        .expect((res) => {
          expect(res.body.message).toContain("password");
        });
    });

    it("should reject duplicate email", () => {
      return request(app.getHttpServer())
        .post("/auth/signup")
        .send({
          email: "duplicate@test.com",
          password: "SecurePass123!",
          fullName: "Test",
        })
        .expect(201)
        .then(() => {
          // Try signup with same email
          return request(app.getHttpServer())
            .post("/auth/signup")
            .send({
              email: "duplicate@test.com",
              password: "SecurePass123!",
              fullName: "Test2",
            })
            .expect(409); // Conflict
        });
    });
  });

  describe("Complete Auth Flow (E2E)", () => {
    it("should signup → login → access protected route → refresh token", async () => {
      const email = "flowtest@test.com";
      const password = "SecurePass123!";

      // 1. Signup
      const signupRes = await request(app.getHttpServer())
        .post("/auth/signup")
        .send({ email, password, fullName: "Flow Test" })
        .expect(201);

      const { accessToken, refreshToken } = signupRes.body.data;

      // 2. Login
      const loginRes = await request(app.getHttpServer())
        .post("/auth/login")
        .send({ email, password })
        .expect(200);

      expect(loginRes.body.data.accessToken).toBeDefined();

      // 3. Access protected route
      const meRes = await request(app.getHttpServer())
        .get("/auth/me")
        .set("Authorization", `Bearer ${accessToken}`)
        .expect(200);

      expect(meRes.body.data.email).toBe(email);

      // 4. Refresh token
      const refreshRes = await request(app.getHttpServer())
        .post("/auth/refresh")
        .send({ refreshToken })
        .expect(200);

      expect(refreshRes.body.data.accessToken).toBeDefined();
    });
  });
});
```

---

## 🎭 Mocking Strategies

### Strategy 1: Mock External Services (Always)

**Mock:**

- Prisma (unit tests only)
- Kafka
- S3/MinIO
- OpenAI API (Phase 2)
- Email service

**Why:** Fast tests, no external dependencies

### Strategy 2: Use Real Services (Integration/E2E)

**Use Real:**

- PostgreSQL (test database)
- Redis (test instance)
- Kafka (Docker container)

**Why:** Test real interactions, catch integration bugs

### Mocking Helper

```typescript
// test/helpers/mocks.ts
export const createMockPrismaService = () => ({
  job: {
    create: jest.fn(),
    findUnique: jest.fn(),
    findMany: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
  user: {
    create: jest.fn(),
    findUnique: jest.fn(),
  },
  candidate: {
    create: jest.fn(),
    findMany: jest.fn(),
  },
  application: {
    create: jest.fn(),
    findMany: jest.fn(),
  },
  $transaction: jest.fn((callback) => callback(this)),
});

export const createMockKafkaService = () => ({
  emit: jest.fn().mockResolvedValue(undefined),
  subscribe: jest.fn(),
});

export const createMockStorageService = () => ({
  upload: jest.fn().mockResolvedValue("https://s3.example.com/file.pdf"),
  delete: jest.fn().mockResolvedValue(undefined),
});
```

**Usage:**

```typescript
import { createMockPrismaService } from "@test/helpers/mocks";

const mockPrisma = createMockPrismaService();
```

---

## 📦 Test Data Management

### Factories

```typescript
// test/factories/user.factory.ts
import { faker } from "@faker-js/faker";

export const userFactory = {
  build: (overrides = {}) => ({
    id: faker.string.uuid(),
    email: faker.internet.email(),
    password: "HashedPassword123",
    fullName: faker.person.fullName(),
    role: "RECRUITER",
    createdAt: new Date(),
    updatedAt: new Date(),
    ...overrides,
  }),

  buildMany: (count: number, overrides = {}) => {
    return Array.from({ length: count }, () => userFactory.build(overrides));
  },
};

// Usage in tests
const mockUser = userFactory.build({ role: "ADMIN" });
const mockUsers = userFactory.buildMany(10);
```

### Fixtures

```typescript
// test/fixtures/jobs.fixture.ts
export const jobFixtures = {
  validJob: {
    title: "Senior Full-Stack Developer",
    description: "We are looking for...",
    requirements: {
      skills: ["NestJS", "React"],
      experience: "5+ years",
    },
    salaryRange: "$100k - $150k",
    status: "OPEN",
  },

  draftJob: {
    title: "Junior Developer",
    description: "Entry level position",
    status: "DRAFT",
  },
};

// Usage
const job = await service.createJob(jobFixtures.validJob, userId);
```

---

## 🎯 Coverage Goals

### Overall Target: 80%

| Component       | Target | Critical? |
| --------------- | ------ | --------- |
| **Services**    | 90%+   | ✅ Yes    |
| **Controllers** | 70%+   | No        |
| **Guards**      | 90%+   | ✅ Yes    |
| **Pipes**       | 80%+   | No        |
| **Filters**     | 70%+   | No        |
| **Utilities**   | 80%+   | No        |

### Critical Paths (90%+ Required)

1. **Authentication**
   - Signup, Login, JWT refresh
   - Password hashing, validation
   - RBAC guards

2. **Job CRUD**
   - Create, Read, Update, Delete
   - Validation logic
   - Permission checks

3. **File Upload**
   - File validation
   - S3 upload
   - Kafka event emission

4. **Kafka Processing** (Phase 2)
   - CV parsing
   - Event handling
   - Retry logic

---

## 🔄 CI/CD Integration

### GitHub Actions Workflow

```yaml
# .github/workflows/test.yml
name: Tests

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest

    services:
      postgres:
        image: postgres:16-alpine
        env:
          POSTGRES_PASSWORD: password
          POSTGRES_DB: talentflow_test
        ports:
          - 5432:5432
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5

      redis:
        image: redis:7-alpine
        ports:
          - 6379:6379

    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: "20"
          cache: "npm"

      - name: Install dependencies
        run: npm ci

      - name: Setup test database
        env:
          DATABASE_URL: postgresql://postgres:password@localhost:5432/talentflow_test
        run: |
          npx prisma migrate deploy
          npx prisma db push

      - name: Run unit tests
        run: npm run test -- --coverage

      - name: Run E2E tests
        env:
          DATABASE_URL: postgresql://postgres:password@localhost:5432/talentflow_test
          REDIS_HOST: localhost
          REDIS_PORT: 6379
        run: npm run test:e2e

      - name: Upload coverage to Codecov
        uses: codecov/codecov-action@v3
        with:
          files: ./coverage/lcov.info

      - name: Comment coverage on PR
        if: github.event_name == 'pull_request'
        uses: romeovs/lcov-reporter-action@v0.3.1
        with:
          lcov-file: ./coverage/lcov.info
          github-token: ${{ secrets.GITHUB_TOKEN }}
```

### Coverage Enforcement

**Block PR nếu coverage < 80%:**

```yaml
# .github/workflows/coverage-check.yml
- name: Check coverage threshold
  run: |
    COVERAGE=$(cat coverage/coverage-summary.json | jq '.total.lines.pct')
    if (( $(echo "$COVERAGE < 80" | bc -l) )); then
      echo "Coverage $COVERAGE% is below 80%"
      exit 1
    fi
```

---

## 📊 Running Tests

### Commands

```bash
# Run all unit tests
npm run test

# Run specific test file
npm run test -- jobs.service.spec.ts

# Run tests in watch mode (during development)
npm run test:watch

# Run with coverage report
npm run test:cov

# Run E2E tests
npm run test:e2e

# Run integration tests
npm run test:integration
```

### package.json Scripts

```json
{
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch",
    "test:cov": "jest --coverage",
    "test:debug": "node --inspect-brk -r tsconfig-paths/register -r ts-node/register node_modules/.bin/jest --runInBand",
    "test:e2e": "jest --config ./test/jest-e2e.json",
    "test:integration": "jest --config ./test/jest-integration.json"
  }
}
```

### Jest Configuration

```javascript
// jest.config.js
module.exports = {
  moduleFileExtensions: ["js", "json", "ts"],
  rootDir: "src",
  testRegex: ".*\\.spec\\.ts$",
  transform: {
    "^.+\\.(t|j)s$": "ts-jest",
  },
  collectCoverageFrom: [
    "**/*.(t|j)s",
    "!**/*.spec.ts",
    "!**/*.module.ts",
    "!**/main.ts",
  ],
  coverageDirectory: "../coverage",
  coverageThreshold: {
    global: {
      lines: 80,
      functions: 80,
      branches: 80,
      statements: 80,
    },
  },
  testEnvironment: "node",
};
```

---

## 🚀 Test-Driven Development (TDD)

### Red-Green-Refactor Cycle

```
🔴 Red: Write failing test
   ↓
🟢 Green: Write minimal code to pass
   ↓
🔵 Refactor: Improve code quality
   ↓
Repeat
```

### Example TDD Flow

```typescript
// 1. 🔴 RED: Write failing test
describe('JobService', () => {
  it('should create job', async () => {
    const job = await service.createJob({ title: 'Dev' }, 'user-id');
    expect(job.title).toBe('Dev');
  });
});

// Run test → FAILS (method doesn't exist)

// 2. 🟢 GREEN: Minimal implementation
async createJob(dto: CreateJobDto, userId: string) {
  return this.prisma.job.create({
    data: { ...dto, createdById: userId },
  });
}

// Run test → PASSES

// 3. 🔵 REFACTOR: Add validation
async createJob(dto: CreateJobDto, userId: string) {
  if (!dto.title || dto.title.length < 3) {
    throw new BadRequestException('Title too short');
  }

  return this.prisma.job.create({
    data: { ...dto, createdById: userId },
  });
}

// Run test → Still PASSES
// Add test for validation → Continue cycle
```

---

## 📈 Measuring Coverage

### View Coverage Report

```bash
# Run tests with coverage
npm run test:cov

# Open HTML report
open coverage/lcov-report/index.html
```

### Coverage Report Example

```
--------------------|---------|----------|---------|---------|
File                | % Stmts | % Branch | % Funcs | % Lines |
--------------------|---------|----------|---------|---------|
All files           |   82.5  |   78.3   |   85.1  |   82.8  |
 jobs/              |   88.2  |   82.5   |   90.0  |   88.5  |
  jobs.service.ts   |   92.1  |   85.0   |   95.0  |   92.3  |
  jobs.controller.ts|   75.0  |   70.0   |   80.0  |   75.2  |
 auth/              |   90.5  |   88.0   |   92.0  |   90.8  |
  auth.service.ts   |   95.0  |   92.0   |   100.0 |   95.2  |
--------------------|---------|----------|---------|---------|
```

**Target:** Tất cả > 80% ✅

---

## 🎓 Testing Best Practices

### DOs ✅

1. **Test behavior, not implementation**

   ```typescript
   // ✅ Good: Test what it does
   it("should return sorted jobs by date", () => {
     expect(jobs[0].createdAt > jobs[1].createdAt).toBe(true);
   });

   // ❌ Bad: Test how it does
   it("should call sort function", () => {
     expect(sortSpy).toHaveBeenCalled();
   });
   ```

2. **Keep tests independent**

   ```typescript
   // ✅ Good: Each test cleans up
   afterEach(() => {
     jest.clearAllMocks();
   });

   // ❌ Bad: Tests depend on each other
   ```

3. **Use descriptive names**

   ```typescript
   // ✅ Good
   it("should throw NotFoundException when job with given ID does not exist");

   // ❌ Bad
   it("test job not found");
   ```

### DON'Ts ❌

1. **Don't test external libraries**
2. **Don't write tests just for coverage** (quality > quantity)
3. **Don't use real credentials** (API keys, passwords)
4. **Don't commit `.env.test`** with secrets

---

## 🔧 Debugging Tests

### Run Single Test

```bash
# Run specific test file
npm run test -- jobs.service.spec.ts

# Run specific test case
npm run test -- -t "should create job"

# Debug mode
npm run test:debug
```

### VSCode Debug Configuration

```json
// .vscode/launch.json
{
  "type": "node",
  "request": "launch",
  "name": "Jest Debug",
  "program": "${workspaceFolder}/node_modules/.bin/jest",
  "args": ["--runInBand", "--no-cache"],
  "console": "integratedTerminal",
  "internalConsoleOptions": "neverOpen"
}
```

---

## 📋 Testing Checklist (Per Feature)

Khi implement feature mới, đảm bảo:

### Unit Tests

- [ ] Service methods có unit tests
- [ ] Happy path covered
- [ ] Error cases covered (NotFoundException, BadRequestException)
- [ ] Validation logic tested
- [ ] Mocks configured correctly

### Integration Tests (Optional)

- [ ] Database operations work
- [ ] Kafka events emitted correctly

### E2E Tests (Critical paths only)

- [ ] Complete user flow tested
- [ ] Authentication required endpoints protected
- [ ] Error responses correct

### Coverage

- [ ] Module coverage > 80%
- [ ] Critical paths > 90%
- [ ] CI passes

---

## 🎯 Team Workflow

### Before Coding

1. ✅ Hiểu requirement
2. ✅ Design API contract
3. 🔴 **Write failing test first** (TDD)

### While Coding

4. 🟢 Implement code to pass test
5. 🔵 Refactor
6. ✅ Add more tests for edge cases

### Before PR

7. ✅ Run `npm run test:cov` → Check 80%+
8. ✅ Run `npm run test:e2e` → All pass
9. ✅ Commit tests với code

### PR Review

10. ✅ Reviewer checks tests quality
11. ✅ CI must pass (automated)

---

## 📚 Resources

- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [NestJS Testing](https://docs.nestjs.com/fundamentals/testing)
- [Supertest GitHub](https://github.com/visionmedia/supertest)
- [Testing Best Practices](https://github.com/goldbergyoni/javascript-testing-best-practices)

---

**Last Updated:** 2026-02-01
**Next Review:** After Sprint 2 (Week 4)
