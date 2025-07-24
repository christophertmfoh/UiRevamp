import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Plus, MapPin, Search, Edit, Trash2, MoreVertical, Edit2, Camera, Sparkles } from 'lucide-react';
import { apiRequest } from '@/lib/queryClient';
import type { Location, Project } from '@/lib/types';
import { LocationDetailView } from './LocationDetailView';
import { LocationPortraitModal } from './LocationPortraitModal';
import { LocationGenerationModal, type LocationGenerationOptions } from './LocationGenerationModal';
// import { generateContextualLocation } from '../../lib/services/locationGeneration';

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

  // Auto-select location if selectedLocationId is provided
  useEffect(() => {
    if (selectedLocationId && locations.length > 0) {
      const location = locations.find(l => l.id === selectedLocationId);
      if (location) {
        setSelectedLocation(location);
        setIsCreating(false);
        // Clear the selection from the parent component
        onClearSelection?.();
      }
    }
  }, [selectedLocationId, locations, onClearSelection]);

  const deleteMutation = useMutation({
    mutationFn: (locationId: string) => 
      apiRequest('DELETE', `/api/locations/${locationId}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/projects', projectId, 'locations'] });
    },
  });

  const updateLocationMutation = useMutation({
    mutationFn: (location: Location) => 
      apiRequest('PUT', `/api/locations/${location.id}`, location),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/projects', projectId, 'locations'] });
    },
  });

  const createLocationMutation = useMutation({
    mutationFn: async (location: Partial<Location>) => {
      console.log('Mutation: Creating location with data:', location);
      const response = await apiRequest('POST', `/api/projects/${projectId}/locations`, {
        ...location,
        projectId,
      });
      console.log('Mutation: Received response:', response);
      const result = await response.json();
      console.log('Mutation: Parsed JSON:', result);
      return result;
    },
    onSuccess: (newLocation: Location) => {
      console.log('Location created successfully, setting as selected:', newLocation);
      queryClient.invalidateQueries({ queryKey: ['/api/projects', projectId, 'locations'] });
      setSelectedLocation(newLocation);
      setIsCreating(false);
    },
    onError: (error) => {
      console.error('Mutation: Failed to create location:', error);
    },
  });

  const filteredLocations = locations.filter((location: Location) =>
    location.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    location.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (location.tags && location.tags.some((tag: string) => tag.toLowerCase().includes(searchQuery.toLowerCase())))
  );

  const handleLocationClick = (location: Location) => {
    setSelectedLocation(location);
    setIsCreating(false);
  };

  const handleCreateNew = () => {
    setIsCreating(true);
    setSelectedLocation(null);
  };

  const handleEditLocation = (location: Location) => {
    setSelectedLocation(location);
    setIsCreating(false);
  };

  const handleDeleteLocation = (location: Location) => {
    if (window.confirm(`Are you sure you want to delete "${location.name}"?`)) {
      deleteMutation.mutate(location.id);
    }
  };

  const handleGenerateLocation = async (options: LocationGenerationOptions) => {
    if (!project) return;
    
    setIsGenerating(true);
    try {
      console.log('Generating location with options:', options);
      
      // Generate rich location data based on options - only include fields that exist in the Location schema
      const locationName = options.customPrompt || `${options.locationType || 'Location'} of ${project.name}`;
      const generatedLocation = {
        name: locationName,
        description: `A ${options.scale || 'medium-sized'} ${options.locationType || 'location'} with ${options.atmosphere || 'a mysterious atmosphere'}.`,
        atmosphere: options.atmosphere || 'A place of mystery and intrigue',
        significance: `An important ${options.locationType || 'location'} in the world of ${project.name}`,
        history: `Founded in ancient times, this ${options.locationType || 'location'} has witnessed many important events.`,
        tags: [options.locationType || 'location', options.scale || 'medium', options.atmosphere || 'mysterious'].filter(Boolean)
      };
      
      console.log('Generated location:', generatedLocation);
      createLocationMutation.mutate(generatedLocation);
    } catch (error) {
      console.error('Failed to generate location:', error);
    } finally {
      setIsGenerating(false);
      setIsGenerationModalOpen(false);
    }
  };

  const handleUpdateImageData = async (locationId: string, imageUrl: string) => {
    const location = locations.find(l => l.id === locationId);
    if (!location) return;

    const updatedLocation = {
      ...location,
      imageUrl,
    };

    updateLocationMutation.mutate(updatedLocation);
  };

  // If we're creating or editing a location, show the form
  if (isCreating || selectedLocation) {
    return (
      <LocationDetailView
        projectId={projectId}
        location={selectedLocation}
        isCreating={isCreating}
        onBack={() => {
          setSelectedLocation(null);
          setIsCreating(false);
        }}
        onEdit={handleEditLocation}
        onDelete={handleDeleteLocation}
      />
    );
  }

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
            disabled={!project || isGenerating}
            variant="outline"
            className="border-accent/20 hover:bg-accent/10"
          >
            <Sparkles className="h-4 w-4 mr-2" />
            {isGenerating ? 'Generating...' : 'Generate Location'}
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
            <Button onClick={handleCreateNew} className="interactive-warm">
              <Plus className="h-4 w-4 mr-2" />
              Create Location
            </Button>
          )}
        </div>
      ) : (
        <div className="grid gap-4">
          {filteredLocations.map((location: Location) => (
            <Card 
              key={location.id} 
              className="creative-card cursor-pointer hover:shadow-lg transition-all duration-200 border-yellow-500/30 hover:border-yellow-500/50"
              onClick={() => handleLocationClick(location)}
            >
              <CardContent className="p-4">
                <div className="flex items-start gap-4">
                  {/* Location Image - Clickable */}
                  <div 
                    className="w-16 h-16 rounded-lg bg-gradient-to-br from-amber-100 to-orange-200 dark:from-amber-900/30 dark:to-orange-900/30 flex items-center justify-center flex-shrink-0 cursor-pointer hover:opacity-80 transition-opacity relative group"
                    onClick={(e) => {
                      e.stopPropagation();
                      setPortraitLocation(location);
                      setIsPortraitModalOpen(true);
                    }}
                  >
                    {location.imageUrl ? (
                      <img 
                        src={location.imageUrl} 
                        alt={location.name}
                        className="w-full h-full object-cover rounded-lg"
                      />
                    ) : (
                      <MapPin className="h-8 w-8 text-amber-600 dark:text-amber-400" />
                    )}
                    
                    {/* Hover overlay */}
                    <div className="absolute inset-0 bg-black/50 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <Camera className="h-4 w-4 text-white" />
                    </div>
                  </div>

                  {/* Location Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg truncate">
                          {location.name}
                        </h3>
                        
                        {/* Basic Info Row */}
                        <div className="flex items-center gap-2 mt-1 mb-3">
                          <Badge variant="secondary" className="text-xs">
                            Location
                          </Badge>
                          {location.tags && location.tags.length > 0 && (
                            <>
                              {location.tags.slice(0, 2).map((tag, index) => (
                                <Badge key={index} variant="outline" className="text-xs">
                                  {tag}
                                </Badge>
                              ))}
                              {location.tags.length > 2 && (
                                <span className="text-xs text-muted-foreground">+{location.tags.length - 2} more</span>
                              )}
                            </>
                          )}
                        </div>

                        {/* Location Details Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                          {location.description && (
                            <div>
                              <p className="text-muted-foreground text-xs uppercase tracking-wider mb-1">Description</p>
                              <p className="line-clamp-2 text-sm">{location.description}</p>
                            </div>
                          )}
                          
                          {location.atmosphere && (
                            <div>
                              <p className="text-muted-foreground text-xs uppercase tracking-wider mb-1">Atmosphere</p>
                              <p className="line-clamp-2 text-sm">{location.atmosphere}</p>
                            </div>
                          )}

                          {location.significance && (
                            <div>
                              <p className="text-muted-foreground text-xs uppercase tracking-wider mb-1">Significance</p>
                              <p className="line-clamp-2 text-sm">{location.significance}</p>
                            </div>
                          )}
                        </div>
                      </div>

                      <DropdownMenu>
                        <DropdownMenuTrigger 
                          className="opacity-70 hover:opacity-100 transition-opacity flex-shrink-0"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <MoreVertical className="h-4 w-4" />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem 
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEditLocation(location);
                            }}
                          >
                            <Edit2 className="h-4 w-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteLocation(location);
                            }}
                            className="text-destructive"
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Modals */}
      {isGenerationModalOpen && project && (
        <LocationGenerationModal
          project={project}
          existingLocations={locations}
          onGenerate={handleGenerateLocation}
          onClose={() => setIsGenerationModalOpen(false)}
          isGenerating={isGenerating}
        />
      )}

      {isPortraitModalOpen && portraitLocation && (
        <LocationPortraitModal
          isOpen={isPortraitModalOpen}
          location={portraitLocation}
          onClose={() => {
            setIsPortraitModalOpen(false);
            setPortraitLocation(null);
          }}
          onImageGenerated={(imageUrl: string) => handleUpdateImageData(portraitLocation?.id || '', imageUrl)}
        />
      )}
    </div>
  );
}