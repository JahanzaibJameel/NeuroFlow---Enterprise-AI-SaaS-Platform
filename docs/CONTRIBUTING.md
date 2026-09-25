# Contributing Guide

> **Version**: 1.0.0  
> **Last Updated**: 2026-09-24

Thank you for contributing to NeuroFlow! This guide will help you get started.

---

## Code of Conduct

By participating, you agree to uphold our [Code of Conduct](CODE_OF_CONDUCT.md). Please report violations to conduct@neuroflow.dev.

---

## Getting Started

### Prerequisites

```bash
Node.js >= 20.x
pnpm >= 9.x
Git >= 2.x
```

### Development Setup

```bash
# 1. Fork and clone
git clone https://github.com/your-org/neuroflow.git
cd neuroflow

# 2. Install dependencies
pnpm install

# 3. Setup environment
cp .env.example .env.local
# Edit .env.local with your values

# 4. Initialize database
pnpm prisma generate
pnpm prisma db push
pnpm prisma db seed

# 5. Start development
pnpm dev
```

### Verify Setup

```bash
# All checks must pass
pnpm typecheck  # TypeScript
pnpm lint       # ESLint
pnpm build      # Production build
```

---

## Development Workflow

### Branch Strategy

```
main (protected)
  │
  ├── feature/component-generation
  ├── fix/auth-rate-limit
  ├── docs/api-documentation
  └── chore/dependency-updates
```

### Commit Convention

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```bash
# Format
<type>[optional scope]: <description>

# Types
feat:     New feature
fix:      Bug fix
docs:     Documentation only
style:    Formatting (no logic change)
refactor: Code restructuring
perf:     Performance improvement
test:     Adding tests
chore:    Maintenance (deps, config)

# Examples
feat(ai): add streaming token counting
fix(auth): add rate limiting to register
docs(readme): update quick start guide
refactor(db): optimize project queries
```

### Pull Request Process

1. **Create feature branch** from `main`
2. **Make changes** with tests if possible
3. **Run quality checks** locally
3. **Push** and open PR against `main`
4. **CI checks** must pass (typecheck, lint, build)
4. **Code review** by maintainer
5. **Squash and merge** after approval

### PR Checklist

- [ ] `pnpm typecheck` passes
- [ ] `pnpm lint` passes (0 errors)
- [ ] `pnpm build` succeeds
- [ ] Tests added/updated (when test infrastructure exists)
- [ ] Documentation updated
- [ ] No `console.log` or `debugger` in production code
- [ ] No `any` types without justification comment

---

## Code Standards

### TypeScript

```typescript
// ✅ Good: Explicit types, no any
interface UserProps {
  name: string;
  email: string;
}

function greetUser(user: UserProps): string {
  return `Hello, ${user.name}!`;
}

// ❌ Bad: any without justification
function greetUser(user: any): string {
  return `Hello, ${user.name}!`;
}

// ✅ Acceptable: any with justification
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const dynamicData: any = await fetchExternalAPI(); // Legacy API, no types available
```

### React Components

```typescript
// ✅ Good: Typed props, forwardRef, displayName
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'destructive' | 'outline';
  size?: 'sm' | 'md' | 'lg';
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', size = 'md', children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(buttonVariants({ variant, size }), className)}
        {...props}
      >
        {children}
      </button>
    );
  }
);
Button.displayName = 'Button';
```

### Naming Conventions

| Type | Convention | Example |
|------|------------|---------|
| Files | kebab-case | `user-profile.tsx` |
| Components | PascalCase | `UserProfile` |
| Functions/Variables | camelCase | `getUserData` |
| Types/Interfaces | PascalCase | `UserData` |
| Constants | UPPER_SNAKE | `MAX_RETRIES` |
| CSS Classes | kebab-case | `.user-profile-card` |

### Import Order

```typescript
// 1. Next.js / React
import { NextResponse } from 'next/server';
import { useState } from 'react';

// 2. Third-party libraries
import { z } from 'zod';
import { prisma } from '@prisma/client';

// 3. Internal (absolute paths with @/)
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { logger } from '@/lib/logger';

// 4. Relative imports
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
```

---

## Project Structure Conventions

### API Routes

```
app/api/
├── [resource]/
│   ├── route.ts          # GET, POST
│   └── [id]/
│       └── route.ts      # GET, PUT, DELETE
```

```typescript
// Standard API route pattern
import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { logger } from '@/lib/logger';
import { z } from 'zod';

const schema = z.object({
  name: z.string().min(1),
});

export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const validatedData = schema.parse(body);

    // Business logic here

    return NextResponse.json({ data }, { status: 201 });
  } catch (error) {
    logger.error('Operation failed', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
```

### Database Queries

```typescript
// ✅ Good: Select only needed fields, use relations
const projects = await prisma.project.findMany({
  where: { userId },
  select: {
    id: true,
    name: true,
    description: true,
    createdAt: true,
    _count: { select: { notes: true } },
  },
  orderBy: { updatedAt: 'desc' },
  take: 10,
});

// ❌ Bad: Fetching all fields, no pagination
const projects = await prisma.project.findMany({
  where: { userId },
});
```

### Error Handling

```typescript
// ✅ Good: Structured error responses
try {
  const result = await riskyOperation();
  return NextResponse.json({ data: result });
} catch (error) {
  logger.error('Operation failed', error, { userId: session.user.id });
  
  if (error instanceof KnownError) {
    return NextResponse.json(
      { error: error.message },
      { status: error.statusCode }
    );
  }
  
  return NextResponse.json(
    { error: 'Internal server error' },
    { status: 500 }
  );
}
```

---

## Testing (Planned)

### Unit Tests

```typescript
// __tests__/utils.test.ts
import { formatDate, formatNumber } from '@/lib/utils';

describe('formatDate', () => {
  it('formats date correctly', () => {
    expect(formatDate('2024-01-15')).toBe('January 15, 2024');
  });
  
  it('handles Date objects', () => {
    expect(formatDate(new Date('2024-01-15'))).toBe('January 15, 2024');
  });
});
```

### Integration Tests

```typescript
// __tests__/api/projects.test.ts
import { createMocks } from 'node-mocks-http';
import { POST } from '@/app/api/projects/route';

describe('/api/projects', () => {
  it('creates project with valid data', async () => {
    const { req, res } = createMocks({
      method: 'POST',
      body: { name: 'Test Project', description: 'Test' },
    });
    
    await POST(req);
    
    expect(res._getStatusCode()).toBe(201);
  });
});
```

---

## Documentation Standards

### API Documentation

Update `docs/API.md` when:
- Adding new endpoints
- Changing request/response formats
- Modifying authentication requirements

### Code Comments

```typescript
// ✅ Good: Explains WHY, not WHAT
// Rate limit: 10 requests per minute per user to prevent abuse
// and ensure fair usage of AI API quota
const recentUsage = await prisma.aIUsage.findMany({...});

// ❌ Bad: States the obvious
// Get recent usage from database
const recentUsage = await prisma.aIUsage.findMany({...});
```

---

## Dependency Management

### Adding Dependencies

```bash
# Production
pnpm add package-name

# Development
pnpm add -D package-name

# Peer dependency
pnpm add -P package-name
```

### Updating Dependencies

```bash
# Check outdated
pnpm outdated

# Update (patch/minor)
pnpm up

# Update major (interactive)
pnpm up -i
```

### Lockfile

- `pnpm-lock.yaml` is committed
- Run `pnpm install` after pulling changes
- Never modify lockfile manually

---

## Release Process

### Versioning

Follow [Semantic Versioning](https://semver.org/):

| Release Type | Version Bump | Example |
|--------------|--------------|---------|
| Patch | Bug fixes | 1.0.0 → 1.0.1 |
| Minor | New features (backward compatible) | 1.0.0 → 1.1.0 |
| Major | Breaking changes | 1.0.0 → 2.0.0 |

### Release Steps

```bash
# 1. Update version
pnpm version patch|minor|major

# 2. Generate changelog
# (Manual or auto-generated)

# 3. Push tags
git push origin main --tags

# 4. CI/CD deploys automatically
```

---

## Getting Help

### Resources

- **Architecture**: `docs/ARCHITECTURE.md`
- **API Reference**: `docs/API.md`
- **Deployment**: `docs/DEPLOYMENT.md`

### Communication

- **Issues**: [GitHub Issues](https://github.com/your-org/neuroflow/issues)
- **Discussions**: [GitHub Discussions](https://github.com/your-org/neuroflow/discussions)
- **Security**: security@neuroflow.dev

### Maintainers

| Name | Role | GitHub |
|------|------|--------|
| Core Team | Maintainers | @neuroflow-team |

---

## Recognition

Contributors are recognized in:
- `AUTHORS.md` file
- Release notes
- GitHub contributors page

Thank you for making NeuroFlow better! 🚀