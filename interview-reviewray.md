# ReviewRay: SDE-1 Interview Preparation Guide

This document is an end-to-end interview preparation guide for **ReviewRay**, an AI-powered, codebase-aware automated code review platform. It covers everything from 30-second elevator pitches to technical architecture, design trade-offs, vector search strategies, webhook reliability, security, and potential cross-questions.

---

## 1. Project Overview (30 Seconds)

- **What ReviewRay Is**: ReviewRay is a codebase-aware, automated AI code reviewer that integrates into GitHub developer workflows. When a developer opens or updates a Pull Request (PR), ReviewRay intercepts the webhook, extracts the diff, fetches relevant structural code context via vector search, generates a Staff-level code review, and posts structured inline feedback directly to GitHub.
- **Problem It Solves**: Human code reviews are bottlenecked by developer bandwidth, leading to long PR turnaround times. Standard static analysis tools catch syntax/lint errors, but lack deep semantic understanding of overall repository context, causing architectural drift, subtle bugs, and security vulnerabilities to pass into main branches.
- **Why I Built It**: To eliminate code review latency in fast-moving engineering teams while delivering high-signal, context-aware feedback (e.g., catching breaking API changes or N+1 query patterns across related files) rather than superficial style nitpicks.
- **Key Features**:
  - **Context-Aware Retrieval-Augmented Generation (RAG)**: Indexes codebase vectors in Pinecone using isolated namespaces (`{repo}--pr-{number}` and `{repo}--main`) to inject related codebase files into the LLM prompt.
  - **Asynchronous Event-Driven Pipeline**: Handled via Inngest queues so GitHub webhook HTTP connections respond within milliseconds, avoiding timeout failures during long LLM inference sessions.
  - **GitHub App Integration**: HMAC SHA-256 signature verification, automatic installation handling, and PR comment posting via Octokit.
  - **SaaS Monetization & Rate Limiting**: Built-in subscription tiers (Free vs. Pro) powered by Razorpay payment webhooks and atomic database usage checks.
- **Tech Stack (Brief)**: Next.js (App Router, React 19), TypeScript, PostgreSQL, Prisma ORM, Pinecone Vector DB, Inngest (Job Queue), Better Auth (GitHub OAuth), OpenRouter AI SDK, Razorpay, Tailwind CSS v4.

---

## 2. 5–6 Minute Project Explanation (Interview Script)

> _"Here is how I explain ReviewRay naturally when asked 'Tell me about your project' during an interview."_

### Introduction & Problem Statement

"ReviewRay is an automated, AI-powered code review platform designed to solve a major friction point in software teams: **code review delays and shallow static feedback**. Standard linters catch syntax issues, but miss cross-file architectural problems like broken API contracts, unhandled edge cases, and security vulnerabilities. Human reviews are high quality but slow down shipping velocity.

I built ReviewRay to provide immediate, Staff-engineer-level PR reviews directly inside GitHub comments by using Retrieval-Augmented Generation (RAG) across the target repository."

### Solution & User Flow

"From a user perspective, setup takes less than two minutes:

1. A developer logs into the ReviewRay dashboard using their GitHub account via **Better Auth**.
2. They install the ReviewRay **GitHub App** on their target repositories.
3. Once installed, whenever a developer opens a Pull Request or pushes new commits, ReviewRay receives a `pull_request` webhook event.
4. ReviewRay automatically parses the code diff, retrieves related code snippets from the codebase index, generates an actionable review, and posts it directly on the PR in GitHub."

### System Architecture & Data Pipeline

"Under the hood, ReviewRay is designed as a decoupled, asynchronous, event-driven architecture.

When GitHub sends a `pull_request` payload to our Next.js API route (`/api/webhooks/github`):

1. **Webhook Security & Offloading**: The backend immediately validates the `x-hub-signature-256` HMAC header. If valid, it records the PR in PostgreSQL via Prisma, checks the user’s subscription quota (Free vs. Pro), and emits an event `github/pr.received` to **Inngest**. The API route then returns a `200 OK` response immediately to GitHub within 50 milliseconds, preventing webhook timeouts.
2. **Chunking & Vector Indexing**: The background Inngest worker picks up the job. It uses Octokit to pull the modified files and unified diffs. It splits these code diffs into logical semantic chunks.
3. **Pinecone Isolation**: These chunks are converted to vector embeddings and stored in **Pinecone**. We use isolated namespaces—such as `owner-repo--pr-12` for PR-specific diffs and `owner-repo` for repository-wide index context—preventing context bleeding between different PRs or repos.
4. **RAG Context Search**: The worker queries Pinecone using the PR title and changed files to retrieve the top 10 most relevant code snippets across the repository.
5. **Structured LLM Generation**: We construct a prompt with strict system guidelines (instructing the model to prioritize Critical/High/Medium bugs like security leaks or N+1 queries over style nitpicks) and pass it to **OpenRouter AI SDK**.
6. **Publishing & State Update**: The generated Markdown review is posted back to the GitHub PR comment thread via Octokit, and the PR record status in PostgreSQL updates from `processing` to `reviewed`."

### Database, Auth, and Billing

"For state management, we use **PostgreSQL with Prisma ORM**. The schema tracks Users, GitHub App Installations, Pull Requests, Repo Sync jobs, and Sessions.

For authentication, we use **Better Auth** with GitHub OAuth to securely manage user sessions.

For billing, we integrated **Razorpay Subscriptions**. Webhooks for events like `subscription.activated` and `subscription.completed` update user plan statuses in real-time, enforcing tier-based review limits."

### Challenges & Engineering Trade-offs

"One major challenge was **Pinecone indexing latency**. Newly upserted vector embeddings aren't instantly searchable due to Pinecone's internal index propagation. To prevent empty search queries during automated execution, I implemented a controlled step sleep in Inngest prior to context retrieval.

Another trade-off was **Context Window vs. Cost/Latency**. Instead of feeding the whole codebase to the LLM (which is slow, expensive, and risks model hallucinations), I designed a dual-namespace vector retrieval system: one namespace for PR diff chunks and one for full repository syncs, injecting only high-relevance code snippets into the prompt."

---

## 3. Architecture Breakdown

### End-to-End Request Flow Diagram

```
Client (GitHub Event)
       │ (HTTP POST Webhook with HMAC signature)
       ▼
1. Next.js API Endpoint (/api/webhooks/github)
       │ (HMAC SHA-256 Verification via Octokit)
       ▼
2. Auth & Quota Check (Prisma / Postgres)
       │ (Queries User plan & rate limit)
       ▼
3. Controller / Event Dispatcher
       │ (Emits 'github/pr.received' event to Inngest)
       │ ──> Returns HTTP 200 OK to GitHub immediately (<50ms)
       ▼
4. Inngest Async Background Queue
       │
       ├──> Step 1: Mark PR status as 'processing' in Postgres
       ├──> Step 2: Fetch PR files & diffs via Octokit REST API
       ├──> Step 3: Parse diff into semantic CodeChunks
       ├──> Step 4: Upsert vector embeddings to Pinecone (Namespace: repo--pr-id)
       ├──> Step 5: Wait 10s for Pinecone index propagation step
       ├──> Step 6: Query Pinecone for top-k contextual code snippets (PR + Repo namespaces)
       ├──> Step 7: Call OpenRouter AI SDK (RAG Prompt Construction)
       ├──> Step 8: Post structured Markdown comment to GitHub PR via Octokit
       └──> Step 9: Mark PR status as 'reviewed' with comment payload in Postgres
```

### Complete Request Flow Step-by-Step

| Layer                  | Component                  | Execution Details                                                                                                       |
| :--------------------- | :------------------------- | :---------------------------------------------------------------------------------------------------------------------- |
| **Client**             | GitHub Webhook             | Triggered on `opened`, `synchronize`, `reopened` PR events. Sends POST request to `/api/webhooks/github`.               |
| **API Entry**          | Next.js API Route          | Receives raw request payload and headers (`x-hub-signature-256`, `x-github-event`).                                     |
| **Authentication**     | `isSignatureValid`         | Verifies secret signature using `app.webhooks.verify()` to prevent unauthorized forged webhook attacks.                 |
| **Validation & Quota** | `canUserReview`            | Checks User record in Postgres. If rate limited, updates PR status to `rate_limited` and short-circuits.                |
| **Controller**         | Event Dispatcher           | Triggers `inngest.send({ name: 'github/pr.received', data: { pullRequestId } })` and returns `HTTP 200 OK`.             |
| **Service Layer**      | Inngest Worker             | Step-driven workflow orchestrating status updates, diff fetching, chunking, and index operations.                       |
| **Vector DB / RAG**    | Pinecone Client            | Upserts vector records into dedicated namespace (`{repo}--pr-{id}`). Performs similarity search for `topK=10` snippets. |
| **AI Layer**           | OpenRouter + Vercel AI SDK | Invokes model with custom Staff Engineer prompt, diff context, and repo-wide context snippets.                          |
| **Database**           | PostgreSQL + Prisma        | Persists PR metadata (`headSha`, `status`, `reviewComment`, `reviewedAt`) and user subscription states.                 |
| **Response / Output**  | Octokit REST API           | Posts final formatted Markdown review comment to the GitHub PR thread.                                                  |

---

## 4. Tech Stack: Deep Dive & Comparisons

### 1. Next.js (App Router, React 19)

- **Why I Chose It**: Provides full-stack capabilities, serverless API routes, optimized React Server Components (RSC), and seamless deployment on Vercel.
- **Role in Project**: Hosts the dashboard UI, landing pages, authentication routes, and webhook processing endpoints.
- **Alternatives**: Vite + Express.js backend. (Next.js was preferred to keep the unified codebase, serverless deployment, and unified TypeScript types).
- **Interview Talking Point**: Explaining Server Actions vs. API Routes, edge runtime considerations, and why Next.js App Router works well for full-stack event-driven apps.

### 2. TypeScript

- **Why I Chose It**: Strict static typing prevents runtime null pointer bugs when handling complex third-party payload types (GitHub Webhooks, Pinecone API results, Razorpay responses).
- **Role in Project**: End-to-end type safety for database models, API routes, and event payloads.
- **Alternatives**: Plain JavaScript.
- **Interview Talking Point**: Used generic interfaces, strict type assertions for external API outputs, and typed Inngest step schemas.

### 3. PostgreSQL & Prisma ORM

- **Why I Chose It**: PostgreSQL provides ACID compliance, strong relational integrity, and fast indexed lookups. Prisma provides a type-safe client with auto-generated TS definitions and migration tracking.
- **Role in Project**: Stores core domain data: Users, Accounts, Sessions, GitHub App Installations, Pull Requests, and Repo Sync states.
- **Alternatives**: Drizzle ORM, TypeORM, MongoDB.
- **Interview Talking Point**: Prisma was paired with `@prisma/adapter-pg` for connection pool optimization on serverless routes.

### 4. Pinecone Vector Database

- **Why I Chose It**: Managed, high-performance vector search engine supporting namespace multi-tenancy without needing to manage self-hosted vector infrastructure like pgvector.
- **Role in Project**: Indexes code chunks as vector embeddings and executes semantic similarity searches (`topK=10`) to retrieve contextual code snippets.
- **Alternatives**: Pgvector (Postgres extension), Qdrant, Weaviate.
- **Interview Talking Point**: Using namespaces (`{repo}--pr-{number}` and `{repo}--main`) allowed complete multi-tenant isolation and fast index operations.

### 5. Inngest (Async Background Queue & Workflow Orchestrator)

- **Why I Chose It**: Built for serverless environments (like Vercel) where long-running functions get terminated. Handles retries, step-by-step executions, and stateful delays (`step.sleep`).
- **Role in Project**: Orchestrates PR review processing and full repository syncing without blocking API request threads.
- **Alternatives**: BullMQ + Redis, Celery, AWS SQS.
- **Interview Talking Point**: Inngest allowed durable execution. If the LLM API fails, Inngest automatically retries only the failed step (`generate-ai-review`), rather than re-running the entire diff parsing pipeline.

### 6. Better Auth (with GitHub Provider)

- **Why I Chose It**: Modern, lightweight authentication framework tailored for TypeScript and Next.js, supporting database session management via Prisma adapters.
- **Role in Project**: Handles user login via GitHub OAuth and session persistence.
- **Alternatives**: NextAuth.js (Auth.js), Clerk, Supabase Auth.
- **Interview Talking Point**: Better Auth seamlessly integrates with Prisma and supports mapping custom GitHub profiles directly to user records.

### 7. Razorpay Payment Gateway

- **Why I Chose It**: Industry-standard payment gateway for subscription lifecycles, supporting webhooks with HMAC signature validation.
- **Role in Project**: Manages Pro tier upgrades, subscription renewals, cancellations, and status syncing via webhooks.
- **Alternatives**: Stripe.
- **Interview Talking Point**: Validated webhook signatures using Node `crypto` (`timingSafeEqual` with HMAC SHA-256) to ensure webhook requests are genuine.

---

## 5. Comprehensive Interview Questions & Answers

### Category 1: Project Overview & Core Logic

#### Q1: What is the primary architecture pattern of ReviewRay?

**Answer**: ReviewRay uses an **Event-Driven, Asynchronous Micro-Workflow Architecture** centered around Retrieval-Augmented Generation (RAG). Webhooks ingest events into a serverless API, which validates signatures and offloads heavy processing to an Inngest background queue. The background queue uses Pinecone for vector retrieval, OpenRouter for LLM inference, and Octokit to update GitHub.

#### Q2: Why is vector retrieval (RAG) necessary for a code review tool? Why not just pass the git diff to the LLM?

**Answer**: Git diffs only show modified lines in isolation. A bug often occurs because a modified function breaks callers or dependencies in _unmodified_ files. Passing only the diff leads to shallow reviews. Fulfilling the prompt with full repo context via vector search (Pinecone) supplies cross-file context (e.g. function signatures, type definitions, helper utilities) while keeping prompt tokens focused and cost-effective.

---

### Category 2: Architecture & Webhooks

#### Q3: How do you handle GitHub Webhook timeout limits (which are 10 seconds)?

**Answer**: The GitHub webhook route `/api/webhooks/github` does minimal work:

1. Validates the signature via HMAC SHA-256.
2. Saves a initial pending record in PostgreSQL.
3. Dispatches an async event to Inngest (`github/pr.received`).
4. Immediately returns `HTTP 200 OK` in <50ms.
   The time-consuming work (fetching diffs, vector embedding, LLM generation) happens entirely within background Inngest steps.

#### Q4: What happens if GitHub sends duplicate webhook events for the same PR?

**Answer**: In our database model, `PullRequest` has a unique constraint on `@@unique([repoFullName, prNumber])`. When duplicate webhooks arrive, `savePullRequest` performs an `upsert` operation, updating `headSha` and status instead of creating duplicate records. Inngest function triggers can also be configured with idempotency keys.

---

### Category 3: Vector Search & RAG

#### Q5: How do you prevent vector data from one PR from leaking into another PR's review?

**Answer**: We utilize Pinecone's **Namespaces**. Each PR review job generates vectors scoped to a unique namespace string: `buildPrNamespace(repoFullName, prNumber)` (e.g., `owner-repo--pr-42`). Search queries are strictly executed against that namespace. Once the PR review is completed, the namespace can be cleared or kept isolated from the main repo branch index (`owner-repo`).

#### Q6: Why is there a `step.sleep('wait-for-vectors-to-index', '10s')` in your Inngest function?

**Answer**: Pinecone upsert operations are asynchronously indexed. There is a small window (typically 1–5 seconds) between sending vectors to Pinecone and them becoming available for similarity queries. Adding a 10-second pause ensures that when `searchPrContext` runs, the newly upserted vectors are fully queryable, preventing empty search results.

---

### Category 4: Backend & Database

#### Q7: Why use Prisma with `@prisma/adapter-pg` instead of standard Prisma client?

**Answer**: Next.js serverless functions spin up and down dynamically. Standard ORM connections can quickly exhaust PostgreSQL connection pools (`Too many clients` error). `@prisma/adapter-pg` utilizes node-postgres (`pg`) pool management, optimizing connection reuse across serverless executions.

#### Q8: What database schema design decisions were made for user subscription tiers?

**Answer**: In the `User` model, we track `plan` (`free` | `pro`), `subscriptionStatus` (`active` | `canceled` | `trialing`), `razorpaySubscriptionId`, and `subscriptionRenewsAt`. Before processing a PR in `webhook-handler.ts`, we execute `canUserReview(userId)`, which queries the user's plan and monthly PR review count atomically. If exceeded, the PR status is set to `rate_limited`.

---

### Category 5: AI & System Prompt Engineering

#### Q9: How do you prevent the LLM from nitpicking code formatting and syntax style?

**Answer**: Through strict **System Prompt Engineering**. The system prompt instructs the AI:

- Persona: "Staff+ Software Engineer".
- Focus Areas: Production outages, security flaws (SQL injection, XSS), performance bottlenecks (N+1 queries), breaking API changes.
- Explicit Instruction: "Do NOT nitpick formatting, style preferences, or subjective opinions unless they materially impact maintainability."
- Structured Output: Mandates structured markdown output with clear severity categories (`🚨 Critical/High`, `⚠️ Medium`, `✅ What Looks Good`).

#### Q10: What AI SDK do you use and why OpenRouter?

**Answer**: We use the Vercel `ai` SDK paired with `@openrouter/ai-sdk-provider`. OpenRouter provides a unified API interface to switch seamlessly between different underlying LLM models (Claude 3.5 Sonnet, GPT-4o, DeepSeek-R1) without rewriting provider SDK code.

---

### Category 6: Security & Authentication

#### Q11: How do you verify that a webhook payload actually originated from GitHub and wasn't forged by a malicious client?

**Answer**: GitHub signs every payload using an HMAC SHA-256 algorithm with a shared secret set during GitHub App configuration. The signature is sent in the `x-hub-signature-256` header. On our server:

```ts
const app = getGithubApp();
const isValid = await app.webhooks.verify(payload, signature);
```

If `isValid` is false, the route immediately rejects the request with `HTTP 401 Unauthorized`.

#### Q12: How are Razorpay webhooks secured against timing attacks?

**Answer**: In `/api/razorpay/webhook/route.ts`, we calculate the expected HMAC hex digest using `crypto.createHmac('sha256', secret)`. To compare the expected signature against the header, we use `crypto.timingSafeEqual`:

```ts
timingSafeEqual(Buffer.from(expected), Buffer.from(signature));
```

This avoids standard `===` string comparison, eliminating side-channel timing attacks where an attacker measures response times to guess valid signatures character by character.

---

## 6. Real-World Cross Questions & Deep Dives

### Topic A: Scalability & Queue Management

- **Interviewer Cross Question**: _"What happens if 1,000 PRs are opened simultaneously? Won't your Inngest workers hit LLM rate limits or Pinecone quota limits?"_
- **Practical Answer**:
  - Inngest supports **Concurrency Controls** and **Rate Limiting** definitions right inside `createFunction`. We can set `concurrency: { limit: 10 }` to throttle parallel executions.
  - For LLM rate limits, Inngest automatically catches 429 status codes and applies exponential backoff retries.
  - In Postgres, we mark PRs as `pending` so queued jobs execute sequentially without dropping events.

---

### Topic B: Vector Chunking Strategy

- **Interviewer Cross Question**: _"How do you split code files into chunks? What happens if a function definition is split right down the middle?"_
- **Practical Answer**:
  - Standard naive chunking (splitting strictly by character count) can cut code functions mid-syntax, corrupting AST context.
  - In our chunking module (`chunk-code.ts`), we chunk files based on diff boundary headers (`@@ -L,C +L,C @@`) and logical block breaks (e.g. line deltas or function boundaries).
  - For repository-wide syncing, we retain file path headers (`File: src/utils/auth.ts`) within each vector metadata payload so the LLM retains structural context.

---

### Topic C: Security of User Repository Code

- **Interviewer Cross Question**: _"Developers are sensitive about sending proprietary code to third-party AI APIs. How does ReviewRay handle code privacy?"_
- **Practical Answer**:
  - Code diffs are stored temporarily in Pinecone under ephemeral namespaces (`repo--pr-id`).
  - We configure OpenRouter model options to select zero-data-retention endpoints where code inputs are not used for AI model training.
  - GitHub App Private Keys are stored securely in environment variables and rotated using RSA key standards.

---

## 7. Rapid Revision Sheet (One-Page Cheat Sheet)

```
========================================================================================
                          REVIEWRAY RAPID REVISION CHEAT SHEET
========================================================================================

1. ARCHITECTURE PATTERN
   - Trigger: GitHub Webhook (POST /api/webhooks/github)
   - Validation: HMAC SHA-256 (x-hub-signature-256 via Octokit)
   - Handshake: Immediate HTTP 200 OK response (<50ms) to prevent GitHub timeout
   - Processing: Inngest Background Worker (Serverless durable step functions)
   - Search: Pinecone Vector Database (RAG pipeline with isolated namespaces)
   - LLM: OpenRouter AI SDK (Staff-level engineering system prompt)
   - Output: Octokit REST API posts structured Markdown review comment on GitHub PR

2. CORE TECH STACK
   - Framework: Next.js (App Router, React 19)
   - Language: TypeScript (Strict Mode)
   - Database: PostgreSQL with Prisma ORM (@prisma/adapter-pg connection pool)
   - Vector DB: Pinecone Database (@pinecone-database/pinecone)
   - Queue: Inngest (inngest-cli, step.run, step.sleep)
   - Auth: Better Auth (GitHub OAuth integration)
   - Payments: Razorpay Subscriptions Gateway (Webhook HMAC signature verification)

3. DATABASE MODELS (Prisma)
   - User: id, email, plan (free|pro), razorpaySubscriptionId, subscriptionStatus
   - GithubInstallation: id, userId, installationId (numeric GitHub ID)
   - PullRequest: id, repoFullName, prNumber, headSha, status (pending|processing|reviewed|rate_limited)
   - RepoSync: id, repoFullName, branch, status (pending|syncing|synced|failed), chunkCount

4. KEY SECURITY PATTERNS
   - GitHub Webhooks: HMAC SHA-256 validation via app.webhooks.verify()
   - Razorpay Webhooks: crypto.timingSafeEqual() against expected HMAC SHA-256 hash
   - Vector Multi-Tenancy: Scoped namespaces (e.g. owner-repo--pr-12) prevent context leakage

5. TOP 3 KEY TALKING POINTS FOR INTERVIEWS
   - 1. Async Offloading: Solved 10-second webhook timeouts using Inngest event queues.
   - 2. Context-Aware RAG: Combined PR diff chunks with codebase vectors for deep reviews.
   - 3. Production Hardening: Handled Pinecone indexing delays, connection pooling, and timing attacks.
========================================================================================
```
