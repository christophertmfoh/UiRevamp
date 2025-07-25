import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { ChevronLeft, Edit, Save, X } from 'lucide-react';
import { apiRequest } from '@/lib/queryClient';
import { ENTITY_CONFIGS, FIELD_CONFIGS } from '@/lib/config/entityConfig';
import { FieldRenderer } from './FieldRenderer';
import { FormSection } from './FormSection';
import type { BaseEntity, EntityType } from '@/lib/types';

interface EntityDetailViewProps {
  entityType: EntityType;
  projectId: string;
  entity: BaseEntity | null;
  isCreating?: boolean;
  onBack: () => void;
  onEdit?: (entity: BaseEntity) => void;
  onDelete?: (entity: BaseEntity) => void;
}

export function EntityDetailView({
  entityType,
  projectId,
  entity,
  isCreating = false,
  onBack,
  onEdit,
  onDelete
}: EntityDetailViewProps) {
  const [isEditing, setIsEditing] = useState(isCreating);
  const [formData, setFormData] = useState<Partial<BaseEntity>>(entity || {});
  const [activeTab, setActiveTab] = useState('overview');
  
  const queryClient = useQueryClient();
  const config = ENTITY_CONFIGS[entityType];
  const fieldConfig = FIELD_CONFIGS[entityType];
  
  // Reset form data when entity changes
  useEffect(() => {
    if (entity) {
      setFormData(entity);
    } else if (isCreating) {
      setFormData({ projectId });
    }
  }, [entity, isCreating, projectId]);

  // Create mutation
  const createMutation = useMutation({
    mutationFn: async (data: Partial<BaseEntity>) => {
      const response = await apiRequest('POST', `/api/projects/${projectId}/${config.apiEndpoint}`, data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/projects', projectId, config.apiEndpoint] });
      setIsEditing(false);
      onBack();
    },
  });

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: async (data: BaseEntity) => {
      const response = await apiRequest('PUT', `/api/${config.apiEndpoint}/${data.id}`, data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/projects', projectId, config.apiEndpoint] });
      setIsEditing(false);
    },
  });

  const handleSave = () => {
    if (isCreating) {
      createMutation.mutate(formData);
    } else if (entity) {
      updateMutation.mutate({ ...entity, ...formData } as BaseEntity);
    }
  };

  const handleCancel = () => {
    if (isCreating) {
      onBack();
    } else {
      setFormData(entity || {});
      setIsEditing(false);
    }
  };

  const handleFieldChange = (key: string, value: any) => {
    setFormData((prev: any) => ({ ...prev, [key]: value }));
  };

  // Calculate completeness
  const calculateCompleteness = (): number => {
    if (!fieldConfig?.sections) return 0;
    
    const allFields = fieldConfig.sections.flatMap((section: any) => section.fields);
    const filledFields = allFields.filter((field: any) => {
      const value = (formData as any)[field.key];
      if (field.type === 'array') {
        return Array.isArray(value) && value.length > 0;
      }
      return value && value.toString().trim() !== '';
    });
    
    return Math.round((filledFields.length / allFields.length) * 100);
  };

  const completeness = calculateCompleteness();

  // Organize sections into tabs
  const tabs = fieldConfig?.sections ? [
    { id: 'overview', label: 'Overview', sections: fieldConfig.sections.slice(0, 2) },
    { id: 'details', label: 'Details', sections: fieldConfig.sections.slice(2, 4) },
    { id: 'advanced', label: 'Advanced', sections: fieldConfig.sections.slice(4) }
  ].filter(tab => tab.sections.length > 0) : [];

  if (!config || !fieldConfig) {
    return (
      <div className="p-6 text-center">
        <p>Configuration not found for entity type: {entityType}</p>
        <Button onClick={onBack} className="mt-4">
          <ChevronLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100 dark:from-slate-900 dark:to-slate-800">
      {/* Enhanced Header with Hero Section */}
      <div className="relative overflow-hidden border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="absolute inset-0 bg-gradient-to-r from-amber-500/10 to-orange-500/10" />
        <div className="relative">
          {/* Top Navigation */}
          <div className="flex items-center justify-between p-6 border-b border-border/50">
            <Button variant="ghost" onClick={onBack} className="gap-2">
              <ChevronLeft className="h-4 w-4" />
              Back to {config.label}
            </Button>
            
            <div className="flex items-center gap-3">
              {!isCreating && (
                <Badge variant="outline" className="px-3 py-1 bg-background/50">
                  {completeness}% Complete
                </Badge>
              )}
              
              {isEditing ? (
                <div className="flex gap-2">
                  <Button
                    onClick={handleSave}
                    disabled={createMutation.isPending || updateMutation.isPending}
                    className="gap-2 bg-accent hover:bg-accent/90"
                  >
                    <Save className="h-4 w-4" />
                    {isCreating ? 'Create' : 'Save'}
                  </Button>
                  <Button variant="outline" onClick={handleCancel}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <div className="flex gap-2">
                  <Button onClick={() => setIsEditing(true)} className="gap-2 bg-accent hover:bg-accent/90">
                    <Edit className="h-4 w-4" />
                    Edit {config.singular}
                  </Button>
                  {/* Character-specific features */}
                  {entityType === 'character' && (
                    <Button variant="outline" className="gap-2">
                      <Sparkles className="h-4 w-4" />
                      Generate Portrait
                    </Button>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Hero Section */}
          <div className="p-6 pb-8">
            <div className="flex items-start gap-6">
              {/* Entity Portrait/Image */}
              <div className="flex-shrink-0">
                <div className="relative group">
                  <div className="w-32 h-32 rounded-lg bg-gradient-to-br from-accent/20 to-accent/40 border-2 border-accent/30 flex items-center justify-center overflow-hidden">
                    {formData.imageUrl ? (
                      <img 
                        src={formData.imageUrl} 
                        alt={formData.name || 'Entity image'}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <config.icon className="h-12 w-12 text-accent/60" />
                    )}
                  </div>
                  {isEditing && (
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 h-8 px-3 text-xs"
                    >
                      Upload
                    </Button>
                  )}
                </div>
              </div>

              {/* Entity Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-3xl font-bold text-foreground truncate">
                    {isCreating ? `Create New ${config.singular}` : (formData.name || `Unnamed ${config.singular}`)}
                  </h1>
                  <Badge variant="secondary" className="text-xs px-2 py-1">
                    {config.singular}
                  </Badge>
                </div>
                
                <p className="text-muted-foreground mb-4 line-clamp-2">
                  {isCreating 
                    ? `Add a new ${config.singular.toLowerCase()} to your world bible` 
                    : formData.description || `Manage this ${config.singular.toLowerCase()}'s details and information`
                  }
                </p>

                {/* Progress and Quick Stats */}
                {!isCreating && (
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-2 bg-background/50 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-accent transition-all duration-500"
                          style={{ width: `${completeness}%` }}
                        />
                      </div>
                      <span>{completeness}% Complete</span>
                    </div>
                    
                    {formData.updatedAt && (
                      <div className="flex items-center gap-1">
                        <span>Last updated:</span>
                        <span>{new Date(formData.updatedAt).toLocaleDateString()}</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Content with Professional Styling */}
      <div className="flex-1 overflow-hidden bg-background">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
          {/* Enhanced Tab Navigation */}
          <div className="border-b bg-background/50 backdrop-blur-sm">
            <div className="px-6 py-4">
              <TabsList className="grid w-full grid-cols-3 bg-background/80 border border-border/50">
                {tabs.map(tab => (
                  <TabsTrigger 
                    key={tab.id} 
                    value={tab.id}
                    className="data-[state=active]:bg-accent data-[state=active]:text-accent-foreground font-medium transition-all duration-200"
                  >
                    {tab.label}
                  </TabsTrigger>
                ))}
              </TabsList>
            </div>
          </div>

          {/* Enhanced Content Area */}
          <ScrollArea className="flex-1">
            <div className="p-6 space-y-6">
              {tabs.map(tab => (
                <TabsContent key={tab.id} value={tab.id} className="mt-0">
                  <div className="space-y-6">
                    {tab.sections.map((section: any) => (
                      <Card key={section.id} className="shadow-sm border-border/50 bg-card/50 backdrop-blur-sm">
                        <CardHeader className="pb-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center">
                              <config.icon className="h-4 w-4 text-accent" />
                            </div>
                            <div>
                              <CardTitle className="text-lg">{section.title}</CardTitle>
                              <CardDescription className="text-sm">{section.description}</CardDescription>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          {section.fields.map((field: any) => (
                            <FieldRenderer
                              key={field.key}
                              field={field}
                              value={formData[field.key]}
                              isEditing={isEditing}
                              onChange={(value: any) => handleFieldChange(field.key, value)}
                            />
                          ))}
                        </CardContent>
                      </Card>
                    ))}

                    {/* Character-specific features - only show for characters */}
                    {entityType === 'character' && activeTab === 'advanced' && (
                      <Card className="shadow-sm border-accent/20 bg-gradient-to-br from-accent/5 to-accent/10">
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2">
                            <Sparkles className="h-5 w-5 text-accent" />
                            Character-Specific Features
                          </CardTitle>
                          <CardDescription>
                            Advanced character development tools and insights
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="grid grid-cols-2 gap-4">
                            <Button variant="outline" className="justify-start gap-2 h-auto py-3">
                              <Eye className="h-4 w-4" />
                              <div className="text-left">
                                <div className="font-medium">Portrait Studio</div>
                                <div className="text-xs text-muted-foreground">Generate & manage images</div>
                              </div>
                            </Button>
                            <Button variant="outline" className="justify-start gap-2 h-auto py-3">
                              <Users className="h-4 w-4" />
                              <div className="text-left">
                                <div className="font-medium">Relationships</div>
                                <div className="text-xs text-muted-foreground">Character connections</div>
                              </div>
                            </Button>
                            <Button variant="outline" className="justify-start gap-2 h-auto py-3">
                              <Zap className="h-4 w-4" />
                              <div className="text-left">
                                <div className="font-medium">Character Arc</div>
                                <div className="text-xs text-muted-foreground">Story progression</div>
                              </div>
                            </Button>
                            <Button variant="outline" className="justify-start gap-2 h-auto py-3">
                              <FileText className="h-4 w-4" />
                              <div className="text-left">
                                <div className="font-medium">AI Insights</div>
                                <div className="text-xs text-muted-foreground">Character analysis</div>
                              </div>
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    )}
                  </div>
                </TabsContent>
              ))}
            </div>
          </ScrollArea>
        </Tabs>
      </div>
    </div>
  );
}