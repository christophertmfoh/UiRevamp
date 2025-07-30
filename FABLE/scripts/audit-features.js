#!/usr/bin/env node

/**
 * FableCraft Feature Audit Script
 * Automatically maps all working features, API endpoints, and UI components
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class FeatureAuditor {
  constructor() {
    this.results = {
      apiEndpoints: new Map(),
      uiComponents: new Map(),
      pages: new Map(),
      hooks: new Map(),
      features: new Map(),
      duplicates: new Set(),
      deadCode: new Set()
    };
  }

  // Scan all API routes and extract working endpoints
  auditAPIEndpoints() {
    console.log('🔍 Auditing API endpoints...');
    
    const routeFiles = this.findFiles('server/routes', '.ts');
    routeFiles.forEach(file => {
      const content = fs.readFileSync(file, 'utf8');
      
      // Extract route definitions
      const routePatterns = [
        /router\.(get|post|put|delete)\(['"`]([^'"`]+)['"`]/g,
        /app\.(get|post|put|delete)\(['"`]([^'"`]+)['"`]/g,
        /characterRouter\.(get|post|put|delete)\(['"`]([^'"`]+)['"`]/g,
        /projectRouter\.(get|post|put|delete)\(['"`]([^'"`]+)['"`]/g
      ];

      routePatterns.forEach(pattern => {
        let match;
        while ((match = pattern.exec(content)) !== null) {
          const method = match[1].toUpperCase();
          const route = match[2];
          const fullRoute = `/api${route.startsWith('/') ? route : '/' + route}`;
          
          this.results.apiEndpoints.set(`${method} ${fullRoute}`, {
            file: file.replace(process.cwd() + '/', ''),
            method,
            route: fullRoute,
            lineNumber: this.getLineNumber(content, match.index)
          });
        }
      });
    });
  }

  // Scan all React components and identify UI patterns
  auditUIComponents() {
    console.log('🎨 Auditing UI components...');
    
    const componentFiles = this.findFiles('client/src', '.tsx');
    componentFiles.forEach(file => {
      const content = fs.readFileSync(file, 'utf8');
      
      // Extract component exports
      const componentPattern = /export\s+(default\s+)?(?:function|const)\s+([A-Z][a-zA-Z0-9]+)/g;
      let match;
      while ((match = componentPattern.exec(content)) !== null) {
        const componentName = match[2];
        
        // Analyze component features
        const features = this.analyzeComponentFeatures(content);
        
        this.results.uiComponents.set(componentName, {
          file: file.replace(process.cwd() + '/', ''),
          features,
          hasHooks: /use[A-Z]/.test(content),
          hasAPI: /apiRequest|useQuery|useMutation/.test(content),
          hasRouting: /useLocation|Link|navigate/.test(content),
          hasAuth: /useAuth|isAuthenticated/.test(content)
        });
      }
    });
  }

  // Analyze component for specific features
  analyzeComponentFeatures(content) {
    const features = [];
    
    // Form handling
    if (/useForm|onSubmit/.test(content)) features.push('forms');
    
    // Modal system
    if (/Dialog|Modal|isOpen/.test(content)) features.push('modals');
    
    // Theme system
    if (/theme|ThemeProvider|useTheme/.test(content)) features.push('theming');
    
    // AI integration
    if (/gemini|openai|generateWith|enhance/.test(content)) features.push('ai');
    
    // CRUD operations
    if (/create|update|delete|edit/.test(content)) features.push('crud');
    
    // Character management
    if (/character|Character/.test(content)) features.push('characters');
    
    // Project management
    if (/project|Project/.test(content)) features.push('projects');
    
    return features;
  }

  // Scan for page components and routing
  auditPages() {
    console.log('📄 Auditing pages and routing...');
    
    const pageFiles = this.findFiles('client/src/pages', '.tsx');
    pageFiles.forEach(file => {
      const content = fs.readFileSync(file, 'utf8');
      const pageName = path.basename(file, '.tsx');
      
      this.results.pages.set(pageName, {
        file: file.replace(process.cwd() + '/', ''),
        hasAuth: /useAuth|isAuthenticated/.test(content),
        hasAPI: /useQuery|useMutation/.test(content),
        hasRouting: /useLocation|navigate/.test(content),
        complexity: this.calculateComplexity(content)
      });
    });
  }

  // Find duplicate implementations
  auditDuplicates() {
    console.log('🔍 Finding duplicates...');
    
    // Look for similar function names
    const allFiles = [
      ...this.findFiles('client/src', '.tsx'),
      ...this.findFiles('client/src', '.ts'),
      ...this.findFiles('server', '.ts')
    ];

    const functionMap = new Map();
    
    allFiles.forEach(file => {
      const content = fs.readFileSync(file, 'utf8');
      
      // Extract function names
      const functions = content.match(/(?:function\s+|const\s+)([a-zA-Z_][a-zA-Z0-9_]*)/g) || [];
      functions.forEach(func => {
        const name = func.replace(/(?:function\s+|const\s+)/, '');
        if (!functionMap.has(name)) {
          functionMap.set(name, []);
        }
        functionMap.get(name).push(file);
      });
    });

    // Identify duplicates
    functionMap.forEach((files, funcName) => {
      if (files.length > 1) {
        this.results.duplicates.add({
          function: funcName,
          files: files.map(f => f.replace(process.cwd() + '/', ''))
        });
      }
    });
  }

  // Utility functions
  findFiles(dir, extension) {
    if (!fs.existsSync(dir)) return [];
    
    const files = [];
    const items = fs.readdirSync(dir);
    
    items.forEach(item => {
      const fullPath = path.join(dir, item);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory()) {
        files.push(...this.findFiles(fullPath, extension));
      } else if (fullPath.endsWith(extension)) {
        files.push(fullPath);
      }
    });
    
    return files;
  }

  getLineNumber(content, index) {
    return content.substring(0, index).split('\n').length;
  }

  calculateComplexity(content) {
    // Simple complexity metric based on hooks, conditionals, loops
    const hooks = (content.match(/use[A-Z]/g) || []).length;
    const conditionals = (content.match(/if\s*\(|switch\s*\(/g) || []).length;
    const loops = (content.match(/for\s*\(|while\s*\(|\.map\(/g) || []).length;
    
    return hooks + conditionals + loops;
  }

  // Generate comprehensive report
  generateReport() {
    console.log('📊 Generating feature audit report...');
    
    const report = {
      timestamp: new Date().toISOString(),
      summary: {
        apiEndpoints: this.results.apiEndpoints.size,
        uiComponents: this.results.uiComponents.size,
        pages: this.results.pages.size,
        duplicates: this.results.duplicates.size
      },
      details: {
        apiEndpoints: Array.from(this.results.apiEndpoints.entries()),
        uiComponents: Array.from(this.results.uiComponents.entries()),
        pages: Array.from(this.results.pages.entries()),
        duplicates: Array.from(this.results.duplicates)
      }
    };

    // Save detailed JSON report
    fs.writeFileSync('FEATURE_AUDIT_REPORT.json', JSON.stringify(report, null, 2));
    
    // Generate markdown summary
    this.generateMarkdownReport(report);
    
    console.log('✅ Audit complete! Reports saved:');
    console.log('  - FEATURE_AUDIT_REPORT.json (detailed data)');
    console.log('  - FEATURE_AUDIT_SUMMARY.md (human readable)');
  }

  generateMarkdownReport(report) {
    let markdown = `# FableCraft Feature Audit Report
*Generated: ${report.timestamp}*

## 📊 Summary
- **API Endpoints**: ${report.summary.apiEndpoints}
- **UI Components**: ${report.summary.uiComponents}  
- **Pages**: ${report.summary.pages}
- **Potential Duplicates**: ${report.summary.duplicates}

## 🔌 API Endpoints Found
`;

    report.details.apiEndpoints.forEach(([endpoint, data]) => {
      markdown += `- \`${endpoint}\` - ${data.file}:${data.lineNumber}\n`;
    });

    markdown += `\n## 🧩 UI Components Found\n`;
    report.details.uiComponents.forEach(([name, data]) => {
      const features = data.features.length > 0 ? ` (${data.features.join(', ')})` : '';
      markdown += `- **${name}**${features} - ${data.file}\n`;
    });

    markdown += `\n## 📄 Pages Found\n`;
    report.details.pages.forEach(([name, data]) => {
      const auth = data.hasAuth ? ' 🔐' : '';
      const api = data.hasAPI ? ' 🔌' : '';
      markdown += `- **${name}**${auth}${api} - ${data.file}\n`;
    });

    if (report.details.duplicates.length > 0) {
      markdown += `\n## ⚠️ Potential Duplicates\n`;
      report.details.duplicates.forEach(dup => {
        markdown += `- **${dup.function}** found in:\n`;
        dup.files.forEach(file => {
          markdown += `  - ${file}\n`;
        });
      });
    }

    fs.writeFileSync('FEATURE_AUDIT_SUMMARY.md', markdown);
  }

  // Run complete audit
  async run() {
    console.log('🚀 Starting FableCraft feature audit...\n');
    
    this.auditAPIEndpoints();
    this.auditUIComponents();
    this.auditPages();
    this.auditDuplicates();
    this.generateReport();
    
    console.log('\n✨ Audit complete! Review the reports to see exactly what you have.');
  }
}

// Run the audit
const auditor = new FeatureAuditor();
auditor.run().catch(console.error);