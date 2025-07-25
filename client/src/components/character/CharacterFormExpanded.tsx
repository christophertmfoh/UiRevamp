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
import { CHARACTER_SECTIONS } from '../../lib/config/fieldConfig';

interface CharacterFormExpandedProps {
  projectId: string;
  onCancel: () => void;
  character?: Character;
}

export function CharacterFormExpanded({ projectId, onCancel, character }: CharacterFormExpandedProps) {
  // Initialize form data with all fields from CHARACTER_SECTIONS
  const initializeFormData = () => {
    const initialData: any = {};
    
    CHARACTER_SECTIONS.forEach(section => {
      section.fields.forEach(field => {
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
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: async (data: any) => {
      return await apiRequest('POST', `/api/characters`, { ...data, projectId });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/characters'] });
      onCancel();
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (data: any) => {
      return await apiRequest('PUT', `/api/characters/${character!.id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/characters'] });
      onCancel();
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Process form data to handle arrays properly
    const processedData = { ...formData };
    
    CHARACTER_SECTIONS.forEach(section => {
      section.fields.forEach(field => {
        if (field.type === 'array' && typeof processedData[field.key] === 'string') {
          const value = processedData[field.key];
          processedData[field.key] = value
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

  const renderField = (field: any) => {
    const value = formData[field.key] || '';
    
    switch (field.type) {
      case 'textarea':
        return (
          <div key={field.key} className={field.rows && field.rows > 3 ? 'col-span-2' : ''}>
            <Label htmlFor={field.key}>{field.label}</Label>
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
            <Label htmlFor={field.key}>{field.label} (comma-separated)</Label>
            <Input
              id={field.key}
              type="text"
              value={value}
              onChange={(e) => updateField(field.key, e.target.value)}
              placeholder={field.placeholder}
            />
          </div>
        );
      
      default: // 'text'
        return (
          <div key={field.key}>
            <Label htmlFor={field.key}>{field.label}</Label>
            <Input
              id={field.key}
              type="text"
              value={value}
              onChange={(e) => updateField(field.key, e.target.value)}
              placeholder={field.placeholder}
            />
          </div>
        );
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={onCancel}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-2xl font-bold">
          {character ? 'Edit Character' : 'Create Character'}
        </h1>
      </div>

      <form onSubmit={handleSubmit}>
        <Tabs defaultValue={CHARACTER_SECTIONS[0]?.id} className="space-y-6">
          <TabsList className="grid w-full grid-cols-6">
            {CHARACTER_SECTIONS.map((section) => (
              <TabsTrigger key={section.id} value={section.id} className="text-xs">
                {section.title}
              </TabsTrigger>
            ))}
          </TabsList>

          {CHARACTER_SECTIONS.map((section) => (
            <TabsContent key={section.id} value={section.id}>
              <Card className="p-6">
                <div className="mb-6">
                  <h2 className="text-xl font-semibold mb-2">{section.title}</h2>
                  <p className="text-muted-foreground">{section.description}</p>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  {section.fields.map(renderField)}
                </div>
              </Card>
            </TabsContent>
          ))}
        </Tabs>

        {/* Footer */}
        <div className="flex justify-end gap-4 mt-6">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button 
            type="submit" 
            disabled={createMutation.isPending || updateMutation.isPending}
          >
            <Save className="h-4 w-4 mr-2" />
            {character ? 'Update Character' : 'Create Character'}
          </Button>
        </div>
      </form>
    </div>
  );
}