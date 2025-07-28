# Environment Variables Documentation

This document outlines all environment variables used in the FableCraft World Bible application.

## 📋 Table of Contents

- [Required Variables](#required-variables)
- [Optional Variables](#optional-variables)
- [Development Variables](#development-variables)
- [Production Variables](#production-variables)
- [Security Considerations](#security-considerations)
- [Environment File Examples](#environment-file-examples)

## 🔴 Required Variables

These variables MUST be set in production environments:

### Database Configuration

| Variable | Description | Example | Notes |
|----------|-------------|---------|-------|
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://user:pass@host:5432/dbname` | **CRITICAL**: Never commit to version control |
| `POSTGRES_DB` | Database name | `fablecraft_prod` | Used by Docker PostgreSQL container |
| `POSTGRES_USER` | Database username | `fablecraft_user` | Used by Docker PostgreSQL container |
| `POSTGRES_PASSWORD` | Database password | `secure_random_password` | **CRITICAL**: Use strong passwords |

### Authentication & Security

| Variable | Description | Example | Notes |
|----------|-------------|---------|-------|
| `JWT_SECRET` | JWT token signing secret | `your-super-secure-jwt-secret-key` | **CRITICAL**: Must be 32+ characters |
| `ENCRYPTION_KEY` | Data encryption key | `32-char-random-encryption-key` | **CRITICAL**: For sensitive data encryption |

### AI Services

| Variable | Description | Example | Notes |
|----------|-------------|---------|-------|
| `GEMINI_API_KEY` | Google Gemini AI API key | `AIza...` | **CRITICAL**: Required for AI features |
| `OPENAI_API_KEY` | OpenAI API key | `sk-...` | Optional: For image generation |

## 🟡 Optional Variables

These variables have sensible defaults but can be customized:

### Application Configuration

| Variable | Description | Default | Notes |
|----------|-------------|---------|-------|
| `NODE_ENV` | Application environment | `development` | Values: `development`, `production`, `test` |
| `PORT` | Server port | `5000` | Port for Express server |
| `CLIENT_PORT` | Client dev server port | `3000` | Only used in development |
| `HOST` | Server host | `localhost` | Bind address for server |

### Performance & Caching

| Variable | Description | Default | Notes |
|----------|-------------|---------|-------|
| `REDIS_URL` | Redis connection string | `redis://localhost:6379` | For caching and sessions |
| `CACHE_TTL` | Cache time-to-live (seconds) | `3600` | Default 1 hour |
| `SESSION_TTL` | Session expiration (seconds) | `86400` | Default 24 hours |

### File Storage

| Variable | Description | Default | Notes |
|----------|-------------|---------|-------|
| `UPLOAD_PATH` | File upload directory | `./uploads` | Ensure proper permissions |
| `MAX_FILE_SIZE` | Maximum upload size (bytes) | `10485760` | Default 10MB |
| `ALLOWED_FILE_TYPES` | Allowed upload extensions | `jpg,jpeg,png,gif,pdf` | Comma-separated |

## 🔵 Development Variables

These variables are primarily used in development:

| Variable | Description | Default | Notes |
|----------|-------------|---------|-------|
| `DEBUG` | Enable debug logging | `false` | Set to `true` for verbose logs |
| `VITE_API_URL` | Client API base URL | `http://localhost:5000` | Frontend-only variable |
| `MOCK_DATABASE` | Use mock database | `true` | Development only |
| `DISABLE_AUTH` | Skip authentication | `false` | **WARNING**: Development only |

## 🟢 Production Variables

Additional variables for production deployments:

### Monitoring & Logging

| Variable | Description | Default | Notes |
|----------|-------------|---------|-------|
| `LOG_LEVEL` | Logging level | `info` | Values: `error`, `warn`, `info`, `debug` |
| `SENTRY_DSN` | Error tracking DSN | `undefined` | For production error monitoring |
| `PROMETHEUS_PORT` | Metrics port | `9090` | For performance monitoring |

### SSL & Security

| Variable | Description | Default | Notes |
|----------|-------------|---------|-------|
| `SSL_CERT_PATH` | SSL certificate path | `undefined` | For HTTPS in production |
| `SSL_KEY_PATH` | SSL private key path | `undefined` | For HTTPS in production |
| `CORS_ORIGINS` | Allowed CORS origins | `*` | Comma-separated domains |
| `RATE_LIMIT_WINDOW` | Rate limit window (ms) | `900000` | Default 15 minutes |
| `RATE_LIMIT_MAX` | Max requests per window | `100` | Per IP address |

### Performance

| Variable | Description | Default | Notes |
|----------|-------------|---------|-------|
| `CLUSTER_WORKERS` | Number of worker processes | `auto` | Based on CPU cores |
| `MAX_CONNECTIONS` | Database connection pool size | `20` | Adjust based on load |
| `MEMORY_LIMIT` | Node.js memory limit | `512mb` | Prevent memory leaks |

## 🔒 Security Considerations

### Secret Management

1. **Never commit secrets to version control**
2. **Use environment-specific `.env` files**
3. **Rotate secrets regularly**
4. **Use strong, random passwords**
5. **Implement least-privilege access**

### Production Best Practices

```bash
# Generate secure random secrets
openssl rand -base64 32  # For JWT_SECRET
openssl rand -hex 32     # For ENCRYPTION_KEY

# Validate environment variables
node -e "console.log(process.env.JWT_SECRET?.length >= 32 ? '✅ JWT_SECRET is secure' : '❌ JWT_SECRET too short')"
```

## 📄 Environment File Examples

### Development (`.env.development`)

```bash
# Application
NODE_ENV=development
PORT=5000
CLIENT_PORT=3000
DEBUG=true

# Database (Mock)
MOCK_DATABASE=true
DATABASE_URL=mock

# Auth
JWT_SECRET=dev-jwt-secret-key-32-characters
DISABLE_AUTH=false

# AI Services (Optional in dev)
GEMINI_API_KEY=your-gemini-api-key
# OPENAI_API_KEY=your-openai-api-key

# Development
VITE_API_URL=http://localhost:5000
```

### Production (`.env.production`)

```bash
# Application
NODE_ENV=production
PORT=5000
HOST=0.0.0.0

# Database
DATABASE_URL=postgresql://user:password@db-host:5432/fablecraft_prod
POSTGRES_DB=fablecraft_prod
POSTGRES_USER=fablecraft_user
POSTGRES_PASSWORD=super-secure-random-password

# Security
JWT_SECRET=production-jwt-secret-minimum-32-characters-long
ENCRYPTION_KEY=32-character-random-encryption-key

# AI Services
GEMINI_API_KEY=your-production-gemini-api-key
OPENAI_API_KEY=your-production-openai-api-key

# Caching
REDIS_URL=redis://redis-host:6379

# Monitoring
LOG_LEVEL=warn
SENTRY_DSN=https://your-sentry-dsn

# Performance
CLUSTER_WORKERS=4
MAX_CONNECTIONS=50
MEMORY_LIMIT=1gb

# Security
CORS_ORIGINS=https://yourdomain.com,https://www.yourdomain.com
RATE_LIMIT_MAX=1000
```

### Docker (`.env.docker`)

```bash
# Database
POSTGRES_DB=fablecraft
POSTGRES_USER=fablecraft
POSTGRES_PASSWORD=fablecraft-docker-password

# Application
DATABASE_URL=postgresql://fablecraft:fablecraft-docker-password@postgres:5432/fablecraft
REDIS_URL=redis://redis:6379

# AI Services
GEMINI_API_KEY=your-gemini-api-key
OPENAI_API_KEY=your-openai-api-key

# Security
JWT_SECRET=docker-jwt-secret-32-characters-minimum

# Monitoring
GRAFANA_PASSWORD=admin
```

## 🚀 Quick Setup Commands

### Development Setup

```bash
# Copy template
cp .env.example .env.development

# Generate secrets
echo "JWT_SECRET=$(openssl rand -base64 32)" >> .env.development
echo "ENCRYPTION_KEY=$(openssl rand -hex 32)" >> .env.development

# Add your API keys
echo "GEMINI_API_KEY=your-key-here" >> .env.development
```

### Production Setup

```bash
# Create production environment file
cp .env.example .env.production

# Set secure values (replace with actual values)
echo "DATABASE_URL=postgresql://..." >> .env.production
echo "JWT_SECRET=$(openssl rand -base64 32)" >> .env.production
echo "ENCRYPTION_KEY=$(openssl rand -hex 32)" >> .env.production
```

### Validation Script

```bash
# Validate required environment variables
npm run validate-env
```

## 📞 Support

For environment configuration issues:

1. Check the [Development Guide](../development/SETUP.md)
2. Review [Deployment Documentation](./DEPLOYMENT.md)
3. Contact the development team

---

**⚠️ Security Notice**: Always validate that production environments have secure, unique values for all secret variables. Regular rotation of secrets is recommended.