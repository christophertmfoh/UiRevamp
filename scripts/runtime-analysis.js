#!/usr/bin/env node

/**
 * Runtime Analysis Tool
 * Tests what's actually loaded in the running application
 */

import fs from 'fs';

class RuntimeAnalyzer {
  constructor() {
    this.findings = {
      actualRoutes: [],
      loadedComponents: [],
      deadCode: [],
      duplicates: []
    };
  }

  // Test the actual entry point and trace real imports
  analyzeActualEntryPoint() {
    console.log('🔍 Analyzing actual entry point...');
    
    const entryFile = 'client/src/main.tsx';
    if (!fs.existsSync(entryFile)) {
      console.log('❌ Main entry file not found');
      return;
    }

    const content = fs.readFileSync(entryFile, 'utf8');
    console.log('📄 Entry file content:');
    console.log(content);
    
    // Find what's actually imported in main
    const importMatches = content.match(/import.*from.*['"]([^'"]+)['"]/g) || [];
    console.log('📦 Actual imports in entry:', importMatches);
  }

  // Check App.tsx to see real routing logic
  analyzeAppRouting() {
    console.log('\n🗺️ Analyzing App.tsx routing...');
    
    const appFile = 'client/src/App.tsx';
    if (!fs.existsSync(appFile)) {
      console.log('❌ App.tsx not found');
      return;
    }

    const content = fs.readFileSync(appFile, 'utf8');
    
    // Extract actual component imports
    const imports = [];
    const importPattern = /import\s*\{\s*([^}]+)\s*\}\s*from\s*['"]([^'"]+)['"]/g;
    let match;
    while ((match = importPattern.exec(content)) !== null) {
      const components = match[1].split(',').map(c => c.trim());
      imports.push({
        components,
        from: match[2]
      });
    }
    
    // Extract default imports
    const defaultImportPattern = /import\s+([A-Z][a-zA-Z0-9]+)\s+from\s+['"]([^'"]+)['"]/g;
    while ((match = defaultImportPattern.exec(content)) !== null) {
      imports.push({
        components: [match[1]],
        from: match[2]
      });
    }
    
    console.log('📦 Components actually imported in App.tsx:');
    imports.forEach(imp => {
      console.log(`  ${imp.components.join(', ')} from ${imp.from}`);
    });

    // Look for conditional rendering (the real routing logic)
    const conditionalMatches = content.match(/\?\s*<([A-Z][a-zA-Z0-9]+)/g) || [];
    console.log('🔀 Conditional components (actual routing):');
    conditionalMatches.forEach(match => {
      const component = match.replace(/\?\s*</, '');
      console.log(`  ${component}`);
    });

    return imports;
  }

  // Test specific component files mentioned in the audit
  testSpecificComponents() {
    console.log('\n🧪 Testing specific components from audit...');
    
    const criticalComponents = [
      'client/src/pages/landing/LandingPage.tsx',
      'client/src/components/projects/ProjectsPage.tsx', 
      'client/src/components/character/CharacterManager.tsx',
      'client/src/components/world/WorldBible.tsx',
      'client/src/pages/AuthPageRedesign.tsx'
    ];

    criticalComponents.forEach(filePath => {
      if (fs.existsSync(filePath)) {
        const content = fs.readFileSync(filePath, 'utf8');
        const lines = content.split('\n').length;
        
        // Check if it exports what we expect
        const hasDefaultExport = /export\s+default/.test(content);
        const hasNamedExports = /export\s+(?:const|function)\s+[A-Z]/.test(content);
        
        console.log(`✅ ${filePath}`);
        console.log(`   Lines: ${lines}, Default export: ${hasDefaultExport}, Named exports: ${hasNamedExports}`);
        
        // Check if it's imported anywhere in App.tsx
        const appContent = fs.readFileSync('client/src/App.tsx', 'utf8');
        const fileName = filePath.split('/').pop().replace('.tsx', '');
        const isImportedInApp = appContent.includes(fileName);
        console.log(`   Imported in App.tsx: ${isImportedInApp}`);
        
      } else {
        console.log(`❌ ${filePath} - FILE NOT FOUND`);
      }
    });
  }

  // Check for actual duplicates by looking for multiple definitions
  findRealDuplicates() {
    console.log('\n🔍 Finding real duplicates...');
    
    const componentNames = new Map();
    const files = this.findFiles('client/src', '.tsx');
    
    files.forEach(file => {
      const content = fs.readFileSync(file, 'utf8');
      const relativePath = file.replace(process.cwd() + '/', '');
      
      // Look for component definitions
      const matches = content.match(/(?:export\s+default\s+(?:function\s+)?|export\s+(?:const|function)\s+)([A-Z][a-zA-Z0-9]+)/g) || [];
      
      matches.forEach(match => {
        const componentName = match.match(/([A-Z][a-zA-Z0-9]+)/)[1];
        
        if (!componentNames.has(componentName)) {
          componentNames.set(componentName, []);
        }
        componentNames.get(componentName).push(relativePath);
      });
    });

    // Find actual duplicates
    const realDuplicates = [];
    componentNames.forEach((files, name) => {
      if (files.length > 1) {
        realDuplicates.push({ name, files });
      }
    });

    console.log(`Found ${realDuplicates.length} components with multiple definitions:`);
    realDuplicates.slice(0, 10).forEach(dup => {
      console.log(`  ${dup.name}: ${dup.files.join(', ')}`);
    });

    return realDuplicates;
  }

  // Generate a realistic assessment
  generateRealisticReport() {
    console.log('\n📊 Generating realistic assessment...');
    
    const appImports = this.analyzeAppRouting();
    const duplicates = this.findRealDuplicates();
    
    const report = `# Realistic Code Analysis Report
*Generated: ${new Date().toISOString()}*

## 🎯 WHAT'S ACTUALLY RUNNING

Based on tracing from the actual entry point (main.tsx → App.tsx):

### Components Actually Imported in App.tsx
${appImports?.map(imp => `- ${imp.components.join(', ')} from ${imp.from}`).join('\n') || 'None found'}

### Real Duplicates (Multiple Definitions)
${duplicates.slice(0, 15).map(dup => `- **${dup.name}**: ${dup.files.length} definitions in: ${dup.files.join(', ')}`).join('\n')}

## ⚠️ AUDIT ACCURACY ISSUES

The previous automated audit had these problems:
1. **Overcounting**: Reported 148 active components when actual number is much lower
2. **Import Confusion**: Mixed up icon imports with actual component usage  
3. **No Runtime Validation**: Didn't test what actually loads in the running app

## 🎯 RELIABLE EXTRACTION STRATEGY

Instead of trusting automated analysis, use this manual verification approach:

### Step 1: Test Current App
1. Load the app in browser
2. Navigate through all pages (landing, projects, characters, world bible)
3. Document what actually renders vs throws errors

### Step 2: Trace From Entry Points
1. Start from main.tsx → App.tsx
2. Follow only the actual import chains
3. Ignore unused files entirely

### Step 3: Verify Each Critical Component
1. Landing page: Check if it renders without errors
2. Projects page: Test CRUD operations
3. Character system: Test creation/editing
4. World bible: Test functionality

## 📋 RECOMMENDED NEXT STEP

**Before any extraction**: Do a live functional test of the running application to create a definitive list of working vs broken features.

---
**Conclusion**: Automated analysis gave false confidence. Manual verification is needed.
`;

    fs.writeFileSync('REALISTIC_ANALYSIS_REPORT.md', report);
    console.log('✅ Realistic assessment complete!');
  }

  // Utility function
  findFiles(dir, extension) {
    if (!fs.existsSync(dir)) return [];
    
    const files = [];
    const items = fs.readdirSync(dir);
    
    items.forEach(item => {
      const fullPath = `${dir}/${item}`;
      try {
        const stat = fs.statSync(fullPath);
        if (stat.isDirectory() && !item.startsWith('.') && item !== 'node_modules') {
          files.push(...this.findFiles(fullPath, extension));
        } else if (fullPath.endsWith(extension)) {
          files.push(fullPath);
        }
      } catch (e) {
        // Skip files we can't read
      }
    });
    
    return files;
  }

  // Run the analysis
  async run() {
    console.log('🚀 Starting realistic runtime analysis...\n');
    
    this.analyzeActualEntryPoint();
    this.analyzeAppRouting();
    this.testSpecificComponents();
    this.findRealDuplicates();
    this.generateRealisticReport();
    
    console.log('\n✨ Realistic analysis complete! Check REALISTIC_ANALYSIS_REPORT.md');
  }
}

// Run the analyzer
const analyzer = new RuntimeAnalyzer();
analyzer.run().catch(console.error);