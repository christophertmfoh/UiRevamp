import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Save, X, MapPin, Upload, Image as ImageIcon } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface LocationFormProps {
  projectId: string;
  location?: any;
  onCancel: () => void;
}

export function LocationForm({ projectId, location, onCancel }: LocationFormProps) {
  const [formData, setFormData] = useState({
    name: location?.name || '',
    description: location?.description || '',
    significance: location?.significance || '',
    history: location?.history || '',
    atmosphere: location?.atmosphere || '',
    tags: location?.tags?.join(', ') || '',
  });

  const { toast } = useToast();
  const queryClient = useQueryClient();

  const saveMutation = useMutation({
    mutationFn: async (data: any) => {
      const processedData = {
        name: data.name || 'Unnamed Location',
        description: data.description || 'A mysterious location awaiting discovery.',
        significance: data.significance || '',
        history: data.history || '',
        atmosphere: data.atmosphere || '',
        tags: data.tags ? data.tags.split(',').map((s: string) => s.trim()).filter(Boolean) : [],
      };

      if (location) {
        const response = await fetch(`/api/locations/${location.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...location, ...processedData }),
        });
        if (!response.ok) throw new Error('Failed to update location');
        return response.json();
      } else {
        const response = await fetch('/api/locations', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
            projectId,
            ...processedData,
          }),
        });
        if (!response.ok) throw new Error('Failed to create location');
        return response.json();
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/projects', projectId, 'locations'] });
      toast({
        title: location ? 'Location Updated' : 'Location Created',
        description: `${formData.name} has been ${location ? 'updated' : 'created'} successfully.`,
      });
      onCancel();
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: `Failed to ${location ? 'update' : 'create'} location. Please try again.`,
        variant: 'destructive',
      });
    },
  });

  const updateField = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    saveMutation.mutate(formData);
  };

  const hasImage = location?.imageGallery && location.imageGallery.length > 0;
  const displayImage = hasImage 
    ? location.imageGallery.find((img: any) => img.id === location.displayImageId) || location.imageGallery[0]
    : null;

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={onCancel} className="gap-2">
          <ArrowLeft className="h-4 w-4" />
          Back to Locations
        </Button>
        <div className="flex gap-2">
          <Button 
            onClick={handleSubmit} 
            disabled={saveMutation.isPending}
            className="interactive-warm gap-2"
          >
            <Save className="h-4 w-4" />
            {saveMutation.isPending ? 'Saving...' : (location ? 'Update Location' : 'Create Location')}
          </Button>
          <Button onClick={onCancel} variant="outline" className="gap-2">
            <X className="h-4 w-4" />
            Cancel
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Left Sidebar - Location Image & Quick Info */}
        <div className="lg:col-span-1 space-y-6">
          {/* Location Image */}
          <Card className="creative-card">
            <CardContent className="p-4">
              <div className="aspect-square bg-gradient-to-br from-green-100 to-blue-200 dark:from-green-900/30 dark:to-blue-900/30 rounded-xl flex items-center justify-center overflow-hidden mb-4">
                {displayImage && displayImage.url ? (
                  <img 
                    src={displayImage.url} 
                    alt={formData.name || 'Location'}
                    className="w-full h-full object-cover rounded-xl"
                  />
                ) : (
                  <MapPin className="h-16 w-16 text-green-600 dark:text-green-400" />
                )}
              </div>
              
              <div className="space-y-2">
                <h3 className="font-title text-lg">
                  {formData.name || 'New Location'}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {formData.significance || 'Location significance'}
                </p>
              </div>
              
              {/* Image Upload/Generate Area */}
              <div className="mt-4 p-4 border-2 border-dashed border-muted-foreground/25 rounded-lg text-center">
                <ImageIcon className="h-8 w-8 mx-auto mb-2 text-muted-foreground/50" />
                <p className="text-xs text-muted-foreground mb-2">
                  Location Image
                </p>
                <Button type="button" variant="outline" size="sm" disabled>
                  <Upload className="h-3 w-3 mr-1" />
                  Generate
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <Card className="creative-card">
            <CardHeader>
              <CardTitle className="text-base">Quick Info</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Type:</span>
                <span>Location</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Status:</span>
                <span>{location ? 'Existing' : 'New'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Tags:</span>
                <span>{formData.tags ? formData.tags.split(',').filter(Boolean).length : 0}</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Area */}
        <div className="lg:col-span-3">
          <Card className="creative-card">
            <div className="p-6">
              <h1 className="font-title text-3xl mb-6">
                {location ? 'Edit Location' : 'Create New Location'}
              </h1>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Basic Information */}
                <div className="space-y-4">
                  <h2 className="text-xl font-semibold flex items-center gap-2">
                    <MapPin className="h-5 w-5" />
                    Basic Information
                  </h2>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name">Location Name</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => updateField('name', e.target.value)}
                        placeholder="Enter location name..."
                        className="creative-input"
                      />
                    </div>
                    <div>
                      <Label htmlFor="significance">Significance</Label>
                      <Input
                        id="significance"
                        value={formData.significance}
                        onChange={(e) => updateField('significance', e.target.value)}
                        placeholder="Why is this place important?"
                        className="creative-input"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => updateField('description', e.target.value)}
                      placeholder="Describe this location in detail..."
                      className="creative-input min-h-[120px]"
                      rows={4}
                    />
                  </div>
                </div>

                {/* Additional Details */}
                <div className="space-y-4">
                  <h2 className="text-xl font-semibold">Additional Details</h2>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="history">History</Label>
                      <Textarea
                        id="history"
                        value={formData.history}
                        onChange={(e) => updateField('history', e.target.value)}
                        placeholder="What is this location's past? How was it founded?"
                        className="creative-input"
                        rows={3}
                      />
                    </div>
                    <div>
                      <Label htmlFor="atmosphere">Atmosphere</Label>
                      <Textarea
                        id="atmosphere"
                        value={formData.atmosphere}
                        onChange={(e) => updateField('atmosphere', e.target.value)}
                        placeholder="What does it feel like to be here? Mood, energy, vibe..."
                        className="creative-input"
                        rows={3}
                      />
                    </div>
                  </div>
                </div>

                {/* Tags */}
                <div className="space-y-4">
                  <h2 className="text-xl font-semibold">Tags & Categories</h2>
                  
                  <div>
                    <Label htmlFor="tags">Tags (comma-separated)</Label>
                    <Input
                      id="tags"
                      value={formData.tags}
                      onChange={(e) => updateField('tags', e.target.value)}
                      placeholder="e.g., city, fortress, mystical, ancient"
                      className="creative-input"
                    />
                  </div>
                  
                  {/* Display tags */}
                  {formData.tags && (
                    <div className="flex flex-wrap gap-2">
                      {formData.tags.split(',').map((tag, index) => {
                        const trimmedTag = tag.trim();
                        return trimmedTag ? (
                          <Badge key={index} variant="secondary">
                            {trimmedTag}
                          </Badge>
                        ) : null;
                      })}
                    </div>
                  )}
                </div>
              </form>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}