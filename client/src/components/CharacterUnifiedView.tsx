import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, Edit, Save, X, User, Eye, Brain, Zap, BookOpen, Users, PenTool } from 'lucide-react';
import { apiRequest } from '@/lib/queryClient';
import type { Character } from '../lib/types';
import { CHARACTER_SECTIONS } from '../lib/characterFieldsConfig';

interface CharacterUnifiedViewProps {
  projectId: string;
  character: Character;
  onBack: () => void;
  onDelete: (character: Character) => void;
}

// Icon mapping for dynamic icon rendering
const ICON_COMPONENTS = {
  User,
  Eye,
  Brain,
  Zap,
  BookOpen,
  Users,
  PenTool,
};

export function CharacterUnifiedView({ 
  projectId,
  character, 
  onBack, 
  onDelete 
}: CharacterUnifiedViewProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(character);
  const [activeTab, setActiveTab] = useState('identity');
  const queryClient = useQueryClient();

  // Save mutation
  const saveMutation = useMutation({
    mutationFn: async (data: Character) => {
      return await apiRequest('PUT', `/api/characters/${character.id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/projects', projectId, 'characters'] });
      setIsEditing(false);
    },
    onError: (error) => {
      console.error('Failed to save character:', error);
    }
  });

  const handleSave = () => {
    saveMutation.mutate(formData);
  };

  const handleCancel = () => {
    setFormData(character); // Reset form data
    setIsEditing(false);
  };

  const handleInputChange = (field: string, value: string | string[]) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Helper function to render a field
  const renderField = (field: any, value: string | undefined) => {
    if (!isEditing) {
      // View mode - only show if has content
      if (!value || value.trim().length === 0) return null;
      return (
        <div>
          <h4 className="font-semibold mb-2 text-foreground">{field.label}</h4>
          <p className="text-muted-foreground leading-relaxed whitespace-pre-line">{value.trim()}</p>
        </div>
      );
    } else {
      // Edit mode - show input field
      if (field.type === 'textarea') {
        return (
          <div>
            <Label htmlFor={field.key}>{field.label}</Label>
            <Textarea
              id={field.key}
              value={value || ''}
              onChange={(e) => handleInputChange(field.key, e.target.value)}
              placeholder={field.placeholder}
              rows={field.rows || 3}
              className="creative-input"
            />
          </div>
        );
      } else {
        return (
          <div>
            <Label htmlFor={field.key}>{field.label}</Label>
            <Input
              id={field.key}
              value={value || ''}
              onChange={(e) => handleInputChange(field.key, e.target.value)}
              placeholder={field.placeholder}
              className="creative-input"
            />
          </div>
        );
      }
    }
  };

  // Helper function to render array fields
  const renderArrayField = (field: any, values: string[] | undefined) => {
    if (!isEditing) {
      // View mode - show as badges
      if (!values?.length || !values.some(v => v?.trim())) return null;
      
      let processedValues: string[] = [];
      if (typeof values === 'string') {
        processedValues = values.split(',').map(v => v.trim()).filter(v => v);
      } else if (Array.isArray(values)) {
        processedValues = values.filter(v => v?.trim());
      }
      
      if (processedValues.length === 0) return null;
      
      return (
        <div>
          <h4 className="font-semibold mb-2 text-foreground">{field.label}</h4>
          <div className="flex flex-wrap gap-2">
            {processedValues.map((value, index) => (
              <Badge key={index} variant="outline" className="text-sm">
                {value.trim()}
              </Badge>
            ))}
          </div>
        </div>
      );
    } else {
      // Edit mode - show as comma-separated input
      const stringValue = Array.isArray(values) ? values.join(', ') : values || '';
      return (
        <div>
          <Label htmlFor={field.key}>{field.label}</Label>
          <Input
            id={field.key}
            value={stringValue}
            onChange={(e) => {
              const arrayValue = e.target.value.split(',').map(v => v.trim()).filter(v => v);
              handleInputChange(field.key, arrayValue);
            }}
            placeholder={field.placeholder}
            className="creative-input"
          />
        </div>
      );
    }
  };

  // Render tab content with grid layout like the original editor
  const renderTabContent = (sectionId: string) => {
    const section = CHARACTER_SECTIONS.find(s => s.id === sectionId);
    if (!section) return null;

    return (
      <div className="space-y-6">
        {section.fields.map((field, index) => {
          const value = (formData as any)[field.key];
          
          if (field.type === 'array') {
            return (
              <div key={field.key}>
                {renderArrayField(field, value)}
              </div>
            );
          } else {
            return (
              <div key={field.key}>
                {renderField(field, value)}
              </div>
            );
          }
        })}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={onBack} className="gap-2">
          <ArrowLeft className="h-4 w-4" />
          Back to Characters
        </Button>
        <div className="flex gap-2">
          {!isEditing ? (
            <>
              <Button onClick={() => setIsEditing(true)} className="interactive-warm gap-2">
                <Edit className="h-4 w-4" />
                Edit Character
              </Button>
              <Button 
                variant="destructive" 
                onClick={() => onDelete(character)}
                className="gap-2"
              >
                <X className="h-4 w-4" />
                Delete
              </Button>
            </>
          ) : (
            <>
              <Button 
                onClick={handleSave} 
                disabled={saveMutation.isPending}
                className="interactive-warm gap-2"
              >
                <Save className="h-4 w-4" />
                {saveMutation.isPending ? 'Saving...' : 'Save Character'}
              </Button>
              <Button onClick={handleCancel} variant="outline" className="gap-2">
                <X className="h-4 w-4" />
                Cancel
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Character Header Card */}
      <Card className="creative-card">
        <CardContent className="p-6">
          <div className="flex items-start gap-6">
            {/* Character Image */}
            <div className="w-32 h-32 rounded-xl bg-gradient-to-br from-amber-100 to-orange-200 dark:from-amber-900/30 dark:to-orange-900/30 flex items-center justify-center flex-shrink-0">
              {character.imageUrl ? (
                <img 
                  src={character.imageUrl} 
                  alt={character.name}
                  className="w-full h-full object-cover rounded-xl"
                />
              ) : (
                <User className="h-16 w-16 text-amber-600 dark:text-amber-400" />
              )}
            </div>

            {/* Character Basic Info */}
            <div className="flex-1">
              <h1 className="font-title text-3xl mb-2">
                {formData.name || 'Unnamed Character'}
              </h1>
              
              {formData.title && (
                <p className="text-lg text-muted-foreground mb-3 italic">"{formData.title}"</p>
              )}
              
              <div className="flex flex-wrap gap-2 mb-4">
                {formData.role && (
                  <Badge variant="default" className="text-sm px-3 py-1">
                    {formData.role}
                  </Badge>
                )}
                {formData.race && (
                  <Badge variant="secondary" className="text-sm">
                    {formData.race}
                  </Badge>
                )}
                {formData.class && (
                  <Badge variant="outline" className="text-sm">
                    {formData.class}
                  </Badge>
                )}
                {formData.age && (
                  <Badge variant="outline" className="text-sm">
                    Age {formData.age}
                  </Badge>
                )}
                {formData.occupation && (
                  <Badge variant="outline" className="text-sm">
                    {formData.occupation}
                  </Badge>
                )}
              </div>

              {formData.oneLine && (
                <p className="text-lg italic text-muted-foreground mb-3">
                  "{formData.oneLine}"
                </p>
              )}
              
              {formData.description && (
                <p className="text-lg text-muted-foreground leading-relaxed">
                  {formData.description}
                </p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabbed Editor/Viewer Interface */}
      <Card className="creative-card">
        <CardContent className="p-6">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-8">
              {CHARACTER_SECTIONS.map(section => {
                const IconComponent = ICON_COMPONENTS[section.icon as keyof typeof ICON_COMPONENTS] || User;
                return (
                  <TabsTrigger 
                    key={section.id} 
                    value={section.id}
                    className="flex items-center gap-2 text-xs"
                  >
                    <IconComponent className="h-4 w-4" />
                    <span className="hidden sm:inline">{section.title}</span>
                  </TabsTrigger>
                );
              })}
            </TabsList>
            
            {CHARACTER_SECTIONS.map(section => (
              <TabsContent key={section.id} value={section.id} className="mt-6">
                <div className="space-y-4">
                  <div className="border-b pb-2">
                    <h3 className="text-lg font-semibold">{section.title}</h3>
                    <p className="text-sm text-muted-foreground">{section.description}</p>
                  </div>
                  {renderTabContent(section.id)}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}