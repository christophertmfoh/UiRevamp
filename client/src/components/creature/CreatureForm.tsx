import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, Save } from 'lucide-react';
import { apiRequest } from '@/lib/queryClient';
import type { Creature } from '@/lib/types';

interface CreatureFormProps {
  projectId: string;
  onCancel: () => void;
  creature?: Creature;
}

export function CreatureForm({ projectId, onCancel, creature }: CreatureFormProps) {
  const [formData, setFormData] = useState({
    name: creature?.name || '',
    species: creature?.species || '',
    classification: creature?.classification || '',
    description: creature?.description || '',
    habitat: creature?.habitat || '',
    behavior: creature?.behavior || '',
    abilities: creature?.abilities?.join(', ') || '',
    weaknesses: creature?.weaknesses?.join(', ') || '',
    threat: creature?.threat || '',
    significance: creature?.significance || '',
    tags: creature?.tags?.join(', ') || '',
  });

  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: (creatureData: any) => 
      apiRequest('POST', `/api/projects/${projectId}/creatures`, creatureData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/projects', projectId, 'creatures'] });
      onCancel();
    },
  });

  const updateMutation = useMutation({
    mutationFn: (creatureData: any) => 
      apiRequest('PUT', `/api/creatures/${creature?.id}`, creatureData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/projects', projectId, 'creatures'] });
      onCancel();
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const processedData = {
      name: formData.name,
      species: formData.species,
      classification: formData.classification,
      description: formData.description,
      habitat: formData.habitat,
      behavior: formData.behavior,
      abilities: formData.abilities.split(',').map(s => s.trim()).filter(Boolean),
      weaknesses: formData.weaknesses.split(',').map(s => s.trim()).filter(Boolean),
      threat: formData.threat,
      significance: formData.significance,
      tags: formData.tags.split(',').map(s => s.trim()).filter(Boolean),
    };

    if (creature) {
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
          Back to Creatures
        </Button>
        <div className="flex gap-2">
          <Button 
            type="submit" 
            onClick={handleSubmit}
            disabled={isLoading}
            className="gap-2"
          >
            <Save className="h-4 w-4" />
            {isLoading ? 'Saving...' : 'Save Creature'}
          </Button>
        </div>
      </div>

      <Card className="p-6">
        <h1 className="font-title text-3xl mb-6">
          {creature ? 'Edit Creature' : 'Create New Creature'}
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="name">Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => updateField('name', e.target.value)}
                required
                placeholder="Enter creature name..."
              />
            </div>

            <div>
              <Label htmlFor="species">Species</Label>
              <Input
                id="species"
                value={formData.species}
                onChange={(e) => updateField('species', e.target.value)}
                placeholder="e.g., Dragon, Wolf, Elemental..."
              />
            </div>

            <div>
              <Label htmlFor="classification">Classification</Label>
              <Input
                id="classification"
                value={formData.classification}
                onChange={(e) => updateField('classification', e.target.value)}
                placeholder="e.g., Magical Beast, Undead, Construct..."
              />
            </div>
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => updateField('description', e.target.value)}
              placeholder="Describe the creature's appearance and nature..."
              rows={4}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="habitat">Habitat</Label>
              <Textarea
                id="habitat"
                value={formData.habitat}
                onChange={(e) => updateField('habitat', e.target.value)}
                placeholder="Where does this creature live..."
                rows={3}
              />
            </div>

            <div>
              <Label htmlFor="behavior">Behavior</Label>
              <Textarea
                id="behavior"
                value={formData.behavior}
                onChange={(e) => updateField('behavior', e.target.value)}
                placeholder="How does this creature act..."
                rows={3}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="abilities">Abilities</Label>
              <Input
                id="abilities"
                value={formData.abilities}
                onChange={(e) => updateField('abilities', e.target.value)}
                placeholder="Special abilities (comma-separated)..."
              />
            </div>

            <div>
              <Label htmlFor="weaknesses">Weaknesses</Label>
              <Input
                id="weaknesses"
                value={formData.weaknesses}
                onChange={(e) => updateField('weaknesses', e.target.value)}
                placeholder="Known weaknesses (comma-separated)..."
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="threat">Threat Level</Label>
              <Input
                id="threat"
                value={formData.threat}
                onChange={(e) => updateField('threat', e.target.value)}
                placeholder="e.g., Low, Medium, High, Extreme..."
              />
            </div>

            <div>
              <Label htmlFor="significance">Significance</Label>
              <Input
                id="significance"
                value={formData.significance}
                onChange={(e) => updateField('significance', e.target.value)}
                placeholder="Why is this creature important..."
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