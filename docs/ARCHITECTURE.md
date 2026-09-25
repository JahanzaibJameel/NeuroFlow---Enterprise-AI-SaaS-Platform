# Architecture Documentation

> **Version**: 1.0.0  
> **Last Updated**: 2026-09-24  
> **Status**: Active Development

---

## System Overview

NeuroFlow is a full-stack AI-enhanced dashboard platform built on the Next.js 15 App Router with TypeScript, Prisma ORM, and Vercel AI SDK.

```
┌─────────────────────────────────────────────────────────────────┐
│                        NeuroFlow Architecture                    │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐      │
│  │   Browser    │◀──▶│   Next.js    │◀──▶│   Database   │      │
│  │  (React 19)  │    │  (App Router)│    │  (SQLite/    │      │
│  └──────────────┘    └──────────────┘    │  PostgreSQL) │      │
│         │                   │            └──────────────┘      │
│         │                   ▼                                     │
│         │           ┌──────────────┐                              │
│         └──────────▶│ Vercel AI    │                              │
│                     │ SDK + OpenAI │                              │
│                     └──────────────┘                              │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## Core Technologies

| Layer | Technology | Version | Purpose |
|-------|------------|---------|---------|
| **Runtime** | Node.js | 20.x LTS | JavaScript runtime |
| **Framework** | Next.js | 15.5.14 | App Router, SSR, API Routes |
| **Language** | TypeScript | 5.6 | Type safety |
| **Styling** | Tailwind CSS | 3.4 | Utility-first CSS |
| **UI Primitives** | Radix UI | Latest | Accessible components |
| **3D Graphics** | React Three Fiber | 9.5 | Three.js React renderer |
| **Database ORM** | Prisma | 5.22 | Type-safe database access |
| **Database (Dev)** | SQLite | 3.x | Local development |
| **Database (Prod)** | PostgreSQL | 15+ | Production database |
| **Authentication** | NextAuth.js | 5.0 (Beta) | Auth framework |
| **AI Integration** | Vercel AI SDK | 3.4 | LLM integration |
| **State Management** | Zustand / SWR | Latest | Client/server state |
| **Charts** | Recharts | 2.12 | Data visualization |

---

## Application Structure

### Route Groups

```
app/
├── (auth)/              # Authentication pages (no layout)
│   ├── login/
│   └── register/
├── (marketing)/         # Public marketing pages
│   └── page.tsx         # Homepage with 3D scene
├── api/                 # API Routes
│   ├── ai/stream/       # AI generation endpoint
│   ├── analytics/       # Analytics data
│   ├── auth/            # NextAuth + registration
│   ├── files/           # File CRUD
│   └── projects/        # Project CRUD
├── dashboard/           # Protected dashboard (layout.tsx)
│   ├── overview/
│   ├── ai-playground/
│   ├── analytics/
│   ├── projects/
│   ├── files/
│   ├── team/
│   ├── activity/
│   ├── notifications/
│   └── settings/
├── layout.tsx           # Root layout (providers)
├── globals.css          # Global styles
└── error.tsx            # Error boundary
```

### Middleware

```typescript
// middleware.ts - Route protection
export async function middleware(request: NextRequest) {
  const session = await auth();
  
  // Protected routes
  if (pathname.startsWith('/dashboard') && !session) {
    return redirect('/login');
  }
  
  // Admin routes
  if (pathname.startsWith('/admin') && session?.user?.role !== 'ADMIN') {
    return redirect('/dashboard/overview');
  }
  
  // Redirect authenticated users from auth pages
  if (['/login', '/register'].includes(pathname) && session) {
    return redirect('/dashboard/overview');
  }
}
```

---

## Data Layer

### Prisma Schema

```prisma
// Core models
User {
  id            String    @id @default(cuid())
  email         String    @unique
  name          String?
  role          String    @default("USER")  // "USER" | "ADMIN"
  password      String?   // bcrypt hashed
  emailVerified DateTime?
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
  
  // Relations
  projects      Project[]
  files         File[]
  notifications Notification[]
  aiUsages      AIUsage[]
  accounts      Account[]
  sessions      Session[]
}

Project {
  id          String       @id @default(cuid())
  name        String
  description String?
  userId      String
  user        User         @relation(fields: [userId], references: [id])
  createdAt   DateTime     @default(now())
  updatedAt   DateTime     @updatedAt
  notes       ProjectNote[]
}

File {
  id        String   @id @default(cuid())
  name      String
  url       String   // Vercel Blob URL
  size      Int
  mimeType  String
  userId    String
  user      User     @relation(fields: [userId], references: [id])
  createdAt DateTime @default(now())
}

Notification {
  id        String   @id @default(cuid())
  userId    String
  user      User     @relation(fields: [userId], references: [id])
  title     String
  content   String?
  read      Boolean  @default(false)
  createdAt DateTime @default(now())
}

AIUsage {
  id        String   @id @default(cuid())
  userId    String
  user      User     @relation(fields: [userId], references: [id])
  prompt    String
  tokens    Int?
  createdAt DateTime @default(now())
}

// NextAuth models
Account, Session, VerificationToken
```

### Database Configuration

```typescript
// lib/db/index.ts - Singleton Prisma client
const globalForPrisma = globalThis as unknown as { prisma: PrismaClient | undefined };

export const prisma = globalForPrisma.prisma ?? new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error']
});

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
```

---

## Authentication System

### NextAuth v5 Configuration

```typescript
// lib/auth/index.ts
export const authConfig: NextAuthConfig = {
  adapter: PrismaAdapter(authPrisma),  // Separate Prisma instance
  providers: [
    Google({ clientId, clientSecret }),
    Credentials({
      name: 'credentials',
      async authorize(credentials) {
        // Email/password validation with bcrypt
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) { /* extend token */ },
    async session({ session, token }) { /* extend session */ }
  },
  session: { strategy: 'jwt' },
  pages: { signIn: '/login', error: '/login' }
};
```

### Session Extension

```typescript
// lib/auth/types.ts
declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      role: 'ADMIN' | 'USER';
    } & DefaultSession['user'];
  }
}
```

---

## AI Integration

### Architecture

```
┌────────────────────────────────────────────────────────────┐
│                    AI Generation Flow                       │
├────────────────────────────────────────────────────────────┤
│                                                             │
│  User Prompt                                                │
│      │                                                      │
│      ▼                                                      │
│  /api/ai/stream                                             │
│      │                                                      │
│      ├──▶ Keyword Match (lib/ai/components.ts)             │
│      │      │                                               │
│      │      ├── Match Found → Return Structured Component  │
│      │      │                                               │
│      │      └── No Match → OpenAI Streaming                │
│      │                                                      │
│      ▼                                                      │
│  Response (Structured JSON or Streaming Text)              │
│                                                             │
└────────────────────────────────────────────────────────────┘
```

### Component Registry

```typescript
// lib/ai/components.ts
export const componentRegistry = {
  TopProjects: async (userId) => { /* query DB, return component */ },
  RecentActivity: async (userId) => { /* query DB, return component */ },
  AnalyticsChart: async (userId) => { /* query DB, return component */ },
  UserStats: async (userId) => { /* query DB, return component */ },
  TeamMembers: async (userId) => { /* return mock data */ }
};

export const promptToComponent = {
  'top projects': 'TopProjects',
  'analytics': 'AnalyticsChart',
  // ... keyword mappings
};
```

### API Route

```typescript
// app/api/ai/stream/route.ts
export const runtime = 'nodejs';  // Required for Prisma/bcrypt

export async function POST(request: Request) {
  const session = await auth();
  const { prompt } = await request.json();
  
  // Rate limit: 10/min
  const recentUsage = await prisma.aIUsage.findMany({...});
  if (recentUsage.length >= 10) return 429;
  
  // Try keyword match first
  const matchedComponent = await generateComponentFromPrompt(prompt, userId);
  if (matchedComponent) return NextResponse.json({ component: matchedComponent });
  
  // Fallback to OpenAI streaming
  const result = await streamText({
    model: openai('gpt-4o-mini'),
    system: 'You are NeuroFlow AI assistant...',
    prompt,
    tools: { getProjects, getNotifications }
  });
  
  return result.toDataStreamResponse();
}
```

---

## UI Layer

### Component Hierarchy

```
RootLayout
├── ThemeProvider (next-themes)
├── Toaster (toast notifications)
├── (auth) pages
├── (marketing) Homepage
│   └── BrainScene (Three.js, lazy loaded)
└── DashboardLayout
    ├── Sidebar (navigation)
    ├── Header (theme toggle, notifications)
    └── Page Content
        ├── Overview (stats cards, recent projects, notifications)
        ├── AIPlayground (useCompletion + streaming)
        ├── Analytics (Recharts + Web Vitals)
        ├── Projects (CRUD with SWR)
        ├── Files (UI + Vercel Blob)
        ├── Team (mock data)
        ├── Activity (mock data)
        ├── Notifications (real DB + local state)
        └── Settings (UI only)
```

### State Management

| Scope | Solution | Usage |
|-------|----------|-------|
| **Server State** | SWR / fetch | API data (projects, analytics) |
| **Client State** | Zustand | UI state (toasts, modals) |
| **Form State** | React Hook Form | Forms with validation |
| **Theme** | next-themes | Dark/light/system |

### Theme System

```typescript
// CSS Variables (globals.css)
:root {
  --background: 0 0% 100%;
  --foreground: 222.2 84% 4.9%;
  --primary: 221.2 83.2% 53.3%;
  --primary-foreground: 210 40% 98%;
  /* ... all semantic colors */
}

.dark {
  --background: 222.2 84% 4.9%;
  --foreground: 210 40% 98%;
  /* ... dark mode overrides */
}
```

---

## Security Architecture

### Authentication Flow

```
┌─────────┐     ┌─────────┐     ┌─────────┐     ┌─────────┐
│ User    │────▶│ Login   │────▶│ NextAuth│────▶│ Session │
│ Browser │     │ Page    │     │ Credentials│    │ Cookie  │
└─────────┘     └─────────┘     └─────────┘     └─────────┘
      │              │               │               │
      │              │               │               │
      ▼              ▼               ▼               ▼
  Email/Pass    validate()      bcrypt compare   JWT in
  submitted     credentials     password hash    HTTP-only
                                                            cookie
```

### Protected Routes

| Route Pattern | Protection | Role Required |
|---------------|------------|---------------|
| `/dashboard/*` | Middleware | Any authenticated |
| `/admin/*` | Middleware | ADMIN only |
| `/api/*` | Server-side check | Authenticated |

### Known Vulnerabilities

| Issue | Severity | Status |
|-------|----------|--------|
| No rate limit on `/api/auth/register` | High | Planned |
| No ownership check on DELETE `/api/projects` | High | Planned |
| No ownership check on DELETE `/api/files` | High | Planned |
| Basic per-minute rate limit on AI endpoint | Medium | Implemented |
| No CSP headers | Medium | Planned |
| No audit logging | Medium | Planned |

---

## Performance Characteristics

### Build Output

```
Route (app)                              Size    First Load JS
┌ ○ /                                    2.97 kB  117 kB
├ ○ /_not-found                           994 B   103 kB
├ ƒ /api/ai/stream                        140 B   103 kB
├ ƒ /api/analytics                        140 B   103 kB
├ ƒ /api/auth/[...nextauth]               140 B   103 kB
├ ƒ /api/auth/register                    140 B   103 kB
├ ƒ /api/files                            140 B   103 kB
├ ƒ /api/projects                         140 B   103 kB
├ ○ /dashboard/overview                  2.73 kB  112 kB
├ ○ /dashboard/ai-playground             20.2 kB  129 kB
├ ○ /dashboard/analytics                 109 kB   219 kB
├ ○ /dashboard/projects                  5.3 kB   115 kB
├ ○ /dashboard/files                     8.55 kB  121 kB
├ ○ /dashboard/team                      3.86 kB  113 kB
├ ○ /dashboard/activity                  3.84 kB  113 kB
├ ○ /dashboard/notifications             4.25 kB  113 kB
├ ○ /dashboard/settings                  7.25 kB  116 kB
├ ○ /login                               2.11 kB  118 kB
└ ○ /register                            2.32 kB  119 kB
+ First Load JS shared by all            102 kB
```

### Optimization Strategies

| Technique | Implementation |
|-----------|----------------|
| **Code Splitting** | Automatic via App Router |
| **Dynamic Imports** | `BrainScene` (3D), heavy charts |
| **Memoization** | `useMemo` for chart data |
| **Static Generation** | 20/20 pages pre-rendered |
| **Image Optimization** | Next.js Image component |
| **Font Optimization** | `next/font` (Inter) |
| **Bundle Analysis** | `next build` output analysis |

---

## Deployment Architecture

### Vercel (Recommended)

```
GitHub → Vercel → Edge Network
           │
           ├── Build (pnpm install → prisma generate → next build)
           ├── Environment Variables
           ├── PostgreSQL (Vercel Postgres / Neon / Supabase)
           ├── Vercel Blob (file storage)
           └── Domain + SSL
```

### Environment Variables (Production)

| Variable | Required | Description |
|----------|----------|-------------|
| `DATABASE_URL` | Yes | PostgreSQL connection string |
| `AUTH_SECRET` | Yes | `openssl rand -base64 32` |
| `AUTH_URL` | Yes | `https://your-domain.com` |
| `GOOGLE_CLIENT_ID` | No | Google OAuth |
| `GOOGLE_CLIENT_SECRET` | No | Google OAuth |
| `OPENAI_API_KEY` | No | AI fallback |
| `BLOB_READ_WRITE_TOKEN` | No | File uploads |
| `SENTRY_DSN` | No | Error tracking |

---

## Monitoring & Observability

### Current State

| Tool | Status | Implementation |
|------|--------|----------------|
| **Error Tracking** | ⚠️ Partial | Logger utility (dev only), Sentry commented |
| **Analytics** | ✅ Web Vitals | Client-side collection |
| **Logging** | ⚠️ Dev Only | Console in dev, no-op in prod |
| **Uptime** | ❌ None | Planned |

### Planned Integration

```typescript
// lib/logger.ts - Future Sentry integration
export const logger = {
  error: (message, error, context) => {
    if (process.env.NODE_ENV === 'development') {
      console.error(message, error, context);
    }
    // Sentry.captureException(error, { tags: context });
  }
};
```

---

## Testing Strategy (Planned)

| Type | Target | Tools |
|------|--------|-------|
| **Unit Tests** | >80% | Jest, React Testing Library |
| **Integration** | Critical paths | Jest + MSW |
| **E2E** | User flows | Playwright |
| **Visual Regression** | UI components | Chromatic |

---

## Future Architecture Considerations

### Scalability

- **Database**: Read replicas for analytics queries
- **Caching**: Redis for session/API caching
- **Queue**: BullMQ for background jobs (AI generation, emails)
- **Real-time**: PartyKit/Yjs for collaboration

### AI Enhancement

- **Vector DB**: pgvector for semantic search
- **Fine-tuning**: Custom models for component generation
- **RAG**: Retrieval-augmented generation for context

### Multi-tenancy

- **Organizations**: Top-level resource
- **Roles**: Owner, Admin, Member, Viewer
- **Isolation**: Row-level security or schema per tenant

---

## Decision Records

| Date | Decision | Rationale |
|------|----------|-----------|
| 2026-09-24 | Next.js 15 App Router | Modern React patterns, RSC support |
| 2026-09-24 | Prisma ORM | Type-safe DB, excellent DX |
| 2026-09-24 | NextAuth v5 | Modern auth, React 19 ready |
| 2026-09-24 | Vercel AI SDK | Streaming, tool calling |
| 2026-09-24 | SQLite dev / PostgreSQL prod | Zero-config dev, scalable prod |
| 2026-09-24 | Tailwind + shadcn/ui | Consistent design, accessible |
| 2026-09-24 | `runtime = 'nodejs'` for AI | Prisma/bcrypt require Node runtime |

---

## Glossary

| Term | Definition |
|------|------------|
| **RSC** | React Server Components |
| **SWR** | Stale-While-Revalidate (data fetching) |
| **CSR** | Client-Side Rendering |
| **SSR** | Server-Side Rendering |
| **SSG** | Static Site Generation |
| **ISR** | Incremental Static Regeneration |
| **JWT** | JSON Web Token |
| **RBAC** | Role-Based Access Control |
| **LLM** | Large Language Model |
| **RAG** | Retrieval-Augmented Generation |