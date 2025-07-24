import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, Save } from 'lucide-react';
import { apiRequest } from '@/lib/queryClient';
import type { Organization } from '@/lib/types';

interface OrganizationFormProps {
  projectId: string;
  onCancel: () => void;
  organization?: Organization;
}

export function OrganizationForm({ projectId, onCancel, organization }: OrganizationFormProps) {
  const [formData, setFormData] = useState({
    name: organization?.name || '',
    type: organization?.type || '',
    description: organization?.description || '',
    goals: organization?.goals || '',
    methods: organization?.methods || '',
    leadership: organization?.leadership || '',
    structure: organization?.structure || '',
    resources: organization?.resources || '',
    relationships: organization?.relationships || '',
    status: organization?.status || '',
    tags: organization?.tags?.join(', ') || '',
  });

  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: (organizationData: any) => 
      apiRequest('POST', `/api/projects/${projectId}/organizations`, organizationData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/projects', projectId, 'organizations'] });
      onCancel();
    },
  });

  const updateMutation = useMutation({
    mutationFn: (organizationData: any) => 
      apiRequest('PUT', `/api/organizations/${organization?.id}`, organizationData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/projects', projectId, 'organizations'] });
      onCancel();
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const processedData = {
      name: formData.name,
      type: formData.type,
      description: formData.description,
      goals: formData.goals,
      methods: formData.methods,
      leadership: formData.leadership,
      structure: formData.structure,
      resources: formData.resources,
      relationships: formData.relationships,
      status: formData.status,
      tags: formData.tags.split(',').map(s => s.trim()).filter(Boolean),
    };

    if (organization) {
      updateMutation.mutate(processedData);
    } else {
      createMutation.mutate(processedData);
    }
  };

  const updateField = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const isLoading = createMutation.isPending || updateMutation.isPending;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={onCancel} className="gap-2">
          <ArrowLeft className="h-4 w-4" />
          Back to Organizations
        </Button>
        <div className="flex gap-2">
          <Button 
            type="submit" 
            onClick={handleSubmit}
            disabled={isLoading}
            className="gap-2"
          >
            <Save className="h-4 w-4" />
            {isLoading ? 'Saving...' : 'Save Organization'}
          </Button>
        </div>
      </div>

      <Card className="p-6">
        <h1 className="font-title text-3xl mb-6">
          {organization ? 'Edit Organization' : 'Create New Organization'}
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => updateField('name', e.target.value)}
                required
                placeholder="Enter organization name..."
              />
            </div>

            <div>
              <Label htmlFor="type">Type</Label>
              <Input
                id="type"
                value={formData.type}
                onChange={(e) => updateField('type', e.target.value)}
                placeholder="e.g., Guild, Corporation, Government..."
              />
            </div>
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => updateField('description', e.target.value)}
              placeholder="Describe the organization..."
              rows={4}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="goals">Goals</Label>
              <Textarea
                id="goals"
                value={formData.goals}
                onChange={(e) => updateField('goals', e.target.value)}
                placeholder="What does this organization aim to achieve..."
                rows={3}
              />
            </div>

            <div>
              <Label htmlFor="methods">Methods</Label>
              <Textarea
                id="methods"
                value={formData.methods}
                onChange={(e) => updateField('methods', e.target.value)}
                placeholder="How do they operate and achieve their goals..."
                rows={3}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="leadership">Leadership</Label>
              <Textarea
                id="leadership"
                value={formData.leadership}
                onChange={(e) => updateField('leadership', e.target.value)}
                placeholder="Who leads this organization..."
                rows={3}
              />
            </div>

            <div>
              <Label htmlFor="structure">Structure</Label>
              <Textarea
                id="structure"
                value={formData.structure}
                onChange={(e) => updateField('structure', e.target.value)}
                placeholder="How is the organization structured..."
                rows={3}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="resources">Resources</Label>
              <Textarea
                id="resources"
                value={formData.resources}
                onChange={(e) => updateField('resources', e.target.value)}
                placeholder="What resources do they have access to..."
                rows={3}
              />
            </div>

            <div>
              <Label htmlFor="relationships">Relationships</Label>
              <Textarea
                id="relationships"
                value={formData.relationships}
                onChange={(e) => updateField('relationships', e.target.value)}
                placeholder="Relationships with other organizations..."
                rows={3}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="status">Status</Label>
              <Input
                id="status"
                value={formData.status}
                onChange={(e) => updateField('status', e.target.value)}
                placeholder="e.g., Active, Disbanded, Underground..."
              />
            </div>

            <div>
              <Label htmlFor="tags">Tags</Label>
              <Input
                id="tags"
                value={formData.tags}
                onChange={(e) => updateField('tags', e.target.value)}
                placeholder="Enter tags separated by commas..."
              />
            </div>
          </div>
        </form>
      </Card>
    </div>
  );
}