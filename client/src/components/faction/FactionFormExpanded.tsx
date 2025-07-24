import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Save, Shield, Target, Users, Zap, History, Settings } from 'lucide-react';
import { apiRequest } from '@/lib/queryClient';
import { FACTION_SECTIONS } from '@/lib/factionConfig';
import type { Faction } from '../../lib/types';

interface FactionFormExpandedProps {
  projectId: string;
  onCancel: () => void;
  faction?: Faction;
}

export function FactionFormExpanded({ projectId, onCancel, faction }: FactionFormExpandedProps) {
  const [formData, setFormData] = useState({
    // Identity
    name: faction?.name || '',
    type: faction?.type || '',
    description: faction?.description || '',
    ideology: faction?.ideology || '',
    
    // Goals & Methods
    goals: faction?.goals || '',
    methods: faction?.methods || '',
    methods_detailed: faction?.methods_detailed || '',
    corruption_techniques: faction?.corruption_techniques || '',
    
    // Organization
    leadership: faction?.leadership || '',
    structure: faction?.structure || '',
    recruitment: faction?.recruitment || '',
    key_figures: faction?.key_figures || '',
    
    // Power & Resources
    resources: faction?.resources || '',
    strongholds: faction?.strongholds || '',
    threat_level: faction?.threat_level || '',
    current_operations: faction?.current_operations || '',
    
    // Relations & History
    relationships: faction?.relationships || '',
    history: faction?.history || '',
    origin_story: faction?.origin_story || '',
    weaknesses: faction?.weaknesses || '',
    
    // Status & Meta
    status: faction?.status || '',
    tags: faction?.tags || []
  });

  const [isSaving, setIsSaving] = useState(false);
  const queryClient = useQueryClient();

  const handleInputChange = (field: string, value: string | string[]) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const saveMutation = useMutation({
    mutationFn: async (data: any) => {
      const endpoint = faction 
        ? `/api/projects/${projectId}/factions/${faction.id}`
        : `/api/projects/${projectId}/factions`;
      
      const response = await fetch(endpoint, {
        method: faction ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });
      
      if (!response.ok) {
        throw new Error('Failed to save faction');
      }
      
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/projects', projectId, 'factions'] });
      onCancel();
    }
  });

  const handleSave = () => {
    const cleanedData = { ...formData } as any;
    
    // Convert tags string to array if needed
    if (typeof cleanedData.tags === 'string') {
      cleanedData.tags = cleanedData.tags ? cleanedData.tags.split(',').map((tag: string) => tag.trim()) : [];
    }
    
    // Clean empty strings to prevent database errors
    Object.keys(cleanedData).forEach((key: string) => {
      if (cleanedData[key] === '') {
        delete cleanedData[key];
      }
    });

    saveMutation.mutate(cleanedData);
  };

  const renderField = (field: any) => {
    const value = formData[field.name as keyof typeof formData];
    
    switch (field.type) {
      case 'textarea':
        return (
          <Textarea
            value={value as string || ''}
            onChange={(e) => handleInputChange(field.name, e.target.value)}
            placeholder={`Enter ${field.label.toLowerCase()}...`}
            className="min-h-[100px]"
          />
        );
      
      case 'select':
        return (
          <Select
            value={value as string || ''}
            onValueChange={(newValue) => handleInputChange(field.name, newValue)}
          >
            <SelectTrigger>
              <SelectValue placeholder={`Select ${field.label.toLowerCase()}...`} />
            </SelectTrigger>
            <SelectContent>
              {field.options?.map((option: string) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );
      
      case 'array':
        return (
          <Input
            value={Array.isArray(value) ? value.join(', ') : value || ''}
            onChange={(e) => handleInputChange(field.name, e.target.value)}
            placeholder="Enter tags separated by commas..."
          />
        );
      
      default:
        return (
          <Input
            value={value as string || ''}
            onChange={(e) => handleInputChange(field.name, e.target.value)}
            placeholder={`Enter ${field.label.toLowerCase()}...`}
          />
        );
    }
  };

  const getSectionIcon = (title: string) => {
    switch (title) {
      case 'Identity': return Shield;
      case 'Goals & Methods': return Target;
      case 'Organization': return Users;
      case 'Power & Resources': return Zap;
      case 'Relations & History': return History;
      case 'Status & Meta': return Settings;
      default: return Shield;
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={onCancel}
            className="text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Factions
          </Button>
          <div>
            <h1 className="text-2xl font-bold">
              {faction ? `Edit ${faction.name}` : 'Create New Faction'}
            </h1>
            <p className="text-muted-foreground">
              {faction ? 'Modify faction details' : 'Add a new faction to your world'}
            </p>
          </div>
        </div>
        <Button 
          onClick={handleSave} 
          disabled={saveMutation.isPending || !formData.name}
          className="bg-accent hover:bg-accent/90"
        >
          <Save className="h-4 w-4 mr-2" />
          {saveMutation.isPending ? 'Saving...' : faction ? 'Save Changes' : 'Create Faction'}
        </Button>
      </div>

      {/* Form Content */}
      <Card className="p-6">
        <Tabs defaultValue="Identity" className="w-full">
          <TabsList className="grid w-full grid-cols-6">
            {FACTION_SECTIONS.map((section) => {
              const IconComponent = getSectionIcon(section.title);
              return (
                <TabsTrigger 
                  key={section.title} 
                  value={section.title}
                  className="flex items-center gap-2"
                >
                  <IconComponent className="h-4 w-4" />
                  <span className="hidden sm:inline">{section.title}</span>
                </TabsTrigger>
              );
            })}
          </TabsList>

          {FACTION_SECTIONS.map((section) => (
            <TabsContent key={section.title} value={section.title} className="space-y-6 mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {section.fields.map((field) => (
                  <div key={field.name} className={field.type === 'textarea' ? 'md:col-span-2' : ''}>
                    <Label htmlFor={field.name} className="text-sm font-medium">
                      {field.label}
                      {field.required && <span className="text-destructive ml-1">*</span>}
                    </Label>
                    <div className="mt-2">
                      {renderField(field)}
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </Card>
    </div>
  );
}