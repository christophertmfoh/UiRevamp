#!/usr/bin/env node

/**
 * Security Check Script
 * Performs comprehensive security scanning of the application
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

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

class SecurityChecker {
  constructor() {
    this.issues = [];
    this.warnings = [];
    this.info = [];
    this.scannedFiles = 0;
    this.startTime = Date.now();
  }

  // Security patterns to look for
  getSecurityPatterns() {
    return {
      // Hardcoded secrets
      secrets: [
        { pattern: /password\s*[:=]\s*["'][^"']{3,}["']/gi, severity: 'high', description: 'Hardcoded password' },
        { pattern: /api[_-]?key\s*[:=]\s*["'][^"']{10,}["']/gi, severity: 'high', description: 'Hardcoded API key' },
        { pattern: /secret\s*[:=]\s*["'][^"']{8,}["']/gi, severity: 'medium', description: 'Potential hardcoded secret' },
        { pattern: /token\s*[:=]\s*["'][^"']{20,}["']/gi, severity: 'medium', description: 'Potential hardcoded token' }
      ],
      
      // Insecure practices
      insecure: [
        { pattern: /eval\s*\(/gi, severity: 'high', description: 'Use of eval() function' },
        { pattern: /innerHTML\s*=/gi, severity: 'medium', description: 'Use of innerHTML (XSS risk)' },
        { pattern: /document\.write/gi, severity: 'medium', description: 'Use of document.write' },
        { pattern: /Math\.random\(\)/gi, severity: 'low', description: 'Non-cryptographic random number generation' },
        { pattern: /console\.log\(/gi, severity: 'low', description: 'Console logging (potential info leak)' }
      ],
      
      // SQL injection risks
      sql: [
        { pattern: /query\s*\(\s*["'].*\$\{.*\}.*["']\s*\)/gi, severity: 'high', description: 'Potential SQL injection' },
        { pattern: /SELECT.*\+.*FROM/gi, severity: 'medium', description: 'Dynamic SQL construction' }
      ],
      
      // Dependency issues
      dependencies: [
        { pattern: /"lodash":\s*["'][^"']*["']/gi, severity: 'low', description: 'Consider lodash alternatives for bundle size' },
        { pattern: /"moment":\s*["'][^"']*["']/gi, severity: 'medium', description: 'Moment.js is deprecated, use date-fns or dayjs' }
      ]
    };
  }

  // File extensions to scan
  getFileExtensions() {
    return ['.js', '.jsx', '.ts', '.tsx', '.json', '.env'];
  }

  // Directories to skip
  getSkipDirectories() {
    return ['node_modules', '.git', 'dist', 'build', '.next', 'coverage', 'archive'];
  }

  scanFile(filePath) {
    try {
      const content = fs.readFileSync(filePath, 'utf8');
      const relativePath = path.relative(process.cwd(), filePath);
      const patterns = this.getSecurityPatterns();
      
      // Check each pattern category
      Object.entries(patterns).forEach(([category, patternList]) => {
        patternList.forEach(({ pattern, severity, description }) => {
          const matches = content.match(pattern);
          if (matches) {
            matches.forEach(match => {
              const lineNumber = this.getLineNumber(content, match);
              this.addIssue({
                file: relativePath,
                line: lineNumber,
                severity,
                category,
                description,
                match: match.trim().substring(0, 100) + (match.length > 100 ? '...' : '')
              });
            });
          }
        });
      });

      this.scannedFiles++;
    } catch (error) {
      this.warnings.push(`Could not scan ${filePath}: ${error.message}`);
    }
  }

  getLineNumber(content, match) {
    const index = content.indexOf(match);
    return content.substring(0, index).split('\n').length;
  }

  addIssue(issue) {
    this.issues.push(issue);
  }

  scanDirectory(dirPath) {
    try {
      const items = fs.readdirSync(dirPath);
      
      items.forEach(item => {
        const itemPath = path.join(dirPath, item);
        const stat = fs.statSync(itemPath);
        
        if (stat.isDirectory()) {
          if (!this.getSkipDirectories().includes(item)) {
            this.scanDirectory(itemPath);
          }
        } else if (stat.isFile()) {
          const ext = path.extname(item);
          if (this.getFileExtensions().includes(ext)) {
            this.scanFile(itemPath);
          }
        }
      });
    } catch (error) {
      this.warnings.push(`Could not scan directory ${dirPath}: ${error.message}`);
    }
  }

  checkEnvironmentSecurity() {
    const envFiles = ['.env', '.env.local', '.env.development', '.env.production'];
    
    envFiles.forEach(envFile => {
      if (fs.existsSync(envFile)) {
        // Check if .env files are in .gitignore
        const gitignoreContent = fs.existsSync('.gitignore') ? fs.readFileSync('.gitignore', 'utf8') : '';
        if (!gitignoreContent.includes('.env')) {
          this.addIssue({
            file: '.gitignore',
            line: 1,
            severity: 'high',
            category: 'configuration',
            description: 'Environment files not excluded from git',
            match: 'Missing .env* in .gitignore'
          });
        }
      }
    });
  }

  checkPackageJsonSecurity() {
    if (fs.existsSync('package.json')) {
      try {
        const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
        
        // Check for known vulnerable packages
        const vulnerablePackages = ['moment', 'request', 'lodash'];
        const dependencies = { ...packageJson.dependencies, ...packageJson.devDependencies };
        
        vulnerablePackages.forEach(pkg => {
          if (dependencies[pkg]) {
            this.addIssue({
              file: 'package.json',
              line: 1,
              severity: 'medium',
              category: 'dependencies',
              description: `Potentially vulnerable package: ${pkg}`,
              match: `"${pkg}": "${dependencies[pkg]}"`
            });
          }
        });

        // Check for scripts with potential security issues
        if (packageJson.scripts) {
          Object.entries(packageJson.scripts).forEach(([scriptName, scriptCommand]) => {
            if (scriptCommand.includes('curl') && scriptCommand.includes('|')) {
              this.addIssue({
                file: 'package.json',
                line: 1,
                severity: 'high',
                category: 'scripts',
                description: 'Script contains curl pipe (security risk)',
                match: `"${scriptName}": "${scriptCommand}"`
              });
            }
          });
        }
      } catch (error) {
        this.warnings.push(`Could not parse package.json: ${error.message}`);
      }
    }
  }

  checkDockerSecurity() {
    // Docker removed in Phase 1 - Replit environment doesn't use Docker
    // Instead, check for Replit-specific security considerations
    this.checkReplitSecurity();
  }

  checkReplitSecurity() {
    // Check for exposed secrets in Replit environment
    const replitFiles = ['.replit', 'replit.nix'];
    
    replitFiles.forEach(file => {
      if (fs.existsSync(file)) {
        try {
          const content = fs.readFileSync(file, 'utf8');
          
          // Check for hardcoded secrets in Replit config
          const secretPatterns = [
            /api[_-]?key\s*=\s*['"]\w+['"]/i,
            /secret\s*=\s*['"]\w+['"]/i,
            /password\s*=\s*['"]\w+['"]/i,
            /token\s*=\s*['"]\w+['"]/i
          ];
          
          secretPatterns.forEach(pattern => {
            const matches = content.match(pattern);
            if (matches) {
              this.addIssue({
                file,
                line: 1,
                severity: 'high',
                category: 'replit-security',
                description: 'Potential hardcoded secret in Replit config',
                match: matches[0].substring(0, 50)
              });
            }
          });
        } catch (error) {
          this.warnings.push(`Could not scan ${file}: ${error.message}`);
        }
      }
    });

    // Check for proper environment variable usage
    if (fs.existsSync('.env.example') && !fs.existsSync('.env')) {
      this.addIssue({
        file: '.env',
        line: 1,
        severity: 'medium',
        category: 'replit-security',
        description: 'Missing .env file - copy from .env.example',
        match: 'Environment setup incomplete'
      });
    }
  }

  generateReport() {
    const endTime = Date.now();
    const scanTime = ((endTime - this.startTime) / 1000).toFixed(2);
    
    console.log(`${colors.bold}${colors.cyan}Security Scan Report${colors.reset}`);
    console.log(`${colors.blue}Scanned ${this.scannedFiles} files in ${scanTime}s${colors.reset}\n`);

    // Group issues by severity
    const groupedIssues = {
      high: this.issues.filter(i => i.severity === 'high'),
      medium: this.issues.filter(i => i.severity === 'medium'),
      low: this.issues.filter(i => i.severity === 'low')
    };

    // Display results
    Object.entries(groupedIssues).forEach(([severity, issues]) => {
      if (issues.length > 0) {
        const color = severity === 'high' ? colors.red : severity === 'medium' ? colors.yellow : colors.blue;
        const icon = severity === 'high' ? '🚨' : severity === 'medium' ? '⚠️' : 'ℹ️';
        
        console.log(`${color}${icon} ${severity.toUpperCase()} (${issues.length} issues):${colors.reset}`);
        
        issues.forEach(issue => {
          console.log(`  ${color}•${colors.reset} ${issue.file}:${issue.line} - ${issue.description}`);
          console.log(`    ${colors.cyan}${issue.match}${colors.reset}`);
        });
        console.log('');
      }
    });

    // Display warnings
    if (this.warnings.length > 0) {
      console.log(`${colors.yellow}⚠️  Warnings:${colors.reset}`);
      this.warnings.forEach(warning => {
        console.log(`  ${colors.yellow}•${colors.reset} ${warning}`);
      });
      console.log('');
    }

    // Summary
    const totalIssues = this.issues.length;
    if (totalIssues === 0) {
      console.log(`${colors.green}${colors.bold}✅ No security issues found!${colors.reset}`);
      return true;
    } else {
      console.log(`${colors.red}${colors.bold}Found ${totalIssues} security issues${colors.reset}`);
      console.log(`  ${colors.red}• High: ${groupedIssues.high.length}${colors.reset}`);
      console.log(`  ${colors.yellow}• Medium: ${groupedIssues.medium.length}${colors.reset}`);
      console.log(`  ${colors.blue}• Low: ${groupedIssues.low.length}${colors.reset}`);
      
      console.log(`\n${colors.cyan}💡 Recommendations:${colors.reset}`);
      if (groupedIssues.high.length > 0) {
        console.log(`  1. ${colors.red}CRITICAL:${colors.reset} Fix high-severity issues immediately`);
      }
      if (groupedIssues.medium.length > 0) {
        console.log(`  2. ${colors.yellow}IMPORTANT:${colors.reset} Address medium-severity issues`);
      }
      console.log(`  3. Run dependency audit: ${colors.cyan}npm audit${colors.reset}`);
      console.log(`  4. Keep dependencies updated: ${colors.cyan}npm outdated${colors.reset}`);
      
      return groupedIssues.high.length === 0; // Pass if no high-severity issues
    }
  }

  run() {
    const args = process.argv.slice(2);
    
    if (args.includes('--help') || args.includes('-h')) {
      console.log(`
${colors.bold}FableCraft Security Scanner${colors.reset}

Usage: node scripts/security-check.js [options]

Options:
  --help, -h        Show this help message
  --path <dir>      Scan specific directory (default: current directory)
  --severity <min>  Minimum severity to report (high, medium, low)
  --format <type>   Output format (console, json, csv)

Examples:
  node scripts/security-check.js
  node scripts/security-check.js --path ./src
  node scripts/security-check.js --severity high
`);
      process.exit(0);
    }

    console.log(`${colors.bold}${colors.cyan}Starting Security Scan...${colors.reset}\n`);

    // Determine scan path
    const pathIndex = args.indexOf('--path');
    const scanPath = pathIndex !== -1 && args[pathIndex + 1] ? args[pathIndex + 1] : '.';

    // Run all security checks
    this.scanDirectory(scanPath);
    this.checkEnvironmentSecurity();
    this.checkPackageJsonSecurity();
    this.checkDockerSecurity();

    // Generate and display report
    const passed = this.generateReport();
    process.exit(passed ? 0 : 1);
  }
}

// CLI interface
if (require.main === module) {
  const checker = new SecurityChecker();
  checker.run();
}

module.exports = SecurityChecker;