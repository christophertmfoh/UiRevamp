#!/usr/bin/env node

/**
 * Environment Variable Validation Script
 * Validates required environment variables and checks security best practices
 */

const fs = require('fs');
const path = require('path');

// ANSI color codes for terminal output
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  white: '\x1b[37m',
  bold: '\x1b[1m'
};

// Environment-specific requirements
const ENVIRONMENTS = {
  development: {
    required: ['NODE_ENV'],
    optional: ['DATABASE_URL', 'GEMINI_API_KEY', 'JWT_SECRET'],
    warnings: []
  },
  production: {
    required: [
      'NODE_ENV',
      'DATABASE_URL',
      'JWT_SECRET',
      'GEMINI_API_KEY'
    ],
    optional: ['OPENAI_API_KEY', 'REDIS_URL', 'SENTRY_DSN'],
    warnings: ['DISABLE_AUTH', 'DEBUG']
  },
  test: {
    required: ['NODE_ENV'],
    optional: ['DATABASE_URL', 'JWT_SECRET'],
    warnings: []
  }
};

// Security validation rules
const SECURITY_RULES = {
  JWT_SECRET: {
    minLength: 32,
    pattern: /^[A-Za-z0-9+/=_-]+$/,
    message: 'JWT_SECRET should be at least 32 characters and contain only safe characters'
  },
  ENCRYPTION_KEY: {
    minLength: 32,
    pattern: /^[A-Fa-f0-9]+$/,
    message: 'ENCRYPTION_KEY should be at least 32 characters and contain only hex characters'
  },
  DATABASE_URL: {
    pattern: /^(postgresql|postgres|mock):/,
    message: 'DATABASE_URL should start with postgresql:// or be "mock" for development'
  },
  GEMINI_API_KEY: {
    pattern: /^[A-Za-z0-9_-]+$/,
    message: 'GEMINI_API_KEY should contain only alphanumeric characters, hyphens, and underscores'
  },
  OPENAI_API_KEY: {
    pattern: /^sk-[A-Za-z0-9]+$/,
    message: 'OPENAI_API_KEY should start with "sk-" followed by alphanumeric characters'
  }
};

class EnvValidator {
  constructor() {
    this.errors = [];
    this.warnings = [];
    this.info = [];
    this.env = process.env.NODE_ENV || 'development';
    this.envFile = this.findEnvFile();
  }

  findEnvFile() {
    const possibleFiles = [
      `.env.${this.env}`,
      '.env.local',
      '.env'
    ];

    for (const file of possibleFiles) {
      if (fs.existsSync(file)) {
        return file;
      }
    }
    return null;
  }

  loadEnvFile() {
    if (!this.envFile) {
      this.warnings.push('No environment file found. Using system environment variables only.');
      return;
    }

    try {
      const envContent = fs.readFileSync(this.envFile, 'utf8');
      const lines = envContent.split('\n');
      
      lines.forEach((line, index) => {
        const trimmed = line.trim();
        if (trimmed && !trimmed.startsWith('#')) {
          const [key, ...valueParts] = trimmed.split('=');
          if (key && valueParts.length > 0) {
            const value = valueParts.join('=');
            process.env[key] = value;
          }
        }
      });

      this.info.push(`Loaded environment from: ${this.envFile}`);
    } catch (error) {
      this.errors.push(`Failed to load environment file ${this.envFile}: ${error.message}`);
    }
  }

  validateRequired() {
    const config = ENVIRONMENTS[this.env];
    if (!config) {
      this.errors.push(`Unknown environment: ${this.env}`);
      return;
    }

    config.required.forEach(varName => {
      if (!process.env[varName]) {
        this.errors.push(`Missing required variable: ${varName}`);
      }
    });

    // Check for production warnings in non-production environments
    if (this.env === 'production') {
      config.warnings.forEach(varName => {
        if (process.env[varName] === 'true') {
          this.warnings.push(`Dangerous setting in production: ${varName}=true`);
        }
      });
    }
  }

  validateSecurity() {
    Object.entries(SECURITY_RULES).forEach(([varName, rule]) => {
      const value = process.env[varName];
      if (!value) return;

      // Check minimum length
      if (rule.minLength && value.length < rule.minLength) {
        this.errors.push(`${varName} is too short (minimum ${rule.minLength} characters)`);
      }

      // Check pattern
      if (rule.pattern && !rule.pattern.test(value)) {
        this.errors.push(`${varName} format invalid: ${rule.message}`);
      }

      // Special checks
      if (varName === 'JWT_SECRET' && value.includes('dev') && this.env === 'production') {
        this.errors.push('JWT_SECRET appears to be a development key in production');
      }

      if (varName === 'DATABASE_URL' && value === 'mock' && this.env === 'production') {
        this.errors.push('Cannot use mock database in production');
      }
    });
  }

  validateValues() {
    // Port validation
    const port = process.env.PORT;
    if (port && (isNaN(port) || parseInt(port) < 1 || parseInt(port) > 65535)) {
      this.errors.push('PORT must be a valid number between 1 and 65535');
    }

    // Node environment validation
    const validNodeEnvs = ['development', 'production', 'test'];
    if (!validNodeEnvs.includes(this.env)) {
      this.warnings.push(`NODE_ENV "${this.env}" is not a standard value (${validNodeEnvs.join(', ')})`);
    }

    // Log level validation
    const logLevel = process.env.LOG_LEVEL;
    const validLogLevels = ['error', 'warn', 'info', 'debug'];
    if (logLevel && !validLogLevels.includes(logLevel)) {
      this.warnings.push(`LOG_LEVEL "${logLevel}" is not valid (${validLogLevels.join(', ')})`);
    }
  }

  checkSecrets() {
    const secretVars = ['JWT_SECRET', 'ENCRYPTION_KEY', 'DATABASE_URL', 'GEMINI_API_KEY', 'OPENAI_API_KEY'];
    const exposedSecrets = [];

    secretVars.forEach(varName => {
      const value = process.env[varName];
      if (value && (value.includes('example') || value.includes('your-') || value.includes('placeholder'))) {
        exposedSecrets.push(varName);
      }
    });

    if (exposedSecrets.length > 0) {
      this.errors.push(`Found placeholder values in: ${exposedSecrets.join(', ')}`);
    }
  }

  generateReport() {
    console.log(`${colors.bold}${colors.cyan}FableCraft Environment Validation Report${colors.reset}`);
    console.log(`${colors.blue}Environment: ${this.env}${colors.reset}`);
    console.log(`${colors.blue}Config file: ${this.envFile || 'None'}${colors.reset}\n`);

    // Info messages
    if (this.info.length > 0) {
      console.log(`${colors.cyan}📋 Information:${colors.reset}`);
      this.info.forEach(msg => console.log(`  ${colors.cyan}ℹ${colors.reset}  ${msg}`));
      console.log('');
    }

    // Warnings
    if (this.warnings.length > 0) {
      console.log(`${colors.yellow}⚠️  Warnings:${colors.reset}`);
      this.warnings.forEach(msg => console.log(`  ${colors.yellow}⚠${colors.reset}  ${msg}`));
      console.log('');
    }

    // Errors
    if (this.errors.length > 0) {
      console.log(`${colors.red}❌ Errors:${colors.reset}`);
      this.errors.forEach(msg => console.log(`  ${colors.red}✖${colors.reset}  ${msg}`));
      console.log('');
    }

    // Summary
    const totalIssues = this.errors.length + this.warnings.length;
    if (totalIssues === 0) {
      console.log(`${colors.green}${colors.bold}✅ All environment variables are valid!${colors.reset}`);
      return true;
    } else {
      console.log(`${colors.red}${colors.bold}❌ Found ${this.errors.length} errors and ${this.warnings.length} warnings${colors.reset}`);
      
      if (this.errors.length > 0) {
        console.log(`\n${colors.yellow}🔧 Quick fixes:${colors.reset}`);
        console.log(`  1. Copy the template: ${colors.cyan}cp .env.example .env.${this.env}${colors.reset}`);
        console.log(`  2. Generate secrets: ${colors.cyan}npm run generate-secrets${colors.reset}`);
        console.log(`  3. Add your API keys to the .env file`);
        console.log(`  4. Re-run: ${colors.cyan}npm run validate-env${colors.reset}`);
      }
      
      return false;
    }
  }

  validate() {
    this.loadEnvFile();
    this.validateRequired();
    this.validateSecurity();
    this.validateValues();
    this.checkSecrets();
    
    const isValid = this.generateReport();
    process.exit(isValid ? 0 : 1);
  }
}

// CLI interface
if (require.main === module) {
  const args = process.argv.slice(2);
  
  if (args.includes('--help') || args.includes('-h')) {
    console.log(`
${colors.bold}FableCraft Environment Validator${colors.reset}

Usage: node scripts/validate-env.js [options]

Options:
  --help, -h     Show this help message
  --env <name>   Validate specific environment (development, production, test)

Examples:
  node scripts/validate-env.js
  node scripts/validate-env.js --env production
  NODE_ENV=production node scripts/validate-env.js
`);
    process.exit(0);
  }

  // Override environment if specified
  const envIndex = args.indexOf('--env');
  if (envIndex !== -1 && args[envIndex + 1]) {
    process.env.NODE_ENV = args[envIndex + 1];
  }

  const validator = new EnvValidator();
  validator.validate();
}

module.exports = EnvValidator;