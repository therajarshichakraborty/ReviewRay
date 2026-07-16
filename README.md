# ReviewRay

ReviewRay is a codebase-aware, automated AI code review engine designed to integrate with GitHub workflows. The application intercepts pull requests via webhooks, retrieves context from a vector database representing the codebase structure, generates reviews utilizing Large Language Models, and posts automated feedback directly onto the active code changes.

## System Previews

### Landing Page
![Landing Page](public/landing.png)

### Developer Dashboard
![Developer Dashboard](public/dashboard.png)

### Account Settings and Billing
![Account Settings](public/settings.png)

---

## Core Features

* **Contextual Codebase Intelligence**: Resolves file structures and module imports to provide code reviews that understand project-wide architecture instead of analyzing files in isolation.
* **Asynchronous Webhook Processing**: Employs background task queues to process incoming GitHub pull request events without blocking main thread executions.
* **Vector Semantic Search**: Leverages vector embeddings to build an indexed map of repository code chunks, allowing fast retrieval of relevant code snippets.
* **Automated Pull Request Integration**: Automatically posts granular inline comments directly onto specific code lines in active pull requests.
* **SaaS Subscription Lifecycle**: Implements full billing lifecycles including upgrades, renewals, and cancellations.

---

## Architecture and Data Flow

ReviewRay is built around a Retrieval-Augmented Generation (RAG) pipeline designed for software codebases. The data flow proceeds as follows:

```
[GitHub PR Event] ──> [Vercel Webhook Endpoint] ──> [Inngest Event Queue]
                                                             │
                                                             ▼
[Pinecone Index] <── [Fetch Code Context] <── [Parse PR Diff & Target Files]
       │
       ▼
[OpenRouter API] ──> [Assemble Prompts] ──> [Generate Automated Review]
                                                             │
                                                             ▼
                                                [Post Comments to GitHub]
```

1. **Ingestion and Embedding**: When a repository is synchronized, code files are retrieved, parsed into logical semantic chunks, processed into vector embeddings, and stored in a Pinecone index.
2. **Event Interception**: A dedicated GitHub App registers webhook subscriptions for active repositories. Opening or updating a pull request triggers an event payload.
3. **Context Retrieval**: The system reads the pull request diff, identifies files modified, and queries Pinecone to fetch semantically relevant code from the surrounding project.
4. **Prompt Compilation**: The system compiles a prompt comprising the pull request diff, the retrieved code context, and architectural guidelines.
5. **Review Generation**: The payload is sent to OpenRouter to run reasoning models.
6. **Publishing Feedback**: The structured review comment is formatted and posted back to the GitHub Pull Request using the Octokit client.

---

## Technology Stack

* **Core Framework**: Next.js (App Router) utilizing React 19
* **Language**: TypeScript (Strict Mode)
* **Database Layer**: PostgreSQL managed via Prisma ORM
* **Vector Database**: Pinecone Client
* **Queue Management**: Inngest asynchronous job scheduling
* **Authentication**: Better Auth with GitHub OAuth integration
* **Billing and Subscriptions**: Razorpay Payment Gateway integration
* **UI Styling**: Tailwind CSS v4, Radix UI primitives, Lucide React, and Phosphor Icons

---

## Environment Setup

To run the application locally, create a `.env` file in the root directory containing the following configuration:

```env
# Database Configuration
DATABASE_URL="postgresql://user:password@host:port/dbname?sslmode=require"

# Better Auth Configuration
BETTER_AUTH_SECRET="your_32_character_session_signing_secret"
BETTER_AUTH_URL="http://localhost:3000"

# GitHub Auth and App Credentials
GITHUB_CLIENT_ID="your_github_oauth_client_id"
GITHUB_CLIENT_SECRET="your_github_oauth_client_secret"
GITHUB_APP_ID="your_github_app_id"
GITHUB_APP_NAME="your_github_app_name"
GITHUB_WEBHOOK_SECRET="your_github_webhook_secret"
GITHUB_APP_PRIVATE_KEY="-----BEGIN RSA PRIVATE KEY-----\nyour_github_app_private_key_escaped_newlines\n-----END RSA PRIVATE KEY-----"
NEXT_PUBLIC_GITHUB_PUBLIC_LINK="https://github.com/apps/your-app-slug"

# Vector Indexing
PINECONE_INDEX="your_pinecone_index_name"
PINECONE_API_KEY="your_pinecone_api_key"
PINECONE_HOST_NAME="your_pinecone_index_host_url"

# LLM Provider
OPENROUTER_API_KEY="your_openrouter_api_key"

# Payment Processor
NEXT_PUBLIC_RAZORPAY_TEST_API_KEY="your_razorpay_key_id"
NEXT_PUBLIC_RAZORPAY_TEST_KEY_SECRET="your_razorpay_key_secret"
NEXT_PUBLIC_RAZORPAY_PLAN_ID="your_razorpay_subscription_plan_id"
NEXT_PUBLIC_RAZORPAY_WEBHOOK_SECRET="your_razorpay_webhook_secret"
```

---

## Installation and Execution

1. Clone the repository and install all dependencies:
   ```bash
   bun install
   ```

2. Generate the Prisma client interface:
   ```bash
   bunx prisma generate
   ```

3. Synchronize database schemas:
   ```bash
   bunx prisma db push
   ```

4. Start the local Inngest development server:
   ```bash
   bunx inngest-cli dev
   ```

5. Launch the Next.js development server:
   ```bash
   bun run dev
   ```

Open `http://localhost:3000` to interact with the application.
