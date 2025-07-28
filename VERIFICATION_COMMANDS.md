# Senior Dev Verification Commands
## Enterprise Testing & Validation Protocol

### Code Quality Verification
```bash
# TypeScript compilation check
npm run build

# Lint check
npm run lint

# Type checking
npx tsc --noEmit

# Dependency analysis
npx madge --circular client/src

# Dead code detection
npx unimported

# Duplicate code analysis
npx jscpd client/src
```

### Functionality Verification
```bash
# Start application
npm run dev

# Test database connection
curl -X GET http://localhost:5000/api/auth/me

# Test project endpoints
curl -X GET http://localhost:5000/api/projects

# Test character endpoints  
curl -X GET http://localhost:5000/api/projects/{PROJECT_ID}/characters
```

### Performance Verification
```bash
# Bundle analysis
npm run build && npx bundle-analyzer

# Memory usage check
node --inspect server/index.ts

# Load time measurement
npm run dev && curl -w "@curl-format.txt" http://localhost:5173/
```

### Security Verification
```bash
# Dependency vulnerability check
npm audit

# Security linting
npx eslint client/src --ext .ts,.tsx

# Package verification
npm list --depth=0
```

### Database Verification
```bash
# Schema validation
npm run db:push --dry-run

# Connection test
npm run db:studio

# Migration check
npm run db:generate
```