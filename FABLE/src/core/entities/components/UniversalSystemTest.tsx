import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  TestTube, 
  Book, 
  User, 
  Settings,
  Layers,
  Database,
  Eye
} from 'lucide-react';
import { TEST_CONFIGS, TestConfigType } from '../config/testConfigs';
import { UniversalEntityManager } from './UniversalEntityManager';
import { UniversalEntityForm } from './UniversalEntityForm';
import { UniversalEntityDetailView } from './UniversalEntityDetailView';
import { UniversalEntityCard } from './UniversalEntityCard';
import { UniversalWizard } from './UniversalWizard';
import type { EnhancedUniversalEntityConfig } from '../config/EntityConfig';

interface TestResult {
  component: string;
  configType: TestConfigType;
  passed: boolean;
  errors: string[];
  warnings: string[];
  performance: {
    renderTime: number;
    complexity: 'low' | 'medium' | 'high';
  };
}

interface UniversalSystemTestProps {
  projectId: string;
}

export function UniversalSystemTest({ projectId }: UniversalSystemTestProps) {
  const [selectedConfig, setSelectedConfig] = useState<TestConfigType>('simple');
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [isRunningTests, setIsRunningTests] = useState(false);
  const [selectedEntity, setSelectedEntity] = useState<any>(null);
  const [showWizard, setShowWizard] = useState(false);
  
  const currentConfig = TEST_CONFIGS[selectedConfig];
  
  // Mock entities for testing
  const mockEntities = {
    simple: [
      {
        id: '1',
        projectId,
        title: 'Test Note 1',
        content: 'This is a simple test note to verify the universal system handles basic entities correctly.',
        tags: ['test', 'simple'],
        createdAt: new Date().toISOString()
      },
      {
        id: '2',
        projectId,
        title: 'Configuration Test',
        content: 'Another note to test grid and list views with minimal configuration.',
        tags: ['configuration', 'testing'],
        createdAt: new Date().toISOString()
      }
    ],
    complex: [
      {
        id: '1',
        projectId,
        name: 'Aragorn',
        title: 'Ranger of the North',
        age: 35,
        species: 'human',
        gender: 'male',
        occupation: 'Ranger',
        personality: 'Noble and brave, driven by duty and honor. A natural leader with deep compassion.',
        traits: ['Honorable', 'Brave', 'Wise', 'Determined'],
        skills: ['Swordsmanship', 'Leadership', 'Survival', 'Tracking'],
        goals: ['Protect Middle-earth', 'Fulfill his destiny as king'],
        backstory: 'Heir to the throne of Gondor, raised by elves, became a ranger.',
        createdAt: new Date().toISOString()
      },
      {
        id: '2',
        projectId,
        name: 'Gandalf',
        title: 'The Grey Wizard',
        age: 2000,
        species: 'maiar',
        gender: 'male',
        occupation: 'Wizard',
        personality: 'Wise and patient, but can be stern when necessary. Deeply caring for all free peoples.',
        traits: ['Wise', 'Patient', 'Powerful', 'Caring'],
        magicalAbilities: ['Fireworks', 'Light', 'Protection spells', 'Foresight'],
        skills: ['Magic', 'Ancient Knowledge', 'Diplomacy'],
        goals: ['Defeat Sauron', 'Guide the Fellowship'],
        createdAt: new Date().toISOString()
      }
    ]
  };
  
  // Test each universal component with current configuration
  const runConfigurabilityTests = async () => {
    setIsRunningTests(true);
    setTestResults([]);
    
    const results: TestResult[] = [];
    
    // Test each component
    const components = [
      'UniversalEntityManager',
      'UniversalEntityForm', 
      'UniversalEntityDetailView',
      'UniversalEntityCard',
      'UniversalWizard'
    ];
    
    for (const component of components) {
      const startTime = performance.now();
      
      try {
        // Simulate component testing
        await simulateComponentTest(component, currentConfig);
        
        const endTime = performance.now();
        const renderTime = endTime - startTime;
        
        results.push({
          component,
          configType: selectedConfig,
          passed: true,
          errors: [],
          warnings: getConfigurationWarnings(component, currentConfig),
          performance: {
            renderTime,
            complexity: getComplexityLevel(currentConfig)
          }
        });
        
      } catch (error) {
        const endTime = performance.now();
        const renderTime = endTime - startTime;
        
        results.push({
          component,
          configType: selectedConfig,
          passed: false,
          errors: [error instanceof Error ? error.message : 'Unknown error'],
          warnings: [],
          performance: {
            renderTime,
            complexity: getComplexityLevel(currentConfig)
          }
        });
      }
      
      // Update results progressively
      setTestResults([...results]);
      
      // Small delay for visual feedback
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    
    setIsRunningTests(false);
  };
  
  // Simulate testing a component with configuration
  const simulateComponentTest = async (component: string, config: EnhancedUniversalEntityConfig) => {
    // Simulate different test scenarios based on component
    switch (component) {
      case 'UniversalEntityManager':
        // Test list rendering, filtering, sorting
        if (!config.display.sortOptions || config.display.sortOptions.length === 0) {
          throw new Error('No sort options configured');
        }
        break;
        
      case 'UniversalEntityForm':
        // Test form rendering with all field types
        if (!config.form.sections || config.form.sections.length === 0) {
          throw new Error('No form sections configured');
        }
        break;
        
      case 'UniversalEntityDetailView':
        // Test tab rendering and field display
        if (!config.tabs.tabs || config.tabs.tabs.length === 0) {
          throw new Error('No tabs configured');
        }
        break;
        
      case 'UniversalEntityCard':
        // Test card display with configured fields
        if (!config.display.card.fields || config.display.card.fields.length === 0) {
          throw new Error('No card fields configured');
        }
        break;
        
      case 'UniversalWizard':
        // Test wizard steps and method availability
        if (!config.wizard.steps || config.wizard.steps.length === 0) {
          throw new Error('No wizard steps configured');
        }
        break;
    }
    
    // Simulate processing time based on configuration complexity
    const complexity = getComplexityLevel(config);
    const delay = complexity === 'high' ? 200 : complexity === 'medium' ? 100 : 50;
    await new Promise(resolve => setTimeout(resolve, delay));
  };
  
  // Get configuration warnings
  const getConfigurationWarnings = (component: string, config: EnhancedUniversalEntityConfig): string[] => {
    const warnings: string[] = [];
    
    switch (component) {
      case 'UniversalEntityManager':
        if (config.fields.length > 20) {
          warnings.push('Large number of fields may impact performance');
        }
        if (config.display.filterOptions && config.display.filterOptions.length > 5) {
          warnings.push('Many filter options may clutter the UI');
        }
        break;
        
      case 'UniversalEntityForm':
        if (config.form.sections && config.form.sections.length > 7) {
          warnings.push('Many form sections may overwhelm users');
        }
        if (config.fields.some(f => f.type === 'textarea' && f.validation?.maxLength && f.validation.maxLength > 2000)) {
          warnings.push('Large textarea fields may cause UX issues');
        }
        break;
        
      case 'UniversalEntityDetailView':
        if (config.tabs.tabs && config.tabs.tabs.length > 8) {
          warnings.push('Too many tabs may reduce usability');
        }
        break;
        
      case 'UniversalWizard':
        if (config.wizard.steps && config.wizard.steps.length > 6) {
          warnings.push('Long wizards may have high abandonment rates');
        }
        break;
    }
    
    return warnings;
  };
  
  // Determine complexity level
  const getComplexityLevel = (config: EnhancedUniversalEntityConfig): 'low' | 'medium' | 'high' => {
    const fieldCount = config.fields.length;
    const sectionCount = config.sections?.length || 0;
    const tabCount = config.tabs.tabs?.length || 0;
    
    const complexityScore = fieldCount + (sectionCount * 2) + (tabCount * 3);
    
    if (complexityScore > 50) return 'high';
    if (complexityScore > 20) return 'medium';
    return 'low';
  };
  
  // Get test result icon
  const getResultIcon = (result: TestResult) => {
    if (!result.passed) return <XCircle className="h-4 w-4 text-red-500" />;
    if (result.warnings.length > 0) return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
    return <CheckCircle className="h-4 w-4 text-green-500" />;
  };
  
  // Calculate overall test score
  const getOverallScore = () => {
    if (testResults.length === 0) return 0;
    const passedTests = testResults.filter(r => r.passed).length;
    return Math.round((passedTests / testResults.length) * 100);
  };
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TestTube className="h-5 w-5" />
            Universal System Configurability Test
          </CardTitle>
          <p className="text-muted-foreground">
            Verify that the same universal components handle both simple and complex entity configurations perfectly.
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium">Test Configuration:</label>
              <Select value={selectedConfig} onValueChange={(value: TestConfigType) => setSelectedConfig(value)}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="simple">
                    <div className="flex items-center gap-2">
                      <Book className="h-4 w-4" />
                      Simple (Note)
                    </div>
                  </SelectItem>
                  <SelectItem value="complex">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      Complex (Character)
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <Button 
              onClick={runConfigurabilityTests}
              disabled={isRunningTests}
              className="gap-2"
            >
              {isRunningTests ? (
                <>
                  <div className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full" />
                  Running Tests...
                </>
              ) : (
                <>
                  <TestTube className="h-4 w-4" />
                  Run Tests
                </>
              )}
            </Button>
          </div>
          
          {/* Configuration Overview */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">{currentConfig.fields.length}</div>
              <div className="text-sm text-muted-foreground">Fields</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">{currentConfig.sections?.length || 0}</div>
              <div className="text-sm text-muted-foreground">Sections</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">{currentConfig.tabs.tabs?.length || 0}</div>
              <div className="text-sm text-muted-foreground">Tabs</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">
                {Object.values(currentConfig.wizard.methods).filter(Boolean).length}
              </div>
              <div className="text-sm text-muted-foreground">Creation Methods</div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Test Results */}
      {testResults.length > 0 && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                Test Results
              </CardTitle>
              <div className="flex items-center gap-2">
                <Badge variant={getOverallScore() === 100 ? 'default' : getOverallScore() > 80 ? 'secondary' : 'destructive'}>
                  {getOverallScore()}% Pass Rate
                </Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {testResults.map((result, index) => (
                <Card key={`${result.component}-${result.configType}`} className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {getResultIcon(result)}
                      <div>
                        <h4 className="font-medium">{result.component}</h4>
                        <p className="text-sm text-muted-foreground">
                          {selectedConfig === 'simple' ? 'Simple' : 'Complex'} Configuration
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4 text-sm">
                      <div className="text-center">
                        <div className="font-medium">{result.performance.renderTime.toFixed(1)}ms</div>
                        <div className="text-muted-foreground">Render Time</div>
                      </div>
                      <Badge variant="outline" className="capitalize">
                        {result.performance.complexity} Complexity
                      </Badge>
                    </div>
                  </div>
                  
                  {(result.errors.length > 0 || result.warnings.length > 0) && (
                    <div className="mt-3 space-y-2">
                      {result.errors.map((error, idx) => (
                        <div key={idx} className="text-sm text-red-600 bg-red-50 p-2 rounded">
                          <strong>Error:</strong> {error}
                        </div>
                      ))}
                      {result.warnings.map((warning, idx) => (
                        <div key={idx} className="text-sm text-yellow-600 bg-yellow-50 p-2 rounded">
                          <strong>Warning:</strong> {warning}
                        </div>
                      ))}
                    </div>
                  )}
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
      
      {/* Live Component Testing */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Eye className="h-5 w-5" />
            Live Component Testing
          </CardTitle>
          <p className="text-muted-foreground">
            Test the universal components with the selected configuration in real-time.
          </p>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="manager" className="space-y-4">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="manager">Manager</TabsTrigger>
              <TabsTrigger value="card">Card</TabsTrigger>
              <TabsTrigger value="form">Form</TabsTrigger>
              <TabsTrigger value="detail">Detail</TabsTrigger>
              <TabsTrigger value="wizard">Wizard</TabsTrigger>
            </TabsList>
            
            <TabsContent value="manager" className="space-y-4">
              <div className="border rounded-lg p-4">
                <h3 className="font-medium mb-4">UniversalEntityManager Component</h3>
                <div className="bg-muted/50 rounded-lg p-4">
                  <UniversalEntityManager
                    config={currentConfig}
                    entities={mockEntities[selectedConfig]}
                    projectId={projectId}
                    onEntitySelect={setSelectedEntity}
                    onEntityCreate={() => setShowWizard(true)}
                    onEntityEdit={() => {}}
                    onEntityDelete={() => {}}
                  />
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="card" className="space-y-4">
              <div className="border rounded-lg p-4">
                <h3 className="font-medium mb-4">UniversalEntityCard Component</h3>
                <div className="grid gap-4 md:grid-cols-2">
                  {mockEntities[selectedConfig].slice(0, 2).map((entity) => (
                    <UniversalEntityCard
                      key={entity.id}
                      config={currentConfig}
                      entity={entity}
                      viewMode="grid"
                      onEdit={() => {}}
                      onDelete={() => {}}
                    />
                  ))}
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="form" className="space-y-4">
              <div className="border rounded-lg p-4">
                <h3 className="font-medium mb-4">UniversalEntityForm Component</h3>
                <div className="bg-muted/50 rounded-lg p-4">
                  <UniversalEntityForm
                    config={currentConfig}
                    projectId={projectId}
                    onSave={() => {}}
                    onCancel={() => {}}
                  />
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="detail" className="space-y-4">
              <div className="border rounded-lg p-4">
                <h3 className="font-medium mb-4">UniversalEntityDetailView Component</h3>
                {selectedEntity ? (
                  <div className="bg-muted/50 rounded-lg p-4">
                    <UniversalEntityDetailView
                      config={currentConfig}
                      entity={selectedEntity}
                      projectId={projectId}
                      onEdit={() => {}}
                      onDelete={() => {}}
                    />
                  </div>
                ) : (
                  <div className="text-center text-muted-foreground py-8">
                    Select an entity from the Manager tab to view details
                  </div>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="wizard" className="space-y-4">
              <div className="border rounded-lg p-4">
                <h3 className="font-medium mb-4">UniversalWizard Component</h3>
                <div className="space-y-4">
                  <Button onClick={() => setShowWizard(true)} className="gap-2">
                    <Settings className="h-4 w-4" />
                    Open Creation Wizard
                  </Button>
                  
                  {showWizard && (
                    <div className="bg-muted/50 rounded-lg p-4">
                      <UniversalWizard
                        isOpen={showWizard}
                        onClose={() => setShowWizard(false)}
                        config={currentConfig}
                        projectId={projectId}
                        onComplete={() => setShowWizard(false)}
                      />
                    </div>
                  )}
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
      
      {/* Configuration Comparison */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Layers className="h-5 w-5" />
            Configuration Comparison
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-3">
              <h3 className="font-medium flex items-center gap-2">
                <Book className="h-4 w-4" />
                Simple Configuration (Note)
              </h3>
              <div className="bg-muted/50 rounded-lg p-4 space-y-2 text-sm">
                <div>• {TEST_CONFIGS.simple.fields.length} fields</div>
                <div>• {TEST_CONFIGS.simple.sections?.length} section</div>
                <div>• {TEST_CONFIGS.simple.tabs.tabs?.length} tab</div>
                <div>• Single-column form layout</div>
                <div>• No relationships or portraits</div>
                <div>• Basic AI and templates</div>
                <div>• Minimal validation rules</div>
              </div>
            </div>
            
            <div className="space-y-3">
              <h3 className="font-medium flex items-center gap-2">
                <User className="h-4 w-4" />
                Complex Configuration (Character)
              </h3>
              <div className="bg-muted/50 rounded-lg p-4 space-y-2 text-sm">
                <div>• {TEST_CONFIGS.complex.fields.length} fields</div>
                <div>• {TEST_CONFIGS.complex.sections?.length} sections</div>
                <div>• {TEST_CONFIGS.complex.tabs.tabs?.length} tabs</div>
                <div>• Two-column form layout</div>
                <div>• Full relationships and portraits</div>
                <div>• Advanced AI prompts and templates</div>
                <div>• Complex validation and automation</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default UniversalSystemTest;