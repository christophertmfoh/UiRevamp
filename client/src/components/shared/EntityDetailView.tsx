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
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex items-center justify-between p-6">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={onBack}>
              <ChevronLeft className="h-4 w-4 mr-2" />
              Back to {config.label}
            </Button>
            <Separator orientation="vertical" className="h-6" />
            <div>
              <h1 className="text-2xl font-bold">
                {isCreating ? `Create New ${config.singular}` : (formData.name || 'Unnamed Entity')}
              </h1>
              <p className="text-muted-foreground">
                {isCreating ? `Add a new ${config.singular.toLowerCase()} to your world` : `Manage this ${config.singular.toLowerCase()}`}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            {!isCreating && (
              <Badge variant="outline" className="px-3 py-1">
                {completeness}% Complete
              </Badge>
            )}
            
            {isEditing ? (
              <div className="flex gap-2">
                <Button
                  onClick={handleSave}
                  disabled={createMutation.isPending || updateMutation.isPending}
                  className="gap-2"
                >
                  <Save className="h-4 w-4" />
                  {isCreating ? 'Create' : 'Save'}
                </Button>
                <Button variant="outline" onClick={handleCancel}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <Button onClick={() => setIsEditing(true)} className="gap-2">
                <Edit className="h-4 w-4" />
                Edit
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-hidden">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
          <div className="border-b px-6 py-3">
            <TabsList className="grid w-full grid-cols-3">
              {tabs.map(tab => (
                <TabsTrigger key={tab.id} value={tab.id}>
                  {tab.label}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>

          <ScrollArea className="flex-1">
            <div className="p-6">
              {tabs.map(tab => (
                <TabsContent key={tab.id} value={tab.id} className="mt-0">
                  <div className="space-y-6">
                    {tab.sections.map((section: any) => (
                      <FormSection
                        key={section.id}
                        section={section}
                        formData={formData}
                        isEditing={isEditing}
                        onFieldChange={handleFieldChange}
                      />
                    ))}
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