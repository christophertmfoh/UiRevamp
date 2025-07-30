import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle, AlertCircle, Info } from 'lucide-react';
import CHARACTER_CONFIG from '@/core/entities/config/CHARACTER_CONFIG';

interface ValidationResult {
  category: string;
  test: string;
  status: 'pass' | 'fail' | 'warning' | 'info';
  expected: string | number;
  actual: string | number;
  details: string;
}

export function ConfigValidationTest() {
  const validationResults = useMemo((): ValidationResult[] => {
    const results: ValidationResult[] = [];
    
    // WIZARD CONFIGURATION VALIDATION
    results.push({
      category: 'Wizard',
      test: 'Wizard Steps Count',
      status: CHARACTER_CONFIG.wizardConfig.steps.length === 10 ? 'pass' : 'fail',
      expected: 10,
      actual: CHARACTER_CONFIG.wizardConfig.steps.length,
      details: 'Step 10 requirement: "Replicate 10 wizard steps exactly"'
    });

    results.push({
      category: 'Wizard',
      test: 'All Creation Methods Enabled',
      status: (CHARACTER_CONFIG.wizardConfig.methods.guided && 
               CHARACTER_CONFIG.wizardConfig.methods.templates && 
               CHARACTER_CONFIG.wizardConfig.methods.ai && 
               CHARACTER_CONFIG.wizardConfig.methods.upload) ? 'pass' : 'fail',
      expected: 'All 4 methods enabled',
      actual: `${Object.values(CHARACTER_CONFIG.wizardConfig.methods).filter(Boolean).length}/4 enabled`,
      details: 'Character system supports guided, templates, AI, and upload creation methods'
    });

    results.push({
      category: 'Wizard',
      test: 'Step Field Mapping',
      status: CHARACTER_CONFIG.wizardConfig.steps.every(step => step.fields.length > 0) ? 'pass' : 'warning',
      expected: 'All steps have fields',
      actual: `${CHARACTER_CONFIG.wizardConfig.steps.filter(step => step.fields.length > 0).length}/${CHARACTER_CONFIG.wizardConfig.steps.length} steps`,
      details: 'Each wizard step should have associated fields for proper functionality'
    });

    // DETAIL VIEW CONFIGURATION VALIDATION
    results.push({
      category: 'Detail View',
      test: 'Detail Tabs Count',
      status: CHARACTER_CONFIG.detailTabConfig.tabs.length >= 10 ? 'pass' : 'fail',
      expected: '10+ tabs',
      actual: CHARACTER_CONFIG.detailTabConfig.tabs.length,
      details: 'Step 10 requirement: "Replicate 4+ detail view tabs exactly" - Character system has 10 tabs'
    });

    results.push({
      category: 'Detail View',
      test: 'Tab Field Organization',
      status: CHARACTER_CONFIG.detailTabConfig.tabs.every(tab => 
        tab.sections && tab.sections.length > 0 && 
        tab.sections.every(section => section.fields.length > 0)
      ) ? 'pass' : 'warning',
      expected: 'All tabs have organized sections with fields',
      actual: `${CHARACTER_CONFIG.detailTabConfig.tabs.filter(tab => tab.sections?.length > 0).length}/${CHARACTER_CONFIG.detailTabConfig.tabs.length} tabs`,
      details: 'Proper field organization ensures content displays correctly in detail view'
    });

    // DISPLAY CONFIGURATION VALIDATION
    results.push({
      category: 'Display',
      test: 'Card Fields Configuration',
      status: CHARACTER_CONFIG.displayConfig.cardFields.length >= 10 ? 'pass' : 'warning',
      expected: '10+ card fields',
      actual: CHARACTER_CONFIG.displayConfig.cardFields.length,
      details: 'Step 10 requirement: "Replicate card/list display exactly" - Character cards have extensive field display'
    });

    results.push({
      category: 'Display',
      test: 'List Fields Configuration',
      status: CHARACTER_CONFIG.displayConfig.listFields.length >= 7 ? 'pass' : 'warning',
      expected: '7+ list fields',
      actual: CHARACTER_CONFIG.displayConfig.listFields.length,
      details: 'Character list view displays comprehensive information in horizontal layout'
    });

    results.push({
      category: 'Display',
      test: 'Sort Options Count',
      status: CHARACTER_CONFIG.displayConfig.sortOptions.length >= 12 ? 'pass' : 'fail',
      expected: '12 sort options',
      actual: CHARACTER_CONFIG.displayConfig.sortOptions.length,
      details: 'Character system has exactly 12 sort options based on CHARACTER_SYSTEM_ANALYSIS.md'
    });

    results.push({
      category: 'Display',
      test: 'Search Fields Configuration',
      status: CHARACTER_CONFIG.displayConfig.searchFields.length >= 6 ? 'pass' : 'warning',
      expected: '6+ search fields',
      actual: CHARACTER_CONFIG.displayConfig.searchFields.length,
      details: 'Comprehensive search across multiple character attributes'
    });

    // FIELD SYSTEM VALIDATION
    const totalFields = CHARACTER_CONFIG.fields.length;
    results.push({
      category: 'Fields',
      test: 'Total Field Count',
      status: totalFields >= 164 ? 'pass' : 'warning',
      expected: '164+ fields',
      actual: totalFields,
      details: 'CHARACTER_SYSTEM_ANALYSIS.md documented 164+ fields in the character system'
    });

    const fieldsWithValidation = CHARACTER_CONFIG.fields.filter(field => field.validation);
    results.push({
      category: 'Fields',
      test: 'Field Validation Coverage',
      status: fieldsWithValidation.length / totalFields > 0.8 ? 'pass' : 'warning',
      expected: '80%+ fields with validation',
      actual: `${Math.round((fieldsWithValidation.length / totalFields) * 100)}%`,
      details: 'Proper validation ensures data integrity and user experience'
    });

    const requiredFields = CHARACTER_CONFIG.fields.filter(field => field.required);
    results.push({
      category: 'Fields',
      test: 'Required Fields Definition',
      status: requiredFields.length > 0 ? 'pass' : 'warning',
      expected: 'At least 1 required field',
      actual: requiredFields.length,
      details: 'Required fields guide user through essential character information'
    });

    const priorityFields = CHARACTER_CONFIG.fields.filter(field => field.priority);
    results.push({
      category: 'Fields',
      test: 'Priority Fields for Completion',
      status: priorityFields.length >= 50 ? 'pass' : 'warning',
      expected: '50+ priority fields',
      actual: priorityFields.length,
      details: 'Priority fields enable completion percentage calculation'
    });

    // FORM CONFIGURATION VALIDATION
    results.push({
      category: 'Form',
      test: 'Form Sections Count',
      status: CHARACTER_CONFIG.formConfig.sections.length >= 10 ? 'pass' : 'fail',
      expected: '10+ form sections',
      actual: CHARACTER_CONFIG.formConfig.sections.length,
      details: 'Character system organizes fields into logical sections for better UX'
    });

    const sectionsWithFields = CHARACTER_CONFIG.formConfig.sections.filter(section => section.fields.length > 0);
    results.push({
      category: 'Form',
      test: 'Form Section Field Mapping',
      status: sectionsWithFields.length === CHARACTER_CONFIG.formConfig.sections.length ? 'pass' : 'warning',
      expected: 'All sections have fields',
      actual: `${sectionsWithFields.length}/${CHARACTER_CONFIG.formConfig.sections.length} sections`,
      details: 'Each form section should contain relevant fields for proper organization'
    });

    // FEATURE CONFIGURATION VALIDATION
    const enabledFeatures = Object.values(CHARACTER_CONFIG.features).filter(Boolean).length;
    const totalFeatures = Object.keys(CHARACTER_CONFIG.features).length;
    results.push({
      category: 'Features',
      test: 'Advanced Features Enabled',
      status: enabledFeatures / totalFeatures > 0.7 ? 'pass' : 'warning',
      expected: '70%+ features enabled',
      actual: `${Math.round((enabledFeatures / totalFeatures) * 100)}%`,
      details: 'Character system has comprehensive feature set including AI, templates, portraits, etc.'
    });

    // PERFORMANCE CONFIGURATION VALIDATION
    const performanceEnabled = CHARACTER_CONFIG.performance && 
      CHARACTER_CONFIG.performance.enableVirtualization && 
      CHARACTER_CONFIG.performance.lazyLoading && 
      CHARACTER_CONFIG.performance.cacheResults;
    
    results.push({
      category: 'Performance',
      test: 'Performance Optimizations',
      status: performanceEnabled ? 'pass' : 'warning',
      expected: 'All optimizations enabled',
      actual: performanceEnabled ? 'Enabled' : 'Partially enabled',
      details: 'Step 8 performance optimizations: virtualization, lazy loading, caching'
    });

    // TEMPLATE CONFIGURATION VALIDATION
    results.push({
      category: 'Templates',
      test: 'Template System Configuration',
      status: CHARACTER_CONFIG.templateConfig.enabled && CHARACTER_CONFIG.templateConfig.templates.length > 0 ? 'pass' : 'warning',
      expected: 'Templates enabled with examples',
      actual: CHARACTER_CONFIG.templateConfig.enabled ? `${CHARACTER_CONFIG.templateConfig.templates.length} templates` : 'Disabled',
      details: 'Template system enables quick character creation from predefined archetypes'
    });

    // AI CONFIGURATION VALIDATION
    results.push({
      category: 'AI',
      test: 'AI System Configuration',
      status: CHARACTER_CONFIG.aiConfig.enabled && CHARACTER_CONFIG.aiConfig.prompts.length > 0 ? 'pass' : 'warning',
      expected: 'AI enabled with prompts',
      actual: CHARACTER_CONFIG.aiConfig.enabled ? `${CHARACTER_CONFIG.aiConfig.prompts.length} prompts` : 'Disabled',
      details: 'AI system provides intelligent character generation and enhancement'
    });

    return results;
  }, []);

  const stats = useMemo(() => {
    const total = validationResults.length;
    const passed = validationResults.filter(r => r.status === 'pass').length;
    const failed = validationResults.filter(r => r.status === 'fail').length;
    const warnings = validationResults.filter(r => r.status === 'warning').length;
    const infos = validationResults.filter(r => r.status === 'info').length;
    
    return { total, passed, failed, warnings, infos };
  }, [validationResults]);

  const overallStatus = stats.failed === 0 ? (stats.warnings === 0 ? 'excellent' : 'good') : 'needs-attention';

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {overallStatus === 'excellent' && <CheckCircle className="h-5 w-5 text-green-600" />}
            {overallStatus === 'good' && <AlertCircle className="h-5 w-5 text-yellow-600" />}
            {overallStatus === 'needs-attention' && <XCircle className="h-5 w-5 text-red-600" />}
            CHARACTER_CONFIG Validation Report
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-4 gap-4 mb-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{stats.passed}</div>
              <div className="text-sm text-muted-foreground">Passed</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">{stats.failed}</div>
              <div className="text-sm text-muted-foreground">Failed</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600">{stats.warnings}</div>
              <div className="text-sm text-muted-foreground">Warnings</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">{stats.total}</div>
              <div className="text-sm text-muted-foreground">Total Tests</div>
            </div>
          </div>
          
          <div className={`p-4 rounded-lg ${
            overallStatus === 'excellent' ? 'bg-green-50 text-green-800' :
            overallStatus === 'good' ? 'bg-yellow-50 text-yellow-800' :
            'bg-red-50 text-red-800'
          }`}>
            <p className="font-medium">
              {overallStatus === 'excellent' && '✅ Excellent: CHARACTER_CONFIG meets all Step 10 requirements with no issues'}
              {overallStatus === 'good' && '⚠️ Good: CHARACTER_CONFIG meets Step 10 requirements with minor warnings'}
              {overallStatus === 'needs-attention' && '❌ Needs Attention: CHARACTER_CONFIG has failed tests that must be addressed'}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Detailed Results by Category */}
      {['Wizard', 'Detail View', 'Display', 'Fields', 'Form', 'Features', 'Performance', 'Templates', 'AI'].map(category => {
        const categoryResults = validationResults.filter(r => r.category === category);
        const categoryPassed = categoryResults.filter(r => r.status === 'pass').length;
        const categoryTotal = categoryResults.length;
        
        return (
          <Card key={category}>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>{category} Configuration</span>
                <Badge variant={categoryPassed === categoryTotal ? 'default' : 'secondary'}>
                  {categoryPassed}/{categoryTotal} passed
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {categoryResults.map((result, idx) => (
                <div key={idx} className="flex items-start gap-3 p-3 border rounded-lg">
                  <div className="mt-0.5">
                    {result.status === 'pass' && <CheckCircle className="h-4 w-4 text-green-600" />}
                    {result.status === 'fail' && <XCircle className="h-4 w-4 text-red-600" />}
                    {result.status === 'warning' && <AlertCircle className="h-4 w-4 text-yellow-600" />}
                    {result.status === 'info' && <Info className="h-4 w-4 text-blue-600" />}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="font-medium">{result.test}</h4>
                      <div className="text-sm text-muted-foreground">
                        Expected: {result.expected} | Actual: {result.actual}
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground">{result.details}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}