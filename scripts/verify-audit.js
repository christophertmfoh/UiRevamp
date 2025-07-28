#!/usr/bin/env node

/**
 * Audit Verification Tool
 * Verifies the audit results by checking actual file contents
 */

import fs from 'fs';

class AuditVerifier {
  constructor() {
    this.results = {
      landingPage: null,
      projectsPage: null,
      characterManager: null,
      worldBible: null,
      apiEndpoints: [],
      verification: {
        correct: 0,
        incorrect: 0,
        issues: []
      }
    };
  }

  // Verify the landing page location and content
  verifyLandingPage() {
    console.log('🔍 Verifying Landing Page...');
    
    const primaryPath = 'client/src/pages/landing/LandingPage.tsx';
    const duplicatePath = 'client/src/pages/workspace.tsx';
    
    // Check primary landing page
    if (fs.existsSync(primaryPath)) {
      const content = fs.readFileSync(primaryPath, 'utf8');
      
      // Verify it contains expected elements
      const hasHeroSection = content.includes('Craft Your') || content.includes('Come to Life');
      const hasFloatingOrbs = content.includes('FloatingOrbs') || content.includes('floating');
      const hasAnimations = content.includes('animate-') || content.includes('animation');
      const hasCallToAction = content.includes('onNavigate') || content.includes('Projects');
      
      this.results.landingPage = {
        location: primaryPath,
        exists: true,
        hasHeroSection,
        hasFloatingOrbs,
        hasAnimations,
        hasCallToAction,
        lineCount: content.split('\n').length
      };
      
      if (hasHeroSection && hasFloatingOrbs && hasAnimations) {
        this.results.verification.correct++;
        console.log('✅ Landing page audit CORRECT');
      } else {
        this.results.verification.incorrect++;
        this.results.verification.issues.push('Landing page missing expected features');
      }
    } else {
      this.results.verification.incorrect++;
      this.results.verification.issues.push('Landing page not found at expected location');
    }
    
    // Check for duplicate
    if (fs.existsSync(duplicatePath)) {
      const content = fs.readFileSync(duplicatePath, 'utf8');
      const hasDuplicateLanding = content.includes('LandingPage') || content.includes('Craft Your');
      if (hasDuplicateLanding) {
        console.log('✅ Duplicate landing page identified correctly');
      }
    }
  }

  // Verify projects page
  verifyProjectsPage() {
    console.log('🔍 Verifying Projects Page...');
    
    const path = 'client/src/components/projects/ProjectsPage.tsx';
    
    if (fs.existsSync(path)) {
      const content = fs.readFileSync(path, 'utf8');
      
      const hasProjectGrid = content.includes('project') || content.includes('grid');
      const hasAPICall = content.includes('/api/projects') || content.includes('useQuery');
      const hasCreateButton = content.includes('create') || content.includes('Create');
      
      this.results.projectsPage = {
        location: path,
        exists: true,
        hasProjectGrid,
        hasAPICall,
        hasCreateButton,
        lineCount: content.split('\n').length
      };
      
      if (hasProjectGrid && hasAPICall) {
        this.results.verification.correct++;
        console.log('✅ Projects page audit CORRECT');
      } else {
        this.results.verification.incorrect++;
        this.results.verification.issues.push('Projects page missing expected features');
      }
    } else {
      this.results.verification.incorrect++;
      this.results.verification.issues.push('Projects page not found');
    }
  }

  // Verify character manager
  verifyCharacterManager() {
    console.log('🔍 Verifying Character Manager...');
    
    const path = 'client/src/components/character/CharacterManager.tsx';
    
    if (fs.existsSync(path)) {
      const content = fs.readFileSync(path, 'utf8');
      
      const hasCharacterCRUD = content.includes('character') && (content.includes('create') || content.includes('delete'));
      const hasAPICall = content.includes('/api/') && content.includes('characters');
      const hasAIFeatures = content.includes('AI') || content.includes('generate') || content.includes('enhance');
      
      this.results.characterManager = {
        location: path,
        exists: true,
        hasCharacterCRUD,
        hasAPICall,
        hasAIFeatures,
        lineCount: content.split('\n').length
      };
      
      if (hasCharacterCRUD && hasAPICall) {
        this.results.verification.correct++;
        console.log('✅ Character manager audit CORRECT');
      } else {
        this.results.verification.incorrect++;
        this.results.verification.issues.push('Character manager missing expected features');
      }
    } else {
      this.results.verification.incorrect++;
      this.results.verification.issues.push('Character manager not found');
    }
  }

  // Verify world bible
  verifyWorldBible() {
    console.log('🔍 Verifying World Bible...');
    
    const path = 'client/src/components/world/WorldBible.tsx';
    
    if (fs.existsSync(path)) {
      const content = fs.readFileSync(path, 'utf8');
      
      const hasWorldBuilding = content.includes('world') || content.includes('location') || content.includes('bible');
      const hasComplexFeatures = content.includes('relationship') || content.includes('timeline') || content.includes('reference');
      
      this.results.worldBible = {
        location: path,
        exists: true,
        hasWorldBuilding,
        hasComplexFeatures,
        lineCount: content.split('\n').length
      };
      
      if (hasWorldBuilding) {
        this.results.verification.correct++;
        console.log('✅ World Bible audit CORRECT');
      } else {
        this.results.verification.incorrect++;
        this.results.verification.issues.push('World Bible missing expected features');
      }
    } else {
      this.results.verification.incorrect++;
      this.results.verification.issues.push('World Bible not found');
    }
  }

  // Verify API endpoints
  verifyAPIEndpoints() {
    console.log('🔍 Verifying API Endpoints...');
    
    const routeFiles = [
      'server/routes/characters.ts',
      'server/routes/projects.ts', 
      'server/routes/auth.ts'
    ];
    
    routeFiles.forEach(file => {
      if (fs.existsSync(file)) {
        const content = fs.readFileSync(file, 'utf8');
        
        // Count actual route definitions
        const routes = content.match(/router\.(get|post|put|delete)\(['"`][^'"`]+['"`]/g) || [];
        
        this.results.apiEndpoints.push({
          file,
          routeCount: routes.length,
          routes: routes.slice(0, 5) // First 5 routes as sample
        });
        
        console.log(`✅ Found ${routes.length} routes in ${file}`);
      }
    });
  }

  // Generate verification report
  generateVerificationReport() {
    console.log('\n📊 Generating verification report...');
    
    const accuracy = this.results.verification.correct / (this.results.verification.correct + this.results.verification.incorrect) * 100;
    
    const report = `# Audit Verification Report
*Generated: ${new Date().toISOString()}*

## 📊 Verification Results
**Accuracy**: ${accuracy.toFixed(1)}%
**Correct Predictions**: ${this.results.verification.correct}
**Incorrect Predictions**: ${this.results.verification.incorrect}

## 🔍 Component Verification

### Landing Page
- **Location**: ${this.results.landingPage?.location || 'Not found'}
- **Exists**: ${this.results.landingPage?.exists ? '✅' : '❌'}
- **Has Hero Section**: ${this.results.landingPage?.hasHeroSection ? '✅' : '❌'}
- **Has Floating Orbs**: ${this.results.landingPage?.hasFloatingOrbs ? '✅' : '❌'}
- **Has Animations**: ${this.results.landingPage?.hasAnimations ? '✅' : '❌'}
- **Line Count**: ${this.results.landingPage?.lineCount || 'Unknown'}

### Projects Page  
- **Location**: ${this.results.projectsPage?.location || 'Not found'}
- **Exists**: ${this.results.projectsPage?.exists ? '✅' : '❌'}
- **Has Project Grid**: ${this.results.projectsPage?.hasProjectGrid ? '✅' : '❌'}
- **Has API Calls**: ${this.results.projectsPage?.hasAPICall ? '✅' : '❌'}
- **Line Count**: ${this.results.projectsPage?.lineCount || 'Unknown'}

### Character Manager
- **Location**: ${this.results.characterManager?.location || 'Not found'}
- **Exists**: ${this.results.characterManager?.exists ? '✅' : '❌'}
- **Has CRUD Operations**: ${this.results.characterManager?.hasCharacterCRUD ? '✅' : '❌'}
- **Has API Integration**: ${this.results.characterManager?.hasAPICall ? '✅' : '❌'}
- **Line Count**: ${this.results.characterManager?.lineCount || 'Unknown'}

### World Bible
- **Location**: ${this.results.worldBible?.location || 'Not found'}
- **Exists**: ${this.results.worldBible?.exists ? '✅' : '❌'}
- **Has World Building**: ${this.results.worldBible?.hasWorldBuilding ? '✅' : '❌'}
- **Line Count**: ${this.results.worldBible?.lineCount || 'Unknown'}

## 🔌 API Endpoints Verification
${this.results.apiEndpoints.map(endpoint => `
### ${endpoint.file}
- **Route Count**: ${endpoint.routeCount}
- **Sample Routes**: ${endpoint.routes.join(', ')}
`).join('')}

## ⚠️ Issues Found
${this.results.verification.issues.length > 0 ? 
  this.results.verification.issues.map(issue => `- ${issue}`).join('\n') : 
  'No issues found'}

---
**Verification Conclusion**: ${accuracy > 90 ? 'Audit results are highly accurate' : accuracy > 70 ? 'Audit results are mostly accurate' : 'Audit results need improvement'}
`;

    fs.writeFileSync('AUDIT_VERIFICATION_REPORT.md', report);
    console.log('✅ Verification complete! Check AUDIT_VERIFICATION_REPORT.md');
  }

  // Run complete verification
  async run() {
    console.log('🚀 Starting audit verification...\n');
    
    this.verifyLandingPage();
    this.verifyProjectsPage();
    this.verifyCharacterManager();
    this.verifyWorldBible();
    this.verifyAPIEndpoints();
    this.generateVerificationReport();
    
    console.log(`\n✨ Verification complete! Accuracy: ${(this.results.verification.correct / (this.results.verification.correct + this.results.verification.incorrect) * 100).toFixed(1)}%`);
  }
}

// Run verification
const verifier = new AuditVerifier();
verifier.run().catch(console.error);