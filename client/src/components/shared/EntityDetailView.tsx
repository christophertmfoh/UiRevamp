import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Edit, Save, X, User, Eye, Brain, Zap, BookOpen, Users, PenTool, Camera, Trash2, Sparkles, Plus } from 'lucide-react';
import { apiRequest } from '@/lib/queryClient';
import type { Character } from '../../lib/types';
import { FieldConfigManager, ENTITY_SECTIONS, SECTION_NAMES } from '../../lib/config/baseFieldConfig';
import { CharacterFormExpanded } from '../character/CharacterFormExpanded';
import { CharacterUnifiedViewPremium } from '../character/CharacterUnifiedViewPremium';
import { CharacterGuidedCreation } from '../character/CharacterGuidedCreation';

interface EntityDetailViewProps {
  projectId: string;
  entity: Character | null;
  entityType: 'character' | 'creature' | 'location' | 'faction' | 'item' | 'organization' | 'magic-system' | 'timeline-event' | 'language' | 'culture' | 'prophecy' | 'theme';
  isCreating?: boolean;
  isGuidedCreation?: boolean;
  onBack: () => void;
  onEdit: (entity: Character) => void;
  onDelete: (entity: Character) => void;
}

export function EntityDetailView({ 
  projectId, 
  entity, 
  entityType,
  isCreating = false,
  isGuidedCreation = false,
  onBack, 
  onEdit, 
  onDelete 
}: EntityDetailViewProps) {
  const [isEditing, setIsEditing] = useState(isCreating && !isGuidedCreation);
  const [formData, setFormData] = useState<any>(entity || {});
  const [activeTab, setActiveTab] = useState('identity');
  const queryClient = useQueryClient();

  // For characters, use the existing specialized components
  if (entityType === 'character') {
    const character = entity as Character;
    
    // If we're doing guided creation, show the guided flow
    if (isGuidedCreation || (isCreating && !character)) {
      return (
        <CharacterGuidedCreation
          projectId={projectId}
          character={character || undefined}
          onCancel={onBack}
          onComplete={(savedCharacter) => {
            setIsEditing(false);
            onEdit(savedCharacter);
          }}
        />
      );
    }

    // If we're creating with existing data, show the form
    if (isCreating || !character) {
      return (
        <CharacterFormExpanded
          projectId={projectId}
          character={character || undefined}
          onCancel={onBack}
        />
      );
    }

    // If we're editing an existing character, show the form
    if (isEditing) {
      return (
        <CharacterFormExpanded
          projectId={projectId}
          character={character}
          onCancel={() => setIsEditing(false)}
        />
      );
    }

    // Use the premium unified view for characters
    return (
      <CharacterUnifiedViewPremium
        projectId={projectId}
        character={character}
        onBack={onBack}
        onDelete={onDelete}
      />
    );
  }

  // For other entity types, use dynamic rendering
  const entityFields = FieldConfigManager.getFieldsForEntity(entityType);
  const entitySections = ENTITY_SECTIONS[entityType] || ['identity', 'meta'];
  
  // Get entity type display name
  const getEntityDisplayName = (type: string) => {
    return type.charAt(0).toUpperCase() + type.slice(1).replace('-', ' ');
  };

  const saveMutation = useMutation({
    mutationFn: async (data: any) => {
      const endpoint = entity?.id 
        ? `/api/${entityType}s/${entity.id}` 
        : `/api/projects/${projectId}/${entityType}s`;
      const method = entity?.id ? 'PUT' : 'POST';
      return await apiRequest(method, endpoint, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/projects', projectId, `${entityType}s`] });
      setIsEditing(false);
    },
    onError: (error) => {
      console.error(`Failed to save ${entityType}:`, error);
    }
  });

  const handleSave = () => {
    saveMutation.mutate(formData);
  };

  const handleCancel = () => {
    setFormData(entity || {});
    setIsEditing(false);
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev: any) => ({ ...prev, [field]: value }));
  };

  const renderField = (field: any) => {
    const value = formData[field.key] || '';
    
    if (!isEditing) {
      // Display mode
      if (field.type === 'array' || field.type === 'tags') {
        const arrayValue = Array.isArray(value) ? value : (typeof value === 'string' ? value.split(',').map((s: string) => s.trim()).filter(Boolean) : []);
        if (arrayValue.length === 0) {
          return <p className="text-muted-foreground italic">No {field.label.toLowerCase()} added yet</p>;
        }
        return (
          <div className="flex flex-wrap gap-1">
            {arrayValue.map((item: string, index: number) => (
              <Badge key={index} variant="outline" className="bg-accent/5 text-accent/80">
                {item}
              </Badge>
            ))}
          </div>
        );
      }
      
      if (!value) {
        return <p className="text-muted-foreground italic">No {field.label.toLowerCase()} added yet</p>;
      }
      
      return <p className="text-foreground whitespace-pre-wrap">{value}</p>;
    }

    // Edit mode
    if (field.type === 'textarea') {
      return (
        <Textarea
          value={value}
          onChange={(e) => handleInputChange(field.key, e.target.value)}
          placeholder={field.placeholder}
          rows={3}
        />
      );
    }
    
    if (field.type === 'select' && field.options) {
      return (
        <Select value={value} onValueChange={(val) => handleInputChange(field.key, val)}>
          <SelectTrigger>
            <SelectValue placeholder={field.placeholder} />
          </SelectTrigger>
          <SelectContent>
            {field.options.map((option: string) => (
              <SelectItem key={option} value={option}>
                {option}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      );
    }
    
    if (field.type === 'array' || field.type === 'tags') {
      const arrayValue = Array.isArray(value) ? value.join(', ') : value;
      return (
        <Input
          value={arrayValue}
          onChange={(e) => handleInputChange(field.key, e.target.value.split(',').map((s: string) => s.trim()).filter(Boolean))}
          placeholder={field.placeholder || `Add ${field.label.toLowerCase()}, separated by commas`}
        />
      );
    }
    
    return (
      <Input
        value={value}
        onChange={(e) => handleInputChange(field.key, e.target.value)}
        placeholder={field.placeholder}
      />
    );
  };

  return (
    <div className="min-h-full bg-gradient-to-br from-background via-background/98 to-accent/5">
      {/* Header */}
      <div className="border-b border-border/30 bg-background/95 backdrop-blur-xl sticky top-0 z-20 shadow-sm">
        <div className="flex items-center justify-between p-6">
          <div className="flex items-center gap-4">
            <Button 
              onClick={onBack} 
              variant="ghost" 
              size="sm"
              className="gap-2 hover:bg-accent/10 hover:text-accent transition-all duration-200"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to {getEntityDisplayName(entityType)}s
            </Button>
          </div>
          
          <div className="flex items-center gap-3">
            {isEditing ? (
              <>
                <Button 
                  onClick={handleCancel} 
                  variant="outline" 
                  size="sm"
                  disabled={saveMutation.isPending}
                  className="gap-2"
                >
                  <X className="h-4 w-4" />
                  Cancel
                </Button>
                <Button 
                  onClick={() => onDelete(entity!)} 
                  variant="outline" 
                  size="sm"
                  disabled={saveMutation.isPending}
                  className="gap-2 border-red-300/50 hover:bg-red-50 hover:text-red-600"
                >
                  <Trash2 className="h-4 w-4" />
                  Delete
                </Button>
                <Button 
                  onClick={handleSave} 
                  size="sm"
                  disabled={saveMutation.isPending}
                  className="gap-2 bg-gradient-to-r from-accent to-accent/80"
                >
                  {saveMutation.isPending ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-accent-foreground" />
                  ) : (
                    <Save className="h-4 w-4" />
                  )}
                  {saveMutation.isPending ? 'Saving...' : 'Save Changes'}
                </Button>
              </>
            ) : (
              <>
                <Button 
                  onClick={() => setIsEditing(true)} 
                  variant="outline" 
                  size="sm"
                  className="gap-2"
                >
                  <Edit className="h-4 w-4" />
                  Edit {getEntityDisplayName(entityType)}
                </Button>
                <Button 
                  onClick={() => onDelete(entity!)} 
                  variant="outline" 
                  size="sm"
                  className="gap-2 border-red-300/50 hover:bg-red-50 hover:text-red-600"
                >
                  <Trash2 className="h-4 w-4" />
                  Delete
                </Button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="p-8 border-b border-border/20">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-start gap-8">
            {/* Entity Icon/Image */}
            <div className="w-48 h-64 rounded-3xl bg-gradient-to-br from-accent/10 via-muted/20 to-accent/15 border border-accent/20 shadow-xl overflow-hidden">
              {formData.imageUrl ? (
                <img 
                  src={formData.imageUrl} 
                  alt={formData.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-16 h-16 mx-auto mb-4 bg-accent/20 rounded-full flex items-center justify-center">
                      <User className="h-8 w-8 text-accent/60" />
                    </div>
                    <p className="text-sm text-muted-foreground font-medium">No image</p>
                  </div>
                </div>
              )}
            </div>

            {/* Entity Info */}
            <div className="flex-1 space-y-6">
              <div>
                <div className="flex items-center gap-4 mb-2">
                  <h1 className="text-4xl font-bold text-foreground">
                    {isEditing ? (
                      <Input
                        value={formData.name || ''}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                        placeholder={`${getEntityDisplayName(entityType)} Name`}
                        className="text-4xl font-bold bg-transparent border-none p-0 m-0 h-auto shadow-none focus-visible:ring-0 text-foreground"
                      />
                    ) : (
                      formData.name || `Unnamed ${getEntityDisplayName(entityType)}`
                    )}
                  </h1>
                  <Badge className="bg-accent text-accent-foreground font-semibold text-sm px-4 py-2 shadow-sm border border-accent/20">
                    {getEntityDisplayName(entityType)}
                  </Badge>
                </div>
                
                {formData.description && (
                  <div className="mb-4">
                    {isEditing ? (
                      <Textarea
                        value={formData.description}
                        onChange={(e) => handleInputChange('description', e.target.value)}
                        placeholder="Description"
                        rows={3}
                      />
                    ) : (
                      <p className="text-lg text-muted-foreground">{formData.description}</p>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content Tabs */}
      <div className="max-w-7xl mx-auto p-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-auto gap-2 mb-8 bg-muted/50 p-2 rounded-lg">
            {entitySections.map((sectionId) => (
              <TabsTrigger 
                key={sectionId} 
                value={sectionId} 
                className="flex items-center gap-2 px-4 py-2"
              >
                {SECTION_NAMES[sectionId] || sectionId}
              </TabsTrigger>
            ))}
          </TabsList>

          {entitySections.map((sectionId) => {
            const sectionFields = FieldConfigManager.getFieldsBySection(entityType, sectionId);
            
            return (
              <TabsContent key={sectionId} value={sectionId} className="space-y-6">
                <div className="grid gap-6">
                  {sectionFields.map((field) => (
                    <Card key={field.key}>
                      <CardHeader>
                        <CardTitle className="text-lg font-semibold">
                          {field.label}
                          {field.required && <span className="text-red-500 ml-1">*</span>}
                        </CardTitle>
                        {field.helpText && (
                          <p className="text-sm text-muted-foreground">{field.helpText}</p>
                        )}
                      </CardHeader>
                      <CardContent>
                        {renderField(field)}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            );
          })}
        </Tabs>
      </div>
    </div>
  );
}