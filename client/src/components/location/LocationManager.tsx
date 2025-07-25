import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Plus, MapPin, Search, Edit, Trash2, MoreVertical, Edit2, Camera, Sparkles, ArrowUpDown, Filter, Grid3X3, List, Eye, Zap, FileText } from 'lucide-react';
import { apiRequest } from '@/lib/queryClient';
import { handleEntityError, showErrorToast, showSuccessToast } from '@/lib/utils/errorHandling';
import type { Location, Project } from '@/lib/types';

interface LocationManagerProps {
  projectId: string;
  selectedLocationId?: string | null;
  onClearSelection?: () => void;
}

type SortOption = 'alphabetical' | 'recently-added' | 'recently-edited';
type ViewMode = 'grid' | 'list';

export function LocationManager({ projectId, selectedLocationId, onClearSelection }: LocationManagerProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);

  // Storage keys for persistence
  const getViewStorageKey = () => `storyWeaver_viewMode_locationManager_${projectId}`;
  const getSortStorageKey = () => `storyWeaver_sortBy_locationManager_${projectId}`;

  // Sort state with persistence
  const [sortBy, setSortBy] = useState<SortOption>(() => {
    const saved = localStorage.getItem(getSortStorageKey());
    return (saved as SortOption) || 'alphabetical';
  });

  const handleSortChange = (option: SortOption) => {
    setSortBy(option);
    localStorage.setItem(getSortStorageKey(), option);
  };
  
  const [viewMode, setViewMode] = useState<ViewMode>(() => {
    // Load saved view preference from localStorage
    const saved = localStorage.getItem(getViewStorageKey());
    return (saved as ViewMode) || 'grid';
  });

  // Save view preference whenever it changes
  const handleViewModeChange = (mode: ViewMode) => {
    setViewMode(mode);
    localStorage.setItem(getViewStorageKey(), mode);
  };

  const [isCreating, setIsCreating] = useState(false);
  const [isCreationLaunchOpen, setIsCreationLaunchOpen] = useState(false);
  const [newLocationData, setNewLocationData] = useState<Partial<Location>>({});
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
        onClearSelection?.();
      }
    }
  }, [selectedLocationId, locations, onClearSelection]);

  const deleteMutation = useMutation({
    mutationFn: (locationId: string) => 
      apiRequest('DELETE', `/api/locations/${locationId}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/projects', projectId, 'locations'] });
      showSuccessToast('Location deleted successfully');
    },
    onError: (error) => {
      const entityError = handleEntityError(error, 'delete', 'location');
      showErrorToast(entityError, 'Delete Failed');
    }
  });

  const handleDeleteLocation = (locationId: string) => {
    if (window.confirm('Are you sure you want to delete this location? This action cannot be undone.')) {
      deleteMutation.mutate(locationId);
      if (selectedLocation?.id === locationId) {
        setSelectedLocation(null);
      }
    }
  };

  // Filter and sort locations
  const filteredLocations = locations.filter(location =>
    location.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    location.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    location.type?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const sortedLocations = [...filteredLocations].sort((a, b) => {
    switch (sortBy) {
      case 'alphabetical':
        return a.name.localeCompare(b.name);
      case 'recently-added':
        // Use ID as fallback for sorting if timestamps not available
        return b.id!.localeCompare(a.id!);
      case 'recently-edited':
        // Use ID as fallback for sorting if timestamps not available  
        return b.id!.localeCompare(a.id!);
      default:
        return 0;
    }
  });

  // Calculate completion percentage for a location
  const calculateCompletion = (location: Location) => {
    const fields = [
      location.name, location.description, location.type, location.history,
      location.atmosphere, location.significance
    ];
    const filledFields = fields.filter(field => field && field.trim().length > 0).length;
    return Math.round((filledFields / fields.length) * 100);
  };

  const handleCreateLocation = () => {
    setIsCreationLaunchOpen(true);
  };

  const handleLocationCreated = (location: Location) => {
    setSelectedLocation(location);
    setIsCreating(false);
    setIsCreationLaunchOpen(false);
    queryClient.invalidateQueries({ queryKey: ['/api/projects', projectId, 'locations'] });
  };

  const renderLocationCard = (location: Location) => {
    const completion = calculateCompletion(location);
    
    return (
      <Card 
        key={location.id} 
        className="group cursor-pointer transition-all duration-300 hover:shadow-xl hover:scale-[1.02] hover:bg-accent/5 creative-card"
        onClick={() => setSelectedLocation(location)}
      >
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
                {location.imageUrl ? (
                  <img 
                    src={location.imageUrl} 
                    alt={location.name}
                    className="w-full h-full rounded-lg object-cover"
                  />
                ) : (
                  <MapPin className="h-6 w-6 text-white" />
                )}
              </div>
              <div>
                <CardTitle className="text-lg group-hover:text-accent transition-colors">
                  {location.name}
                </CardTitle>
                {location.type && (
                  <Badge variant="secondary" className="mt-1 text-xs">
                    {location.type}
                  </Badge>
                )}
              </div>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                <Button variant="ghost" size="sm">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={(e) => {
                  e.stopPropagation();
                  setSelectedLocation(location);
                }}>
                  <Edit2 className="h-4 w-4 mr-2" />
                  Edit Details
                </DropdownMenuItem>
                <DropdownMenuItem 
                  className="text-destructive"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteLocation(location.id!);
                  }}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete Location
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
            {location.description || 'Click to add description and bring this location to life'}
          </p>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-full bg-muted rounded-full h-2 max-w-[120px]">
                <div 
                  className="bg-accent h-2 rounded-full transition-all duration-300" 
                  style={{ width: `${completion}%` }}
                />
              </div>
              <span className="text-xs text-muted-foreground">{completion}%</span>
            </div>
            {completion < 50 && (
              <Badge variant="outline" className="text-xs">
                Ready to develop
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>
    );
  };

  const renderLocationListItem = (location: Location) => {
    const completion = calculateCompletion(location);
    
    return (
      <Card 
        key={location.id} 
        className="group cursor-pointer transition-all duration-300 hover:shadow-lg hover:bg-accent/5 mb-3"
        onClick={() => setSelectedLocation(location)}
      >
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4 flex-1">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center flex-shrink-0">
                {location.imageUrl ? (
                  <img 
                    src={location.imageUrl} 
                    alt={location.name}
                    className="w-full h-full rounded-lg object-cover"
                  />
                ) : (
                  <MapPin className="h-6 w-6 text-white" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2 mb-1">
                  <h3 className="font-semibold text-lg group-hover:text-accent transition-colors truncate">
                    {location.name}
                  </h3>
                  {location.type && (
                    <Badge variant="secondary" className="text-xs">
                      {location.type}
                    </Badge>
                  )}
                </div>
                <p className="text-sm text-muted-foreground line-clamp-1 mb-2">
                  {location.description || 'Ready to develop • Click to add details and bring this location to life'}
                </p>
                <div className="flex items-center space-x-3">
                  <div className="flex items-center space-x-2">
                    <div className="w-24 bg-muted rounded-full h-2">
                      <div 
                        className="bg-accent h-2 rounded-full transition-all duration-300" 
                        style={{ width: `${completion}%` }}
                      />
                    </div>
                    <span className="text-xs text-muted-foreground">{completion}%</span>
                  </div>
                  {completion < 50 && (
                    <Badge variant="outline" className="text-xs">
                      Ready to develop
                    </Badge>
                  )}
                </div>
              </div>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                <Button variant="ghost" size="sm">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={(e) => {
                  e.stopPropagation();
                  setSelectedLocation(location);
                }}>
                  <Edit2 className="h-4 w-4 mr-2" />
                  Edit Details
                </DropdownMenuItem>
                <DropdownMenuItem 
                  className="text-destructive"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteLocation(location.id!);
                  }}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete Location
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardContent>
      </Card>
    );
  };

  if (selectedLocation) {
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <Button 
            variant="ghost" 
            onClick={() => setSelectedLocation(null)}
            className="flex items-center space-x-2"
          >
            <ArrowUpDown className="h-4 w-4 rotate-90" />
            <span>Back to Locations</span>
          </Button>
        </div>
        {/* TODO: Add LocationDetailView component similar to CharacterDetailView */}
        <div className="text-center py-12">
          <MapPin className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-2xl font-bold mb-2">{selectedLocation.name}</h3>
          <p className="text-muted-foreground mb-6">Location detail view coming soon</p>
          <Button onClick={() => setSelectedLocation(null)}>
            Back to Locations
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Locations</h1>
          <p className="text-muted-foreground">
            {locations.length} location{locations.length === 1 ? '' : 's'} in your world
          </p>
        </div>
        <Button 
          onClick={handleCreateLocation}
          className="flex items-center space-x-2 bg-gradient-to-r from-accent to-accent/80 hover:from-accent/90 hover:to-accent/70 text-accent-foreground font-medium px-6"
        >
          <Plus className="h-4 w-4 rotate-0 transition-transform hover:rotate-90" />
          <span>Create Location</span>
        </Button>
      </div>

      {/* Search and Controls */}
      <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search locations by name, type, or description..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <div className="flex items-center space-x-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="flex items-center space-x-2">
                <ArrowUpDown className="h-4 w-4" />
                <span className="hidden sm:inline">Sort: {
                  sortBy === 'alphabetical' ? 'A-Z' :
                  sortBy === 'recently-added' ? 'Recently Added' :
                  'Recently Edited'
                }</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => handleSortChange('alphabetical')}>
                Alphabetical (A-Z)
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleSortChange('recently-added')}>
                Recently Added
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleSortChange('recently-edited')}>
                Recently Edited
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <div className="flex items-center border rounded-lg p-1">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => handleViewModeChange('grid')}
              className="p-2"
            >
              <Grid3X3 className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => handleViewModeChange('list')}
              className="p-2"
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-muted rounded-lg" />
                  <div className="space-y-2 flex-1">
                    <div className="h-4 bg-muted rounded" />
                    <div className="h-3 bg-muted rounded w-2/3" />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="h-3 bg-muted rounded" />
                  <div className="h-3 bg-muted rounded w-4/5" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : sortedLocations.length === 0 ? (
        <Card className="creative-card">
          <CardContent className="text-center py-12">
            <MapPin className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-2xl font-bold mb-2">No locations yet</h3>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              Start building your world by creating your first location. Add places where your story unfolds.
            </p>
            <Button onClick={handleCreateLocation} className="bg-gradient-to-r from-accent to-accent/80 hover:from-accent/90 hover:to-accent/70">
              <Plus className="h-4 w-4 mr-2" />
              Create Your First Location
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className={viewMode === 'grid' 
          ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" 
          : "space-y-3"
        }>
          {sortedLocations.map(location => 
            viewMode === 'grid' ? renderLocationCard(location) : renderLocationListItem(location)
          )}
        </div>
      )}

      {/* Creation Launch Modal - TODO: Add LocationCreationLaunch component */}
      {isCreationLaunchOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="w-full max-w-md mx-4">
            <CardHeader>
              <CardTitle>Create Location</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">Location creation wizard coming soon</p>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsCreationLaunchOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={() => setIsCreationLaunchOpen(false)}>
                  OK
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}