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
import { ORGANIZATION_SECTIONS } from '@/lib/organizationConfig';
import type { Organization } from '../../lib/types';

interface OrganizationFormExpandedProps {
  projectId: string;
  onCancel: () => void;
  organization?: Organization;
}

export function OrganizationFormExpanded({ projectId, onCancel, organization }: OrganizationFormExpandedProps) {
  const [formData, setFormData] = useState({
    // Identity
    name: organization?.name || '',
    type: organization?.type || '',
    description: organization?.description || '',
    mission: organization?.mission || '',
    vision: organization?.vision || '',
    
    // Purpose
    goals: organization?.goals || '',
    objectives: organization?.objectives || '',
    services: organization?.services || '',
    target_audience: organization?.target_audience || '',
    activities: organization?.activities || '',
    strategic_plan: organization?.strategic_plan || '',
    
    // Structure
    leadership: organization?.leadership || '',
    structure: organization?.structure || '',
    departments: organization?.departments || '',
    membership: organization?.membership || '',
    hierarchy: organization?.hierarchy || '',
    roles_responsibilities: organization?.roles_responsibilities || '',
    
    // Operations
    resources: organization?.resources || '',
    locations: organization?.locations || '',
    budget: organization?.budget || '',
    funding_sources: organization?.funding_sources || '',
    equipment: organization?.equipment || '',
    governance_model: organization?.governance_model || '',
    
    // Relations
    relationships: organization?.relationships || '',
    partnerships: organization?.partnerships || '',
    stakeholders: organization?.stakeholders || '',
    competitors: organization?.competitors || '',
    reputation: organization?.reputation || '',
    public_perception: organization?.public_perception || '',
    
    // History
    history: organization?.history || '',
    founding: organization?.founding || '',
    key_events: organization?.key_events || '',
    evolution: organization?.evolution || '',
    achievements: organization?.achievements || '',
    legacy: organization?.legacy || '',
    
    // Culture
    organizational_culture: organization?.organizational_culture || '',
    values: organization?.values || [],
    principles: organization?.principles || '',
    ethics: organization?.ethics || '',
    code_of_conduct: organization?.code_of_conduct || '',
    workplace_environment: organization?.workplace_environment || '',
    
    // Meta
    status: organization?.status || '',
    challenges: organization?.challenges || '',
    future_goals: organization?.future_goals || '',
    tags: organization?.tags || [],
    notes: organization?.notes || ''
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
      const endpoint = organization 
        ? `/api/organizations/${organization.id}`
        : `/api/projects/${projectId}/organizations`;
      
      const response = await fetch(endpoint, {
        method: organization ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...data,
          projectId,
          id: organization?.id || Date.now().toString() + Math.random().toString(36).substr(2, 5)
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to save organization');
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/projects', projectId, 'organizations'] });
      onCancel();
    },
  });

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await saveMutation.mutateAsync(formData);
    } catch (error) {
      console.error('Save error:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const renderField = (field: any) => {
    const value = formData[field.name as keyof typeof formData] || '';
    
    switch (field.type) {
      case 'text':
        return (
          <div key={field.name} className="space-y-2">
            <Label htmlFor={field.name}>{field.label}</Label>
            <Input
              id={field.name}
              value={value as string}
              onChange={(e) => handleInputChange(field.name, e.target.value)}
              placeholder={`Enter ${field.label.toLowerCase()}...`}
              className="creative-input"
            />
          </div>
        );
      
      case 'textarea':
        return (
          <div key={field.name} className="space-y-2">
            <Label htmlFor={field.name}>{field.label}</Label>
            <Textarea
              id={field.name}
              value={value as string}
              onChange={(e) => handleInputChange(field.name, e.target.value)}
              placeholder={`Enter ${field.label.toLowerCase()}...`}
              className="creative-input min-h-[100px] resize-y"
            />
          </div>
        );
      
      case 'select':
        return (
          <div key={field.name} className="space-y-2">
            <Label htmlFor={field.name}>{field.label}</Label>
            <Select 
              value={value as string} 
              onValueChange={(newValue) => handleInputChange(field.name, newValue)}
            >
              <SelectTrigger className="creative-input">
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
          </div>
        );
      
      case 'array':
        return (
          <div key={field.name} className="space-y-2">
            <Label htmlFor={field.name}>{field.label}</Label>
            <Input
              id={field.name}
              value={Array.isArray(value) ? value.join(', ') : ''}
              onChange={(e) => handleInputChange(field.name, e.target.value.split(',').map(s => s.trim()).filter(Boolean))}
              placeholder={`Enter ${field.label.toLowerCase()}, separated by commas...`}
              className="creative-input"
            />
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <Button 
            variant="ghost" 
            onClick={onCancel}
            className="flex items-center space-x-2"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Organizations</span>
          </Button>
        </div>
        <Button 
          onClick={handleSave}
          disabled={isSaving || !formData.name.trim()}
          className="interactive-warm"
        >
          <Save className="h-4 w-4 mr-2" />
          {isSaving ? 'Saving...' : 'Save Organization'}
        </Button>
      </div>

      {/* Title */}
      <div className="mb-8">
        <h1 className="font-title text-3xl mb-2">
          {organization ? 'Edit Organization' : 'Create New Organization'}
        </h1>
        <p className="text-muted-foreground">
          {organization ? 'Modify your organization details' : 'Add a new organization to your world'}
        </p>
      </div>

      {/* Form */}
      <Card className="creative-card">
        <div className="p-6">
          <Tabs defaultValue={ORGANIZATION_SECTIONS[0].title.toLowerCase()} className="w-full">
            <TabsList className="grid w-full grid-cols-8 mb-8">
              {ORGANIZATION_SECTIONS.map((section) => (
                <TabsTrigger 
                  key={section.title} 
                  value={section.title.toLowerCase()}
                  className="text-sm px-3 py-2 data-[state=active]:bg-accent data-[state=active]:text-accent-foreground border border-border/50 data-[state=active]:border-accent/50 bg-transparent hover:bg-accent/10 transition-colors"
                >
                  {section.title}
                </TabsTrigger>
              ))}
            </TabsList>

            {ORGANIZATION_SECTIONS.map((section) => (
              <TabsContent 
                key={section.title} 
                value={section.title.toLowerCase()}
                className="space-y-6 mt-6"
              >
                <div className="grid gap-6 md:grid-cols-2">
                  {section.fields.map(renderField)}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </Card>
    </div>
  );
}