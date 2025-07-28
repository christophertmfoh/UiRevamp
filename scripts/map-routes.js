#!/usr/bin/env node

/**
 * FableCraft Route Mapping Tool
 * Maps exact routes to components, assets, and API calls
 */

import fs from 'fs';
import path from 'path';

class RouteMapper {
  constructor() {
    this.routeMap = new Map();
    this.componentMap = new Map();
    this.assetMap = new Map();
    this.apiCallMap = new Map();
  }

  // Find the main App routing configuration
  mapAppRoutes() {
    console.log('🗺️  Mapping application routes...');
    
    const appFile = 'client/src/App.tsx';
    if (!fs.existsSync(appFile)) {
      console.log('❌ App.tsx not found');
      return;
    }

    const content = fs.readFileSync(appFile, 'utf8');
    
    // Extract Route components and their paths
    const routePatterns = [
      /<Route[^>]*path=['"]([^'"]+)['"][^>]*component=\{([^}]+)\}/g,
      /<Route[^>]*path=['"]([^'"]+)['"][^>]*element=\{<([^>]+)/g,
      /path:\s*['"]([^'"]+)['"][^,]*component:\s*([^,\s}]+)/g
    ];

    routePatterns.forEach(pattern => {
      let match;
      while ((match = pattern.exec(content)) !== null) {
        const routePath = match[1];
        const componentName = match[2];
        
        this.routeMap.set(routePath, {
          component: componentName,
          file: appFile,
          line: this.getLineNumber(content, match.index)
        });
      }
    });

    // Also check for conditional routing based on auth state
    this.analyzeConditionalRoutes(content);
  }

  // Analyze conditional routes (logged in vs logged out)
  analyzeConditionalRoutes(content) {
    console.log('🔐 Analyzing conditional routes...');
    
    // Look for authentication-based routing
    const authPatterns = [
      /isAuthenticated\s*\?\s*<([^>]+)/g,
      /user\s*\?\s*<([^>]+)/g,
      /!isAuthenticated\s*\?\s*<([^>]+)/g,
      /!user\s*\?\s*<([^>]+)/g
    ];

    authPatterns.forEach(pattern => {
      let match;
      while ((match = pattern.exec(content)) !== null) {
        const componentName = match[1];
        const isLoggedIn = !match[0].includes('!');
        
        this.routeMap.set(isLoggedIn ? '/ (authenticated)' : '/ (unauthenticated)', {
          component: componentName,
          file: 'client/src/App.tsx',
          condition: isLoggedIn ? 'User logged in' : 'User not logged in'
        });
      }
    });
  }

  // Map each component to its actual file location
  mapComponentFiles() {
    console.log('🧩 Mapping components to files...');
    
    const componentFiles = this.findFiles('client/src', '.tsx');
    
    componentFiles.forEach(file => {
      const content = fs.readFileSync(file, 'utf8');
      const fileName = path.basename(file, '.tsx');
      
      // Extract export declarations
      const exportPatterns = [
        /export\s+default\s+(?:function\s+)?([A-Z][a-zA-Z0-9]+)/g,
        /export\s+(?:const|function)\s+([A-Z][a-zA-Z0-9]+)/g,
        /export\s*\{\s*([A-Z][a-zA-Z0-9]+)[^}]*\}/g
      ];

      exportPatterns.forEach(pattern => {
        let match;
        while ((match = pattern.exec(content)) !== null) {
          const componentName = match[1];
          
          this.componentMap.set(componentName, {
            file: file.replace(process.cwd() + '/', ''),
            exports: this.getComponentExports(content),
            imports: this.getComponentImports(content),
            apiCalls: this.getAPICalls(content),
            assets: this.getAssetImports(content)
          });
        }
      });
    });
  }

  // Extract all asset imports from a component
  getAssetImports(content) {
    const assets = [];
    
    // Look for asset imports
    const assetPatterns = [
      /import\s+([^'"]+)\s+from\s+['"]@assets\/([^'"]+)['"]/g,
      /import\s+([^'"]+)\s+from\s+['"].*\.(png|jpg|jpeg|gif|svg|ico)['"]/g,
      /src=\{([^}]+)\}/g,
      /backgroundImage:\s*`url\(([^)]+)\)/g
    ];

    assetPatterns.forEach(pattern => {
      let match;
      while ((match = pattern.exec(content)) !== null) {
        if (match[2]) {
          assets.push(`@assets/${match[2]}`);
        } else if (match[1] && (match[1].includes('.png') || match[1].includes('.jpg') || match[1].includes('.svg'))) {
          assets.push(match[1]);
        }
      }
    });

    return assets;
  }

  // Extract API calls from component
  getAPICalls(content) {
    const apiCalls = [];
    
    const apiPatterns = [
      /queryKey:\s*\[['"]([^'"]+)['"]/g,
      /apiRequest\(['"]([^'"]+)['"]/g,
      /fetch\(['"]([^'"]+)['"]/g,
      /axios\.\w+\(['"]([^'"]+)['"]/g
    ];

    apiPatterns.forEach(pattern => {
      let match;
      while ((match = pattern.exec(content)) !== null) {
        apiCalls.push(match[1]);
      }
    });

    return [...new Set(apiCalls)];
  }

  // Get component imports
  getComponentImports(content) {
    const imports = [];
    const importPattern = /import\s+(?:\{[^}]+\}|\w+)\s+from\s+['"]([^'"]+)['"]/g;
    
    let match;
    while ((match = importPattern.exec(content)) !== null) {
      imports.push(match[1]);
    }
    
    return imports;
  }

  // Get component exports
  getComponentExports(content) {
    const exports = [];
    const exportPattern = /export\s+(?:default\s+)?(?:const|function|class)\s+([A-Z][a-zA-Z0-9]+)/g;
    
    let match;
    while ((match = exportPattern.exec(content)) !== null) {
      exports.push(match[1]);
    }
    
    return exports;
  }

  // Map actual assets in the filesystem
  mapAssets() {
    console.log('🖼️  Mapping assets...');
    
    const assetDirs = ['attached_assets', 'client/src/assets', 'public'];
    
    assetDirs.forEach(dir => {
      if (fs.existsSync(dir)) {
        const assetFiles = this.findFiles(dir, '');
        assetFiles.forEach(file => {
          const relativePath = file.replace(process.cwd() + '/', '');
          const fileName = path.basename(file);
          
          this.assetMap.set(fileName, {
            path: relativePath,
            size: fs.statSync(file).size,
            type: path.extname(file)
          });
        });
      }
    });
  }

  // Generate comprehensive route report
  generateRouteReport() {
    console.log('📊 Generating route mapping report...');
    
    const report = {
      timestamp: new Date().toISOString(),
      routes: Array.from(this.routeMap.entries()),
      components: Array.from(this.componentMap.entries()),
      assets: Array.from(this.assetMap.entries()),
      summary: {
        totalRoutes: this.routeMap.size,
        totalComponents: this.componentMap.size,
        totalAssets: this.assetMap.size
      }
    };

    // Save detailed JSON
    fs.writeFileSync('ROUTE_MAPPING_REPORT.json', JSON.stringify(report, null, 2));
    
    // Generate readable markdown
    this.generateMarkdownRouteReport(report);
    
    console.log('✅ Route mapping complete!');
    console.log('  - ROUTE_MAPPING_REPORT.json (detailed data)');
    console.log('  - ROUTE_MAPPING_GUIDE.md (user-friendly)');
  }

  generateMarkdownRouteReport(report) {
    let markdown = `# FableCraft Route Mapping Guide
*Generated: ${report.timestamp}*

## 🎯 YOUR EXACT PAGES AND LOCATIONS

`;

    // Group routes by functionality
    const routesByType = {
      'Landing/Authentication': [],
      'Main Application': [],
      'Project Management': [],
      'Character System': [],
      'Advanced Features': []
    };

    report.routes.forEach(([route, data]) => {
      const component = data.component;
      
      if (route.includes('unauthenticated') || component.includes('Landing') || component.includes('Auth')) {
        routesByType['Landing/Authentication'].push([route, data]);
      } else if (component.includes('Project')) {
        routesByType['Project Management'].push([route, data]);
      } else if (component.includes('Character')) {
        routesByType['Character System'].push([route, data]);
      } else if (route === '/' || component.includes('Dashboard') || component.includes('Workspace')) {
        routesByType['Main Application'].push([route, data]);
      } else {
        routesByType['Advanced Features'].push([route, data]);
      }
    });

    Object.entries(routesByType).forEach(([category, routes]) => {
      if (routes.length > 0) {
        markdown += `### ${category}\n`;
        routes.forEach(([route, data]) => {
          markdown += `- **Route**: \`${route}\`\n`;
          markdown += `  - **Component**: ${data.component}\n`;
          markdown += `  - **File**: ${data.file}\n`;
          if (data.condition) {
            markdown += `  - **Condition**: ${data.condition}\n`;
          }
          
          // Add component details if available
          const componentDetails = report.components.find(([name]) => name === data.component);
          if (componentDetails) {
            const [, details] = componentDetails;
            if (details.apiCalls && details.apiCalls.length > 0) {
              markdown += `  - **API Calls**: ${details.apiCalls.join(', ')}\n`;
            }
            if (details.assets && details.assets.length > 0) {
              markdown += `  - **Assets Used**: ${details.assets.join(', ')}\n`;
            }
          }
          markdown += '\n';
        });
      }
    });

    markdown += `## 🧩 COMPONENT BREAKDOWN

`;

    report.components.forEach(([name, details]) => {
      markdown += `### ${name}
- **File**: ${details.file}
- **API Calls**: ${details.apiCalls.join(', ') || 'None'}
- **Assets**: ${details.assets.join(', ') || 'None'}
- **Key Imports**: ${details.imports.filter(imp => imp.startsWith('./') || imp.startsWith('../')).slice(0, 3).join(', ')}

`;
    });

    markdown += `## 🖼️  ASSETS INVENTORY

`;

    const assetsByType = {};
    report.assets.forEach(([name, details]) => {
      const type = details.type || 'unknown';
      if (!assetsByType[type]) assetsByType[type] = [];
      assetsByType[type].push([name, details]);
    });

    Object.entries(assetsByType).forEach(([type, assets]) => {
      markdown += `### ${type.toUpperCase()} Files\n`;
      assets.forEach(([name, details]) => {
        const sizeKB = Math.round(details.size / 1024);
        markdown += `- **${name}** (${sizeKB}KB) - ${details.path}\n`;
      });
      markdown += '\n';
    });

    fs.writeFileSync('ROUTE_MAPPING_GUIDE.md', markdown);
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
      } else if (extension === '' || fullPath.endsWith(extension)) {
        files.push(fullPath);
      }
    });
    
    return files;
  }

  getLineNumber(content, index) {
    return content.substring(0, index).split('\n').length;
  }

  // Run complete route mapping
  async run() {
    console.log('🚀 Starting route mapping...\n');
    
    this.mapAppRoutes();
    this.mapComponentFiles();
    this.mapAssets();
    this.generateRouteReport();
    
    console.log('\n✨ Route mapping complete! Check the reports to see exactly where everything is.');
  }
}

// Run the route mapper
const mapper = new RouteMapper();
mapper.run().catch(console.error);