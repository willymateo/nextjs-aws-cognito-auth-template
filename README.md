# Next.js AWS Cognito Authentication Template

A production-ready **starter template** for building secure, scalable web applications with AWS-managed authentication. Built with **Next.js 15**, **NextAuth.js v5**, **AWS Cognito**, and **DynamoDB**, this template demonstrates complete OAuth 2.0/OIDC authentication, user session management, protected routes with middleware, DynamoDB integration for data persistence, and includes a task management demo application. Perfect for developers who want to quickly bootstrap a Next.js application with enterprise-grade AWS authentication and data storage.

## 🚀 Getting Started

### Prerequisites

- Node.js 20+ installed
- AWS Account with configured Cognito User Pool and DynamoDB table
- npm, yarn, pnpm, or bun package manager

### 1. Install Dependencies

```bash
npm install
# or
yarn install
# or
pnpm install
```

### 2. Configure Environment Variables

Copy the [.env.template](https://github.com/willymateo/nextjs-aws-cognito-auth-template/blob/main/.env.template) file to `.env.local` and fill it with your AWS credentials and configuration values.

### 3. Run Development Server

```bash
npm run start:dev
# or
yarn start:dev
# or
pnpm start:dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.

## 🏭 Production Deployment

### Build for Production

```bash
npm run build
# or
yarn build
# or
pnpm build
```

This creates an optimized production build using Turbopack.

### Start Production Server

```bash
npm start
# or
yarn start
# or
pnpm start
```

## ☁️ AWS Services Configuration

### Required AWS Services

1. **Cognito User Pool**
   - Manages user registration, authentication, and account recovery
   - Configure OAuth 2.0 flows and hosted UI

2. **Cognito App Client**
   - Application credentials for NextAuth.js integration
   - Enable OAuth 2.0 flows (Authorization code grant)

3. **Cognito Hosted UI** (Optional)
   - Managed login/signup pages
   - Custom domain support

4. **Cognito Domain**
   - Required for OAuth 2.0 callbacks
   - Can use Amazon domain or custom domain

5. **Cognito Identity Pool**
   - Provides temporary AWS credentials for authenticated users
   - Enables direct access to DynamoDB from the application

6. **DynamoDB Table**
   - NoSQL database for application data (tasks in this template)
   - Partition key: `userId`, Sort key: `id`

7. **IAM Roles**
   - Authenticated role: Grants DynamoDB access to signed-in users
   - Unauthenticated role: Limited or no access
