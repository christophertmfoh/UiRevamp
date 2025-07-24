import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft, Save, MapPin } from 'lucide-react';

interface Location {
  id?: string;
  name: string;
  description: string;
  history: string;
  significance: string;
  atmosphere: string;
  tags: string[];
}

interface LocationFormProps {
  location?: Location;
  onSave: (location: Location) => void;
  onCancel: () => void;
}

export function LocationForm({ location, onSave, onCancel }: LocationFormProps) {
  const [formData, setFormData] = useState({
    name: location?.name || '',
    description: location?.description || '',
    history: location?.history || '',
    significance: location?.significance || '',
    atmosphere: location?.atmosphere || '',
    tags: location?.tags?.join(', ') || '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...location,
      ...formData,
      tags: formData.tags.split(',').map(tag => tag.trim()).filter(Boolean),
    });
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={onCancel}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <div>
          <h2 className="font-title text-2xl">
            {location ? 'Edit Location' : 'Create Location'}
          </h2>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardContent className="p-6 space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <MapPin className="h-5 w-5" />
              <h3 className="font-semibold">Basic Information</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleChange('name', e.target.value)}
                  placeholder="Location name"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="significance">Significance</Label>
                <Input
                  id="significance"
                  value={formData.significance}
                  onChange={(e) => handleChange('significance', e.target.value)}
                  placeholder="Why is this location important?"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleChange('description', e.target.value)}
                placeholder="Describe this location..."
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="history">History</Label>
              <Textarea
                id="history"
                value={formData.history}
                onChange={(e) => handleChange('history', e.target.value)}
                placeholder="What is the history of this location?"
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="atmosphere">Atmosphere</Label>
              <Textarea
                id="atmosphere"
                value={formData.atmosphere}
                onChange={(e) => handleChange('atmosphere', e.target.value)}
                placeholder="What does it feel like to be here?"
                rows={2}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="tags">Tags (comma-separated)</Label>
              <Input
                id="tags"
                value={formData.tags}
                onChange={(e) => handleChange('tags', e.target.value)}
                placeholder="ancient, mystical, dangerous..."
              />
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit">
            <Save className="h-4 w-4 mr-2" />
            Save Location
          </Button>
        </div>
      </form>
    </div>
  );
}