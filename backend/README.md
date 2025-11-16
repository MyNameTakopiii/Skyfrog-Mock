# Backend API Service

Express.js backend service running on Bun runtime (local development) with TypeScript, NeonDB via Prisma ORM, and @auth/express authentication middleware.

## Prerequisites

- [Bun](https://bun.sh) v1.2.21 or higher (for local development)
- Node.js v18+ (for Vercel deployment)
- NeonDB PostgreSQL database
- Vercel account (for deployment)

## Local Development Setup

### 1. Install Dependencies

```bash
bun install
```

### 2. Configure Environment Variables

Copy the example environment file and configure your variables:

```bash
cp .env.example .env
```

Edit `.env` with your actual values:

```env
DATABASE_URL="postgresql://USER:PASSWORD@HOST/dbname?sslmode=require"
AUTH_SECRET="your-secret-key-min-32-chars"
AUTH_TRUST_HOST=true
NODE_ENV="development"
FRONTEND_URL="http://localhost:5173"
```

### 3. Set Up Database

Generate Prisma Client and run migrations:

```bash
bun run prisma:generate
bun run prisma:migrate
```

### 4. Run Development Server

```bash
bun run dev
```

The server will start on `http://localhost:3000` with hot reload enabled.

## Available Scripts

- `bun run dev` - Start development server with hot reload
- `bun run build` - Build TypeScript to JavaScript
- `bun run start` - Start production server (requires build first)
- `bun run prisma:generate` - Generate Prisma Client
- `bun run prisma:migrate` - Run database migrations (development)
- `bun run prisma:migrate:deploy` - Deploy migrations (production)
- `bun run prisma:studio` - Open Prisma Studio for database inspection
- `bun run prisma:push` - Push schema changes without migrations

## Project Structure

```
backend/
├── src/
│   ├── index.ts           # Main entry point
│   ├── app.ts             # Express app configuration
│   ├── routes/            # API route handlers
│   ├── controllers/       # Business logic (future)
│   ├── middleware/        # Custom middleware
│   │   └── auth.ts        # Authentication configuration
│   ├── lib/               # Utility functions
│   │   ├── prisma.ts      # Prisma Client singleton
│   │   └── errors.ts      # Error handling utilities
│   └── types/             # TypeScript type definitions
├── prisma/
│   └── schema.prisma      # Prisma schema
├── dist/                  # Compiled JavaScript (generated)
├── .env                   # Environment variables (not in git)
├── .env.example           # Environment variables template
├── vercel.json            # Vercel deployment configuration
├── tsconfig.json          # TypeScript configuration
└── package.json           # Dependencies and scripts
```

## API Endpoints

- `GET /api/health` - Health check endpoint
- `POST /api/auth/*` - Authentication endpoints (handled by @auth/express)
- `GET /api/v1/*` - Versioned API routes

## Vercel Deployment

### Initial Setup

1. **Install Vercel CLI** (optional, for local testing):

```bash
npm i -g vercel
```

2. **Link Your Project to Vercel**:

Navigate to the backend directory and run:

```bash
cd backend
vercel link
```

Follow the prompts to link to your Vercel project.

### Configure Environment Variables in Vercel

Set the following environment variables in your Vercel project dashboard (Settings → Environment Variables):

#### Required Variables

| Variable          | Description                                  | Example                                          |
| ----------------- | -------------------------------------------- | ------------------------------------------------ |
| `DATABASE_URL`    | NeonDB connection string                     | `postgresql://user:pass@host/db?sslmode=require` |
| `AUTH_SECRET`     | Secret key for authentication (min 32 chars) | Generate with: `openssl rand -base64 32`         |
| `AUTH_TRUST_HOST` | Trust host header (required for Vercel)      | `true`                                           |
| `NODE_ENV`        | Environment mode                             | `production`                                     |
| `FRONTEND_URL`    | Frontend URL for CORS                        | `https://your-frontend.vercel.app`               |

#### Optional Provider Variables

Add these if using OAuth providers:

- `AUTH_GOOGLE_ID` - Google OAuth Client ID
- `AUTH_GOOGLE_SECRET` - Google OAuth Client Secret
- `AUTH_GITHUB_ID` - GitHub OAuth Client ID
- `AUTH_GITHUB_SECRET` - GitHub OAuth Client Secret

### Vercel Project Settings

Configure these settings in your Vercel project dashboard:

1. **Root Directory**: Set to `backend`
2. **Framework Preset**: Other
3. **Build Command**: `npm run build && npm run prisma:generate`
4. **Output Directory**: `dist`
5. **Install Command**: `npm install`
6. **Node.js Version**: 18.x or higher

### Deploy to Vercel

#### Option 1: Deploy via Git (Recommended)

Push changes to your GitHub repository. Vercel will automatically deploy when changes are detected in the `backend/` directory (configured via GitHub Actions).

```bash
git add .
git commit -m "Update backend"
git push origin main
```

#### Option 2: Deploy via Vercel CLI

```bash
cd backend
vercel --prod
```

### Post-Deployment

After deployment, run database migrations:

```bash
vercel env pull .env.production
npm run prisma:migrate:deploy
```

Or set up a deployment hook to run migrations automatically.

### Vercel Configuration Details

The `vercel.json` file configures:

- **Runtime**: Node.js (Bun not natively supported on Vercel yet)
- **Build**: Compiles TypeScript and generates Prisma Client
- **Routes**: All requests routed to the Express app
- **Environment**: References to Vercel environment variables

### Troubleshooting Vercel Deployment

**Build Failures:**

- Ensure all environment variables are set in Vercel dashboard
- Check build logs for TypeScript or dependency errors
- Verify `DATABASE_URL` is accessible from Vercel's network

**Runtime Errors:**

- Check function logs in Vercel dashboard
- Ensure Prisma Client is generated during build
- Verify database connection string includes `?sslmode=require`

**Cold Start Issues:**

- Vercel serverless functions have cold starts (~1-2s)
- Consider using Vercel Edge Functions for critical paths
- Implement connection pooling (Prisma handles this)

## Database Management

### Running Migrations

**Development:**

```bash
bun run prisma:migrate
```

**Production (Vercel):**

```bash
npm run prisma:migrate:deploy
```

### Viewing Database

Open Prisma Studio to inspect and edit data:

```bash
bun run prisma:studio
```

### Creating New Models

1. Edit `prisma/schema.prisma`
2. Run `bun run prisma:migrate` to create migration
3. Prisma Client types are automatically updated

## Security Notes

- Never commit `.env` file to version control
- Use strong secrets (min 32 characters) for `AUTH_SECRET`
- Enable CORS only for trusted frontend origins
- Keep dependencies updated for security patches
- Use environment variables for all sensitive data

## GitHub Actions Integration

The backend deployment is automated via GitHub Actions. The workflow triggers only when changes are made to the `backend/` directory.

### Required GitHub Secrets

Configure these secrets in your GitHub repository (Settings → Secrets and variables → Actions):

| Secret              | Description                 | How to Get                                                  |
| ------------------- | --------------------------- | ----------------------------------------------------------- |
| `VERCEL_TOKEN`      | Vercel authentication token | Generate at: https://vercel.com/account/tokens              |
| `VERCEL_ORG_ID`     | Your Vercel organization ID | Found in `.vercel/project.json` after running `vercel link` |
| `VERCEL_PROJECT_ID` | Your Vercel project ID      | Found in `.vercel/project.json` after running `vercel link` |
| `DATABASE_URL`      | NeonDB connection string    | Your NeonDB dashboard                                       |

### Workflow Behavior

The GitHub Actions workflow (`.github/workflows/backend.yml`) will:

1. **Trigger** when:
   - Changes are pushed to the `main` branch in the `backend/` directory
   - Changes are made to the workflow file itself
   - Manually triggered via workflow_dispatch

2. **Execute** these steps:
   - Checkout code
   - Setup Bun runtime
   - Install dependencies
   - Generate Prisma Client
   - Run database migrations
   - Build TypeScript
   - Deploy to Vercel using Vercel CLI

3. **Output** deployment URL and summary in GitHub Actions logs

### Setting Up GitHub Actions

1. **Link Vercel Project** (one-time setup):

```bash
cd backend
vercel link
```

This creates a `.vercel/project.json` file with your `VERCEL_ORG_ID` and `VERCEL_PROJECT_ID`.

2. **Generate Vercel Token**:

Visit https://vercel.com/account/tokens and create a new token with deployment permissions.

3. **Add Secrets to GitHub**:

Go to your repository → Settings → Secrets and variables → Actions → New repository secret

Add all four required secrets listed above.

4. **Test the Workflow**:

Push a change to the `backend/` directory or manually trigger the workflow from the Actions tab.

### Monitoring Deployments

- View workflow runs in the **Actions** tab of your GitHub repository
- Check deployment status in your Vercel dashboard
- Review logs for any build or deployment errors

### Troubleshooting GitHub Actions

**Workflow Not Triggering:**

- Verify changes are in the `backend/` directory
- Check that you're pushing to the `main` branch
- Ensure the workflow file is in `.github/workflows/`

**Deployment Failures:**

- Verify all GitHub secrets are correctly set
- Check that `DATABASE_URL` is accessible from GitHub Actions
- Review workflow logs for specific error messages
- Ensure Vercel project is properly linked

**Migration Failures:**

- Verify `DATABASE_URL` secret is correct
- Check that database is accessible from GitHub Actions IPs
- Ensure migrations are compatible with production database

## Support

For issues or questions:

- Check Vercel deployment logs
- Review Prisma documentation: https://www.prisma.io/docs
- Review @auth/express documentation: https://authjs.dev/getting-started/installation?framework=express
