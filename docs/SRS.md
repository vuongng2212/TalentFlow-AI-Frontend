# PART 2: SOFTWARE REQUIREMENTS SPECIFICATION (SRS)

**Project Name:** TalentFlow AI
**Architecture Pattern:** Polyglot 3-Service Architecture (NestJS + Spring Boot + ASP.NET Core)
**Last Updated:** 2026-02-18

> ⚠️ **IMPORTANT:** This document describes the **CURRENT** architecture (Polyglot 3-Service).
> For historical context on the previous NestJS Monorepo approach, see [ADR-001](./adr/ADR-001-nestjs-monorepo.md) (SUPERSEDED).
> For message broker decision, see [ADR-009](./adr/ADR-009-rabbitmq-polyglot.md) (RabbitMQ for polyglot).

## 1. System Architecture Overview

Hệ thống sử dụng kiến trúc **Polyglot 3-Service** trong **single repository**:

- **Single Repository Structure:** 3 services trong 1 Git repository (`api-gateway/`, `cv-parser/`, `notification-service/`) để dễ quản lý.
- **Polyglot Services:** Mỗi service dùng tech stack phù hợp nhất:
  - **Service 1 (API Gateway):** NestJS - REST API, Auth, CRUD
  - **Service 2 (CV Parser):** Spring Boot - CPU-intensive PDF/OCR processing
  - **Service 3 (Notification):** ASP.NET Core - WebSocket, Email
- **Clean Architecture Layers:**
  - **Domain Layer:** Entities, Use Cases, Business Rules - core business logic không phụ thuộc framework.
  - **Application Layer:** Service Interfaces, DTOs, Application Logic - orchestrate use cases.
  - **Infrastructure Layer:** Database (Prisma/EF Core), External APIs, Message Queue (RabbitMQ) - implementation details.
  - **Presentation Layer:** REST Controllers, WebSocket Gateways - handle HTTP/WS requests.
- **Communication:** Async queue-based architecture với **RabbitMQ (AMQP)** để đảm bảo polyglot support và reliability cho MVP.

### C4 Model: Context Diagram

```mermaid
graph TB
    %% External Actors
    Recruiter[👤 Recruiter<br/>Creates jobs, reviews CVs]
    HiringManager[👤 Hiring Manager<br/>Reviews candidates]
    Admin[👤 Admin<br/>Manages system]

    %% Main System
    System[📦 TalentFlow AI System<br/>AI-Powered ATS]

    %% External Systems
    EmailService[📧 Email Service<br/>SendGrid/Resend]
    AIService[🤖 AI Service<br/>Anthropic Claude API]
    Storage[☁️ Cloud Storage<br/>Cloudflare R2]

    %% Relationships
    Recruiter -->|Upload CV, Review Candidates| System
    HiringManager -->|Review Candidates, Interview| System
    Admin -->|Manage Users & Jobs| System

    System -->|Send Notifications| EmailService
    System -->|Parse CV, Match Jobs| AIService
    System -->|Store Files| Storage

    %% Styling
    classDef person fill:#08427B,stroke:#052E56,color:#fff
    classDef system fill:#1168BD,stroke:#0B4884,color:#fff
    classDef external fill:#999999,stroke:#6B6B6B,color:#fff

    class Recruiter,HiringManager,Admin person
    class System system
    class EmailService,AIService,Storage external
```

**Context Diagram Legend:**

- **Users:** Recruiters upload CVs and manage jobs, Hiring Managers review candidates
- **System:** TalentFlow AI handles CV parsing, AI scoring, and workflow management
- **External Systems:** Email for notifications, AI for CV processing, Cloud storage for files

### C4 Model: Container Diagram

```mermaid
graph TB
    %% Frontend
    Frontend[🖥️ Web Application<br/>Next.js 16<br/>TypeScript, React Server Components]

    %% Backend Services
    subgraph "TalentFlow AI System"
        APIGateway[⚙️ API Gateway<br/>NestJS TypeScript<br/>REST API, Auth, CRUD]
        CVParser[🔧 CV Parser Service<br/>Spring Boot Java<br/>PDF/OCR Processing, AI Scoring]
        Notification[📬 Notification Service<br/>ASP.NET Core C#<br/>WebSocket, Email]

        Database[(🗄️ PostgreSQL<br/>Neon Serverless<br/>Users, Jobs, CVs, Applications)]
        Queue[🔄 Message Queue<br/>RabbitMQ AMQP<br/>Async Event Processing]
        Cache[⚡ Redis Cache<br/>Session, Rate Limiting]
    end

    %% External Services
    R2[☁️ Cloudflare R2<br/>CV File Storage]
    Claude[🤖 Anthropic Claude<br/>CV Parsing & Scoring]
    SendGrid[📧 SendGrid<br/>Email Notifications]

    %% Relationships
    Frontend -->|HTTPS REST API| APIGateway
    Frontend -->|WebSocket| Notification

    APIGateway -->|Query/Mutate| Database
    APIGateway -->|Publish Events| Queue
    APIGateway -->|Upload Files| R2
    APIGateway -->|Cache Session| Cache

    Queue -->|Consume cv.uploaded| CVParser
    Queue -->|Consume cv.processed| Notification

    CVParser -->|Download CV| R2
    CVParser -->|Parse & Score| Claude
    CVParser -->|Update Results| Database
    CVParser -->|Publish cv.processed| Queue

    Notification -->|Send Email| SendGrid
    Notification -->|Push Updates| Frontend
    Notification -->|Read Data| Database

    %% Styling
    classDef frontend fill:#1168BD,stroke:#0B4884,color:#fff
    classDef service fill:#438DD5,stroke:#2E6295,color:#fff
    classDef storage fill:#6DB33F,stroke:#4D7F2C,color:#fff
    classDef external fill:#999999,stroke:#6B6B6B,color:#fff

    class Frontend frontend
    class APIGateway,CVParser,Notification service
    class Database,Queue,Cache storage
    class R2,Claude,SendGrid external
```

**Container Diagram Legend:**

- **Frontend:** Next.js 16 web application for recruiters
- **API Gateway:** NestJS service handling HTTP requests, authentication, CRUD
- **CV Parser:** Spring Boot service for CPU-intensive PDF parsing & OCR
- **Notification:** ASP.NET Core service for real-time WebSocket & email
- **Database:** PostgreSQL for relational data (users, jobs, applications)
- **Queue:** RabbitMQ (AMQP) for async communication between services
- **External:** Cloudflare R2 for file storage, Claude AI for CV processing

### ASCII Architecture Diagram (Legacy)

```
┌────────────────────────────────────────────┐
│     Service 1: API Gateway (NestJS)        │
│  - REST API, Auth, CRUD, File Upload       │
└──────┬─────────────────────────┬───────────┘
       │                         │
       │ BullMQ (Redis)         │ PostgreSQL (Shared)
       │                         │
┌──────▼───────────┐  ┌─────────▼───────────┐
│ Service 2:       │  │ Service 3:          │
│ CV Parser        │  │ Notification        │
│ (Spring Boot)    │  │ (ASP.NET Core)      │
│ - Tesseract OCR  │  │ - WebSocket         │
│ - PDF parsing    │  │ - Email             │
└──────────────────┘  └─────────────────────┘
```

**See:** [ADR-006: Polyglot 3-Service Architecture](./adr/ADR-006-hybrid-microservices.md) for detailed rationale.

## 2. Technology Stack

| Component             | Technology            | Description                                                                                           |
| --------------------- | --------------------- | ----------------------------------------------------------------------------------------------------- |
| **Frontend**          | **Next.js 16**        | TypeScript, App Router, React Server Components, Server Actions, TailwindCSS, Shadcn/UI, React Query. |
| **Backend Service 1** | **NestJS**            | API Gateway - REST API, Auth (JWT + Passport), CRUD operations, BullMQ producer.                      |
| **Backend Service 2** | **Spring Boot 3.x**   | CV Parser - PDF/DOCX parsing (Apache PDFBox/POI), Tesseract OCR, LLM integration, RabbitMQ consumer.  |
| **Backend Service 3** | **ASP.NET Core 8**    | Notification Service - WebSocket (SignalR), Email (SendGrid/Resend), RabbitMQ consumer.               |
| **ORM**               | **Prisma / EF Core**  | Type-safe database client, migrations, schema management.                                             |
| **Database**          | **PostgreSQL 16**     | Primary relational database for structured data (shared by all services with logical separation).     |
| **Queue**             | **RabbitMQ**          | AMQP message broker for async communication between services, DLQ support, routing patterns.          |
| **Storage**           | **Cloudflare R2**     | S3-compatible object storage for CV files (FREE egress saves $33k vs AWS S3).                         |
| **Cache**             | **Redis 7.x**         | BullMQ queue storage + session caching + rate limiting.                                               |
| **Vector DB**         | **Weaviate / Qdrant** | (Phase 2) Embeddings storage for Semantic Search and AI matching.                                     |
| **DevOps**            | **Docker Compose**    | Container orchestration for local development (PostgreSQL + Redis).                                   |
| **CI/CD**             | **GitHub Actions**    | Automated testing, building, and deployment pipelines.                                                |
| **Deployment**        | **Railway**           | Cloud platform for hosting services (API Gateway, CV Parser, Notification).                           |

## 3. Functional Requirements (Detailed)

### 3.1. Authentication & Authorization (NestJS Auth Module)

- **FR-01:** Đăng nhập/Đăng ký qua Email/Password sử dụng **NestJS Passport** với Local Strategy.
- **FR-02:** Phân quyền dựa trên Role (RBAC): Admin, Recruiter, Interviewer. Sử dụng **JWT (Access Token + Refresh Token)** và `@Roles()` decorator cho route protection.

### 3.2. Job Management (NestJS Job Module)

- **FR-03:** CRUD Job Description thông qua RESTful API với **NestJS Controllers**.
- **FR-04:** Lưu trữ JD dưới dạng cấu trúc JSON trong PostgreSQL (qua **Prisma ORM**) để AI dễ dàng đối chiếu và parse.

### 3.3. CV Upload & Processing Pipeline (Async with RabbitMQ)

**Architecture Flow:**

```
Frontend (Next.js 16)
  -> Service 1: API Gateway (NestJS - Upload Controller)
    -> Cloudflare R2 Storage
    -> PostgreSQL (Metadata via Prisma)
    -> RabbitMQ Producer: Queue "cv.uploaded"

Service 2: CV Parser (Spring Boot - RabbitMQ Consumer)
  -> Download CV from R2
  -> PDF Parsing (Apache PDFBox / Tika)
  -> DOCX Parsing (Apache POI)
  -> Tesseract OCR (for scanned PDFs)
  -> LLM Extraction & Scoring (Anthropic Claude API)
  -> Update PostgreSQL (resume_text, ai_score)
  -> RabbitMQ Producer: Queue "cv.parsed"

Service 3: Notification (ASP.NET Core - RabbitMQ Consumer)
  -> WebSocket notification to Frontend (recruiter dashboard)
  -> Email notification (SendGrid/Resend)
```

**Detailed Requirements:**

- **FR-05 (User Action):** User upload file PDF/DOCX từ Frontend -> Gọi **Next.js 16 Server Action** hoặc API endpoint tới **NestJS Upload Controller** (sử dụng `@nestjs/platform-express` với Multer).

- **FR-06 (Storage):** API Gateway (NestJS) validate file (size, type), upload lên **Cloudflare R2** bằng R2 SDK (S3-compatible), lưu metadata (file_url, candidate_id, job_id, status) vào **PostgreSQL** qua **Prisma**.

- **FR-07 (Async Trigger):** API Gateway emit job `cv.uploaded` (payload: `{candidateId, fileUrl, jobId}`) vào **RabbitMQ Exchange**: `cv-events` sử dụng **amqplib** library.

- **FR-08 (AI Processing):** **Service 2: CV Parser (Spring Boot)** consume RabbitMQ queue `cv-processing`:
  - Tải file từ Cloudflare R2.
  - Sử dụng **Apache PDFBox/Tika** (PDF) hoặc **Apache POI** (DOCX) để extract text.
  - Tesseract OCR cho scanned PDFs.
  - Rule-based filtering hoặc gọi **Anthropic Claude API** với structured prompt để trích xuất JSON:
    ```json
    {
      "name": "...",
      "email": "...",
      "phone": "...",
      "skills": ["React", "Node.js"],
      "experience": [...]
    }
    ```
  - Gọi **OpenAI Embeddings API** để generate vector representation.
  - Lưu vector vào **Weaviate/Qdrant** với metadata (Phase 2).
  - Emit job `cv.parsed` (payload: `{candidateId, extractedData, score}`) vào **RabbitMQ Exchange**: `cv-events`.

- **FR-09 (Update & Notification):** **Service 3: Notification (ASP.NET Core)** nhận job `cv.parsed` từ RabbitMQ, sau đó:
  - Gửi notification tới Frontend qua **SignalR WebSocket Gateway**.
  - Gửi email notification tới recruiter (optional).
  - Update UI Kanban board real-time.

### 3.4. Search & Matching (NestJS Search Module)

- **FR-10:** API tìm kiếm ứng viên bằng ngôn ngữ tự nhiên (VD: "Tìm ứng viên biết React và NestJS") qua **NestJS GraphQL Resolver** hoặc REST endpoint.

- **FR-11:** Hệ thống chuyển search query thành Vector (qua OpenAI Embeddings), thực hiện **Cosine Similarity Search** trong Vector DB, trả về top N candidates với confidence score.

## 4. Database Schema Design (High-Level Entities)

**ORM:** Sử dụng **Prisma** làm ORM - type-safe database client với auto-completion và migration management.

**Core Entities:**

- **User:** `id, email, password_hash, role (enum: ADMIN|RECRUITER|INTERVIEWER), status, created_at, updated_at`
- **Job:** `id, title, description, requirements (JSON), salary_range, status (DRAFT|OPEN|CLOSED), created_by (FK: User), created_at`
- **Candidate:** `id, full_name, email, phone, linkedin_url, resume_url, resume_text, created_at`
- **Application:** `id, job_id (FK: Job), candidate_id (FK: Candidate), current_stage (enum), ai_score (float), ai_summary (text), created_at, updated_at`
- **Interview:** `id, application_id (FK: Application), interviewer_id (FK: User), scheduled_time, feedback, rating (1-5), status, created_at`

**Prisma Schema File Example:**

```prisma
// prisma/schema.prisma
model Candidate {
  id          String   @id @default(uuid())
  fullName    String   @map("full_name")
  email       String   @unique
  phone       String?
  linkedinUrl String?  @map("linkedin_url")
  resumeUrl   String   @map("resume_url")
  resumeText  String?  @map("resume_text") @db.Text

  applications Application[]

  createdAt   DateTime @default(now()) @map("created_at")
  updatedAt   DateTime @updatedAt @map("updated_at")

  @@map("candidates")
}
```

**Vector Database Schema (Pinecone/Weaviate):**

- Store candidate embeddings with metadata: `{candidateId, jobId, vectorEmbedding, timestamp}`

## 5. API Interface Guidelines (Contract)

- **Standard:** RESTful API + GraphQL (cho search queries phức tạp).
- **Framework:** NestJS với decorators-based routing.

- **Response Format (REST):**

```json
{
  "status": 200,
  "message": "Success",
  "data": { ... },
  "timestamp": "2026-02-01T10:00:00Z"
}
```

- **Error Handling:** Sử dụng NestJS Exception Filters:

```json
{
  "status": 400,
  "error": "Bad Request",
  "message": "Invalid file format",
  "timestamp": "2026-02-01T10:00:00Z"
}
```

- **NestJS Architectural Patterns:**
  - **Guards:** `@UseGuards(JwtAuthGuard, RolesGuard)` cho authentication & authorization.
  - **Interceptors:** Logging, response transformation, caching.
  - **Pipes:** DTO validation với `class-validator` và `class-transformer`.
  - **Filters:** Global exception handling.

- **GraphQL Schema (Search Example):**

```graphql
type Query {
  searchCandidates(query: String!, jobId: ID, limit: Int): [Candidate!]!
}

type Candidate {
  id: ID!
  fullName: String!
  email: String!
  aiScore: Float
  skills: [String!]!
}
```

- **Documentation:**
  - **Swagger/OpenAPI:** Auto-generated từ NestJS decorators (`@ApiTags`, `@ApiOperation`, `@ApiResponse`).
  - **GraphQL Playground:** Built-in với NestJS GraphQL module.
  - Access tại: `http://localhost:3000/api/docs` (Swagger) và `http://localhost:3000/graphql` (GraphQL Playground).

## 6. Polyglot 3-Service Structure

Hệ thống sử dụng **Polyglot Architecture** với 3 services trong **single repository**.

### 6.1. Project Structure

```
talentflow-backend/  (Single Git Repository)
│
├── api-gateway/                  # Service 1: NestJS API Gateway
│   ├── src/
│   │   ├── main.ts
│   │   ├── app.module.ts
│   │   └── modules/
│   │       ├── auth/             # JWT Auth + RBAC
│   │       ├── users/            # User management
│   │       ├── jobs/             # Job CRUD
│   │       ├── candidates/       # Candidate management
│   │       ├── applications/     # Application tracking
│   │       └── upload/           # File upload → R2
│   ├── test/
│   ├── package.json
│   ├── tsconfig.json
│   └── prisma/
│       └── schema.prisma         # Shared Prisma schema
│
├── cv-parser/                    # Service 2: Spring Boot CV Parser
│   ├── src/main/java/
│   │   └── com/talentflow/parser/
│   │       ├── CvParserApplication.java
│   │       ├── config/
│   │       │   ├── BullMQConfig.java
│   │       │   └── R2Config.java
│   │       ├── consumer/
│   │       │   └── CvUploadedConsumer.java
│   │       ├── service/
│   │       │   ├── PdfParserService.java      # Apache PDFBox
│   │       │   ├── DocxParserService.java     # Apache POI
│   │       │   ├── TesseractService.java      # OCR
│   │       │   ├── LlmScoringService.java     # Anthropic API
│   │       │   └── R2StorageService.java
│   │       └── producer/
│   │           └── CvProcessedProducer.java
│   ├── src/test/java/
│   ├── pom.xml (or build.gradle)
│   └── application.yml
│
├── notification-service/         # Service 3: ASP.NET Core Notification
│   ├── Controllers/
│   │   └── NotificationController.cs
│   ├── Hubs/
│   │   └── NotificationHub.cs      # SignalR WebSocket
│   ├── Services/
│   │   ├── RabbitMQConsumer.cs
│   │   └── EmailService.cs
│   ├── Program.cs
│   └── appsettings.json
│
├── shared/                       # Shared code
│   ├── types/                    # TypeScript types (for NestJS services)
│   ├── configs/                  # Config templates
│   └── scripts/                  # Build scripts
│
├── docs/                         # Documentation
├── .github/workflows/            # CI/CD pipelines
├── docker-compose.yml            # PostgreSQL + Redis
├── .env.example
└── README.md
```

### 6.2. Service Responsibilities

#### **Service 1: API Gateway (NestJS)** - Port 3000

- Main HTTP server
- Handles all incoming REST API requests from Frontend
- Authentication & Authorization (JWT + RBAC)
- Database CRUD operations (Prisma)
- File upload to Cloudflare R2
- RabbitMQ Producer (emit jobs to queue)

#### **Service 2: CV Parser (Spring Boot)** - Port 8080

- RabbitMQ Consumer (listen `cv-processing` queue)
- CPU-intensive file processing (PDF/DOCX/OCR)
- LLM integration (Anthropic Claude)
- Database updates (Spring Data JPA)
- RabbitMQ Producer (emit `cv.parsed` events)

#### **Service 3: Notification (ASP.NET Core)** - Port 5000

- RabbitMQ Consumer (listen `cv-notifications` queue)
- WebSocket server (SignalR) for real-time updates
- Email notifications (SendGrid/Resend)
- SMS notifications (optional)

#### **libs/common**

- Shared guards, interceptors, pipes, filters
- Custom decorators: `@CurrentUser()`, `@Roles()`, `@Public()`

#### **shared/types**

- TypeScript type definitions shared across NestJS services
- DTOs, Interfaces, Enums

#### **shared/configs**

- Configuration templates
- Shared constants

### 6.3. Clean Architecture Layers in Practice

```
Presentation Layer (Controllers, Gateways)
    ↓
Application Layer (Services, Use Cases)
    ↓
Domain Layer (Entities, Business Logic)
    ↓
Infrastructure Layer (Prisma, BullMQ, R2, External APIs)
```

**Example: CV Upload Flow (API Gateway - NestJS)**

```typescript
// Presentation Layer
@Controller("candidates")
export class CandidateController {
  @Post("upload")
  async uploadCV(@UploadedFile() file: Express.Multer.File) {
    return this.candidateService.processCVUpload(file);
  }
}

// Application Layer
@Injectable()
export class CandidateService {
  async processCVUpload(file: File) {
    // Business logic
    const url = await this.r2Service.upload(file);
    await this.queueService.publishCvUploaded({ url });
  }
}

// Infrastructure Layer
@Injectable()
export class QueueService {
  async publishCvUploaded(data: CvUploadedEvent) {
    // RabbitMQ publish implementation
    this.channel.publish(
      "cv-events",
      "cv.uploaded",
      Buffer.from(JSON.stringify(data)),
    );
  }
}

// Infrastructure Layer (R2 Storage)
@Injectable()
export class R2Service {
  async upload(file: File): Promise<string> {
    // Cloudflare R2 SDK implementation
    return r2Url;
  }
}
```

**Example: CV Processing (CV Parser - Spring Boot)**

```java
@Service
public class CvProcessorService {

  @RabbitListener(queues = "cv-processing")
  public void processCv(CvUploadedEvent event) {
    String candidateId = event.getCandidateId();
    String cvUrl = event.getFileUrl();
    String jobId = event.getJobId();

    // 1. Download from R2
    byte[] pdfBytes = r2Client.download(cvUrl);

    // 2. Extract text (Apache PDFBox)
    String text = pdfBoxService.extractText(pdfBytes);

    // 3. LLM Scoring (Anthropic Claude)
    LlmResponse score = anthropicService.evaluate(text, jobRequirements);

    // 4. Update database
    candidateRepo.updateScore(candidateId, score);

    // 5. Emit to notification queue
    rabbitTemplate.convertAndSend("cv-events", "cv.parsed",
        new CvParsedEvent(candidateId, score));
  }
}
```

### 6.4. Environment Configuration

Each service has its own `.env` file but shares infrastructure credentials:

```
api-gateway/.env
cv-parser/.env (or application.yml)
notification-service/.env
```

**Key Environment Variables:**

```bash
# Database (Shared)
DATABASE_URL="postgresql://postgres:password@localhost:5432/talentflow_dev"

# RabbitMQ (Message Queue)
RABBITMQ_URL="amqp://rabbitmq:rabbitmq@localhost:5672"

# Redis (Cache only - not for queue)
REDIS_URL="redis://localhost:6379"

# Cloudflare R2 Storage
R2_ACCOUNT_ID="your-account-id"
R2_ACCESS_KEY_ID="your-access-key"
R2_SECRET_ACCESS_KEY="your-secret-key"
R2_BUCKET="talentflow-cvs"

# LLM API
ANTHROPIC_API_KEY="sk-ant-..."
# OR OPENAI_API_KEY="sk-..."

# Vector DB (Phase 2)
WEAVIATE_URL="http://localhost:8080"

# JWT (API Gateway)
JWT_SECRET="super-secret-key-change-in-production"
JWT_ACCESS_EXPIRATION="15m"
JWT_REFRESH_EXPIRATION="7d"

# Service Ports
API_GATEWAY_PORT=3000
CV_PARSER_PORT=8080
NOTIFICATION_PORT=5000
```

### 6.5. Development Commands

```bash
# Install dependencies
npm install

# Generate Prisma client
npm run prisma:generate

# Run migrations
npm run prisma:migrate

# Start all services in dev mode
npm run start:dev

# Start specific app
npm run start:dev api-gateway
npm run start:dev ai-worker

# Run tests
npm run test
npm run test:e2e

# Build all apps
npm run build

# Lint & format
npm run lint
npm run format
```
