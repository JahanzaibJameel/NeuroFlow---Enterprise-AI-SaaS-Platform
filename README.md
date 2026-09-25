# 🧠 NeuroFlow - AI-Powered Dashboard Platform

<div align="center">

**An AI-Enhanced Dashboard Platform Built with Next.js 15, TypeScript, and Vercel AI SDK**

[![Next.js](https://img.shields.io/badge/Next.js-15.5.14-black?logo=next.js&logoColor=white&style=for-the-badge)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6-blue?logo=typescript&logoColor=white&style=for-the-badge)](https://www.typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38bdf8?logo=tailwindcss&logoColor=white&style=for-the-badge)](https://tailwindcss.com)
[![Vercel AI SDK](https://img.shields.io/badge/Vercel%20AI-SDK%203.4-black?logo=vercel&logoColor=white&style=for-the-badge)](https://sdk.vercel.ai/docs)
[![Prisma](https://img.shields.io/badge/Prisma-5.22-2D3748?logo=prisma&logoColor=white&style=for-the-badge)](https://prisma.io)
[![Status](https://img.shields.io/badge/status-active%20development-yellow?style=for-the-badge)](.)

[![License](https://img.shields.io/badge/license-MIT-green?style=for-the-badge)](LICENSE)
[![Build](https://img.shields.io/badge/build-passing-brightgreen?style=for-the-badge)](.)
[![TypeCheck](https://img.shields.io/badge/typecheck-passing-brightgreen?style=for-the-badge)](.)
[![Lint](https://img.shields.io/badge/lint-passing-brightgreen?style=for-the-badge)](.)

</div>

---

## 📋 Project Status - 

> **This project is in active development.** The following table reflects what is **actually implemented** vs. what is **planned/mocked**.

| Feature | Status | Implementation Details |
|---------|--------|----------------------|
| **AI Playground** | ✅ Working | Keyword-based component matching + OpenAI fallback streaming |
| **Analytics Dashboard** | ✅ Working | Web Vitals (LCP/INP/CLS), AI token usage, project stats |
| **3D Visualization** | ✅ Working | Three.js brain scene with particles on homepage |
| **Authentication** | ✅ Working | NextAuth v5 (credentials + Google OAuth), JWT sessions, RBAC |
| **Project CRUD** | ✅ Working | Full create/read/update/delete with ownership |
| **File Management** | ⚠️ Partial | UI complete, upload requires Vercel Blob configuration |
| **Notifications** | ✅ Working | Real-time DB storage, read/unread states |
| **Team Management** | ⚠️ Mocked | UI complete, hardcoded demo data |
| **Activity Log** | ⚠️ Mocked | UI complete, hardcoded demo data |
| **Settings** | ⚠️ UI Only | Forms render but don't persist |
| **Real-time Collaboration** | ❌ Not Implemented | PartyKit installed but not integrated |
| **True Generative AI** | ❌ Not Implemented | Uses keyword matching, not LLM-based generation |
| **Enterprise Security** | ⚠️ Basic | Auth works, but missing rate limiting, audit logs |
| **Tests** | ❌ Not Implemented | Zero test files or config |
| **Storybook** | ❌ Not Implemented | Dependencies installed, config missing |

### 🎯 Current Capabilities

- **Dashboard**: 9 functional pages with sidebar navigation
- **AI Integration**: Streaming responses via Vercel AI SDK, keyword-matched components with real DB data
- **Database**: SQLite (dev) / PostgreSQL (prod) with Prisma ORM
- **Authentication**: Secure sessions with role-based access control
- **UI System**: shadcn/ui components with dark mode support

---

## 🚀 Quick Start

### Prerequisites

```bash
Node.js >= 20.x    # LTS recommended
pnpm >= 9.x        # Package manager
Git >= 2.x         # Version control
```

### Installation (3 Minutes)

```bash
# 1. Clone repository
git clone https://github.com/your-org/neuroflow.git
cd neuroflow

# 2. Install dependencies
pnpm install

# 3. Setup environment variables
cp .env.example .env.local
# Edit .env.local with your values (see Configuration below)

# 4. Initialize database
pnpm prisma generate
pnpm prisma db push
pnpm prisma db seed

# 5. Start development server
pnpm dev
```

✅ **Access the app:** http://localhost:3000

### Demo Credentials

| Role | Email | Password | Permissions |
|------|-------|----------|-------------|
| **Admin** | `admin@neuroflow.dev` | `admin123` | Full access, user management |
| **User** | `user@neuroflow.dev` | `admin123` | Standard dashboard access |

---

## ⚙️ Configuration

### Required Environment Variables

Create `.env.local` from `.env.example` and fill in:

```env
# Database (SQLite for dev, PostgreSQL for prod)
DATABASE_URL="file:./prisma/dev.db"

# Auth.js - Generate with: openssl rand -base64 32
AUTH_SECRET="your-generated-secret-here"
AUTH_URL="http://localhost:3000"

# OAuth (Optional - for Google login)
GOOGLE_CLIENT_ID=""
GOOGLE_CLIENT_SECRET=""

# AI Features (Optional - for OpenAI fallback)
OPENAI_API_KEY=""

# File Storage (Optional - for file uploads)
BLOB_READ_WRITE_TOKEN=""

# Monitoring (Optional)
SENTRY_DSN=""
```

### Generate AUTH_SECRET

```bash
openssl rand -base64 32
```

---

## 🏗 Architecture

### Tech Stack

| Layer | Technology | Version |
|-------|------------|---------|
| **Framework** | Next.js | 15.5.14 (App Router) |
| **Language** | TypeScript | 5.6 (Strict Mode) |
| **Styling** | Tailwind CSS | 3.4 |
| **UI Components** | shadcn/ui (Radix) | Latest |
| **3D Graphics** | React Three Fiber | 9.5 |
| **Database** | Prisma ORM | 5.22 |
| **Database (Dev)** | SQLite | 3.x |
| **Database (Prod)** | PostgreSQL | 15+ |
| **Authentication** | NextAuth.js | 5.0 (Beta) |
| **AI SDK** | Vercel AI SDK | 3.4 |
| **State** | Zustand / SWR | Latest |
| **Charts** | Recharts | 2.12 |

### Project Structure

```
neuroflow/
├── app/                          # Next.js App Router
│   ├── (auth)/                   # Auth route group
│   │   ├── login/page.tsx        # Login page
│   │   └── register/page.tsx     # Registration page
│   ├── (marketing)/              # Marketing route group
│   │   └── page.tsx              # Homepage with 3D scene
│   ├── api/                      # API Routes
│   │   ├── ai/stream/route.ts    # AI streaming endpoint
│   │   ├── analytics/route.ts    # Analytics data
│   │   ├── auth/[...nextauth]/   # NextAuth handler
│   │   ├── auth/register/route.ts # Registration
│   │   ├── files/route.ts        # File CRUD
│   │   └── projects/route.ts     # Project CRUD
│   ├── dashboard/                # Protected dashboard
│   │   ├── overview/page.tsx     # Dashboard home
│   │   ├── ai-playground/page.tsx # AI component generator
│   │   ├── analytics/page.tsx    # Metrics & Web Vitals
│   │   ├── projects/page.tsx     # Project management
│   │   ├── files/page.tsx        # File manager
│   │   ├── team/page.tsx         # Team (mocked)
│   │   ├── activity/page.tsx     # Activity log (mocked)
│   │   ├── notifications/page.tsx # Notifications
│   │   └── settings/page.tsx     # Settings (UI only)
│   ├── layout.tsx                # Root layout
│   ├── globals.css               # Global styles
│   └── error.tsx                 # Error boundary
├── components/
│   ├── 3d/BrainScene.tsx         # Three.js brain visualization
│   ├── ai/GeneratedComponents.tsx # Pre-built component renderers
│   ├── layout/                   # Theme provider, toggle
│   └── ui/                       # shadcn/ui primitives
├── lib/
│   ├── ai/components.ts          # Keyword-matched component registry
│   ├── auth/                     # NextAuth config & types
│   ├── db/index.ts               # Prisma client singleton
│   ├── logger.ts                 # Logging utility (dev only)
│   └── utils.ts                  # Helper functions (cn, formatDate, etc.)
├── hooks/use-toast.ts            # Toast notification system
├── prisma/
│   ├── schema.prisma             # Database schema
│   └── seed.ts                   # Demo data seeding
├── middleware.ts                 # Route protection
├── next.config.js                # Next.js configuration
└── package.json
```

### Data Flow

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Client    │────▶│  Next.js    │────▶│  Prisma     │
│  (React)    │     │  API Routes │     │  (SQLite/   │
└─────────────┘     └─────────────┘     │  PostgreSQL)│
       │                  │             └─────────────┘
       │                  ▼
       │           ┌─────────────┐
       └──────────▶│ Vercel AI   │
                   │ SDK + OpenAI│
                   └─────────────┘
```

---

## 🔌 API Reference

### Authentication

All dashboard API routes require authentication via NextAuth session cookie.

### POST `/api/ai/stream`

Generates UI components from natural language prompts.

**Request:**
```json
{
  "prompt": "Show my top projects"
}
```

**Response (Keyword Match):**
```json
{
  "component": {
    "type": "TopProjects",
    "props": { "projects": [...] }
  },
  "message": "Generated TopProjects component with real data"
}
```

**Response (OpenAI Fallback):**
Streaming text response with code examples.

**Supported Keywords:**
- `top projects`, `recent projects`, `my projects` → TopProjects
- `activity`, `notifications`, `recent activity` → RecentActivity
- `analytics`, `chart`, `graph` → AnalyticsChart
- `stats`, `statistics`, `metrics` → UserStats
- `team`, `members` → TeamMembers

### GET `/api/analytics`

Returns user analytics data.

**Response:**
```json
{
  "aiUsage": [
    { "date": "2024-01-15", "tokens": 1250, "requests": 5 }
  ],
  "projects": {
    "total": 3,
    "thisWeek": 1,
    "growth": 50
  }
}
```

### GET/POST/PUT/DELETE `/api/projects`

Full project CRUD with ownership validation.

### GET/POST/DELETE `/api/files`

File management (requires Vercel Blob configuration).

### POST `/api/auth/register`

User registration with bcrypt password hashing (12 rounds).

---

## 🎨 UI Components

### Design System

- **Colors**: CSS variables with dark mode support
- **Typography**: Inter font family
- **Spacing**: Tailwind's default scale
- **Radius**: 0.5rem base, scalable
- **Shadows**: Subtle elevation system

### Available Components

| Component | Description |
|-----------|-------------|
| `Button` | Variants: default, destructive, outline, secondary, ghost, link |
| `Card` | Header, Title, Description, Content, Footer |
| `Input` | Form input with label support |
| `Textarea` | Multi-line text input |
| `Badge` | Status indicators with variants |
| `ScrollArea` | Styled scrollbars |
| `Toast` | Notification toasts |
| `Badge` | Status labels |

### 3D Components

- `BrainScene` - Animated neural network visualization (Three.js)

---

## 🧪 Development

### Available Scripts

```bash
pnpm dev              # Start dev server
pnpm build            # Production build
pnpm start            # Start production server
pnpm lint             # Run ESLint
pnpm typecheck        # TypeScript type check
pnpm db:generate      # Generate Prisma client
pnpm db:push          # Push schema to database
pnpm db:migrate       # Run migrations
pnpm db:seed          # Seed demo data
pnpm db:studio        # Open Prisma Studio
```

### Code Quality

```bash
# All must pass before commit
pnpm typecheck  # ✅ 0 errors
pnpm lint       # ✅ 0 errors (warnings only)
pnpm build      # ✅ Successful
```

### Git Workflow

```bash
# Feature branch
git checkout -b feature/your-feature

# Commit with conventional messages
git commit -m "feat: add user avatar upload"

# Push and open PR
git push origin feature/your-feature
```

---

## 🚀 Deployment

### Vercel (Recommended)

1. Push to GitHub
2. Import in Vercel
3. Add environment variables
4. Deploy

```bash
# One-click deploy
vercel --prod
```

### Required Production Variables

```env
DATABASE_URL="postgresql://..."
AUTH_SECRET="..."
AUTH_URL="https://your-domain.com"
GOOGLE_CLIENT_ID="..."
GOOGLE_CLIENT_SECRET="..."
OPENAI_API_KEY="..."
BLOB_READ_WRITE_TOKEN="..."
```

### Docker

```dockerfile
FROM node:20-alpine AS base

# Dependencies
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN corepack enable pnpm && pnpm i --frozen-lockfile

# Builder
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN corepack enable pnpm && pnpm build

# Runner
FROM base AS runner
WORKDIR /app
ENV NODE_ENV production
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
USER nextjs
EXPOSE 3000
CMD ["node", "server.js"]
```

---

## 🔒 Security

### Implemented

- ✅ bcrypt password hashing (12 rounds)
- ✅ JWT-based sessions with HTTP-only cookies
- ✅ Role-based access control (ADMIN/USER)
- ✅ Middleware route protection
- ✅ CSRF protection via NextAuth
- ✅ SQL injection prevention (Prisma ORM)
- ✅ XSS protection (React auto-escaping)

### Known Gaps (Planned)

- ❌ Rate limiting on auth endpoints
- ❌ Rate limiting on AI endpoints (basic per-minute only)
- ❌ CSP headers
- ❌ Audit logging
- ❌ Ownership validation on all DELETE/PUT (partial)

---

## 📊 Performance

### Build Metrics

- **Build Time**: ~12s
- **Static Pages**: 20/20 generated
- **First Load JS**: ~102 KB shared
- **TypeScript**: Strict mode, 0 errors
- **ESLint**: 0 errors (warnings only)

### Optimization

- Code splitting via Next.js App Router
- Dynamic imports for heavy components (3D scene)
- `useMemo` for chart data transformations
- Image optimization via Next.js Image
- Font optimization via `next/font`

---

## 🗺 Roadmap

### Phase 1: Stabilize (Current)
- [x] Fix build/lint/typecheck
- [x] Fix hydration errors
- [x] Database setup and seeding
- [x] Auth flow working

### Phase 2: Core Features
- [ ] True generative AI (LLM-based component generation)
- [ ] File upload with Vercel Blob
- [ ] Real-time notifications (Server-Sent Events)
- [ ] Settings persistence

### Phase 3: Enterprise
- [ ] Rate limiting with Upstash Redis
- [ ] Audit logging
- [ ] Rate limiting on all endpoints
- [ ] Comprehensive test suite (Jest + Playwright)
- [ ] Storybook component documentation
- [ ] CI/CD pipeline

### Phase 4: Scale
- [ ] Multi-tenant support
- [ ] Real-time collaboration (PartyKit/Yjs)
- [ ] Advanced analytics dashboard
- [ ] Plugin/extension system

---

## 🤝 Contributing

### Getting Started

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run quality checks: `pnpm typecheck && pnpm lint && pnpm build`
5. Submit a Pull Request

### Code Standards

- **TypeScript**: Strict mode, no `any` without justification
- **Naming**: camelCase (functions/vars), PascalCase (types/components)
- **Imports**: Next.js → React → Libraries → Local (alphabetical)
- **Components**: Functional with hooks, typed props interfaces
- **Error Handling**: Try-catch with logger utility

### Commit Convention

```
feat:     New feature
fix:      Bug fix
docs:     Documentation
style:    Formatting
refactor: Code restructuring
test:     Tests
chore:    Maintenance
```

---

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details.

---

## 👥 Team & Acknowledgments

**Built by the NeuroFlow Team**

Special thanks to:
- [Vercel](https://vercel.com) for Next.js and AI SDK
- [shadcn/ui](https://ui.shadcn.com) for beautiful components
- [Prisma](https://prisma.io) for type-safe database access
- [Auth.js](https://authjs.dev) for authentication
- [Radix UI](https://radix-ui.com) for accessible primitives

---

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/your-org/neuroflow/issues)
- **Discussions**: [GitHub Discussions](https://github.com/your-org/neuroflow/discussions)
- **Security**: security@neuroflow.dev

---

<div align="center">

**Made with Next.js, TypeScript, and ❤️**

[Report Bug](https://github.com/your-org/neuroflow/issues) • [Request Feature](https://github.com/your-org/neuroflow/issues) • [View Demo](https://neuroflow.dev)

</div>