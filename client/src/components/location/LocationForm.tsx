import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, Save } from 'lucide-react';
import { apiRequest } from '@/lib/queryClient';
import type { Location } from '../lib/types';

interface LocationFormProps {
  projectId: string;
  onCancel: () => void;
  location?: Location;
}

export function LocationForm({ projectId, onCancel, location }: LocationFormProps) {
  const [formData, setFormData] = useState({
    name: location?.name || '',
    description: location?.description || '',
    history: location?.history || '',
    significance: location?.significance || '',
    atmosphere: location?.atmosphere || '',
    tags: location?.tags?.join(', ') || '',
  });

  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: (locationData: any) => 
      apiRequest('POST', `/api/projects/${projectId}/locations`, locationData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/projects', projectId, 'locations'] });
      onCancel();
    },
  });

  const updateMutation = useMutation({
    mutationFn: (locationData: any) => 
      apiRequest('PUT', `/api/locations/${location?.id}`, locationData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/projects', projectId, 'locations'] });
      onCancel();
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const processedData = {
      name: formData.name,
      description: formData.description,
      history: formData.history,
      significance: formData.significance,
      atmosphere: formData.atmosphere,
      tags: formData.tags.split(',').map(s => s.trim()).filter(Boolean),
      projectId,
    };

    if (location) {
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
          Back to Locations
        </Button>
        <div className="flex gap-2">
          <Button 
            type="submit" 
            onClick={handleSubmit}
            disabled={isLoading}
            className="interactive-warm gap-2"
          >
            <Save className="h-4 w-4" />
            {isLoading ? 'Saving...' : 'Save Location'}
          </Button>
        </div>
      </div>

      <Card className="creative-card">
        <div className="p-6">
          <h1 className="font-title text-3xl mb-6">
            {location ? 'Edit Location' : 'Create New Location'}
          </h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Location Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => updateField('name', e.target.value)}
                  placeholder="Enter location name..."
                  required
                />
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => updateField('description', e.target.value)}
                  placeholder="Describe the location..."
                  rows={4}
                />
              </div>

              <div>
                <Label htmlFor="atmosphere">Atmosphere</Label>
                <Input
                  id="atmosphere"
                  value={formData.atmosphere}
                  onChange={(e) => updateField('atmosphere', e.target.value)}
                  placeholder="e.g., mysterious, peaceful, dangerous..."
                />
              </div>

              <div>
                <Label htmlFor="history">History</Label>
                <Textarea
                  id="history"
                  value={formData.history}
                  onChange={(e) => updateField('history', e.target.value)}
                  placeholder="What is the history of this location?"
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="significance">Significance</Label>
                <Textarea
                  id="significance"
                  value={formData.significance}
                  onChange={(e) => updateField('significance', e.target.value)}
                  placeholder="Why is this location important to your story?"
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="tags">Tags</Label>
                <Input
                  id="tags"
                  value={formData.tags}
                  onChange={(e) => updateField('tags', e.target.value)}
                  placeholder="e.g., forest, magical, ancient, dangerous (comma-separated)"
                />
              </div>
            </div>
          </form>
        </div>
      </Card>
    </div>
  );
}