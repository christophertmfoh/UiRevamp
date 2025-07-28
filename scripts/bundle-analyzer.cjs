#!/usr/bin/env node

/**
 * Bundle Size Analyzer
 * Analyzes frontend bundle size and provides optimization recommendations
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

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

class BundleAnalyzer {
  constructor() {
    this.analysis = {
      files: [],
      dependencies: {},
      recommendations: [],
      metrics: {}
    };
    this.startTime = Date.now();
  }

  // Analyze file sizes and complexity
  analyzeFiles() {
    const clientSrc = 'client/src';
    if (!fs.existsSync(clientSrc)) {
      console.error(`${colors.red}❌ Client source directory not found: ${clientSrc}${colors.reset}`);
      return;
    }

    console.log(`${colors.cyan}📊 Analyzing frontend files...${colors.reset}`);
    
    const files = this.getFilesRecursively(clientSrc);
    
    files.forEach(filePath => {
      try {
        const stats = fs.statSync(filePath);
        const content = fs.readFileSync(filePath, 'utf8');
        const relativePath = path.relative(clientSrc, filePath);
        
        const fileAnalysis = {
          path: relativePath,
          size: stats.size,
          lines: content.split('\n').length,
          imports: this.analyzeImports(content),
          exports: this.analyzeExports(content),
          complexity: this.calculateComplexity(content),
          type: this.getFileType(filePath)
        };
        
        this.analysis.files.push(fileAnalysis);
      } catch (error) {
        console.warn(`${colors.yellow}⚠️ Could not analyze ${filePath}: ${error.message}${colors.reset}`);
      }
    });

    console.log(`${colors.green}✅ Analyzed ${this.analysis.files.length} files${colors.reset}`);
  }

  getFilesRecursively(dir) {
    const files = [];
    const items = fs.readdirSync(dir);
    
    items.forEach(item => {
      const itemPath = path.join(dir, item);
      const stat = fs.statSync(itemPath);
      
      if (stat.isDirectory()) {
        files.push(...this.getFilesRecursively(itemPath));
      } else if (this.isAnalyzableFile(itemPath)) {
        files.push(itemPath);
      }
    });
    
    return files;
  }

  isAnalyzableFile(filePath) {
    const extensions = ['.ts', '.tsx', '.js', '.jsx'];
    return extensions.some(ext => filePath.endsWith(ext));
  }

  getFileType(filePath) {
    if (filePath.includes('/components/')) return 'component';
    if (filePath.includes('/pages/')) return 'page';
    if (filePath.includes('/hooks/')) return 'hook';
    if (filePath.includes('/utils/')) return 'utility';
    if (filePath.includes('/services/')) return 'service';
    if (filePath.includes('/types/')) return 'types';
    if (filePath.includes('/contexts/')) return 'context';
    return 'other';
  }

  analyzeImports(content) {
    const importRegex = /import\s+(?:(?:\{[^}]*\}|\*\s+as\s+\w+|\w+)(?:\s*,\s*(?:\{[^}]*\}|\*\s+as\s+\w+|\w+))*\s+from\s+)?['"`]([^'"`]+)['"`]/g;
    const imports = [];
    let match;
    
    while ((match = importRegex.exec(content)) !== null) {
      const importPath = match[1];
      imports.push({
        path: importPath,
        isExternal: !importPath.startsWith('.') && !importPath.startsWith('@/'),
        isLazy: content.includes(`React.lazy(() => import('${importPath}'))`),
        isDynamic: content.includes(`import('${importPath}')`)
      });
    }
    
    return imports;
  }

  analyzeExports(content) {
    const exports = {
      default: /export\s+default/.test(content),
      named: (content.match(/export\s+(?:const|function|class|interface|type)/g) || []).length,
      reexports: (content.match(/export\s+\{[^}]*\}\s+from/g) || []).length
    };
    
    return exports;
  }

  calculateComplexity(content) {
    // Simple complexity metrics
    const cyclomaticFactors = [
      'if', 'else', 'for', 'while', 'switch', 'case', 
      'catch', 'throw', '&&', '||', '?'
    ];
    
    let complexity = 1; // Base complexity
    
    cyclomaticFactors.forEach(factor => {
      // Escape special regex characters and handle edge cases
      const escapedFactor = factor.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const regex = factor.match(/^[a-zA-Z]+$/) 
        ? new RegExp(`\\b${escapedFactor}\\b`, 'g')
        : new RegExp(escapedFactor, 'g');
      const matches = content.match(regex);
      if (matches) {
        complexity += matches.length;
      }
    });
    
    return complexity;
  }

  analyzeDependencies() {
    console.log(`${colors.cyan}📦 Analyzing dependencies...${colors.reset}`);
    
    try {
      // Analyze package.json
      const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
      const clientPackageJson = fs.existsSync('client/package.json') 
        ? JSON.parse(fs.readFileSync('client/package.json', 'utf8'))
        : { dependencies: {}, devDependencies: {} };
      
      const allDeps = {
        ...packageJson.dependencies,
        ...packageJson.devDependencies,
        ...clientPackageJson.dependencies,
        ...clientPackageJson.devDependencies
      };
      
      // Categorize dependencies
      const categories = {
        ui: ['react', 'react-dom', '@radix-ui', 'lucide-react', 'class-variance-authority'],
        styling: ['tailwindcss', 'postcss', 'autoprefixer', 'clsx'],
        routing: ['react-router', 'react-router-dom'],
        state: ['zustand', '@tanstack/react-query'],
        forms: ['react-hook-form', 'zod'],
        build: ['vite', 'typescript', 'esbuild'],
        testing: ['vitest', '@testing-library'],
        ai: ['@google/generative-ai', 'openai'],
        database: ['drizzle-orm', '@neondatabase/serverless'],
        server: ['express', 'cors', 'bcryptjs', 'jsonwebtoken']
      };
      
      Object.entries(allDeps).forEach(([name, version]) => {
        const category = this.categorizeDependency(name, categories);
        if (!this.analysis.dependencies[category]) {
          this.analysis.dependencies[category] = [];
        }
        this.analysis.dependencies[category].push({ name, version });
      });
      
      console.log(`${colors.green}✅ Analyzed ${Object.keys(allDeps).length} dependencies${colors.reset}`);
    } catch (error) {
      console.error(`${colors.red}❌ Could not analyze dependencies: ${error.message}${colors.reset}`);
    }
  }

  categorizeDependency(name, categories) {
    for (const [category, keywords] of Object.entries(categories)) {
      if (keywords.some(keyword => name.includes(keyword))) {
        return category;
      }
    }
    return 'other';
  }

  calculateMetrics() {
    console.log(`${colors.cyan}📈 Calculating performance metrics...${colors.reset}`);
    
    const files = this.analysis.files;
    
    // File size metrics
    const totalSize = files.reduce((sum, file) => sum + file.size, 0);
    const avgSize = totalSize / files.length;
    
    // Complexity metrics
    const totalComplexity = files.reduce((sum, file) => sum + file.complexity, 0);
    const avgComplexity = totalComplexity / files.length;
    
    // Large files (potential optimization targets)
    const largeFiles = files.filter(file => file.size > 10000).sort((a, b) => b.size - a.size);
    
    // Complex files (potential refactoring targets)
    const complexFiles = files.filter(file => file.complexity > 20).sort((a, b) => b.complexity - a.complexity);
    
    // Heavy importers (potential bundle size impact)
    const heavyImporters = files
      .filter(file => file.imports.length > 15)
      .sort((a, b) => b.imports.length - a.imports.length);
    
    // File type distribution
    const typeDistribution = files.reduce((dist, file) => {
      dist[file.type] = (dist[file.type] || 0) + 1;
      return dist;
    }, {});
    
    this.analysis.metrics = {
      totalFiles: files.length,
      totalSize,
      avgSize: Math.round(avgSize),
      totalComplexity,
      avgComplexity: Math.round(avgComplexity * 10) / 10,
      largeFiles: largeFiles.slice(0, 10),
      complexFiles: complexFiles.slice(0, 10),
      heavyImporters: heavyImporters.slice(0, 10),
      typeDistribution
    };
  }

  generateRecommendations() {
    console.log(`${colors.cyan}💡 Generating optimization recommendations...${colors.reset}`);
    
    const { metrics } = this.analysis;
    
    // Bundle size recommendations
    if (metrics.totalSize > 1000000) { // > 1MB
      this.analysis.recommendations.push({
        type: 'bundle-size',
        priority: 'high',
        title: 'Large bundle size detected',
        description: `Total source size is ${Math.round(metrics.totalSize / 1024)}KB. Consider code splitting and lazy loading.`,
        actions: [
          'Implement React.lazy() for route components',
          'Use dynamic imports for heavy libraries',
          'Consider bundle splitting by feature'
        ]
      });
    }
    
    // Large files recommendations
    if (metrics.largeFiles.length > 0) {
      this.analysis.recommendations.push({
        type: 'large-files',
        priority: 'medium',
        title: `${metrics.largeFiles.length} large files found`,
        description: 'Large files can impact bundle size and maintainability.',
        actions: [
          'Break down large components into smaller ones',
          'Extract utility functions to separate files',
          'Consider moving constants to separate files'
        ],
        files: metrics.largeFiles.slice(0, 5).map(f => f.path)
      });
    }
    
    // Complex files recommendations
    if (metrics.complexFiles.length > 0) {
      this.analysis.recommendations.push({
        type: 'complexity',
        priority: 'medium',
        title: `${metrics.complexFiles.length} complex files found`,
        description: 'High complexity can impact maintainability and performance.',
        actions: [
          'Refactor complex functions into smaller ones',
          'Extract custom hooks for complex logic',
          'Consider using state machines for complex state'
        ],
        files: metrics.complexFiles.slice(0, 5).map(f => f.path)
      });
    }
    
    // Heavy importers recommendations
    if (metrics.heavyImporters.length > 0) {
      this.analysis.recommendations.push({
        type: 'imports',
        priority: 'low',
        title: `${metrics.heavyImporters.length} files with many imports`,
        description: 'Files with many imports can indicate tight coupling.',
        actions: [
          'Review import necessity',
          'Consider dependency injection',
          'Evaluate component composition'
        ],
        files: metrics.heavyImporters.slice(0, 5).map(f => f.path)
      });
    }
    
    // External dependencies recommendations
    const externalImports = this.analysis.files
      .flatMap(file => file.imports)
      .filter(imp => imp.isExternal);
    
    const uniqueExternals = [...new Set(externalImports.map(imp => imp.path))];
    
    if (uniqueExternals.length > 50) {
      this.analysis.recommendations.push({
        type: 'dependencies',
        priority: 'medium',
        title: `${uniqueExternals.length} external dependencies detected`,
        description: 'Many external dependencies can increase bundle size.',
        actions: [
          'Audit unused dependencies',
          'Consider lighter alternatives',
          'Implement tree shaking optimization'
        ]
      });
    }
  }

  generateReport() {
    const endTime = Date.now();
    const analysisTime = ((endTime - this.startTime) / 1000).toFixed(2);
    
    console.log(`\n${colors.bold}${colors.cyan}📊 BUNDLE SIZE ANALYSIS REPORT${colors.reset}`);
    console.log(`${colors.blue}Analysis completed in ${analysisTime}s${colors.reset}\n`);
    
    // Overview
    console.log(`${colors.bold}📋 Overview:${colors.reset}`);
    console.log(`  Total files analyzed: ${colors.green}${this.analysis.metrics.totalFiles}${colors.reset}`);
    console.log(`  Total source size: ${colors.yellow}${Math.round(this.analysis.metrics.totalSize / 1024)}KB${colors.reset}`);
    console.log(`  Average file size: ${colors.blue}${Math.round(this.analysis.metrics.avgSize / 1024)}KB${colors.reset}`);
    console.log(`  Average complexity: ${colors.blue}${this.analysis.metrics.avgComplexity}${colors.reset}\n`);
    
    // File type distribution
    console.log(`${colors.bold}📊 File Type Distribution:${colors.reset}`);
    Object.entries(this.analysis.metrics.typeDistribution).forEach(([type, count]) => {
      console.log(`  ${type}: ${colors.green}${count}${colors.reset} files`);
    });
    console.log('');
    
    // Dependencies
    console.log(`${colors.bold}📦 Dependencies by Category:${colors.reset}`);
    Object.entries(this.analysis.dependencies).forEach(([category, deps]) => {
      console.log(`  ${category}: ${colors.green}${deps.length}${colors.reset} packages`);
    });
    console.log('');
    
    // Top issues
    if (this.analysis.metrics.largeFiles.length > 0) {
      console.log(`${colors.bold}📄 Largest Files:${colors.reset}`);
      this.analysis.metrics.largeFiles.slice(0, 5).forEach(file => {
        console.log(`  ${colors.yellow}${file.path}${colors.reset}: ${Math.round(file.size / 1024)}KB`);
      });
      console.log('');
    }
    
    if (this.analysis.metrics.complexFiles.length > 0) {
      console.log(`${colors.bold}🔄 Most Complex Files:${colors.reset}`);
      this.analysis.metrics.complexFiles.slice(0, 5).forEach(file => {
        console.log(`  ${colors.yellow}${file.path}${colors.reset}: complexity ${file.complexity}`);
      });
      console.log('');
    }
    
    // Recommendations
    if (this.analysis.recommendations.length > 0) {
      console.log(`${colors.bold}💡 Optimization Recommendations:${colors.reset}`);
      this.analysis.recommendations.forEach((rec, index) => {
        const priorityColor = rec.priority === 'high' ? colors.red : 
                             rec.priority === 'medium' ? colors.yellow : colors.blue;
        
        console.log(`\n  ${index + 1}. ${colors.bold}${rec.title}${colors.reset} ${priorityColor}[${rec.priority.toUpperCase()}]${colors.reset}`);
        console.log(`     ${rec.description}`);
        
        if (rec.actions) {
          console.log(`     ${colors.cyan}Actions:${colors.reset}`);
          rec.actions.forEach(action => {
            console.log(`     • ${action}`);
          });
        }
        
        if (rec.files) {
          console.log(`     ${colors.cyan}Affected files:${colors.reset}`);
          rec.files.forEach(file => {
            console.log(`     • ${file}`);
          });
        }
      });
    } else {
      console.log(`${colors.green}✅ No major optimization issues detected!${colors.reset}`);
    }
    
    console.log(`\n${colors.cyan}💾 Full analysis saved to: bundle-analysis.json${colors.reset}`);
  }

  saveResults() {
    const report = {
      timestamp: new Date().toISOString(),
      analysisTime: Date.now() - this.startTime,
      metrics: this.analysis.metrics,
      dependencies: this.analysis.dependencies,
      recommendations: this.analysis.recommendations,
      files: this.analysis.files.map(file => ({
        ...file,
        imports: file.imports.length // Reduce file size
      }))
    };
    
    fs.writeFileSync('bundle-analysis.json', JSON.stringify(report, null, 2));
  }

  run() {
    console.log(`${colors.bold}${colors.cyan}🚀 Starting Bundle Size Analysis...${colors.reset}\n`);
    
    this.analyzeFiles();
    this.analyzeDependencies();
    this.calculateMetrics();
    this.generateRecommendations();
    this.generateReport();
    this.saveResults();
    
    const hasHighPriorityIssues = this.analysis.recommendations.some(r => r.priority === 'high');
    process.exit(hasHighPriorityIssues ? 1 : 0);
  }
}

// CLI interface
if (require.main === module) {
  const analyzer = new BundleAnalyzer();
  analyzer.run();
}

module.exports = BundleAnalyzer;