import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, Save } from 'lucide-react';
import { apiRequest } from '@/lib/queryClient';
import type { MagicSystem } from '@/lib/types';

interface MagicSystemFormProps {
  projectId: string;
  onCancel: () => void;
  magicSystem?: MagicSystem;
}

export function MagicSystemForm({ projectId, onCancel, magicSystem }: MagicSystemFormProps) {
  const [formData, setFormData] = useState({
    name: magicSystem?.name || '',
    type: magicSystem?.type || '',
    description: magicSystem?.description || '',
    source: magicSystem?.source || '',
    practitioners: magicSystem?.practitioners?.join(', ') || '',
    effects: magicSystem?.effects?.join(', ') || '',
    limitations: magicSystem?.limitations || '',
    corruption: magicSystem?.corruption || '',
    tags: magicSystem?.tags?.join(', ') || '',
  });

  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: (magicSystemData: any) => 
      apiRequest('POST', `/api/projects/${projectId}/magic-systems`, magicSystemData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/projects', projectId, 'magic-systems'] });
      onCancel();
    },
  });

  const updateMutation = useMutation({
    mutationFn: (magicSystemData: any) => 
      apiRequest('PUT', `/api/magic-systems/${magicSystem?.id}`, magicSystemData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/projects', projectId, 'magic-systems'] });
      onCancel();
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const processedData = {
      name: formData.name,
      type: formData.type,
      description: formData.description,
      source: formData.source,
      practitioners: formData.practitioners.split(',').map(s => s.trim()).filter(Boolean),
      effects: formData.effects.split(',').map(s => s.trim()).filter(Boolean),
      limitations: formData.limitations,
      corruption: formData.corruption,
      tags: formData.tags.split(',').map(s => s.trim()).filter(Boolean),
    };

    if (magicSystem) {
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
          Back to Magic Systems
        </Button>
        <div className="flex gap-2">
          <Button 
            type="submit" 
            onClick={handleSubmit}
            disabled={isLoading}
            className="gap-2"
          >
            <Save className="h-4 w-4" />
            {isLoading ? 'Saving...' : 'Save Magic System'}
          </Button>
        </div>
      </div>

      <Card className="p-6">
        <h1 className="font-title text-3xl mb-6">
          {magicSystem ? 'Edit Magic System' : 'Create New Magic System'}
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
                placeholder="Enter magic system name..."
              />
            </div>

            <div>
              <Label htmlFor="type">Type</Label>
              <Input
                id="type"
                value={formData.type}
                onChange={(e) => updateField('type', e.target.value)}
                placeholder="e.g., Elemental, Divine, Arcane..."
              />
            </div>
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => updateField('description', e.target.value)}
              placeholder="Describe how this magic system works..."
              rows={4}
            />
          </div>

          <div>
            <Label htmlFor="source">Source</Label>
            <Textarea
              id="source"
              value={formData.source}
              onChange={(e) => updateField('source', e.target.value)}
              placeholder="Where does this magic power come from..."
              rows={3}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="practitioners">Practitioners</Label>
              <Input
                id="practitioners"
                value={formData.practitioners}
                onChange={(e) => updateField('practitioners', e.target.value)}
                placeholder="Who can use this magic (comma-separated)..."
              />
            </div>

            <div>
              <Label htmlFor="effects">Effects</Label>
              <Input
                id="effects"
                value={formData.effects}
                onChange={(e) => updateField('effects', e.target.value)}
                placeholder="What effects can be achieved (comma-separated)..."
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="limitations">Limitations</Label>
              <Textarea
                id="limitations"
                value={formData.limitations}
                onChange={(e) => updateField('limitations', e.target.value)}
                placeholder="What are the limits and restrictions..."
                rows={3}
              />
            </div>

            <div>
              <Label htmlFor="corruption">Corruption/Cost</Label>
              <Textarea
                id="corruption"
                value={formData.corruption}
                onChange={(e) => updateField('corruption', e.target.value)}
                placeholder="What are the risks or costs of using this magic..."
                rows={3}
              />
            </div>
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
        </form>
      </Card>
    </div>
  );
}