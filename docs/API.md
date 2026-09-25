# API Documentation

> **Version**: 1.0.0  
> **Last Updated**: 2026-09-24  
> **Base URL**: `http://localhost:3000/api` (dev) / `https://your-domain.com/api` (prod)

All API routes require authentication via NextAuth session cookie unless otherwise noted.

---

## Authentication

### POST `/api/auth/register`

Register a new user account.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securepassword123",
  "name": "John Doe"  // optional
}
```

**Validation Rules:**
- Email: Valid email format
- Password: Minimum 8 characters
- Name: Optional, string

**Responses:**
| Status | Description |
|--------|-------------|
| 201 | User created successfully |
| 400 | Validation error or user exists |
| 500 | Server error |

**Example:**
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123","name":"Test User"}'
```

---

### POST `/api/auth/callback/credentials`

NextAuth credentials callback (handled automatically by NextAuth).

---

## AI Generation

### POST `/api/ai/stream`

Generate UI components from natural language prompts.

**Authentication**: Required (session cookie)

**Request Body:**
```json
{
  "prompt": "Show my top 5 projects"
}
```

**Rate Limit**: 10 requests per minute per user

**Response Types:**

#### Keyword Match (Structured Component)
```json
{
  "component": {
    "type": "TopProjects",
    "props": {
      "projects": [
        {
          "id": "cmufpp0ja00004h8hjripb4nz",
          "name": "AI Marketing Dashboard",
          "description": "Generative UI dashboard",
          "updatedAt": "2026-09-24T15:53:50.326Z"
        }
      ]
    }
  },
  "message": "Generated TopProjects component with real data"
}
```

#### OpenAI Fallback (Streaming)
Server-Sent Events stream with text/code response.

**Supported Keyword Mappings:**

| Keywords | Component Type | Description |
|----------|----------------|-------------|
| `top projects`, `recent projects`, `my projects` | `TopProjects` | User's 5 most recent projects |
| `activity`, `notifications`, `recent activity` | `RecentActivity` | User's 10 most recent notifications |
| `analytics`, `chart`, `graph` | `AnalyticsChart` | AI token usage over time |
| `stats`, `statistics`, `metrics` | `UserStats` | Project/file/notification counts |
| `team`, `members` | `TeamMembers` | Current user as team member |

**Errors:**
| Status | Description |
|--------|-------------|
| 401 | Unauthorized (no session) |
| 400 | Invalid prompt (empty) |
| 429 | Rate limit exceeded |
| 500 | AI service error |

---

## Analytics

### GET `/api/analytics`

Retrieve user analytics data.

**Authentication**: Required

**Response:**
```json
{
  "aiUsage": [
    {
      "date": "2026-09-18",
      "tokens": 1250,
      "requests": 5
    }
  ],
  "projects": {
    "total": 3,
    "thisWeek": 1,
    "growth": 50
  }
}
```

**Data Sources:**
- `aiUsage`: Aggregated from `AIUsage` table (last 7 days)
- `projects.total`: Count of user's projects
- `projects.thisWeek`: Projects created in last 7 days
- `projects.growth`: Week-over-week percentage change

---

## Projects

### GET `/api/projects`

List all projects for authenticated user.

**Response:**
```json
{
  "projects": [
    {
      "id": "cmufpp0ja00004h8hjripb4nz",
      "name": "AI Marketing Dashboard",
      "description": "Generative UI dashboard for marketing analytics",
      "userId": "cmufpp0ja00004h8hjripb4nz",
      "createdAt": "2026-09-24T15:53:50.326Z",
      "updatedAt": "2026-09-24T15:53:50.326Z"
    }
  ]
}
```

---

### POST `/api/projects`

Create a new project.

**Request Body:**
```json
{
  "name": "New Project",
  "description": "Optional description"
}
```

**Validation:**
- `name`: Required, string
- `description`: Optional, string

**Response:** Created project object (201)

---

### PUT `/api/projects`

Update a project (ownership validated).

**Request Body:**
```json
{
  "id": "project-id",
  "name": "Updated Name",
  "description": "Updated description"
}
```

**Validation:**
- `id`: Required, string
- `name`: Required, string
- `description`: Optional, string

---

### DELETE `/api/projects`

Delete a project (ownership validated).

**Query Parameters:**
- `id`: Project ID (required)

**Response:** `{ "success": true }` (200)

---

## Files

### GET `/api/files`

List all files for authenticated user.

**Response:**
```json
{
  "files": [
    {
      "id": "file-id",
      "name": "document.pdf",
      "url": "https://blob.vercel-storage.com/...",
      "size": 1024000,
      "mimeType": "application/pdf",
      "userId": "user-id",
      "createdAt": "2026-09-24T15:53:50.326Z"
    }
  ]
}
```

---

### POST `/api/files`

Create file record (after Vercel Blob upload).

**Request Body:**
```json
{
  "name": "document.pdf",
  "url": "https://blob.vercel-storage.com/...",
  "size": 1024000,
  "mimeType": "application/pdf"
}
```

**Validation:** All fields required

**Note**: Actual file upload to Vercel Blob must be done client-side first. This endpoint only stores metadata.

---

### DELETE `/api/files`

Delete a file record.

**Query Parameters:**
- `id`: File ID (required)

---

## Error Format

All error responses follow this structure:

```json
{
  "error": "Human-readable error message",
  "details": []  // Optional: validation error details
}
```

**Common HTTP Status Codes:**
| Code | Meaning |
|------|---------|
| 200 | Success |
| 201 | Created |
| 400 | Bad Request (validation) |
| 401 | Unauthorized |
| 403 | Forbidden |
| 404 | Not Found |
| 429 | Rate Limited |
| 500 | Internal Server Error |

---

## Rate Limiting

| Endpoint | Limit |
|----------|-------|
| `/api/ai/stream` | 10 req/min per user |
| `/api/auth/register` | None (planned) |
| Other endpoints | None (planned) |

---

## Webhooks

None currently implemented.

---

## SDK Examples

### JavaScript/TypeScript Client

```typescript
// Using fetch with credentials
async function generateComponent(prompt: string) {
  const response = await fetch('/api/ai/stream', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',  // Include session cookie
    body: JSON.stringify({ prompt })
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error);
  }
  
  return response.json();
}

// Usage
const result = await generateComponent('Show my top projects');
if (result.component) {
  // Render the component
  renderComponent(result.component.type, result.component.props);
}
```

### cURL Examples

```bash
# Generate component
curl -X POST http://localhost:3000/api/ai/stream \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{"prompt":"Show my analytics chart"}'

# Get analytics
curl -X GET http://localhost:3000/api/analytics \
  -b cookies.txt

# Create project
curl -X POST http://localhost:3000/api/projects \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{"name":"My Project","description":"A new project"}'
```

---

## Versioning

API versioning is not yet implemented. All routes are at `/api/*`.

Future versions will use `/api/v1/*` prefix.