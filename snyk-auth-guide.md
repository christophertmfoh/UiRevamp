# Snyk Authentication in Cloud Environments

## The Issue
Snyk's browser-based authentication expects localhost (127.0.0.1:8080) which doesn't work in cloud IDEs like Replit.

## Solution: Use API Token Authentication

### Step 1: Get Your Snyk API Token
1. Go to https://app.snyk.io/account
2. Sign up for a free account if you don't have one
3. Once logged in, go to Account Settings
4. Click on "Auth Token" or visit: https://app.snyk.io/account/auth-token
5. Copy your API token

### Step 2: Set the Token in Your Environment

Option A - Set it temporarily (for this session):
```bash
export SNYK_TOKEN=your-token-here
```

Option B - Add to Replit Secrets (recommended):
1. In Replit, click the lock icon (Secrets)
2. Add a new secret:
   - Key: `SNYK_TOKEN`
   - Value: [paste your token]

### Step 3: Verify Authentication
```bash
npx snyk auth $SNYK_TOKEN
```

Or if using Replit secrets:
```bash
npx snyk auth $SNYK_TOKEN
```

### Step 4: Test It Works
```bash
npx snyk test
```

## Alternative: Use Snyk Without Authentication

For basic vulnerability scanning without cloud features:
```bash
# This will work but with limited features
npx snyk test --no-auth
```

However, this won't give you:
- Continuous monitoring
- Fix PRs
- Full vulnerability database
- License scanning

## Using Your Security Script

Once authenticated, you can use:
```bash
./run-snyk.sh
```

This provides an easy menu for all security features!