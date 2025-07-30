import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, Edit, Trash2, Camera, Share, Download, Eye, EyeOff } from 'lucide-react';
import type { 
  EnhancedUniversalEntityConfig, 
  DetailTabConfig 
} from '../config/EntityConfig';

interface UniversalEntityDetailViewProps {
  config: EnhancedUniversalEntityConfig;
  entity: any;
  projectId: string;
  onBack: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

export function UniversalEntityDetailView({ 
  config, 
  entity, 
  projectId, 
  onBack, 
  onEdit, 
  onDelete 
}: UniversalEntityDetailViewProps) {
  const [activeTab, setActiveTab] = useState<string>(() => {
    // Find first visible tab as default
    const firstVisibleTab = getVisibleTabs()[0];
    return firstVisibleTab?.id || config.detailTabConfig.tabs[0]?.id || 'overview';
  });
  
  // Get entity image/portrait
  const getEntityImage = () => {
    if (entity.imageUrl) return entity.imageUrl;
    if (entity.portraits && entity.portraits.length > 0) return entity.portraits[0];
    return null;
  };

  const entityImage = getEntityImage();

  // Check if a tab should be visible based on conditional display rules
  const isTabVisible = (tab: DetailTabConfig): boolean => {
    if (!tab.conditionalDisplay) return true;
    
    // Check field-based conditions
    if (tab.conditionalDisplay.showIfFieldHasValue) {
      const fieldKeys = tab.conditionalDisplay.showIfFieldHasValue;
      return fieldKeys.some(fieldKey => {
        const value = entity[fieldKey];
        if (Array.isArray(value)) return value.length > 0;
        return value && value.toString().trim() !== '';
      });
    }
    
    // Check feature-based conditions
    if (tab.conditionalDisplay.showIfFeatureEnabled) {
      const features = tab.conditionalDisplay.showIfFeatureEnabled;
      return features.some(feature => {
        switch (feature) {
          case 'hasPortraits': return config.features?.hasPortraits;
          case 'hasAIGeneration': return config.features?.hasAIGeneration;
          case 'hasRelationships': return config.features?.hasRelationships;
          case 'hasArcTracking': return config.features?.hasArcTracking;
          case 'hasInsights': return config.features?.hasInsights;
          default: return true;
        }
      });
    }
    
    return true;
  };
  
  // Get filtered list of visible tabs
  const getVisibleTabs = (): DetailTabConfig[] => {
    return config.detailTabConfig.tabs.filter(isTabVisible);
  };
  
  const visibleTabs = getVisibleTabs();

  // Render field value based on type and configuration
  const renderFieldValue = (fieldKey: string, value: any, customRenderer?: any) => {
    const field = config.fields.find(f => f.key === fieldKey);
    
    if (customRenderer && typeof customRenderer === 'function') {
      return customRenderer(value, field, entity);
    }
    
    if (!value) {
      const emptyText = field?.emptyStateText || 'Not specified';
      return <span className="text-muted-foreground">{emptyText}</span>;
    }

    if (Array.isArray(value)) {
      if (value.length === 0) {
        const emptyText = field?.emptyStateText || 'None added';
        return <span className="text-muted-foreground">{emptyText}</span>;
      }
      return (
        <div className="flex flex-wrap gap-2">
          {value.map((item, index) => (
            <Badge key={index} variant="secondary">
              {typeof item === 'object' ? item.name || item.label || String(item) : item}
            </Badge>
          ))}
        </div>
      );
    }

    if (typeof value === 'string') {
      if (field?.type === 'textarea') {
        return (
          <div className="prose prose-sm max-w-none">
            <p className="whitespace-pre-wrap">{value}</p>
          </div>
        );
      }
      return <span>{value}</span>;
    }

    if (typeof value === 'boolean') {
      return (
        <Badge variant={value ? 'default' : 'secondary'}>
          {value ? 'Yes' : 'No'}
        </Badge>
      );
    }

    return <span>{String(value)}</span>;
  };

  // Calculate completion percentage based on configured fields
  const calculateCompletion = () => {
    const essentialFields = config.fields.filter(f => f.priority === 'essential');
    const importantFields = config.fields.filter(f => f.priority === 'important');
    
    const essentialCompleted = essentialFields.filter(field => {
      const value = entity[field.key];
      if (Array.isArray(value)) return value.length > 0;
      return value && value.toString().trim() !== '';
    }).length;
    
    const importantCompleted = importantFields.filter(field => {
      const value = entity[field.key];
      if (Array.isArray(value)) return value.length > 0;
      return value && value.toString().trim() !== '';
    }).length;
    
    // Weight essential fields more heavily
    const essentialWeight = 0.7;
    const importantWeight = 0.3;
    
    const essentialScore = essentialFields.length > 0 ? 
      (essentialCompleted / essentialFields.length) * essentialWeight : 0;
    const importantScore = importantFields.length > 0 ? 
      (importantCompleted / importantFields.length) * importantWeight : 0;
    
    return Math.round((essentialScore + importantScore) * 100);
  };

  const completionPercentage = calculateCompletion();

  // Render tab content based on configuration
  const renderTabContent = (tab: DetailTabConfig) => {
    const { sections } = tab;
    
    if (!sections || sections.length === 0) {
      return (
        <div className="text-center py-8 text-muted-foreground">
          <p>No content configured for this tab</p>
        </div>
      );
    }

    return (
      <div className="space-y-8">
        {sections.map((section, sectionIndex) => {
          const sectionFields = section.fields || [];
          
          // Check if section has any visible fields
          const hasVisibleFields = sectionFields.some(fieldKey => {
            const field = config.fields.find(f => f.key === fieldKey);
            return field && (entity[fieldKey] || field.required);
          });
          
          if (!hasVisibleFields && !section.alwaysShow) {
            return null;
          }
          
          return (
            <div key={sectionIndex} className="space-y-6">
              {section.title && (
                <div>
                  <h3 className="text-lg font-semibold mb-1 flex items-center gap-2">
                    {section.icon && <section.icon className="h-5 w-5" />}
                    {section.title}
                  </h3>
                  {section.description && (
                    <p className="text-sm text-muted-foreground mb-4">{section.description}</p>
                  )}
                </div>
              )}
              
              <div className={`grid gap-6 ${section.layout === 'single' ? 'grid-cols-1' : 
                section.layout === 'double' ? 'md:grid-cols-2' : 
                'md:grid-cols-2 lg:grid-cols-3'}`}>
                {sectionFields.map(fieldKey => {
                  const field = config.fields.find(f => f.key === fieldKey);
                  const value = entity[fieldKey];
                  
                  if (!field) return null;
                  
                  // Don't show empty optional fields unless explicitly configured
                  if (!value && field.priority === 'optional' && !section.showEmptyFields) {
                    return null;
                  }
                  
                  return (
                    <div key={fieldKey} className="space-y-2">
                      <div className="flex items-start justify-between">
                        <h4 className="font-medium text-sm">{field.label}</h4>
                        <div className="flex items-center gap-1">
                          {field.aiEnhanceable && (
                            <Badge variant="outline" className="text-xs">
                              AI Enhanced
                            </Badge>
                          )}
                          {field.priority === 'essential' && (
                            <Badge variant="default" className="text-xs">
                              Essential
                            </Badge>
                          )}
                        </div>
                      </div>
                      
                      <div className="text-sm">
                        {renderFieldValue(fieldKey, value, section.customRenderer)}
                      </div>
                      
                      {field.priority === 'essential' && !value && (
                        <p className="text-xs text-muted-foreground">
                          This is an essential field for a complete {config.displayName.toLowerCase()}.
                        </p>
                      )}
                      
                      {field.helpText && (
                        <p className="text-xs text-muted-foreground">
                          {field.helpText}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
              
              {section.customComponent && (
                <div className="mt-6">
                  {section.customComponent({ entity, config, projectId })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="outline" size="sm" onClick={onBack}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <div className="flex-1">
          <h1 className="text-3xl font-bold">{entity.name || entity.title || 'Unnamed'}</h1>
          <p className="text-muted-foreground">{config.displayName} Details</p>
        </div>
        <div className="flex gap-2">
          {config.features?.hasPortraits && (
            <Button variant="outline" size="sm">
              <Camera className="h-4 w-4 mr-2" />
              Portraits
            </Button>
          )}
          <Button variant="outline" size="sm">
            <Share className="h-4 w-4 mr-2" />
            Share
          </Button>
          <Button variant="outline" size="sm" onClick={onEdit}>
            <Edit className="h-4 w-4 mr-2" />
            Edit
          </Button>
          <Button variant="destructive" size="sm" onClick={onDelete}>
            <Trash2 className="h-4 w-4 mr-2" />
            Delete
          </Button>
        </div>
      </div>

      {/* Hero Section */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-start gap-6">
            {/* Entity Image */}
            {config.features?.hasPortraits && (
              <div className={`w-32 h-32 rounded-lg bg-gradient-to-br ${config.gradient || 'from-primary/20 to-primary/10'} flex items-center justify-center flex-shrink-0`}>
                {entityImage ? (
                  <img 
                    src={entityImage} 
                    alt={entity.name || 'Entity image'}
                    className="w-full h-full object-cover rounded-lg"
                  />
                ) : (
                  <config.icon className="h-16 w-16 text-primary" />
                )}
              </div>
            )}

            {/* Entity Summary */}
            <div className="flex-1">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Main description */}
                <div className="md:col-span-2">
                  <h3 className="font-semibold mb-2">Description</h3>
                  {renderFieldValue(
                    'description',
                    entity.description || entity.characterSummary || entity.oneLine || entity.summary
                  )}
                </div>

                {/* Quick stats */}
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium text-sm text-muted-foreground">Completion</h4>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="flex-1 bg-muted rounded-full h-2">
                        <div 
                          className="h-2 rounded-full bg-primary transition-all duration-300"
                          style={{ width: `${completionPercentage}%` }}
                        />
                      </div>
                      <span className="text-sm font-medium">{completionPercentage}%</span>
                    </div>
                  </div>

                  {/* Display key summary fields */}
                  {config.displayConfig?.summary?.quickStats?.map(fieldKey => {
                    const field = config.fields.find(f => f.key === fieldKey);
                    const value = entity[fieldKey];
                    
                    if (!field || !value) return null;
                    
                    return (
                      <div key={fieldKey}>
                        <h4 className="font-medium text-sm text-muted-foreground">{field.label}</h4>
                        <div className="mt-1">
                          {renderFieldValue(fieldKey, value)}
                        </div>
                      </div>
                    );
                  }) || []}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Dynamic Tab System */}
      {visibleTabs.length > 0 && (
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className={`grid w-full ${
            visibleTabs.length <= 2 ? 'grid-cols-2' :
            visibleTabs.length <= 4 ? 'grid-cols-2 md:grid-cols-4' :
            visibleTabs.length <= 6 ? 'grid-cols-2 md:grid-cols-3 lg:grid-cols-6' :
            'grid-cols-2 md:grid-cols-4 lg:grid-cols-8'
          }`}>
            {visibleTabs.map(tab => {
              const IconComponent = tab.icon;
              return (
                <TabsTrigger key={tab.id} value={tab.id} className="text-xs flex items-center gap-1">
                  {IconComponent && <IconComponent className="h-3 w-3" />}
                  <span className="hidden sm:inline">{tab.label}</span>
                  <span className="sm:hidden">{tab.shortLabel || tab.label}</span>
                </TabsTrigger>
              );
            })}
          </TabsList>

          {visibleTabs.map(tab => (
            <TabsContent key={tab.id} value={tab.id}>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    {tab.icon && <tab.icon className="h-5 w-5" />}
                    {tab.label}
                  </CardTitle>
                  {tab.description && (
                    <p className="text-sm text-muted-foreground">{tab.description}</p>
                  )}
                </CardHeader>
                <CardContent>
                  {renderTabContent(tab)}
                </CardContent>
              </Card>
            </TabsContent>
          ))}
        </Tabs>
      )}

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm" onClick={onEdit}>
              <Edit className="h-4 w-4 mr-2" />
              Edit {config.displayName}
            </Button>
            
            {config.features?.hasPortraits && (
              <Button variant="outline" size="sm">
                <Camera className="h-4 w-4 mr-2" />
                Manage Portraits
              </Button>
            )}
            
            {config.features?.hasAIGeneration && (
              <Button variant="outline" size="sm">
                <config.icon className="h-4 w-4 mr-2" />
                AI Enhance
              </Button>
            )}
            
            {config.features?.hasRelationships && (
              <Button variant="outline" size="sm">
                <Share className="h-4 w-4 mr-2" />
                Relationships
              </Button>
            )}
            
            {config.features?.hasExport && (
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}