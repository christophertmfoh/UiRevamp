import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Plus, Users, Search, Edit, Trash2, MoreVertical, Edit2, Camera, Sparkles } from 'lucide-react';
import { apiRequest } from '@/lib/queryClient';
import type { Theme, Project } from '../../lib/types';
import { ThemeDetailView } from './ThemeDetailView';
import { ThemePortraitModal } from './ThemePortraitModal';
import { ThemeGenerationModal, type ThemeGenerationOptions } from './ThemeGenerationModal';
import { generateContextualTheme } from '../../lib/services/themeGeneration';

interface ThemeManagerProps {
  projectId: string;
  selectedThemeId?: string | null;
  onClearSelection?: () => void;
}

export function ThemeManager({ projectId, selectedThemeId, onClearSelection }: ThemeManagerProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTheme, setSelectedTheme] = useState<Theme | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [portraitTheme, setPortraitTheme] = useState<Theme | null>(null);
  const [isPortraitModalOpen, setIsPortraitModalOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isGenerationModalOpen, setIsGenerationModalOpen] = useState(false);
  const queryClient = useQueryClient();

  const { data: themes = [], isLoading } = useQuery<Theme[]>({
    queryKey: ['/api/projects', projectId, 'themes'],
  });

  const { data: project } = useQuery<Project>({
    queryKey: ['/api/projects', projectId],
  });

  const { data: locations = [] } = useQuery<any[]>({
    queryKey: ['/api/projects', projectId, 'locations'],
  });

  // Auto-select theme if selectedThemeId is provided
  useEffect(() => {
    if (selectedThemeId && themes.length > 0) {
      const theme = themes.find(item => item.id === selectedThemeId);
      if (theme) {
        setSelectedTheme(theme);
        setIsCreating(false);
        // Clear the selection from the parent component
        onClearSelection?.();
      }
    }
  }, [selectedThemeId, themes, onClearSelection]);

  const deleteMutation = useMutation({
    mutationFn: (themeId: string) => 
      apiRequest('DELETE', `/api/themes/${themeId}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/projects', projectId, 'themes'] });
    },
  });

  const updateThemeMutation = useMutation({
    mutationFn: (theme: Theme) => 
      apiRequest('PUT', `/api/themes/${theme.id}`, theme),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/projects', projectId, 'themes'] });
    },
  });

  const createThemeMutation = useMutation({
    mutationFn: async (theme: Partial<Theme>) => {
      console.log('Mutation: Creating theme with data:', theme);
      const response = await apiRequest('POST', `/api/projects/${projectId}/themes`, theme);
      console.log('Mutation: Received response:', response);
      const result = await response.json();
      console.log('Mutation: Parsed JSON:', result);
      return result;
    },
    onSuccess: (newTheme: Theme) => {
      console.log('Theme created successfully, setting as selected:', newTheme);
      queryClient.invalidateQueries({ queryKey: ['/api/projects', projectId, 'themes'] });
      // Open the newly created theme in the editor
      setSelectedTheme(newTheme);
      setIsCreating(false);
    },
    onError: (error) => {
      console.error('Failed to create theme:', error);
    }
  });

  const filteredThemes = themes.filter((theme: Theme) =>
    (theme.name && theme.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (theme.role && theme.role.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (theme.race && theme.race.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (theme.occupation && theme.occupation.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleEdit = (theme: Theme) => {
    setSelectedTheme(theme);
  };

  const handleDelete = (theme: Theme) => {
    if (confirm(`Are you sure you want to delete ${theme.name}?`)) {
      deleteMutation.mutate(theme.id, {
        onSuccess: () => {
          // Navigate back to the theme list after successful deletion
          setSelectedTheme(null);
          setIsCreating(false);
        }
      });
    }
  };

  const handleCreateNew = () => {
    setIsCreating(true);
    setSelectedTheme(null);
  };

  const handleOpenGenerationModal = () => {
    setIsGenerationModalOpen(true);
  };

  const handleGenerateTheme = async (options: ThemeGenerationOptions) => {
    if (!project) return;
    
    setIsGenerating(true);
    try {
      console.log('Starting server-side theme generation with options:', options);
      
      // Call the server-side generation endpoint
      const response = await fetch(`/api/projects/${projectId}/themes/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(options)
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.details || errorData.error || 'Failed to generate theme');
      }
      
      const generatedTheme = await response.json();
      console.log('Generated theme data:', generatedTheme);
      
      // Create the theme with generated data and ensure it has the projectId
      const themeToCreate = {
        ...generatedTheme,
        projectId,
        // Ensure we have at least a basic name if generation didn't provide one
        name: generatedTheme.name || `Generated ${options.themeType || 'Theme'}`
      };
      
      console.log('Creating theme with data:', themeToCreate);
      
      // Create the theme - this will automatically open it in the editor on success
      const createdTheme = await createThemeMutation.mutateAsync(themeToCreate);
      console.log('Theme creation completed, created theme:', createdTheme);
      
      // Explicitly set the theme and ensure we're not in creating mode
      setSelectedTheme(createdTheme);
      setIsCreating(false);
      
      // Close the generation modal
      setIsGenerationModalOpen(false);
    } catch (error) {
      console.error('Error generating theme:', error);
      alert(`Failed to generate theme: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleBackToList = () => {
    // Invalidate the theme list query to fetch fresh data
    queryClient.invalidateQueries({ queryKey: ['/api/projects', projectId, 'themes'] });
    setSelectedTheme(null);
    setIsCreating(false);
  };

  const handlePortraitClick = (theme: Theme, event: React.MouseEvent) => {
    event.stopPropagation(); // Prevent card click
    setPortraitTheme(theme);
    setIsPortraitModalOpen(true);
  };

  const handleImageGenerated = (imageUrl: string) => {
    if (portraitTheme) {
      updateThemeMutation.mutate({ 
        ...portraitTheme, 
        imageUrl,
        // Make sure to preserve any existing portraits array
        portraits: portraitTheme.portraits || []
      });
    }
  };

  const handleImageUploaded = (imageUrl: string) => {
    if (portraitTheme) {
      updateThemeMutation.mutate({ 
        ...portraitTheme, 
        imageUrl,
        // Make sure to preserve any existing portraits array
        portraits: portraitTheme.portraits || []
      });
    }
  };

  // Show theme detail view (which handles both viewing and editing)
  if (selectedTheme || isCreating) {
    return (
      <ThemeDetailView
        projectId={projectId}
        theme={selectedTheme}
        isCreating={isCreating}
        onBack={handleBackToList}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-title text-2xl">Themes</h2>
          <p className="text-muted-foreground">
            {themes.length} {themes.length === 1 ? 'theme' : 'themes'} in your world
          </p>
        </div>
        <div className="flex gap-2">
          <Button 
            onClick={handleCreateNew} 
            className="interactive-warm"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Theme
          </Button>
          <Button 
            onClick={handleOpenGenerationModal} 
            disabled={!project}
            variant="outline"
            className="border-accent/20 hover:bg-accent/10"
          >
            <Sparkles className="h-4 w-4 mr-2" />
            Generate Theme
          </Button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search themes by name, role, or race..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 creative-input"
        />
      </div>

      {/* Theme List */}
      {isLoading ? (
        <div className="text-center py-12 text-muted-foreground">
          <div className="animate-spin h-8 w-8 border-b-2 border-accent mx-auto mb-4"></div>
          <p>Loading themes...</p>
        </div>
      ) : filteredThemes.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          <Users className="h-24 w-24 mx-auto mb-6 opacity-30" />
          <h3 className="text-xl font-semibold mb-3">
            {themes.length === 0 ? 'No Themes Created' : 'No Themes Found'}
          </h3>
          <p className="mb-6">
            {themes.length === 0 
              ? 'Start building your cast of themes to bring your world to life.'
              : 'Try adjusting your search terms to find the theme you\'re looking for.'
            }
          </p>
          {themes.length === 0 && (
            <Button 
              onClick={handleCreateNew} 
              className="interactive-warm"
            >
              <Plus className="h-4 w-4 mr-2" />
              Create First Theme
            </Button>
          )}
        </div>
      ) : (
        <div className="grid gap-4">
          {filteredThemes.map((theme: Theme) => (
            <Card 
              key={theme.id} 
              className="creative-card cursor-pointer hover:shadow-lg transition-all duration-200 border-yellow-500/30 hover:border-yellow-500/50"
              onClick={() => handleEdit(theme)}
            >
              <CardContent className="p-4">
                <div className="flex items-start gap-4">
                  {/* Theme Image - Clickable */}
                  <div 
                    className="w-16 h-16 rounded-lg bg-gradient-to-br from-amber-100 to-orange-200 dark:from-amber-900/30 dark:to-orange-900/30 flex items-center justify-center flex-shrink-0 cursor-pointer hover:opacity-80 transition-opacity relative group"
                    onClick={(e) => handlePortraitClick(theme, e)}
                  >
                    {theme.imageUrl ? (
                      <img 
                        src={theme.imageUrl} 
                        alt={theme.name}
                        className="w-full h-full object-cover rounded-lg"
                      />
                    ) : (
                      <Edit className="h-8 w-8 text-amber-600 dark:text-amber-400" />
                    )}
                    
                    {/* Hover overlay */}
                    <div className="absolute inset-0 bg-black/50 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <Camera className="h-4 w-4 text-white" />
                    </div>
                  </div>

                  {/* Theme Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-lg mb-1 truncate">{theme.name || 'Unnamed Theme'}</h3>
                        {theme.title && (
                          <p className="text-sm text-muted-foreground mb-2 italic">"{theme.title}"</p>
                        )}
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
                              handleEdit(theme);
                            }}
                          >
                            <Edit2 className="h-4 w-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDelete(theme);
                            }}
                            className="text-destructive"
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>

                    {/* Badges - same as header */}
                    <div className="flex flex-wrap gap-2 mb-3">
                      {theme.role && (
                        <Badge variant="default" className="text-xs px-2 py-1">
                          {theme.role}
                        </Badge>
                      )}
                      {theme.class && (
                        <Badge variant="outline" className="text-xs">
                          {theme.class}
                        </Badge>
                      )}
                      {theme.age && (
                        <Badge variant="outline" className="text-xs">
                          Age {theme.age}
                        </Badge>
                      )}
                    </div>

                    {/* One-line or description */}
                    {theme.oneLine && (
                      <p className="text-sm italic text-muted-foreground mb-2">
                        "{theme.oneLine}"
                      </p>
                    )}
                    
                    {theme.description && !theme.oneLine && (
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {theme.description}
                      </p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Theme Portrait Modal */}
      {portraitTheme && (
        <ThemePortraitModal
          theme={portraitTheme}
          isOpen={isPortraitModalOpen}
          onClose={() => {
            setIsPortraitModalOpen(false);
            setPortraitTheme(null);
          }}
          onImageGenerated={handleImageGenerated}
          onImageUploaded={handleImageUploaded}
        />
      )}

      {/* Theme Generation Modal */}
      <ThemeGenerationModal
        isOpen={isGenerationModalOpen}
        onClose={() => setIsGenerationModalOpen(false)}
        onGenerate={handleGenerateTheme}
        isGenerating={isGenerating}
      />
    </div>
  );
}
