#!/usr/bin/env node

/**
 * Code Usage Detection Tool
 * Analyzes which components are actually imported/used vs orphaned
 */

import fs from 'fs';
import path from 'path';

class UsageDetector {
  constructor() {
    this.allComponents = new Map();
    this.allImports = new Map();
    this.activeComponents = new Set();
    this.deadComponents = new Set(); 
    this.entryPoints = [
      'client/src/App.tsx',
      'client/src/index.tsx',
      'client/src/main.tsx'
    ];
  }

  // Find all component definitions
  scanAllComponents() {
    console.log('📦 Scanning all components...');
    
    const componentFiles = this.findFiles('client/src', '.tsx');
    
    componentFiles.forEach(file => {
      const content = fs.readFileSync(file, 'utf8');
      const relativePath = file.replace(process.cwd() + '/', '');
      
      // Extract exported components
      const exportPatterns = [
        /export\s+default\s+(?:function\s+)?([A-Z][a-zA-Z0-9]+)/g,
        /export\s+(?:const|function)\s+([A-Z][a-zA-Z0-9]+)/g,
        /export\s*\{\s*([A-Z][a-zA-Z0-9]+)(?:\s+as\s+default)?\s*\}/g
      ];

      exportPatterns.forEach(pattern => {
        let match;
        while ((match = pattern.exec(content)) !== null) {
          const componentName = match[1];
          
          if (!this.allComponents.has(componentName)) {
            this.allComponents.set(componentName, []);
          }
          
          this.allComponents.get(componentName).push({
            file: relativePath,
            isDefault: match[0].includes('default'),
            lineCount: content.split('\n').length
          });
        }
      });
    });
    
    console.log(`Found ${this.allComponents.size} unique component names`);
  }

  // Find all import statements
  scanAllImports() {
    console.log('🔍 Scanning all imports...');
    
    const allFiles = [
      ...this.findFiles('client/src', '.tsx'),
      ...this.findFiles('client/src', '.ts')
    ];
    
    allFiles.forEach(file => {
      const content = fs.readFileSync(file, 'utf8');
      const relativePath = file.replace(process.cwd() + '/', '');
      
      // Extract import statements
      const importPatterns = [
        /import\s+([A-Z][a-zA-Z0-9]+)\s+from\s+['"]([^'"]+)['"]/g,
        /import\s*\{\s*([^}]+)\s*\}\s+from\s+['"]([^'"]+)['"]/g
      ];

      importPatterns.forEach(pattern => {
        let match;
        while ((match = pattern.exec(content)) !== null) {
          let componentNames = [];
          
          if (match[1] && match[1].match(/^[A-Z]/)) {
            // Default import
            componentNames = [match[1]];
          } else if (match[1] && match[1].includes(',')) {
            // Named imports
            componentNames = match[1]
              .split(',')
              .map(name => name.trim())
              .filter(name => name.match(/^[A-Z]/));
          }
          
          componentNames.forEach(componentName => {
            if (!this.allImports.has(componentName)) {
              this.allImports.set(componentName, []);
            }
            
            this.allImports.get(componentName).push({
              importedIn: relativePath,
              importPath: match[2],
              line: this.getLineNumber(content, match.index)
            });
          });
        }
      });
    });
    
    console.log(`Found ${this.allImports.size} imported components`);
  }

  // Trace usage from entry points
  traceUsageFromEntryPoints() {
    console.log('🕵️ Tracing actual usage...');
    
    const visited = new Set();
    const toVisit = [];
    
    // Start from entry points
    this.entryPoints.forEach(entryPoint => {
      if (fs.existsSync(entryPoint)) {
        console.log(`Starting trace from: ${entryPoint}`);
        this.traceFileUsage(entryPoint, visited, toVisit);
      }
    });
    
    // Process queue of files to visit
    while (toVisit.length > 0) {
      const file = toVisit.shift();
      if (!visited.has(file)) {
        this.traceFileUsage(file, visited, toVisit);
      }
    }
    
    console.log(`Traced ${visited.size} active files`);
  }

  // Trace usage in a specific file
  traceFileUsage(filePath, visited, toVisit) {
    if (visited.has(filePath) || !fs.existsSync(filePath)) {
      return;
    }
    
    visited.add(filePath);
    const content = fs.readFileSync(filePath, 'utf8');
    
    // Find all imports in this file
    const importPattern = /import\s+(?:([A-Z][a-zA-Z0-9]+)|\{\s*([^}]+)\s*\})\s+from\s+['"]([^'"]+)['"]/g;
    
    let match;
    while ((match = importPattern.exec(content)) !== null) {
      const defaultImport = match[1];
      const namedImports = match[2];
      const importPath = match[3];
      
      // Mark components as active
      if (defaultImport) {
        this.activeComponents.add(defaultImport);
      }
      
      if (namedImports) {
        namedImports.split(',').forEach(name => {
          const trimmed = name.trim();
          if (trimmed.match(/^[A-Z]/)) {
            this.activeComponents.add(trimmed);
          }
        });
      }
      
      // Resolve relative imports and add to queue
      if (importPath.startsWith('./') || importPath.startsWith('../')) {
        const resolvedPath = this.resolveImportPath(filePath, importPath);
        if (resolvedPath) {
          toVisit.push(resolvedPath);
        }
      }
    }
  }

  // Resolve relative import paths
  resolveImportPath(fromFile, importPath) {
    const fromDir = path.dirname(fromFile);
    let resolvedPath = path.resolve(fromDir, importPath);
    
    // Try different extensions
    const extensions = ['.tsx', '.ts', '.jsx', '.js'];
    
    for (const ext of extensions) {
      const withExt = resolvedPath + ext;
      if (fs.existsSync(withExt)) {
        return withExt;
      }
    }
    
    // Try index files
    for (const ext of extensions) {
      const indexPath = path.join(resolvedPath, 'index' + ext);
      if (fs.existsSync(indexPath)) {
        return indexPath;
      }
    }
    
    return null;
  }

  // Identify dead components
  identifyDeadComponents() {
    console.log('💀 Identifying dead components...');
    
    this.allComponents.forEach((locations, componentName) => {
      if (!this.activeComponents.has(componentName)) {
        this.deadComponents.add(componentName);
      }
    });
    
    console.log(`Found ${this.deadComponents.size} potentially dead components`);
  }

  // Generate usage report
  generateUsageReport() {
    console.log('📊 Generating usage report...');
    
    const activeList = Array.from(this.activeComponents).sort();
    const deadList = Array.from(this.deadComponents).sort();
    
    const report = `# Code Usage Analysis Report
*Generated: ${new Date().toISOString()}*

## 📊 Usage Summary
- **Total Components Found**: ${this.allComponents.size}
- **Active Components**: ${activeList.length}
- **Dead/Unused Components**: ${deadList.length}
- **Usage Rate**: ${(activeList.length / this.allComponents.size * 100).toFixed(1)}%

## ✅ ACTIVE COMPONENTS (Actually Used)
${activeList.map(name => {
  const locations = this.allComponents.get(name) || [];
  const imports = this.allImports.get(name) || [];
  return `
### ${name}
- **Defined in**: ${locations.map(loc => loc.file).join(', ')}
- **Imported by**: ${imports.length} files
- **Import locations**: ${imports.slice(0, 3).map(imp => imp.importedIn).join(', ')}${imports.length > 3 ? '...' : ''}
`;
}).join('')}

## 💀 DEAD/UNUSED COMPONENTS (Safe to Ignore)
${deadList.map(name => {
  const locations = this.allComponents.get(name) || [];
  return `
### ${name}
- **Defined in**: ${locations.map(loc => loc.file).join(', ')}
- **Line count**: ${locations.map(loc => loc.lineCount).join(', ')}
- **Status**: Not imported anywhere (potentially dead code)
`;
}).join('')}

## 🔍 DUPLICATE ANALYSIS
${Array.from(this.allComponents.entries())
  .filter(([name, locations]) => locations.length > 1)
  .map(([name, locations]) => `
### ${name} (${locations.length} versions)
${locations.map(loc => `- ${loc.file} (${loc.lineCount} lines)`).join('\n')}
**Status**: ${this.activeComponents.has(name) ? '✅ ACTIVE' : '💀 DEAD'}
`).join('')}

## 📋 EXTRACTION RECOMMENDATIONS

### High Priority (Definitely Extract)
${activeList.filter(name => {
  const locations = this.allComponents.get(name) || [];
  return locations.length === 1; // Single implementation, actively used
}).slice(0, 10).map(name => `- ${name}`).join('\n')}

### Medium Priority (Choose Best Version)
${Array.from(this.allComponents.entries())
  .filter(([name, locations]) => locations.length > 1 && activeList.includes(name))
  .map(([name, locations]) => `- ${name} (${locations.length} versions - pick the best one)`)
  .join('\n')}

### Skip Entirely (Dead Code)
${deadList.slice(0, 10).map(name => `- ${name}`).join('\n')}

---
**Recommendation**: Focus extraction on the ${activeList.length} active components. Ignore the ${deadList.length} dead components entirely.
`;

    fs.writeFileSync('CODE_USAGE_ANALYSIS.md', report);
    console.log('✅ Usage analysis complete!');
  }

  // Utility functions
  findFiles(dir, extension) {
    if (!fs.existsSync(dir)) return [];
    
    const files = [];
    const items = fs.readdirSync(dir);
    
    items.forEach(item => {
      const fullPath = path.join(dir, item);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory() && !item.startsWith('.') && item !== 'node_modules') {
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

  // Run complete analysis
  async run() {
    console.log('🚀 Starting code usage analysis...\n');
    
    this.scanAllComponents();
    this.scanAllImports();
    this.traceUsageFromEntryPoints();
    this.identifyDeadComponents();
    this.generateUsageReport();
    
    console.log(`\n✨ Analysis complete! Found ${this.activeComponents.size} active vs ${this.deadComponents.size} dead components.`);
  }
}

// Run the analysis
const detector = new UsageDetector();
detector.run().catch(console.error);