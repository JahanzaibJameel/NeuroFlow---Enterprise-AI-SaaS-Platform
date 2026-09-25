# Changelog

All notable changes to NeuroFlow will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [Unreleased]

### Added
- Comprehensive documentation suite (README, API, Architecture, Deployment, Contributing)
- Honest project status assessment in README
- Code of Conduct
- Contributing guide with standards

### Fixed
- Hydration error in notifications page (Badge inside `<p>` tag)
- TypeScript strict mode errors (4 implicit any types)
- ESLint configuration (missing eslint-plugin-prettier)
- Edge Runtime conflict in AI stream route (Prisma + bcryptjs)
- AI SDK version incompatibility (@ai-sdk/openai downgraded)
- Unescaped JSX entities in multiple pages
- Missing AUTH_SECRET in development environment
- Database initialization and seeding

### Changed
- AI stream route runtime: `edge` → `nodejs` (required for Prisma/bcryptjs)
- @ai-sdk/openai: 3.0.48 → 0.0.28 (compatibility with ai@3.4.33)
- Removed deprecated react-three-fiber package
- Added explicit type annotations instead of `as any` casts
- Updated next.config.js: removed deprecated runtime config
- ESLint config: added @typescript-eslint plugin

---

## [1.0.0] - 2026-09-24

### Added
- Initial project scaffold with Next.js 15 App Router
- TypeScript strict mode configuration
- Tailwind CSS 3.4 with shadcn/ui components
- Prisma ORM with SQLite (dev) / PostgreSQL (prod) support
- NextAuth.js v5 authentication (credentials + Google OAuth)
- Vercel AI SDK 3.4 integration with OpenAI
- Dashboard with 9 pages:
  - Overview (stats, recent projects, notifications)
  - AI Playground (keyword-based component generation)
  - Analytics (Web Vitals, AI usage, project stats)
  - Projects (full CRUD)
  - Files (UI + Vercel Blob integration)
  - Team (mocked)
  - Activity (mocked)
  - Notifications (real DB + local state)
  - Settings (UI only)
- 3D BrainScene visualization on homepage
- Keyword-matched AI component generation (6 component types)
- Real-time Web Vitals collection (LCP, INP, CLS)
- Middleware route protection
- Role-based access control (ADMIN/USER)

### Security
- bcrypt password hashing (12 rounds)
- JWT-based sessions with HTTP-only cookies
- CSRF protection via NextAuth
- SQL injection prevention (Prisma)
- XSS protection (React auto-escaping)

### Developer Experience
- ESLint + Prettier configuration
- TypeScript strict mode
- Prisma Studio for database management
- Seed script with demo users
- pnpm package manager
- Hot module replacement

---

## [0.1.0] - 2026-09-23

### Added
- Initial repository setup
- Basic Next.js 15 project structure
- Package.json with core dependencies
- Tailwind CSS configuration
- Prisma schema with core models
- Basic README with aspirational features

---

## Migration Guide

### From 0.x to 1.0.0

This is the first stable release. No migration needed for new projects.

For existing forks:
1. Update dependencies: `pnpm install`
2. Regenerate Prisma: `pnpm prisma generate`
3. Push schema: `pnpm prisma db push`
4. Run seeds: `pnpm prisma db seed`
5. Verify: `pnpm typecheck && pnpm lint && pnpm build`

---

## Deprecation Notices

| Feature | Deprecated In | Removed In | Alternative |
|---------|--------------|------------|-------------|
| `react-three-fiber` (separate pkg) | 1.0.0 | 1.0.0 | Use `@react-three/fiber` only |
| `serverRuntimeConfig` / `publicRuntimeConfig` | Next.js 15 | Next.js 16 | Use `next.config.js` ESM exports |
| `next lint` | Next.js 15 | Next.js 16 | Use `eslint` directly |

---

## Support Policy

| Version | Status | Support Until |
|---------|--------|---------------|
| 1.x | Active | TBD |
| 0.x | Deprecated | 2026-12-31 |

Only the latest minor version receives security patches.

---

## Release Schedule

- **Patch releases**: As needed (bug fixes, security)
- **Minor releases**: Monthly (new features)
- **Major releases**: Quarterly (breaking changes)

Release dates are approximate and subject to change.