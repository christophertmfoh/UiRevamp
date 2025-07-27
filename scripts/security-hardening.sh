#!/bin/bash

# Fablecraft Security Hardening Script
# This script fixes known vulnerabilities and implements security best practices

set -e  # Exit on any error

echo "🔒 Starting Fablecraft Security Hardening..."
echo "================================================"

# Function to check if running in CI
is_ci() {
    [[ "${CI:-false}" == "true" ]]
}

# Function to prompt user for confirmation
confirm() {
    if is_ci; then
        return 0  # Auto-confirm in CI
    fi
    
    read -p "$1 (y/N): " -n 1 -r
    echo
    [[ $REPLY =~ ^[Yy]$ ]]
}

# 1. Backup package.json and package-lock.json
echo "📋 Creating backup of package files..."
cp package.json package.json.backup.$(date +%Y%m%d_%H%M%S)
cp package-lock.json package-lock.json.backup.$(date +%Y%m%d_%H%M%S)

# 2. Fix known vulnerabilities (non-breaking changes)
echo "📦 Fixing package vulnerabilities (safe updates)..."
npm audit fix

# 3. Check for breaking changes
echo ""
echo "⚠️  The following updates require breaking changes:"
echo "   - vite: current → 7.0.6 (major version update)"
echo "   - drizzle-kit: current → 0.31.4 (major version update)"
echo ""

if confirm "Do you want to apply breaking changes? This may require code updates"; then
    echo "🔧 Applying breaking changes..."
    npm audit fix --force
    
    echo "⚠️  IMPORTANT: Breaking changes applied!"
    echo "   Please review the following and test thoroughly:"
    echo "   1. Vite configuration may need updates"
    echo "   2. Drizzle-kit configuration may need updates" 
    echo "   3. Build process may need adjustments"
else
    echo "⏭️  Skipping breaking changes. Manual update recommended."
fi

# 4. Install security packages
echo ""
echo "🛡️ Installing security packages..."
npm install --save helmet cors express-rate-limit express-validator

# 5. Update dependencies to latest compatible versions
echo "⬆️ Updating dependencies to latest compatible versions..."
npm update

# 6. Add security middleware to server
echo "🔧 Adding security middleware template..."

cat > server/security.ts << 'EOF'
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import cors from 'cors';
import type { Express } from 'express';

// Security configuration
export function configureSecurityMiddleware(app: Express) {
  // Security headers
  app.use(helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"], // Note: unsafe-eval needed for Vite dev
        styleSrc: ["'self'", "'unsafe-inline'"],
        imgSrc: ["'self'", "data:", "https:", "blob:"],
        connectSrc: ["'self'", "https://api.openai.com", "https://generativelanguage.googleapis.com"],
        fontSrc: ["'self'", "https:", "data:"],
        objectSrc: ["'none'"],
        mediaSrc: ["'self'"],
        frameSrc: ["'none'"],
      },
    },
    crossOriginEmbedderPolicy: false, // Disable for AI API compatibility
  }));

  // CORS configuration
  app.use(cors({
    origin: process.env.ALLOWED_ORIGINS?.split(',') || [
      'http://localhost:3000',
      'http://localhost:5000',
      'http://localhost:5173'
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
  }));

  // Rate limiting
  const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
    message: {
      error: 'Too many requests from this IP, please try again later.'
    },
    standardHeaders: true,
    legacyHeaders: false,
  });

  // Apply rate limiting to all requests
  app.use('/api/', limiter);

  // Stricter rate limiting for AI endpoints
  const aiLimiter = rateLimit({
    windowMs: 60 * 1000, // 1 minute
    max: 10, // Limit each IP to 10 AI requests per minute
    message: {
      error: 'Too many AI requests, please slow down.'
    }
  });

  app.use('/api/characters/generate', aiLimiter);
  app.use('/api/characters/enhance', aiLimiter);
  app.use('/api/generate-image', aiLimiter);
}

// Environment variable validation
export function validateEnvironmentVariables() {
  const requiredEnvVars = [
    'DATABASE_URL',
    'GOOGLE_API_KEY'
  ];

  const missing = requiredEnvVars.filter(envVar => !process.env[envVar]);
  
  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
  }

  console.log('✅ All required environment variables are present');
}
EOF

echo "📝 Security middleware template created at server/security.ts"

# 7. Create environment variable template
echo "📝 Creating environment variable template..."

cat > .env.example << 'EOF'
# Fablecraft Environment Variables
# Copy this file to .env and fill in your values

# Database
DATABASE_URL=postgresql://username:password@localhost:5432/fablecraft

# AI Services
GOOGLE_API_KEY=your_google_gemini_api_key_here
GOOGLE_API_KEY_1=your_backup_google_api_key_here
OPENAI_API_KEY=your_openai_api_key_here

# Security
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:5000
SESSION_SECRET=your_secure_session_secret_here

# Production settings
NODE_ENV=production
PORT=5000
EOF

# 8. Update server index.ts to include security middleware
echo "📝 Creating security integration instructions..."

cat > SECURITY_INTEGRATION.md << 'EOF'
# Security Integration Instructions

## 1. Update server/index.ts

Add the following imports at the top:
```typescript
import { configureSecurityMiddleware, validateEnvironmentVariables } from './security';
```

Add before the existing middleware:
```typescript
// Validate environment variables
validateEnvironmentVariables();

// Configure security middleware
configureSecurityMiddleware(app);
```

## 2. Environment Variables

1. Copy `.env.example` to `.env`
2. Fill in all required values
3. Add SESSION_SECRET for secure sessions
4. Configure ALLOWED_ORIGINS for production

## 3. Test Security Headers

After starting the server, test security headers:
```bash
curl -I http://localhost:5000/api/health
```

Look for headers like:
- X-Content-Type-Options: nosniff
- X-Frame-Options: DENY
- X-XSS-Protection: 0

## 4. Production Deployment

Ensure the following for production:
- Set NODE_ENV=production
- Use strong SESSION_SECRET
- Configure proper ALLOWED_ORIGINS
- Enable HTTPS
- Monitor rate limiting logs
EOF

# 9. Final security audit
echo ""
echo "🔍 Running final security audit..."
npm audit

# 10. Summary
echo ""
echo "✅ Security hardening complete!"
echo "================================================"
echo ""
echo "📋 Summary of changes:"
echo "   ✅ Fixed package vulnerabilities"
echo "   ✅ Added security middleware (helmet, cors, rate-limiting)"
echo "   ✅ Created security configuration template"
echo "   ✅ Created environment variable template"
echo "   ✅ Updated dependencies"
echo ""
echo "🚨 IMPORTANT NEXT STEPS:"
echo "   1. Review SECURITY_INTEGRATION.md"
echo "   2. Update server/index.ts with security middleware"
echo "   3. Copy .env.example to .env and configure"
echo "   4. Test the application thoroughly"
echo "   5. Review any breaking changes from dependency updates"
echo ""
echo "📊 Security Status:"
if npm audit --audit-level=moderate > /dev/null 2>&1; then
    echo "   ✅ No moderate or high vulnerabilities found"
else
    echo "   ⚠️  Some vulnerabilities may remain - review npm audit output"
fi
echo ""
echo "🔗 Next steps: Follow the SECURITY_INTEGRATION.md guide"
echo "📚 Full report: See SECURITY_ANALYSIS_REPORT.md"