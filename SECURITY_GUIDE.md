# Fablecraft Security Guide with Snyk

## Current Security Status

### npm audit results (basic check):
- Fixed 6 vulnerabilities automatically
- 5 moderate severity vulnerabilities remain
- Main issue: esbuild vulnerability in development dependencies

### Why Snyk is Better

**npm audit** only checks:
- Known vulnerabilities in npm packages
- Basic severity levels
- Limited fix suggestions

**Snyk** provides:
- Deep code analysis for security flaws
- Container scanning
- License compliance checking
- Fix pull requests
- Continuous monitoring
- Developer-friendly reports
- Integration with CI/CD pipelines
- Real-time alerts for new vulnerabilities

## Setting Up Snyk

### 1. Create Free Account
Visit https://snyk.io and sign up for a free account. The free tier includes:
- 200 tests/month
- Open source project scanning
- Basic remediation advice

### 2. Authenticate
```bash
npx snyk auth
```
This opens your browser to connect your project.

### 3. Run Security Scans

**Basic vulnerability test:**
```bash
npx snyk test
```

**Fix vulnerabilities interactively:**
```bash
npx snyk wizard
```

**Monitor project (continuous scanning):**
```bash
npx snyk monitor
```

## What Snyk Would Find in Fablecraft

Based on your project structure, Snyk would check:

### 1. **Dependency Vulnerabilities**
- All 100+ npm packages
- Transitive dependencies (dependencies of dependencies)
- License compliance issues

### 2. **Code Security Issues**
- SQL injection risks in database queries
- XSS vulnerabilities in React components
- Insecure API endpoints
- Exposed sensitive data
- Authentication weaknesses

### 3. **API Key Security**
- Hardcoded secrets detection
- Environment variable misuse
- API key exposure patterns

### 4. **AI Integration Security**
- Prompt injection vulnerabilities
- Data leakage through AI APIs
- Rate limiting issues

## Immediate Security Recommendations

### 1. **Fix Current Vulnerabilities**
The esbuild vulnerability affects development only, but should be addressed:
```bash
npm update esbuild
```

### 2. **Add Security Headers**
Create middleware for Express to add security headers.

### 3. **Validate User Input**
Ensure all user inputs are sanitized, especially:
- Character creation forms
- File uploads
- AI prompts

### 4. **Secure Database Queries**
Your Drizzle ORM usage is good, but always use parameterized queries.

### 5. **API Rate Limiting**
Implement rate limiting for AI endpoints to prevent abuse.

## Quick Security Script

I've created `run-snyk.sh` for easy access to security features:
```bash
./run-snyk.sh
```

This provides a menu with options to:
1. Run security tests
2. Fix vulnerabilities
3. Monitor your project
4. Generate detailed reports

## Next Steps

1. **Sign up for Snyk** (free): https://snyk.io
2. **Run authentication**: `npx snyk auth`
3. **Test your project**: `npx snyk test`
4. **Fix issues**: `npx snyk wizard`
5. **Set up monitoring**: `npx snyk monitor`

## Alternative: Using npm audit

If you prefer to stick with npm audit for now:
```bash
# Check for vulnerabilities
npm audit

# Auto-fix what's possible
npm audit fix

# Force fix (may break things)
npm audit fix --force
```

However, npm audit only catches about 30% of what Snyk can detect.

## Security Best Practices for Fablecraft

1. **Keep dependencies updated** - Run security checks weekly
2. **Use environment variables** - Never hardcode API keys
3. **Validate all inputs** - Especially AI prompts and file uploads
4. **Implement rate limiting** - Protect AI endpoints
5. **Use HTTPS only** - When deploying
6. **Regular backups** - Database security includes recovery plans
7. **Audit logs** - Track who accesses what data
8. **Least privilege** - Give minimal permissions needed

Would you like me to implement any specific security improvements now?