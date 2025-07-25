import React, { useState, useEffect, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { 
  Users, 
  MapPin, 
  Shield, 
  Package, 
  Sparkles, 
  Clock, 
  Scroll,
  Crown,
  Languages,
  Heart,
  Eye,
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
import { CharacterManager } from '../character';

interface WorldBibleProps {
  project: Project;
  onBack: () => void;
}

export function WorldBible({ project, onBack }: WorldBibleProps) {
  const [activeCategory, setActiveCategory] = useState('overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [draggedItem, setDraggedItem] = useState<string | null>(null);
  const [dragOverItem, setDragOverItem] = useState<string | null>(null);
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const [featuredCharacterOrder, setFeaturedCharacterOrder] = useState<string[]>([]);
  const [draggedCharacterId, setDraggedCharacterId] = useState<string | null>(null);
  const [dragOverCharacterId, setDragOverCharacterId] = useState<string | null>(null);

  // Fetch character data
  const { data: characters = [] } = useQuery<Character[]>({
    queryKey: ['/api/projects', project.id, 'characters'],
  });

  // Search functionality for characters
  const allWorldData = useMemo(() => {
    return characters.map(item => ({ ...item, category: 'characters', categoryLabel: 'Characters', icon: Users }));
  }, [characters]);

  // Search results based on query
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    
    const query = searchQuery.toLowerCase().trim();
    
    return allWorldData.filter(item => {
      // Search in name/title
      if (item.name?.toLowerCase().includes(query)) return true;
      if (item.title?.toLowerCase().includes(query)) return true;
      
      // Search in description
      if (item.description?.toLowerCase().includes(query)) return true;
      
      // Search in tags
      if (item.tags && Array.isArray(item.tags)) {
        if (item.tags.some((tag: string) => tag.toLowerCase().includes(query))) return true;
      }
      
      // Search in character-specific fields
      if (item.category === 'characters') {
        const searchFields = [
          item.race, item.occupation, item.background, item.personality,
          item.goals, item.fears, item.secrets
        ];
        if (searchFields.some(field => field?.toLowerCase().includes(query))) return true;
      }
      
      return false;
    });
  }, [allWorldData, searchQuery]);

  // Drag and drop handlers
  const handleDragStart = (e: React.DragEvent, categoryId: string) => {
    const category = categories.find(cat => cat.id === categoryId);
    if (category?.locked) {
      e.preventDefault();
      return;
    }
    setDraggedItem(categoryId);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent, categoryId: string) => {
    e.preventDefault();
    const category = categories.find(cat => cat.id === categoryId);
    if (category?.locked) return;
    
    setDragOverItem(categoryId);
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDragLeave = () => {
    setDragOverItem(null);
  };

  const handleDrop = (e: React.DragEvent, targetCategoryId: string) => {
    e.preventDefault();
    
    if (!draggedItem || draggedItem === targetCategoryId) {
      setDraggedItem(null);
      setDragOverItem(null);
      return;
    }

    const targetCategory = categories.find(cat => cat.id === targetCategoryId);
    if (targetCategory?.locked) {
      setDraggedItem(null);
      setDragOverItem(null);
      return;
    }

    const newCategories = [...categories];
    const draggedIndex = newCategories.findIndex(cat => cat.id === draggedItem);
    const targetIndex = newCategories.findIndex(cat => cat.id === targetCategoryId);

    // Don't allow moving before or after the locked overview
    if (targetIndex === 0 || (draggedIndex === 0)) {
      setDraggedItem(null);
      setDragOverItem(null);
      return;
    }

    // Remove dragged item and insert at target position
    const [draggedCategory] = newCategories.splice(draggedIndex, 1);
    newCategories.splice(targetIndex, 0, draggedCategory);

    setCategories(newCategories);
    setDraggedItem(null);
    setDragOverItem(null);
  };

  const handleDragEnd = () => {
    setDraggedItem(null);
    setDragOverItem(null);
  };

  // BloomWeaver World Data
  const worldData = {
    overview: {
      title: "Umbra Floris",
      subtitle: "The Realm of the BloomWeaver's Lament",
      description: "A world born from cosmic love gone wrong, where the Witch Essylt transformed herself into The Bloom out of unbearable longing for the Warlock Somnus, plunging the realm into a three-pronged apocalypse of sentient flora, corrupted dreams, and ancient Stone Lords.",
      coreThemes: [
        "Monstrousness of Misguided Love",
        "Individuality vs. Unity", 
        "Fragility of Reality",
        "Burden of History & Remembrance"
      ],
      horrorTypes: [
        "Cosmic Horror",
        "Body Horror", 
        "Psychological Horror",
        "Ontological Horror"
      ]
    },
    characters: []
  };

  // World Bible categories with drag-and-drop capability (moved after worldData definition)
  const [categories, setCategories] = useState([
    { id: 'overview', label: 'World Overview', icon: Globe, count: 1, locked: true },
    { id: 'characters', label: 'Characters', icon: Users, count: characters.length, locked: false }
  ]);

  // Update counts dynamically when data changes
  useEffect(() => {
    setCategories(prev => prev.map(cat => {
      switch (cat.id) {
        case 'characters': return { ...cat, count: characters.length };
        default: return cat;
      }
    }));
  }, [characters.length]);

  // Render search results
  const renderSearchResults = () => {
    if (searchResults.length === 0) {
      return (
        <div className="text-center py-12">
          <Search className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
          <h3 className="font-title text-xl mb-2">No Results Found</h3>
          <p className="text-muted-foreground mb-4">
            No items found for "{searchQuery}" in your world bible.
          </p>
          <Button 
            variant="outline" 
            onClick={() => setSearchQuery('')}
            className="interactive-warm"
          >
            Clear Search
          </Button>
        </div>
      );
    }

    // Group results by category
    const groupedResults = searchResults.reduce((acc, item) => {
      if (!acc[item.category]) {
        acc[item.category] = [];
      }
      acc[item.category].push(item);
      return acc;
    }, {} as Record<string, any[]>);

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-title text-2xl">Search Results</h2>
            <p className="text-muted-foreground">
              Found {searchResults.length} result{searchResults.length !== 1 ? 's' : ''} for "{searchQuery}"
            </p>
          </div>
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => setSearchQuery('')}
            className="interactive-warm"
          >
            <X className="h-4 w-4 mr-2" />
            Clear Search
          </Button>
        </div>

        {Object.entries(groupedResults).map(([category, items]) => {
          const categoryInfo = categories.find(cat => cat.id === category);
          if (!categoryInfo) return null;
          
          const Icon = categoryInfo.icon;
          const itemList = items as any[];
          
          return (
            <Card key={category} className="creative-card">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-3">
                  <Icon className="h-5 w-5" />
                  {categoryInfo.label}
                  <Badge variant="secondary" className="text-xs">
                    {itemList.length}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="grid gap-3">
                  {itemList.map((item: any) => (
                    <Card 
                      key={item.id} 
                      className="p-4 border-l-4 border-l-accent cursor-pointer hover:bg-muted/30 transition-colors"
                      onClick={() => {
                        // Set the selected item and navigate to its category
                        setSelectedItemId(item.id);
                        setActiveCategory(category);
                        setSearchQuery('');
                      }}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="font-semibold text-sm mb-1">
                            {item.name || item.title}
                          </h4>
                          {item.description && (
                            <p className="text-muted-foreground text-xs line-clamp-2 mb-2">
                              {item.description}
                            </p>
                          )}
                          {item.tags && item.tags.length > 0 && (
                            <div className="flex flex-wrap gap-1">
                              {item.tags.slice(0, 3).map((tag: string, index: number) => (
                                <Badge key={index} variant="outline" className="text-xs">
                                  {tag}
                                </Badge>
                              ))}
                              {item.tags.length > 3 && (
                                <Badge variant="outline" className="text-xs">
                                  +{item.tags.length - 3} more
                                </Badge>
                              )}
                            </div>
                          )}
                        </div>
                        <ChevronRight className="h-4 w-4 text-muted-foreground ml-2" />
                      </div>
                    </Card>
                  ))}
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
              <h3 className="text-xl text-muted-foreground mb-4">{worldData.overview.subtitle}</h3>
              <p className="text-lg leading-relaxed">{worldData.overview.description}</p>
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
            
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="creative-card">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Sword className="h-5 w-5 mr-2 text-accent" />
                    Core Themes
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {worldData.overview.coreThemes.map((theme, index) => (
                      <Badge key={index} variant="outline" className="mr-2 mb-2">
                        {theme}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="creative-card">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Eye className="h-5 w-5 mr-2 text-accent" />
                    Horror Types
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {worldData.overview.horrorTypes.map((type, index) => (
                      <Badge key={index} variant="secondary" className="mr-2 mb-2">
                        {type}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Featured Content Sections */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Featured Characters Section */}
              <Card className="creative-card">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span className="flex items-center">
                      <Users className="h-5 w-5 mr-2" />
                      Featured Characters
                    </span>
                    <Badge variant="outline">{characters.length}</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {characters.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <Users className="h-12 w-12 mx-auto mb-3 opacity-50" />
                      <p>No characters created yet</p>
                    </div>
                  ) : (
                    <div className="space-y-3 max-h-64 overflow-y-auto">
                      {(() => {
                        // Get featured characters in custom order, or default to first 4 characters
                        let featuredChars = characters;
                        
                        if (featuredCharacterOrder.length > 0) {
                          const orderedChars = featuredCharacterOrder
                            .map(id => characters.find(char => char.id === id))
                            .filter(Boolean) as Character[];
                          const remainingChars = characters.filter(char => !featuredCharacterOrder.includes(char.id!));
                          featuredChars = [...orderedChars, ...remainingChars];
                        }
                        
                        return featuredChars.slice(0, 4).map((character, index) => (
                          <div 
                            key={character.id} 
                            className={`group p-3 rounded-lg border-l-4 cursor-pointer flex items-center gap-3 transition-all duration-300 ease-out ${
                              draggedCharacterId === character.id 
                                ? 'bg-accent/25 border-accent scale-110 shadow-2xl z-20 opacity-90' 
                                : dragOverCharacterId === character.id
                                ? 'bg-accent/15 border-accent transform translate-y-2 scale-102 shadow-md'
                                : 'bg-muted/30 border-accent/50 hover:bg-accent/10 hover:border-accent hover:scale-105 hover:shadow-lg hover:-translate-y-1'
                            }`}
                            style={{
                              transform: draggedCharacterId === character.id 
                                ? 'rotate(3deg) scale(1.1)' 
                                : dragOverCharacterId === character.id
                                ? 'translateY(8px) scale(1.02)'
                                : 'rotate(0deg) scale(1)',
                            }}
                            onClick={() => {
                              if (!draggedCharacterId) {
                                setSelectedItemId(character.id!);
                                setActiveCategory('characters');
                              }
                            }}
                            draggable
                            onDragStart={(e) => {
                              setDraggedCharacterId(character.id!);
                              e.dataTransfer.setData('text/plain', character.id!);
                              e.dataTransfer.effectAllowed = 'move';
                            }}
                            onDragEnd={() => {
                              setDraggedCharacterId(null);
                              setDragOverCharacterId(null);
                            }}
                            onDragOver={(e) => {
                              e.preventDefault();
                              setDragOverCharacterId(character.id!);
                              e.dataTransfer.dropEffect = 'move';
                            }}
                            onDragLeave={() => {
                              setDragOverCharacterId(null);
                            }}
                            onDrop={(e) => {
                              e.preventDefault();
                              const draggedId = e.dataTransfer.getData('text/plain');
                              const currentOrder = featuredCharacterOrder.length > 0 ? featuredCharacterOrder : characters.map(c => c.id!);
                              const draggedIndex = currentOrder.findIndex(id => id === draggedId);
                              const dropIndex = index;
                              
                              if (draggedIndex !== -1 && draggedIndex !== dropIndex) {
                                const newOrder = [...currentOrder];
                                const [draggedItem] = newOrder.splice(draggedIndex, 1);
                                newOrder.splice(dropIndex, 0, draggedItem);
                                setFeaturedCharacterOrder(newOrder);
                              }
                              
                              setDraggedCharacterId(null);
                              setDragOverCharacterId(null);
                            }}
                          >
                            <div className="flex-shrink-0 transition-all duration-300">
                              {character.imageUrl ? (
                                <img 
                                  src={character.imageUrl} 
                                  alt={character.name}
                                  className={`w-10 h-10 rounded-full object-cover border-2 transition-all duration-300 ${
                                    draggedCharacterId === character.id
                                      ? 'border-accent shadow-lg scale-110'
                                      : 'border-accent/20 group-hover:border-accent/60 group-hover:scale-110 group-hover:shadow-md'
                                  }`}
                                />
                              ) : (
                                <div className={`w-10 h-10 rounded-full bg-accent/10 border-2 flex items-center justify-center transition-all duration-300 ${
                                  draggedCharacterId === character.id
                                    ? 'border-accent bg-accent/20 shadow-lg scale-110'
                                    : 'border-accent/20 group-hover:border-accent/60 group-hover:bg-accent/15 group-hover:scale-110'
                                }`}>
                                  <Users className="h-5 w-5 text-accent/60 group-hover:text-accent transition-colors duration-300" />
                                </div>
                              )}
                            </div>
                            <div className="flex-1 min-w-0 transition-all duration-300">
                              <div className={`font-medium text-sm truncate transition-all duration-300 ${
                                draggedCharacterId === character.id
                                  ? 'text-accent font-semibold'
                                  : 'group-hover:text-accent/90 group-hover:font-semibold'
                              }`}>
                                {character.name}
                              </div>
                              {character.title && (
                                <div className="text-xs text-muted-foreground truncate group-hover:text-muted-foreground/80 transition-colors duration-300">
                                  {character.title}
                                </div>
                              )}
                              {character.role && (
                                <Badge 
                                  variant="outline" 
                                  className={`text-xs mt-1 transition-all duration-300 ${
                                    draggedCharacterId === character.id
                                      ? 'border-accent/60 text-accent bg-accent/10'
                                      : 'group-hover:border-accent/50 group-hover:text-accent/80 group-hover:bg-accent/5'
                                  }`}
                                >
                                  {character.role}
                                </Badge>
                              )}
                            </div>
                            <div className={`flex-shrink-0 transition-all duration-300 ${
                              draggedCharacterId === character.id
                                ? 'opacity-100 scale-125 text-accent'
                                : draggedCharacterId
                                ? 'opacity-30'
                                : 'opacity-0 group-hover:opacity-100 group-hover:scale-110'
                            }`}>
                              <GripVertical className={`h-4 w-4 cursor-grab active:cursor-grabbing transition-all duration-300 ${
                                draggedCharacterId === character.id
                                  ? 'text-accent animate-pulse'
                                  : 'text-muted-foreground group-hover:text-accent/70'
                              }`} />
                            </div>
                          </div>
                        ));
                      })()}
                    </div>
                  )}
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="w-full mt-3" 
                    onClick={() => {
                      setActiveCategory('characters');
                      // Scroll to top when navigating to characters page
                      setTimeout(() => {
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }, 100);
                    }}
                  >
                    {characters.length === 0 ? 'Add First Character' : 'View All Characters'} →
                  </Button>
                </CardContent>
              </Card>


            </div>

            {/* Quick Actions */}
            <Card className="creative-card">
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 gap-3">
                  <Button variant="outline" size="sm" onClick={() => setActiveCategory('characters')}>
                    <Users className="h-4 w-4 mr-2" />
                    Add Character
                  </Button>
                </div>
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
              This section will contain detailed information about {activeCategory.replace('-', ' ')} from your BloomWeaver world.
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
            <p className="text-muted-foreground">The BloomWeaver's Lament</p>
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
            <Button 
              size="sm" 
              variant="outline"
              className={searchQuery ? "bg-accent/20" : ""}
            >
              <Search className="h-4 w-4" />
              {searchResults.length > 0 && (
                <Badge variant="secondary" className="ml-2 px-1 py-0 text-xs">
                  {searchResults.length}
                </Badge>
              )}
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar - Categories */}
          <div className="lg:col-span-1">
            <Card className="creative-card">
              <CardContent className="p-4">
                <div className="space-y-1">
                    {categories.map((category) => {
                      const Icon = category.icon;
                      const isDragging = draggedItem === category.id;
                      const isDragOver = dragOverItem === category.id;
                      
                      return (
                        <div
                          key={category.id}
                          draggable={!category.locked}
                          onDragStart={(e) => handleDragStart(e, category.id)}
                          onDragOver={(e) => handleDragOver(e, category.id)}
                          onDragLeave={handleDragLeave}
                          onDrop={(e) => handleDrop(e, category.id)}
                          onDragEnd={handleDragEnd}
                          className={`flex items-center justify-between p-3 rounded-lg transition-all duration-200 ${
                            activeCategory === category.id
                              ? 'bg-yellow-500/10 text-yellow-600 border border-yellow-500/30'
                              : 'hover:bg-muted/50'
                          } ${
                            category.locked 
                              ? 'cursor-default' 
                              : 'cursor-pointer'
                          } ${
                            isDragging 
                              ? 'opacity-50 scale-95 transform rotate-2' 
                              : ''
                          } ${
                            isDragOver && !category.locked 
                              ? 'border-2 border-accent border-dashed bg-accent/5' 
                              : ''
                          }`}
                          onClick={() => setActiveCategory(category.id)}
                        >
                          <div className="flex items-center space-x-3">
                            {!category.locked && (
                              <GripVertical 
                                className="h-4 w-4 text-muted-foreground hover:text-accent"
                              />
                            )}
                            <Icon className="h-4 w-4" />
                            <span className="text-sm font-medium">{category.label}</span>
                          </div>
                          {!category.locked && (
                            <Badge variant="outline" className="text-xs">
                              {category.count}
                            </Badge>
                          )}
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
    </div>
  );
}