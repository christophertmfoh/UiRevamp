import React, { useState, useEffect, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { apiRequest } from '@/lib/queryClient';
import { 
  Users, 
  MapPin, 
  Shield, 
  Package, 
  Sparkles, 
  Clock, 
  Scroll,
  Crown,

  Heart,
  Search,
  Plus,
  GripVertical,
  ChevronRight,
  Globe,
  Castle,
  Sword,
  X
} from 'lucide-react';
import type { Project, Character } from '../../lib/types';
import { CharacterManager } from '../character/CharacterManager';

interface WorldBibleProps {
  project: Project;
  onBack: () => void;
}

export function WorldBible({ project, onBack }: WorldBibleProps): React.JSX.Element {
  const [activeCategory, setActiveCategory] = useState('overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [draggedItem, setDraggedItem] = useState<string | null>(null);
  const [dragOverItem, setDragOverItem] = useState<string | null>(null);
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const [featuredCharacterOrder, setFeaturedCharacterOrder] = useState<string[]>([]);
  const [draggedCharacterId, setDraggedCharacterId] = useState<string | null>(null);
  const [dragOverCharacterId, setDragOverCharacterId] = useState<string | null>(null);
  const [isEditingSynopsis, setIsEditingSynopsis] = useState(false);
  const [synopsisText, setSynopsisText] = useState(project.synopsis || '');
  
  const queryClient = useQueryClient();

  // Fetch all world bible data for search
  const { data: characters = [] } = useQuery<Character[]>({
    queryKey: ['/api/projects', project.id, 'characters'],
  });

  // Filter featured characters based on the order
  const featuredCharacters = useMemo(() => {
    if (featuredCharacterOrder.length === 0) {
      return characters.slice(0, 6);
    }
    return featuredCharacterOrder
      .map(id => characters.find(char => char.id === id))
      .filter(Boolean)
      .slice(0, 6);
  }, [characters, featuredCharacterOrder]);

  // Categories for navigation
  const categories = [
    { id: 'overview', label: 'Overview', icon: Globe, count: 0 },
    { id: 'characters', label: 'Characters', icon: Users, count: characters.length },
  ];

  // Search across all data
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    
    const query = searchQuery.toLowerCase();
    const results: Array<{ type: string; item: any }> = [];

    // Search characters
    characters.forEach(char => {
      if (char.name?.toLowerCase().includes(query) || 
          char.description?.toLowerCase().includes(query) ||
          char.role?.toLowerCase().includes(query)) {
        results.push({ type: 'character', item: char });
      }
    });



    return results;
  }, [searchQuery, characters]);

  // Project update mutation
  const updateProjectMutation = useMutation({
    mutationFn: async (updatedProject: Partial<Project>) => {
      const response = await apiRequest('PUT', `/api/projects/${project.id}`, updatedProject);
      return response.json();
    },
    onSuccess: (updatedProject) => {
      // Update local project state immediately
      if (updatedProject.synopsis !== undefined) {
        project.synopsis = updatedProject.synopsis;
      }
      // Force refresh the project data
      queryClient.invalidateQueries({ queryKey: ['/api/projects'] });
      queryClient.invalidateQueries({ queryKey: ['/api/projects', project.id] });
    },
  });

  // World overview data
  const worldData = {
    overview: {
      title: project.name || 'Untitled Project',
      subtitle: project.type || 'Story',
      genres: Array.isArray(project.genre) ? project.genre : (project.genre ? [project.genre] : []),
      description: project.synopsis || project.description || 'Add a synopsis to describe your project...',
      coreThemes: ['Destiny vs. Free Will', 'Power and Corruption', 'Sacrifice and Redemption', 'Unity in Diversity'],
      majorConflicts: ['The Ancient Prophecy', 'War of the Five Kingdoms', 'The Dark Lord\'s Return'],
      keyMysteries: ['The Lost Bloodline', 'The Sealed Temple', 'The Forgotten Alliance']
    }
  };

  const handleSynopsisSubmit = () => {
    const newSynopsis = synopsisText.trim();
    updateProjectMutation.mutate({ synopsis: newSynopsis });
    // Update local state immediately for instant UI feedback
    project.synopsis = newSynopsis;
    setIsEditingSynopsis(false);
  };

  // Handle character drag and drop
  const handleCharacterDragStart = (e: React.DragEvent, characterId: string) => {
    setDraggedCharacterId(characterId);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleCharacterDragOver = (e: React.DragEvent, characterId: string) => {
    e.preventDefault();
    setDragOverCharacterId(characterId);
  };

  const handleCharacterDragLeave = () => {
    setDragOverCharacterId(null);
  };

  const handleCharacterDrop = (e: React.DragEvent, targetCharacterId: string) => {
    e.preventDefault();
    if (draggedCharacterId && draggedCharacterId !== targetCharacterId) {
      const currentOrder = featuredCharacterOrder.length > 0 ? 
        featuredCharacterOrder : 
        characters.slice(0, 6).map(char => char.id);
      
      const draggedIndex = currentOrder.indexOf(draggedCharacterId);
      const targetIndex = currentOrder.indexOf(targetCharacterId);
      
      if (draggedIndex !== -1 && targetIndex !== -1) {
        const newOrder = [...currentOrder];
        const [draggedItem] = newOrder.splice(draggedIndex, 1);
        newOrder.splice(targetIndex, 0, draggedItem);
        setFeaturedCharacterOrder(newOrder);
      }
    }
    setDraggedCharacterId(null);
    setDragOverCharacterId(null);
  };

  const renderSearchResults = () => {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="font-title text-2xl">Search Results</h2>
          <Badge variant="secondary">{searchResults.length} results</Badge>
        </div>
        
        {searchResults.map((result, index) => {
          const Icon = categories.find(cat => cat.id === result.type)?.icon || Package;
          return (
            <Card key={`${result.type}-${result.item.id}-${index}`} className="creative-card cursor-pointer hover:bg-muted/20 transition-colors">
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center mb-2">
                      <Icon className="h-4 w-4 mr-2 text-accent" />
                      <Badge variant="outline" className="text-xs mr-2">
                        {result.type}
                      </Badge>
                      <h4 className="font-semibold text-sm">{result.item.name}</h4>
                    </div>
                    {result.item.description && (
                      <p className="text-muted-foreground text-xs line-clamp-2 mb-2">
                        {result.item.description}
                      </p>
                    )}
                    {result.item.tags && result.item.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {result.item.tags.slice(0, 3).map((tag: string, index: number) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                        {result.item.tags.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{result.item.tags.length - 3} more
                          </Badge>
                        )}
                      </div>
                    )}
                  </div>
                  <ChevronRight className="h-4 w-4 text-muted-foreground ml-2" />
                </div>
              </CardContent>
            </Card>
          );
        })}
        </div>
      );
    };

  const renderCategoryContent = () => {
    switch (activeCategory) {
      case 'overview':
        return (
          <div className="space-y-8">
            <div>
              <h2 className="font-title text-3xl mb-2">{worldData.overview.title}</h2>
              <div className="flex items-center gap-2 mb-4">
                <Badge className="bg-gradient-to-r from-accent via-accent/90 to-accent/80 text-accent-foreground font-medium text-sm px-3 py-1.5 shadow-md border-0 rounded-full">
                  {worldData.overview.subtitle}
                </Badge>
                {worldData.overview.genres.map((genre, index) => (
                  <Badge key={index} className="bg-gradient-to-r from-accent via-accent/90 to-accent/80 text-accent-foreground font-medium text-sm px-3 py-1.5 shadow-md border-0 rounded-full">
                    {genre}
                  </Badge>
                ))}
              </div>
              {isEditingSynopsis ? (
                <div className="space-y-2">
                  <Textarea 
                    value={synopsisText}
                    onChange={(e) => setSynopsisText(e.target.value)}
                    placeholder="Enter a synopsis for your project..."
                    className="text-lg leading-relaxed min-h-24"
                  />
                  <div className="flex gap-2">
                    <Button onClick={handleSynopsisSubmit} size="sm" disabled={updateProjectMutation.isPending}>
                      {updateProjectMutation.isPending ? 'Saving...' : 'Save'}
                    </Button>
                    <Button onClick={() => {
                      setIsEditingSynopsis(false);
                      setSynopsisText(project.synopsis || '');
                    }} variant="outline" size="sm">
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <p 
                  className={`text-lg leading-relaxed cursor-pointer hover:bg-muted/20 rounded p-2 transition-colors ${
                    !project.synopsis ? 'text-muted-foreground italic' : ''
                  }`}
                  onClick={() => setIsEditingSynopsis(true)}
                >
                  {worldData.overview.description}
                </p>
              )}
            </div>

            {/* World Statistics Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {categories.filter(cat => cat.id !== 'overview').map(category => {
                const Icon = category.icon;
                return (
                  <div key={category.id} className="creative-card p-4 text-center cursor-pointer hover:bg-muted/20 transition-colors"
                       onClick={() => setActiveCategory(category.id)}>
                    <Icon className="h-6 w-6 mx-auto mb-2 text-accent" />
                    <div className="text-2xl font-bold text-accent">{category.count}</div>
                    <div className="text-sm text-muted-foreground">{category.label}</div>
                  </div>
                );
              })}
            </div>
            


            <Card className="creative-card">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Users className="h-5 w-5 mr-2 text-accent" />
                  Featured Characters
                </CardTitle>
                <CardDescription>
                  Key characters in your story (drag to reorder)
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {featuredCharacters.map((character) => (
                    character && <div
                      key={character.id}
                      draggable
                      onDragStart={(e) => handleCharacterDragStart(e, character.id)}
                      onDragOver={(e) => handleCharacterDragOver(e, character.id)}
                      onDragLeave={handleCharacterDragLeave}
                      onDrop={(e) => handleCharacterDrop(e, character.id)}
                      className={`creative-card p-4 cursor-move transition-all duration-200 ${
                        draggedCharacterId === character.id 
                          ? 'scale-105 rotate-3 shadow-lg opacity-80' 
                          : dragOverCharacterId === character.id 
                            ? 'scale-102 shadow-md bg-accent/5' 
                            : 'hover:scale-102 hover:shadow-lg'
                      }`}
                    >
                      <div className="flex items-center mb-3">
                        <GripVertical className={`h-4 w-4 mr-2 transition-all duration-200 ${
                          draggedCharacterId === character.id ? 'text-accent scale-125' : 'text-muted-foreground'
                        }`} />
                        <div className="flex-1">
                          <h4 className={`font-semibold text-sm transition-all duration-200 ${
                            draggedCharacterId === character.id ? 'text-accent font-bold' : ''
                          }`}>
                            {character.name}
                          </h4>
                          {character.role && (
                            <p className={`text-xs transition-all duration-200 ${
                              draggedCharacterId === character.id ? 'text-accent/80' : 'text-muted-foreground'
                            }`}>
                              {character.role}
                            </p>
                          )}
                        </div>
                      </div>
                      {character.displayImageId && (
                        <div className={`w-full h-24 bg-muted rounded-md mb-2 overflow-hidden transition-all duration-200 ${
                          draggedCharacterId === character.id ? 'ring-2 ring-accent glow-accent' : ''
                        }`}>
                          <img 
                            src={String(character.displayImageId)} 
                            alt={character.name || ''}
                            className={`w-full h-full object-cover transition-all duration-200 ${
                              draggedCharacterId === character.id ? 'scale-110' : 'hover:scale-105'
                            }`}
                          />
                        </div>
                      )}
                      {character.physicalDescription && (
                        <p className="text-xs text-muted-foreground line-clamp-2">
                          {character.physicalDescription}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
                {featuredCharacters.length === 0 && (
                  <div className="text-center py-8">
                    <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground mb-4">No characters created yet</p>
                    <Button onClick={() => setActiveCategory('characters')} className="interactive-warm">
                      <Plus className="h-4 w-4 mr-2" />
                      Create Characters
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        );

      case 'characters':
        return <CharacterManager projectId={project.id} selectedCharacterId={selectedItemId} onClearSelection={() => setSelectedItemId(null)} />;

      default:
        return (
          <div className="text-center py-16">
            <div className="mb-4">
              {categories.find(cat => cat.id === activeCategory)?.icon &&
                React.createElement(categories.find(cat => cat.id === activeCategory)!.icon, {
                  className: "h-16 w-16 mx-auto text-accent mb-4"
                })
              }
            </div>
            <h3 className="font-title text-2xl mb-2">
              {categories.find(cat => cat.id === activeCategory)?.label}
            </h3>
            <p className="text-muted-foreground mb-6">
              This section will contain detailed information about {activeCategory.replace('-', ' ')} from your world.
            </p>
            <Button variant="outline" className="interactive-warm">
              <Plus className="h-4 w-4 mr-2" />
              Add {categories.find(cat => cat.id === activeCategory)?.label}
            </Button>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="creative-card mb-8 p-6">
        <div className="flex items-center justify-between">
          <Button variant="ghost" size="sm" onClick={onBack} className="interactive-warm">
            ← Back to Dashboard
          </Button>
          <div className="text-center flex-1">
            <h1 className="font-title text-3xl">World Bible</h1>
          </div>
          <div className="flex items-center space-x-2">
            <div className="relative">
              <Input
                placeholder="Search world..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-64 pr-8"
              />
              {searchQuery && (
                <Button
                  size="sm"
                  variant="ghost"
                  className="absolute right-1 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
                  onClick={() => setSearchQuery('')}
                >
                  <X className="h-3 w-3" />
                </Button>
              )}
            </div>
            <Button size="sm" variant="outline" className="interactive-warm">
              <Search className="h-4 w-4 mr-2" />
              Filter
            </Button>
          </div>
        </div>
      </header>

      <div className="grid lg:grid-cols-4 gap-8">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <Card className="creative-card">
            <CardHeader>
              <CardTitle>Categories</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="space-y-1">
                {categories.map(category => {
                  const Icon = category.icon;
                  const isActive = activeCategory === category.id;
                  const isDragging = draggedItem === category.id;
                  const isDragOver = dragOverItem === category.id;
                  
                  return (
                    <div
                      key={category.id}
                      onClick={() => setActiveCategory(category.id)}
                      className={`flex items-center justify-between p-3 cursor-pointer transition-all duration-200 mx-3 my-1 rounded-lg ${
                        isActive 
                          ? 'bg-accent text-accent-foreground shadow-md' 
                          : isDragging 
                            ? 'bg-accent/20 scale-105 shadow-lg' 
                            : isDragOver 
                              ? 'bg-accent/10 scale-102' 
                              : 'hover:bg-muted/50'
                      }`}
                    >
                      <div className="flex items-center">
                        {category.id !== 'overview' && (
                          <GripVertical 
                            className={`h-3 w-3 mr-2 transition-all duration-200 ${
                              isDragging ? 'text-accent scale-125' : 'text-muted-foreground/50'
                            }`}
                          />
                        )}
                        <Icon className="h-4 w-4" />
                        <span className="text-sm font-medium">{category.label}</span>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {category.count}
                      </Badge>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3">
          <Card className="creative-card">
            <CardContent className="p-6">
              {searchQuery ? renderSearchResults() : renderCategoryContent()}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}