# FableCraft API Documentation
## Enterprise-Grade REST API Specification

### Base URL
- Development: `http://localhost:5000/api`
- Production: `https://your-domain.com/api`

### Authentication
All protected endpoints require a valid JWT token in the Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

## Core Endpoints

### Authentication Endpoints

#### POST /auth/login
Authenticate user and receive JWT token.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securepassword"
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "user_123",
      "email": "user@example.com",
      "displayName": "John Doe"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "expiresAt": "2024-02-01T12:00:00Z"
  }
}
```

#### POST /auth/register
Create new user account.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securepassword",
  "displayName": "John Doe"
}
```

#### GET /auth/me
Get current authenticated user information.

**Response (200):**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "user_123",
      "email": "user@example.com",
      "displayName": "John Doe",
      "createdAt": "2024-01-01T00:00:00Z",
      "lastActiveAt": "2024-01-15T10:30:00Z"
    }
  }
}
```

### Project Endpoints

#### GET /projects
List all projects for authenticated user.

**Query Parameters:**
- `limit` (optional): Number of projects to return (default: 50)
- `offset` (optional): Number of projects to skip (default: 0)
- `type` (optional): Filter by project type (novel, screenplay, comic, dnd-campaign, poetry)

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": "project_123",
      "name": "My Epic Novel",
      "type": "novel",
      "description": "An adventure story",
      "createdAt": "2024-01-01T00:00:00Z",
      "lastModified": "2024-01-15T10:30:00Z",
      "synopsis": "A hero's journey...",
      "genre": ["Fantasy", "Adventure"],
      "wordCount": 15420
    }
  ],
  "pagination": {
    "total": 5,
    "limit": 50,
    "offset": 0,
    "hasMore": false
  }
}
```

#### POST /projects
Create a new project.

**Request Body:**
```json
{
  "name": "My New Novel",
  "type": "novel",
  "description": "A thrilling adventure story",
  "synopsis": "Optional synopsis",
  "genre": ["Fantasy", "Adventure"]
}
```

#### GET /projects/:id
Get specific project details.

#### PUT /projects/:id
Update project information.

#### DELETE /projects/:id
Delete a project (soft delete).

### Character Endpoints

#### GET /projects/:projectId/characters
List all characters in a project.

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": "char_123",
      "projectId": "project_123",
      "name": "Aragorn",
      "template": "fantasy-hero",
      "fields": {
        "age": "87",
        "occupation": "Ranger",
        "personality": "Brave, loyal, determined"
      },
      "tags": ["protagonist", "ranger"],
      "portraitUrl": "https://example.com/portraits/aragorn.jpg",
      "createdAt": "2024-01-01T00:00:00Z",
      "updatedAt": "2024-01-15T10:30:00Z"
    }
  ]
}
```

#### POST /projects/:projectId/characters
Create a new character.

**Request Body:**
```json
{
  "name": "New Character",
  "template": "fantasy-hero",
  "fields": {
    "age": "25",
    "occupation": "Warrior"
  },
  "tags": ["protagonist"]
}
```

#### GET /characters/:id
Get specific character details.

#### PUT /characters/:id
Update character information.

#### DELETE /characters/:id
Delete a character.

### World Bible Endpoints

#### GET /projects/:projectId/world
Get world bible information for a project.

#### PUT /projects/:projectId/world
Update world bible information.

### AI Integration Endpoints

#### POST /ai/character-enhance
Enhance character details using AI.

**Request Body:**
```json
{
  "characterId": "char_123",
  "fields": ["personality", "background"],
  "context": "Fantasy medieval setting"
}
```

#### POST /ai/generate-portrait
Generate character portrait using AI.

**Request Body:**
```json
{
  "characterId": "char_123",
  "style": "realistic",
  "description": "Tall warrior with dark hair"
}
```

### Health Check Endpoints

#### GET /health
Basic health check endpoint.

**Response (200):**
```json
{
  "status": "healthy",
  "timestamp": "2024-01-15T10:30:00Z",
  "uptime": 86400000,
  "version": "3.0.0",
  "environment": "production",
  "services": {
    "database": {
      "status": "healthy",
      "responseTime": 25,
      "lastChecked": "2024-01-15T10:30:00Z"
    },
    "ai": {
      "status": "healthy",
      "lastChecked": "2024-01-15T10:30:00Z"
    }
  }
}
```

## Error Handling

All endpoints follow a consistent error response format:

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input provided",
    "details": {
      "field": "email",
      "reason": "Invalid email format"
    },
    "timestamp": "2024-01-15T10:30:00Z",
    "requestId": "req_123456789"
  }
}
```

### Common Error Codes
- `VALIDATION_ERROR` (400): Invalid input data
- `AUTHENTICATION_REQUIRED` (401): Missing or invalid authentication
- `FORBIDDEN` (403): Insufficient permissions
- `NOT_FOUND` (404): Resource not found
- `RATE_LIMIT_EXCEEDED` (429): Too many requests
- `INTERNAL_ERROR` (500): Server error

## Rate Limiting

API endpoints are rate limited to prevent abuse:
- Authentication endpoints: 5 requests per minute per IP
- General API endpoints: 100 requests per minute per user
- AI endpoints: 10 requests per minute per user

Rate limit headers are included in responses:
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1642248600
```

## Data Types

### Project Types
- `novel`: Novel/book projects
- `screenplay`: Screenplay/script projects  
- `comic`: Comic/graphic novel projects
- `dnd-campaign`: D&D campaign projects
- `poetry`: Poetry collection projects

### Character Field Types
- `text`: Short text input
- `textarea`: Long text input
- `select`: Single selection dropdown
- `multiselect`: Multiple selection
- `number`: Numeric input
- `boolean`: True/false checkbox

## SDK Examples

### JavaScript/Node.js
```javascript
const FableCraftAPI = require('@fablecraft/api-client');

const api = new FableCraftAPI({
  apiKey: 'your-api-key',
  baseURL: 'https://api.fablecraft.com'
});

// Get user projects
const projects = await api.projects.list();

// Create new character
const character = await api.characters.create(projectId, {
  name: 'Aragorn',
  template: 'fantasy-hero'
});
```

### Python
```python
from fablecraft import FableCraftAPI

api = FableCraftAPI(api_key='your-api-key')

# Get user projects
projects = api.projects.list()

# Create new character
character = api.characters.create(
    project_id=project_id,
    name='Aragorn',
    template='fantasy-hero'
)
```

## Webhooks

FableCraft supports webhooks for real-time notifications of project changes.

### Webhook Events
- `project.created`
- `project.updated`
- `project.deleted`
- `character.created`
- `character.updated`
- `character.deleted`

### Webhook Payload Example
```json
{
  "event": "character.created",
  "timestamp": "2024-01-15T10:30:00Z",
  "data": {
    "character": {
      "id": "char_123",
      "name": "Aragorn",
      "projectId": "project_123"
    }
  }
}
```

## OpenAPI Specification

A complete OpenAPI 3.0 specification is available at `/api/docs/openapi.json` for automatic client generation and testing with tools like Postman or Insomnia.