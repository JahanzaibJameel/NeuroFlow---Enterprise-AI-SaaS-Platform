# Deployment Guide

> **Version**: 1.0.0  
> **Last Updated**: 2026-09-24  
> **Target Platforms**: Vercel (recommended), Docker, Self-hosted

---

## Quick Deploy to Vercel

### Prerequisites

- GitHub/GitLab/Bitbucket repository
- Vercel account
- PostgreSQL database (Vercel Postgres, Neon, Supabase, or self-hosted)
- Domain name (optional)

### One-Click Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/your-org/neuroflow)

### Manual Vercel Deploy

```bash
# 1. Install Vercel CLI
pnpm add -g vercel

# 2. Login
vercel login

# 3. Link project
vercel link

# 4. Deploy to production
vercel --prod
```

---

## Environment Variables

### Required for Production

| Variable | Description | Example |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://user:pass@host:5432/db` |
| `AUTH_SECRET` | NextAuth secret (32+ chars) | `openssl rand -base64 32` |
| `AUTH_URL` | Your production URL | `https://app.neuroflow.dev` |

### Optional (Feature Flags)

| Variable | Feature | Required |
|----------|---------|----------|
| `GOOGLE_CLIENT_ID` | Google OAuth | No |
| `GOOGLE_CLIENT_SECRET` | Google OAuth | No |
| `OPENAI_API_KEY` | AI fallback streaming | No |
| `BLOB_READ_WRITE_TOKEN` | File uploads | No |
| `SENTRY_DSN` | Error tracking | No |
| `SENTRY_ORG` | Sentry organization | No |
| `SENTRY_PROJECT` | Sentry project | No |
| `EDGE_CONFIG` | Feature flags | No |
| `UPSTASH_REDIS_REST_URL` | Rate limiting | No |
| `UPSTASH_REDIS_REST_TOKEN` | Rate limiting | No |

### Generate AUTH_SECRET

```bash
# Linux/macOS
openssl rand -base64 32

# Windows PowerShell
[Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Maximum 256 }))
```

---

## Database Setup

### Option 1: Vercel Postgres (Easiest)

1. In Vercel dashboard, go to **Storage** → **Create Database** → **Postgres**
2. Copy the connection string to `DATABASE_URL`
3. Vercel automatically manages connection pooling

### Option 2: Neon (Serverless Postgres)

1. Create account at [neon.tech](https://neon.tech)
2. Create project → Copy connection string
3. Add `?sslmode=require` if not present

### Option 3: Supabase

1. Create project at [supabase.com](https://supabase.com)
2. Settings → Database → Connection string (Transaction Pooler)
3. Use format: `postgresql://postgres:[password]@[host]:5432/postgres`

### Option 4: Self-Hosted PostgreSQL

```bash
# Docker
docker run -d \
  --name postgres \
  -e POSTGRES_DB=neuroflow \
  -e POSTGRES_USER=neuroflow \
  -e POSTGRES_PASSWORD=secure_password \
  -p 5432:5432 \
  -v postgres_data:/var/lib/postgresql/data \
  postgres:15

# Connection string
DATABASE_URL="postgresql://neuroflow:secure_password@localhost:5432/neuroflow"
```

### Initialize Schema

```bash
# After setting DATABASE_URL
pnpm prisma generate
pnpm prisma db push
pnpm prisma db seed
```

---

## File Storage (Vercel Blob)

### Setup

1. In Vercel dashboard: **Storage** → **Create** → **Blob**
2. Copy `BLOB_READ_WRITE_TOKEN` to environment variables
3. Files API will automatically use Blob storage

### Alternative: AWS S3

```bash
# Install AWS SDK
pnpm add @aws-sdk/client-s3

# Environment
AWS_REGION="us-east-1"
AWS_ACCESS_KEY_ID="..."
AWS_SECRET_ACCESS_KEY="..."
S3_BUCKET="neuroflow-files"
```

Update `app/api/files/route.ts` to use S3 instead of Vercel Blob.

---

## Authentication Providers

### Google OAuth

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create project → APIs & Services → Credentials
3. Create OAuth 2.0 Client ID
4. Authorized redirect URI: `https://your-domain.com/api/auth/callback/google`
4. Add `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` to Vercel

### Adding More Providers

Edit `lib/auth/index.ts`:

```typescript
import GitHub from 'next-auth/providers/github';

providers: [
  GitHub({
    clientId: process.env.GITHUB_CLIENT_ID!,
    clientSecret: process.env.GITHUB_CLIENT_SECRET!,
  }),
  // ... existing providers
]
```

---

## Build & Deploy Commands

### Vercel (Automatic)

Vercel detects Next.js and runs:

```bash
# Install
pnpm install

# Generate Prisma Client
pnpm prisma generate

# Build
pnpm build
```

### Custom Build (Docker/Other)

```dockerfile
# Build stage
FROM node:20-alpine AS builder
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN corepack enable pnpm && pnpm i --frozen-lockfile
COPY . .
RUN corepack enable pnpm && pnpm prisma generate && pnpm build

# Runner
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
USER nextjs
EXPOSE 3000
CMD ["node", "server.js"]
```

---

## CI/CD Pipeline

### GitHub Actions (Example)

```yaml
# .github/workflows/deploy.yml
name: Deploy to Vercel

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v2
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'pnpm'
      - run: pnpm install --frozen-lockfile
      - run: pnpm typecheck
      - run: pnpm lint
      - run: pnpm build

  deploy:
    needs: test
    if: github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          vercel-args: '--prod'
```

### Required Secrets

| Secret | Description |
|--------|-------------|
| `VERCEL_TOKEN` | Vercel access token |
| `VERCEL_ORG_ID` | Organization ID |
| `VERCEL_PROJECT_ID` | Project ID |

---

## Domain Configuration

### Custom Domain (Vercel)

1. Vercel Dashboard → Project → Settings → Domains
2. Add domain → Verify ownership
3. DNS records automatically configured

### DNS Records (Manual)

| Type | Name | Value |
|------|------|-------|
| A | @ | 76.76.21.21 (Vercel) |
| CNAME | www | cname.vercel-dns.com |

---

## SSL/TLS

Vercel provides automatic HTTPS with Let's Encrypt. No configuration needed.

For custom SSL:
1. Vercel Dashboard → Domains → SSL/TLS
2. Upload certificate/key or use Vercel's automatic provisioning

---

## Monitoring & Observability

### Sentry (Error Tracking)

```bash
# Install
pnpm add @sentry/nextjs

# Configure sentry.client.config.ts
import * as Sentry from '@sentry/nextjs';
Sentry.init({
  dsn: process.env.SENTRY_DSN,
  tracesSampleRate: 1.0,
});
```

### Health Checks

```typescript
// app/api/health/route.ts
export async function GET() {
  try {
    await prisma.$queryRaw`SELECT 1`;
    return NextResponse.json({ status: 'healthy', timestamp: new Date() });
  } catch {
    return NextResponse.json({ status: 'unhealthy' }, { status: 503 });
  }
}
```

---

## Performance Optimization

### Edge Functions

Move compatible API routes to Edge Runtime:

```typescript
// app/api/health/route.ts
export const runtime = 'edge';  // Only for routes without Prisma/bcrypt
```

### Caching

```typescript
// Static data
export const revalidate = 3600; // 1 hour

// Dynamic with cache
export async function GET() {
  const data = await fetchData();
  return NextResponse.json(data, {
    headers: { 'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300' }
  });
}
```

---

## Troubleshooting

### Common Issues

| Issue | Solution |
|-------|----------|
| `PrismaClientInitializationError` | Run `pnpm prisma generate` and ensure `DATABASE_URL` is set |
| `MissingSecret` (NextAuth) | Set `AUTH_SECRET` in environment variables |
| `Module not found: @prisma/client` | Run `pnpm prisma generate` |
| `Invalid credentials` | Verify bcrypt hash matches; re-seed database |
| `Rate limit exceeded` | Check `prisma.aIUsage` table; wait 1 minute |
| Build fails on Vercel | Check Node version (20.x); ensure `pnpm` in `packageManager` |

### Debug Commands

```bash
# Check database
pnpm prisma studio

# View logs
vercel logs

# Local production build
pnpm build && pnpm start

# Database migration
pnpm prisma migrate dev --name migration_name
```

---

## Rollback Strategy

### Vercel Instant Rollback

1. Vercel Dashboard → Deployments
2. Click "..." on previous deployment → "Promote to Production"

### Database Rollback

```bash
# If migration caused issues
pnpm prisma migrate resolve --rolled-back "migration_name"

# Or restore from backup
pg_restore -d neuroflow backup.dump
```

---

## Security Checklist

- [ ] `AUTH_SECRET` generated and set
- [ ] `DATABASE_URL` uses SSL (`sslmode=require`)
- [ ] Google OAuth redirect URIs configured
- [ ] Rate limiting enabled (Upstash Redis)
- [ ] CSP headers configured in `next.config.js`
- [ ] Sentry DSN configured
- [ ] Dependencies audited (`pnpm audit`)
- [ ] No secrets in code or logs
- [ ] Domain uses HTTPS only
- [ ] Cookie security flags (Secure, HttpOnly, SameSite)

---

## Cost Estimation (Monthly)

| Service | Free Tier | Paid Estimate |
|---------|-----------|---------------|
| Vercel (Pro) | $0 | $20/team |
| Vercel Postgres | 256 MB | $20+/mo |
| Neon | 512 MB | $19/mo |
| Vercel Blob | 1 GB | $0.15/GB |
| Upstash Redis | 10k req/day | $0.50/mo |
| Sentry | 5k errors/mo | $26/mo |
| **Total (Hobby)** | **$0** | **~$50-100/mo** |

---

## Support

For deployment issues:
- Vercel: [vercel.com/support](https://vercel.com/support)
- Neon: [neon.tech/docs](https://neon.tech/docs)
- Prisma: [pris.ly/discord](https://pris.ly/discord)
- NextAuth: [next-auth.js.org](https://next-auth.js.org)