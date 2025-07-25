import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Save } from 'lucide-react';
import { apiRequest } from '@/lib/queryClient';
import type { Character } from '../../lib/types';
import { CHARACTER_SECTIONS, getFieldsBySection } from '../../lib/config/fieldConfig';
import { FieldAIAssist } from './FieldAIAssist';

interface CharacterFormExpandedProps {
  projectId: string;
  onCancel: () => void;
  character?: Character;
}

const AI_ENABLED_FIELD_TYPES = ['text', 'textarea', 'array'];

export function CharacterFormExpanded({ projectId, onCancel, character }: CharacterFormExpandedProps) {
  // Initialize form data with all fields from CHARACTER_SECTIONS
  const initializeFormData = () => {
    const initialData: any = {};
    
    CHARACTER_SECTIONS.forEach(section => {
      const sectionFields = getFieldsBySection(section.id);
      sectionFields.forEach(field => {
        const value = (character as any)?.[field.key];
        if (field.type === 'array') {
          initialData[field.key] = Array.isArray(value) ? value.join(', ') : '';
        } else {
          initialData[field.key] = value || '';
        }
      });
    });
    
    return initialData;
  };

  const [formData, setFormData] = useState(initializeFormData);
  const [isEnhancing, setIsEnhancing] = useState(false);
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await fetch(`/api/projects/${projectId}/characters`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (!response.ok) throw new Error('Failed to create character');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/projects', projectId, 'characters'] });
      onCancel();
    }
  });

  const updateMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await fetch(`/api/characters/${character?.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (!response.ok) throw new Error('Failed to update character');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/projects', projectId, 'characters'] });
      onCancel();
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const processedData = {
      projectId,
      ...formData,
      isModelTrained: false,
      imageUrl: '',
    };

    // Process array fields
    CHARACTER_SECTIONS.forEach(section => {
      const sectionFields = getFieldsBySection(section.id);
      sectionFields.forEach(field => {
        if (field.type === 'array') {
          const value = formData[field.key];
          processedData[field.key] = typeof value === 'string' 
            ? value.split(',').map((s: string) => s.trim()).filter(Boolean)
            : [];
        }
      });
    });

    if (character) {
      updateMutation.mutate(processedData);
    } else {
      const newCharacterData = {
        ...processedData,
        id: Date.now().toString(),
      };
      createMutation.mutate(newCharacterData);
    }
  };

  const updateField = (field: string, value: string) => {
    setFormData((prev: any) => ({ ...prev, [field]: value }));
  };

  // Helper function to check if field should show AI assist
  const shouldShowAIAssist = (field: any, sectionId: string) => {
    if (!character) return false;
    return AI_ENABLED_FIELD_TYPES.includes(field.type);
  };

  const renderField = (field: any, sectionId: string) => {
    const value = formData[field.key] || '';
    
    switch (field.type) {
      case 'textarea':
        return (
          <div key={field.key} className={field.rows && field.rows > 3 ? 'col-span-2' : ''}>
            <div className="flex items-center justify-between mb-2">
              <Label htmlFor={field.key}>{field.label}</Label>
              {shouldShowAIAssist(field, sectionId) && (
                <FieldAIAssist
                  character={character}
                  fieldKey={field.key}
                  fieldLabel={field.label}
                  currentValue={value}
                  onFieldUpdate={(newValue) => updateField(field.key, newValue)}
                  disabled={isEnhancing}
                />
              )}
            </div>
            <Textarea
              id={field.key}
              value={value}
              onChange={(e) => updateField(field.key, e.target.value)}
              placeholder={field.placeholder}
              rows={field.rows || 3}
            />
          </div>
        );
      
      case 'select':
        return (
          <div key={field.key}>
            <Label htmlFor={field.key}>{field.label}</Label>
            <Select value={value} onValueChange={(val) => updateField(field.key, val)}>
              <SelectTrigger>
                <SelectValue placeholder={field.placeholder} />
              </SelectTrigger>
              <SelectContent>
                {field.options?.map((option: string) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        );
      
      case 'array':
        return (
          <div key={field.key} className="col-span-2">
            <div className="flex items-center justify-between mb-2">
              <Label htmlFor={field.key}>{field.label} (comma-separated)</Label>
              {shouldShowAIAssist(field, sectionId) && (
                <FieldAIAssist
                  character={character}
                  fieldKey={field.key}
                  fieldLabel={field.label}
                  currentValue={value}
                  onFieldUpdate={(newValue) => updateField(field.key, newValue)}
                  disabled={isEnhancing}
                />
              )}
            </div>
            <Input
              id={field.key}
              value={value}
              onChange={(e) => updateField(field.key, e.target.value)}
              placeholder={field.placeholder}
            />
          </div>
        );
      
      default: // text
        return (
          <div key={field.key}>
            <div className="flex items-center justify-between mb-2">
              <Label htmlFor={field.key}>{field.label}</Label>
              {shouldShowAIAssist(field, sectionId) && (
                <FieldAIAssist
                  character={character}
                  fieldKey={field.key}
                  fieldLabel={field.label}
                  currentValue={value}
                  onFieldUpdate={(newValue) => updateField(field.key, newValue)}
                  disabled={isEnhancing}
                  fieldOptions={field.options}
                />
              )}
            </div>
            <Input
              id={field.key}
              value={value}
              onChange={(e) => updateField(field.key, e.target.value)}
              placeholder={field.placeholder}
            />
          </div>
        );
    }
  };

  const isLoading = createMutation.isPending || updateMutation.isPending;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={onCancel} className="gap-2">
          <ArrowLeft className="h-4 w-4" />
          Back to Characters
        </Button>
        <div className="flex gap-2">
          <Button 
            type="submit" 
            onClick={handleSubmit}
            disabled={isLoading}
            className="interactive-warm gap-2"
          >
            <Save className="h-4 w-4" />
            {isLoading ? 'Saving...' : 'Save Character'}
          </Button>
        </div>
      </div>

      <Card className="creative-card">
        <div className="p-6">
          <h1 className="font-title text-3xl mb-6">
            {character ? 'Edit Character' : 'Create New Character'}
          </h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            <Tabs defaultValue="identity" className="w-full">
              <TabsList className="grid w-full grid-cols-8 gap-1 bg-transparent">
                {CHARACTER_SECTIONS.map(section => (
                  <TabsTrigger 
                    key={section.id}
                    value={section.id}
                    className="rounded-lg border border-border/50 px-3 py-2 text-sm font-medium transition-all hover:border-border data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:border-primary shadow-sm"
                  >
                    {section.title}
                  </TabsTrigger>
                ))}
              </TabsList>

              {CHARACTER_SECTIONS.map(section => (
                <TabsContent key={section.id} value={section.id} className="space-y-6">
                  <div className="space-y-4">
                    <div className="mb-4">
                      <h3 className="text-lg font-semibold">{section.title}</h3>
                      <p className="text-sm text-muted-foreground">{section.description}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      {getFieldsBySection(section.id).map(field => renderField(field, section.id))}
                    </div>
                  </div>
                </TabsContent>
              ))}
            </Tabs>
          </form>
        </div>
      </Card>
    </div>
  );
}