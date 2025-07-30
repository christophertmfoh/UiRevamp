#!/usr/bin/env node

/**
 * Secret Generation Script
 * Generates secure random secrets for environment variables
 */

const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

// ANSI color codes for terminal output
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  bold: '\x1b[1m'
};

class SecretGenerator {
  constructor() {
    this.secrets = {};
  }

  generateBase64Secret(length = 32) {
    return crypto.randomBytes(length).toString('base64');
  }

  generateHexSecret(length = 32) {
    return crypto.randomBytes(length).toString('hex');
  }

  generateAlphanumeric(length = 32) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += chars.charAt(crypto.randomInt(0, chars.length));
    }
    return result;
  }

  generatePassword(length = 16) {
    const lowercase = 'abcdefghijklmnopqrstuvwxyz';
    const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const numbers = '0123456789';
    const symbols = '!@#$%^&*()_+-=[]{}|;:,.<>?';
    const allChars = lowercase + uppercase + numbers + symbols;

    // Ensure at least one character from each category
    let password = '';
    password += lowercase[crypto.randomInt(0, lowercase.length)];
    password += uppercase[crypto.randomInt(0, uppercase.length)];
    password += numbers[crypto.randomInt(0, numbers.length)];
    password += symbols[crypto.randomInt(0, symbols.length)];

    // Fill the rest randomly
    for (let i = 4; i < length; i++) {
      password += allChars[crypto.randomInt(0, allChars.length)];
    }

    // Shuffle the password
    return password.split('').sort(() => crypto.randomInt(0, 3) - 1).join('');
  }

  generateSecrets() {
    console.log(`${colors.bold}${colors.cyan}Generating Secure Secrets...${colors.reset}\n`);

    // JWT Secret (Base64, 32 bytes = 44 characters in base64)
    this.secrets.JWT_SECRET = this.generateBase64Secret(32);
    console.log(`${colors.green}✓${colors.reset} JWT_SECRET: ${colors.yellow}[GENERATED]${colors.reset}`);

    // Encryption Key (Hex, 32 bytes = 64 hex characters)
    this.secrets.ENCRYPTION_KEY = this.generateHexSecret(32);
    console.log(`${colors.green}✓${colors.reset} ENCRYPTION_KEY: ${colors.yellow}[GENERATED]${colors.reset}`);

    // Database Password (Strong password)
    this.secrets.POSTGRES_PASSWORD = this.generatePassword(20);
    console.log(`${colors.green}✓${colors.reset} POSTGRES_PASSWORD: ${colors.yellow}[GENERATED]${colors.reset}`);

    // Session Secret (Base64)
    this.secrets.SESSION_SECRET = this.generateBase64Secret(24);
    console.log(`${colors.green}✓${colors.reset} SESSION_SECRET: ${colors.yellow}[GENERATED]${colors.reset}`);

    // API Key for internal services (Alphanumeric)
    this.secrets.INTERNAL_API_KEY = this.generateAlphanumeric(40);
    console.log(`${colors.green}✓${colors.reset} INTERNAL_API_KEY: ${colors.yellow}[GENERATED]${colors.reset}`);

    // Phase 3: Grafana removed - Replit-native monitoring instead

    console.log(`\n${colors.cyan}📋 Security Information:${colors.reset}`);
    console.log(`  • JWT_SECRET: ${this.secrets.JWT_SECRET.length} characters (Base64)`);
    console.log(`  • ENCRYPTION_KEY: ${this.secrets.ENCRYPTION_KEY.length} characters (Hex)`);
    console.log(`  • POSTGRES_PASSWORD: ${this.secrets.POSTGRES_PASSWORD.length} characters (Strong)`);
    console.log(`  • SESSION_SECRET: ${this.secrets.SESSION_SECRET.length} characters (Base64)`);
    console.log(`  • INTERNAL_API_KEY: ${this.secrets.INTERNAL_API_KEY.length} characters (Alphanumeric)`);
  }

  updateEnvFile(envFile) {
    try {
      let envContent = '';
      
      if (fs.existsSync(envFile)) {
        envContent = fs.readFileSync(envFile, 'utf8');
        console.log(`\n${colors.blue}📝 Updating existing file: ${envFile}${colors.reset}`);
      } else {
        if (fs.existsSync('.env.example')) {
          envContent = fs.readFileSync('.env.example', 'utf8');
          console.log(`\n${colors.blue}📝 Creating new file from template: ${envFile}${colors.reset}`);
        } else {
          console.log(`\n${colors.blue}📝 Creating new file: ${envFile}${colors.reset}`);
        }
      }

      // Update or add each secret
      Object.entries(this.secrets).forEach(([key, value]) => {
        const regex = new RegExp(`^${key}=.*$`, 'm');
        const newLine = `${key}=${value}`;
        
        if (regex.test(envContent)) {
          envContent = envContent.replace(regex, newLine);
          console.log(`  ${colors.green}↻${colors.reset} Updated ${key}`);
        } else {
          envContent += `\n${newLine}`;
          console.log(`  ${colors.green}+${colors.reset} Added ${key}`);
        }
      });

      // Write the file
      fs.writeFileSync(envFile, envContent);
      console.log(`\n${colors.green}${colors.bold}✅ Secrets written to ${envFile}${colors.reset}`);

      return true;
    } catch (error) {
      console.error(`\n${colors.red}❌ Error writing to ${envFile}: ${error.message}${colors.reset}`);
      return false;
    }
  }

  displaySecrets() {
    console.log(`\n${colors.yellow}🔑 Generated Secrets (copy these to your .env file):${colors.reset}`);
    console.log(`${colors.cyan}${'='.repeat(60)}${colors.reset}`);
    
    Object.entries(this.secrets).forEach(([key, value]) => {
      console.log(`${colors.green}${key}${colors.reset}=${colors.yellow}${value}${colors.reset}`);
    });
    
    console.log(`${colors.cyan}${'='.repeat(60)}${colors.reset}`);
  }

  showSecurityWarning() {
    console.log(`\n${colors.red}${colors.bold}🚨 SECURITY WARNING:${colors.reset}`);
    console.log(`${colors.red}• These secrets are displayed ONCE only${colors.reset}`);
    console.log(`${colors.red}• Store them securely and never commit to version control${colors.reset}`);
    console.log(`${colors.red}• Rotate secrets regularly in production${colors.reset}`);
    console.log(`${colors.red}• Use different secrets for each environment${colors.reset}`);
  }

  run() {
    const args = process.argv.slice(2);
    
    if (args.includes('--help') || args.includes('-h')) {
      console.log(`
${colors.bold}FableCraft Secret Generator${colors.reset}

Usage: node scripts/generate-secrets.js [options]

Options:
  --help, -h           Show this help message
  --file <path>        Write secrets to specific .env file
  --env <environment>  Generate for specific environment (dev, prod, test)
  --display-only       Only display secrets, don't write to file
  --force              Overwrite existing secrets in file

Examples:
  node scripts/generate-secrets.js
  node scripts/generate-secrets.js --env production
  node scripts/generate-secrets.js --file .env.production
  node scripts/generate-secrets.js --display-only
`);
      process.exit(0);
    }

    this.generateSecrets();

    // Determine output file
    let envFile = null;
    const fileIndex = args.indexOf('--file');
    const envIndex = args.indexOf('--env');
    const displayOnly = args.includes('--display-only');

    if (fileIndex !== -1 && args[fileIndex + 1]) {
      envFile = args[fileIndex + 1];
    } else if (envIndex !== -1 && args[envIndex + 1]) {
      const env = args[envIndex + 1];
      envFile = `.env.${env}`;
    } else if (!displayOnly) {
      envFile = '.env.development';
    }

    if (displayOnly) {
      this.displaySecrets();
    } else if (envFile) {
      const success = this.updateEnvFile(envFile);
      if (success) {
        console.log(`\n${colors.cyan}💡 Next steps:${colors.reset}`);
        console.log(`  1. Review the generated secrets in ${envFile}`);
        console.log(`  2. Add your API keys (GEMINI_API_KEY, OPENAI_API_KEY)`);
        console.log(`  3. Validate configuration: ${colors.cyan}npm run validate-env${colors.reset}`);
        console.log(`  4. Start development: ${colors.cyan}npm run dev${colors.reset}`);
      }
    }

    this.showSecurityWarning();
  }
}

// CLI interface
if (require.main === module) {
  const generator = new SecretGenerator();
  generator.run();
}

module.exports = SecretGenerator;