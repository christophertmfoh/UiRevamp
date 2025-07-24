import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Search, Sparkles, MapPin } from 'lucide-react';
import { apiRequest } from '@/lib/queryClient';
import type { Project } from '../../lib/types';

interface Location {
  id: string;
  projectId: string;
  name: string;
  description: string;
  history: string;
  significance: string;
  atmosphere: string;
  imageGallery: any[];
  displayImageId: number | null;
  tags: string[];
}

interface LocationManagerProps {
  project: Project;
}

export function LocationManager({ project }: LocationManagerProps) {
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isGenerationModalOpen, setIsGenerationModalOpen] = useState(false);

  const queryClient = useQueryClient();

  const { data: locations = [], isLoading } = useQuery({
    queryKey: ['/api/projects', project.id, 'locations'],
    enabled: !!project?.id,
  });

  const filteredLocations = locations.filter((location: Location) =>
    location.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    location.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    location.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleLocationSelect = (location: Location) => {
    setSelectedLocation(location);
    setIsCreating(false);
  };

  const handleCreateNew = () => {
    setIsCreating(true);
    setSelectedLocation(null);
  };

  if (isLoading) {
    return <div className="flex items-center justify-center h-64">Loading locations...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-title text-2xl">Locations</h2>
          <p className="text-muted-foreground">
            {locations.length} {locations.length === 1 ? 'location' : 'locations'} in your world
          </p>
        </div>
        <div className="flex gap-2">
          <Button 
            onClick={handleCreateNew} 
            className="interactive-warm"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Location
          </Button>
          <Button 
            onClick={() => setIsGenerationModalOpen(true)} 
            disabled={!project}
            variant="outline"
            className="border-accent/20 hover:bg-accent/10"
          >
            <Sparkles className="h-4 w-4 mr-2" />
            Generate Location
          </Button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search locations by name, description, or tags..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 creative-input"
        />
      </div>

      {/* Locations Grid */}
      {filteredLocations.length === 0 ? (
        <div className="text-center py-12">
          <MapPin className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
          <h3 className="text-lg font-semibold mb-2">No locations found</h3>
          <p className="text-muted-foreground mb-4">
            {searchQuery ? 'Try adjusting your search terms' : 'Create your first location to get started'}
          </p>
          {!searchQuery && (
            <div className="flex gap-2 justify-center">
              <Button onClick={handleCreateNew}>
                <Plus className="h-4 w-4 mr-2" />
                Create Location
              </Button>
              <Button onClick={() => setIsGenerationModalOpen(true)} variant="outline">
                <Sparkles className="h-4 w-4 mr-2" />
                Generate Location
              </Button>
            </div>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredLocations.map((location: Location) => (
            <div key={location.id} className="p-4 border rounded-lg cursor-pointer hover:shadow-md" onClick={() => handleLocationSelect(location)}>
              <h3 className="font-semibold">{location.name}</h3>
              <p className="text-sm text-muted-foreground">{location.description}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}