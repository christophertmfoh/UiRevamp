import React, { useState, useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Search, Sparkles, MapPin } from 'lucide-react';
import type { Project } from '../../lib/types';
import { LocationCard } from './LocationCard';
import { LocationUnifiedView } from './LocationUnifiedView';
import { LocationForm } from './LocationForm';
import { LocationPortraitModal } from './LocationPortraitModal';
import { LocationGenerationModal } from './LocationGenerationModal';

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
  projectId: string;
  selectedLocationId?: string | null;
  onClearSelection?: () => void;
}

export function LocationManager({ projectId, selectedLocationId, onClearSelection }: LocationManagerProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [portraitLocation, setPortraitLocation] = useState<Location | null>(null);
  const [isPortraitModalOpen, setIsPortraitModalOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isGenerationModalOpen, setIsGenerationModalOpen] = useState(false);
  const queryClient = useQueryClient();

  const { data: locations = [], isLoading } = useQuery<Location[]>({
    queryKey: ['/api/projects', projectId, 'locations'],
  });

  const { data: project } = useQuery<Project>({
    queryKey: ['/api/projects', projectId],
  });

  const { data: characters = [] } = useQuery<any[]>({
    queryKey: ['/api/projects', projectId, 'characters'],
  });

  // Handle external selection
  useEffect(() => {
    if (selectedLocationId && locations.length > 0) {
      const location = locations.find(l => l.id === selectedLocationId);
      if (location) {
        setSelectedLocation(location);
        setIsCreating(false);
      }
    }
  }, [selectedLocationId, locations]);

  // Filter locations based on search
  const filteredLocations = locations.filter(location =>
    location.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    location.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    location.significance?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    location.atmosphere?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleLocationSelect = (location: Location) => {
    setSelectedLocation(location);
    setIsCreating(false);
    onClearSelection?.();
  };

  const handleCreateNew = () => {
    setSelectedLocation(null);
    setIsCreating(true);
    onClearSelection?.();
  };

  const handleBackToList = () => {
    setSelectedLocation(null);
    setIsCreating(false);
    onClearSelection?.();
  };

  const handleLocationUpdate = () => {
    queryClient.invalidateQueries({ queryKey: ['/api/projects', projectId, 'locations'] });
  };

  const handleLocationDelete = async (location: Location) => {
    try {
      const response = await fetch(`/api/locations/${location.id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        queryClient.invalidateQueries({ queryKey: ['/api/projects', projectId, 'locations'] });
        setSelectedLocation(null);
        setIsCreating(false);
      }
    } catch (error) {
      console.error('Failed to delete location:', error);
    }
  };

  const handleOpenPortraitModal = (location: Location) => {
    setPortraitLocation(location);
    setIsPortraitModalOpen(true);
  };

  const handleOpenGenerationModal = () => {
    setIsGenerationModalOpen(true);
  };

  const handleLocationGenerated = (generatedLocation: Partial<Location>) => {
    setIsGenerationModalOpen(false);
    // Create a new location with generated data
    setSelectedLocation(null);
    setIsCreating(true);
    // The form will be pre-filled with generated data
  };

  // Show detailed view if a location is selected or creating
  if (selectedLocation || isCreating) {
    if (isCreating) {
      return (
        <LocationForm
          projectId={projectId}
          onCancel={handleBackToList}
        />
      );
    }

    return (
      <LocationUnifiedView
        location={selectedLocation!}
        onBack={handleBackToList}
        onUpdate={handleLocationUpdate}
        onDelete={handleLocationDelete}
        onOpenPortraitModal={handleOpenPortraitModal}
      />
    );
  }

  // Show loading state
  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-muted rounded w-1/4 mb-2"></div>
          <div className="h-4 bg-muted rounded w-1/2"></div>
        </div>
      </div>
    );
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
            onClick={handleOpenGenerationModal} 
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
          placeholder="Search locations by name, description, or atmosphere..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 creative-input"
        />
      </div>

      {/* Location Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredLocations.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <MapPin className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <h3 className="font-title text-xl mb-2">
              {searchQuery ? 'No locations found' : 'No locations yet'}
            </h3>
            <p className="text-muted-foreground mb-6">
              {searchQuery 
                ? 'Try adjusting your search terms'
                : 'Start building your world by creating your first location'
              }
            </p>
            <Button onClick={handleCreateNew} className="interactive-warm">
              <Plus className="h-4 w-4 mr-2" />
              {searchQuery ? 'Create New Location' : 'Create First Location'}
            </Button>
          </div>
        ) : (
          filteredLocations.map((location) => (
            <LocationCard
              key={location.id}
              location={location}
              onClick={() => handleLocationSelect(location)}
              onOpenPortraitModal={() => handleOpenPortraitModal(location)}
            />
          ))
        )}
      </div>

      {/* Portrait Modal */}
      {isPortraitModalOpen && portraitLocation && (
        <LocationPortraitModal
          location={portraitLocation}
          onClose={() => setIsPortraitModalOpen(false)}
          onUpdate={handleLocationUpdate}
        />
      )}

      {/* Generation Modal */}
      {isGenerationModalOpen && (
        <LocationGenerationModal
          projectId={projectId}
          onClose={() => setIsGenerationModalOpen(false)}
          onLocationGenerated={handleLocationGenerated}
        />
      )}
    </div>
  );
}