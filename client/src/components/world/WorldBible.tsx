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
import { LocationManager } from '../location';
import { FactionManager } from '../faction';
import { ItemManager } from '../item';
import { OrganizationManager } from '../organization';
import { MagicSystemManager } from '../magic-system';
import { TimelineEventManager } from '../timeline-event';
import { CreatureManager } from '../creature';
import { LanguageManager } from '../language';
import { CultureManager } from '../culture';
import { ProphecyManager } from '../prophecy';
import { ThemeManager } from '../theme';

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

  // Fetch all world bible data for search
  const { data: characters = [] } = useQuery<Character[]>({
    queryKey: ['/api/projects', project.id, 'characters'],
  });

  const { data: locations = [] } = useQuery<any[]>({
    queryKey: ['/api/projects', project.id, 'locations'],
  });

  const { data: factions = [] } = useQuery<any[]>({
    queryKey: ['/api/projects', project.id, 'factions'],
  });

  const { data: items = [] } = useQuery<any[]>({
    queryKey: ['/api/projects', project.id, 'items'],
  });

  const { data: organizations = [] } = useQuery<any[]>({
    queryKey: ['/api/projects', project.id, 'organizations'],
  });

  const { data: magicSystems = [] } = useQuery<any[]>({
    queryKey: ['/api/projects', project.id, 'magic-systems'],
  });

  const { data: timelineEvents = [] } = useQuery<any[]>({
    queryKey: ['/api/projects', project.id, 'timeline-events'],
  });

  const { data: creatures = [] } = useQuery<any[]>({
    queryKey: ['/api/projects', project.id, 'creatures'],
  });

  const { data: languages = [] } = useQuery<any[]>({
    queryKey: ['/api/projects', project.id, 'languages'],
  });

  const { data: cultures = [] } = useQuery<any[]>({
    queryKey: ['/api/projects', project.id, 'cultures'],
  });

  const { data: prophecies = [] } = useQuery<any[]>({
    queryKey: ['/api/projects', project.id, 'prophecies'],
  });

  const { data: themes = [] } = useQuery<any[]>({
    queryKey: ['/api/projects', project.id, 'themes'],
  });

  // Global search functionality across all world bible categories
  const allWorldData = useMemo(() => {
    return [
      ...characters.map(item => ({ ...item, category: 'characters', categoryLabel: 'Characters', icon: Users })),
      ...locations.map(item => ({ ...item, category: 'locations', categoryLabel: 'Locations', icon: MapPin })),
      ...factions.map(item => ({ ...item, category: 'factions', categoryLabel: 'Factions', icon: Shield })),
      ...items.map(item => ({ ...item, category: 'items', categoryLabel: 'Items', icon: Package })),
      ...organizations.map(item => ({ ...item, category: 'organizations', categoryLabel: 'Organizations', icon: Crown })),
      ...magicSystems.map(item => ({ ...item, category: 'magic-systems', categoryLabel: 'Magic Systems', icon: Sparkles })),
      ...timelineEvents.map(item => ({ ...item, category: 'timeline-events', categoryLabel: 'Timeline', icon: Clock })),
      ...creatures.map(item => ({ ...item, category: 'creatures', categoryLabel: 'Creatures', icon: Eye })),
      ...languages.map(item => ({ ...item, category: 'languages', categoryLabel: 'Languages', icon: Languages })),
      ...cultures.map(item => ({ ...item, category: 'cultures', categoryLabel: 'Cultures', icon: Heart })),
      ...prophecies.map(item => ({ ...item, category: 'prophecies', categoryLabel: 'Prophecies', icon: Scroll })),
      ...themes.map(item => ({ ...item, category: 'themes', categoryLabel: 'Themes', icon: Globe })),
    ];
  }, [characters, locations, factions, items, organizations, magicSystems, timelineEvents, creatures, languages, cultures, prophecies, themes]);

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
      
      // Search in specific fields based on category
      if (item.category === 'characters') {
        const searchFields = [
          item.race, item.occupation, item.background, item.personality,
          item.appearance, item.goals, item.fears, item.secrets
        ];
        if (searchFields.some(field => field?.toLowerCase().includes(query))) return true;
      }
      
      if (item.category === 'locations') {
        const searchFields = [item.history, item.significance, item.atmosphere];
        if (searchFields.some(field => field?.toLowerCase().includes(query))) return true;
      }
      
      if (item.category === 'factions') {
        const searchFields = [item.goals, item.methods, item.history, item.leadership];
        if (searchFields.some(field => field?.toLowerCase().includes(query))) return true;
      }
      
      if (item.category === 'magic-systems') {
        const searchFields = [item.type, item.source, item.limitations, item.corruption];
        if (searchFields.some(field => field?.toLowerCase().includes(query))) return true;
        if (item.practitioners && Array.isArray(item.practitioners)) {
          if (item.practitioners.some((p: string) => p.toLowerCase().includes(query))) return true;
        }
        if (item.effects && Array.isArray(item.effects)) {
          if (item.effects.some((e: string) => e.toLowerCase().includes(query))) return true;
        }
      }
      
      if (item.category === 'timeline-events') {
        const searchFields = [item.era, item.period, item.significance, item.consequences];
        if (searchFields.some(field => field?.toLowerCase().includes(query))) return true;
        if (item.participants && Array.isArray(item.participants)) {
          if (item.participants.some((p: string) => p.toLowerCase().includes(query))) return true;
        }
      }
      
      if (item.category === 'creatures') {
        const searchFields = [
          item.species, item.classification, item.habitat, item.behavior, 
          item.threat, item.significance
        ];
        if (searchFields.some(field => field?.toLowerCase().includes(query))) return true;
        if (item.abilities && Array.isArray(item.abilities)) {
          if (item.abilities.some((a: string) => a.toLowerCase().includes(query))) return true;
        }
      }
      
      if (item.category === 'prophecies') {
        const searchFields = [item.text, item.origin, item.interpretation, item.fulfillment];
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
    characters: [],
    locations: locations,
    factions: [
      {
        name: "The Cultist Group",
        type: "Apocalyptic Cult",
        description: "Emerged from despair, believing the Dream Weaver's 'uncontrolled' dreaming is the source of chaos. Aim to harness dream power to impose absolute order.",
        goals: ["Corrupt the Dream Weaver", "Impose absolute order", "Control reality through dreams"],
        methods: ["Psychological manipulation", "Dream corruption", "Chaos-pattern injection"],
        status: "Active/Primary Antagonist",
        threat: "Directly responsible for triggering the cataclysm"
      },
      {
        name: "The Stone Lords", 
        type: "Ancient Magical Nobility",
        description: "Kings and lords who harnessed magic to infuse their essence into colossal stone monuments. Now awakened and rampaging during the championships.",
        goals: ["Cement legacies", "Demonstrate power", "Relive past glory"],
        methods: ["Earth manipulation", "Monument animation", "Historical echo projection"],
        status: "Awakened/Chaotic",
        threat: "Widespread destruction through ancient power"
      }
    ],
    organizations: [
      {
        name: "Great Stone Lord Championships",
        type: "Ancient Competition",
        description: "Grand spectacle where Stone Lords demonstrate their power through colossal monument animation and earth manipulation contests.",
        structure: "Ceremonial hierarchy with ancient protocols",
        status: "Active during cataclysm",
        significance: "Backdrop for the apocalyptic events"
      }
    ],
    magic: [
      {
        name: "The Flow of Magic",
        type: "Cosmic Phenomenon",
        description: "Widespread magic that emerged from the intertwined emanations of The Bloom and Dream Weaver. Enabled diverse magical classes and Stone Lord power.",
        source: "Essylt (Bloom) + Somnus (Dream Weaver)",
        effects: ["Enabled magical classes", "Stone Lord essence infusion", "Reality manipulation"],
        corruption: "Now tainted by Dream Weaver's corruption and Bloom's forced unity"
      },
      {
        name: "Dream Weaving",
        type: "Cosmic Magic",
        description: "Somnus's mastered art of manipulating dreams and reality through dreamscape. Now corrupted by cultists to manifest nightmares as Waking Phantoms.",
        practitioners: ["Somnus (Dream Weaver)", "Cultists (corrupted version)"],
        effects: ["Reality manipulation", "Dream control", "Nightmare manifestation"],
        corruption: "Seed nightmares and chaos-patterns injected by cultists"
      },
      {
        name: "Bloom Integration", 
        type: "Assimilation Magic",
        description: "Essylt's power to absorb and integrate living beings into the fungal hive mind. Transforms individuals while preserving their essence in collective consciousness.",
        practitioners: ["Essylt (The Bloom)", "Bloom-assimilated creatures"],
        effects: ["Consciousness integration", "Physical transformation", "Hive mind expansion"],
        purpose: "Create unified solace and end individual suffering"
      }
    ],
    timeline: [
      {
        era: "Primordial Era",
        period: "Before Flow of Magic",
        events: [
          "Silent Earth: World devoid of widespread magic",
          "Cosmic Arcana manifestation: Essylt and Somnus bound by absolute magical love",
          "Rudimentary societies, dormant cosmic energies"
        ]
      },
      {
        era: "The Separation",
        period: "Warlock's Journey", 
        events: [
          "Somnus embarks on cosmic journey to master dreamweaving",
          "Essylt consumed by loneliness and longing",
          "Essylt transforms into The Bloom as testament of love"
        ]
      },
      {
        era: "Age of Magic",
        period: "Dream Weaver's Return",
        events: [
          "Somnus returns as Dream Weaver, finds Essylt transformed", 
          "Garden of Expanse becomes cosmic focal point",
          "Flow of Magic emerges from their combined emanations",
          "Rise of magical classes and Stone Lords",
          "Cycles of decline, terror, and meaningless conflict"
        ]
      },
      {
        era: "The Cataclysm",
        period: "Present Crisis",
        events: [
          "Great Stone Lord Championships begin",
          "Cultists corrupt Dream Weaver with seed nightmares",
          "Waking Phantoms manifest across the realm", 
          "Bloom rapidly expands to engulf realm in protective hive mind",
          "Stone Lords awaken and rampage",
          "Heroes unite inadvertently, Chronicler documents"
        ]
      }
    ]
  };

  // World Bible categories with drag-and-drop capability (moved after worldData definition)
  const [categories, setCategories] = useState([
    { id: 'overview', label: 'World Overview', icon: Globe, count: 1, locked: true },
    { id: 'characters', label: 'Characters', icon: Users, count: characters.length, locked: false },
    { id: 'locations', label: 'Locations', icon: MapPin, count: locations.length, locked: false },
    { id: 'factions', label: 'Factions', icon: Shield, count: factions.length, locked: false },
    { id: 'organizations', label: 'Organizations', icon: Crown, count: organizations.length, locked: false },
    { id: 'items', label: 'Items & Artifacts', icon: Package, count: items.length, locked: false },
    { id: 'magic', label: 'Magic & Lore', icon: Sparkles, count: magicSystems.length, locked: false },
    { id: 'timeline', label: 'Timeline', icon: Clock, count: timelineEvents.length, locked: false },
    { id: 'bestiary', label: 'Bestiary', icon: Eye, count: creatures.length, locked: false },
    { id: 'languages', label: 'Languages', icon: Languages, count: languages.length, locked: false },
    { id: 'culture', label: 'Culture', icon: Heart, count: cultures.length, locked: false },
    { id: 'prophecies', label: 'Prophecies', icon: Scroll, count: prophecies.length, locked: false },
    { id: 'themes', label: 'Themes', icon: Sword, count: themes.length, locked: false }
  ]);

  // Update counts dynamically when data changes
  useEffect(() => {
    setCategories(prev => prev.map(cat => {
      switch (cat.id) {
        case 'characters': return { ...cat, count: characters.length };
        case 'locations': return { ...cat, count: locations.length };
        case 'factions': return { ...cat, count: factions.length };
        case 'organizations': return { ...cat, count: organizations.length };
        case 'items': return { ...cat, count: items.length };
        case 'magic': return { ...cat, count: magicSystems.length };
        case 'timeline': return { ...cat, count: timelineEvents.length };
        case 'bestiary': return { ...cat, count: creatures.length };
        case 'languages': return { ...cat, count: languages.length };
        case 'culture': return { ...cat, count: cultures.length };
        case 'prophecies': return { ...cat, count: prophecies.length };
        case 'themes': return { ...cat, count: themes.length };
        default: return cat;
      }
    }));
  }, [
    characters.length, 
    locations.length, 
    factions.length, 
    organizations.length, 
    items.length, 
    magicSystems.length, 
    timelineEvents.length, 
    creatures.length, 
    languages.length, 
    cultures.length, 
    prophecies.length, 
    themes.length
  ]);

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

        {Object.entries(groupedResults).map(([category, items]: [string, any[]]) => {
          const categoryInfo = categories.find(cat => cat.id === category);
          if (!categoryInfo) return null;
          
          const Icon = categoryInfo.icon;
          
          return (
            <Card key={category} className="creative-card">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-3">
                  <Icon className="h-5 w-5" />
                  {categoryInfo.label}
                  <Badge variant="secondary" className="text-xs">
                    {items.length}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="grid gap-3">
                  {items.map((item: any) => (
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
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">{characters.length}</Badge>
                      {characters.length > 0 && (
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => {
                            // Toggle ordering mode or show all characters
                            setActiveCategory('characters');
                          }}
                          className="text-xs hover:bg-accent/10"
                        >
                          Manage
                        </Button>
                      )}
                    </div>
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
                            className="group p-3 bg-muted/30 rounded-lg border-l-4 border-accent/50 cursor-pointer hover:bg-muted/40 transition-colors flex items-center gap-3"
                            onClick={() => {
                              setSelectedItemId(character.id!);
                              setActiveCategory('characters');
                            }}
                            draggable
                            onDragStart={(e) => {
                              e.dataTransfer.setData('text/plain', character.id!);
                              e.dataTransfer.effectAllowed = 'move';
                            }}
                            onDragOver={(e) => {
                              e.preventDefault();
                              e.dataTransfer.dropEffect = 'move';
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
                            }}
                          >
                            <div className="flex-shrink-0">
                              {character.imageUrl ? (
                                <img 
                                  src={character.imageUrl} 
                                  alt={character.name}
                                  className="w-10 h-10 rounded-full object-cover border-2 border-accent/20"
                                />
                              ) : (
                                <div className="w-10 h-10 rounded-full bg-accent/10 border-2 border-accent/20 flex items-center justify-center">
                                  <Users className="h-5 w-5 text-accent/60" />
                                </div>
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="font-medium text-sm truncate">{character.name}</div>
                              {character.title && (
                                <div className="text-xs text-muted-foreground truncate">{character.title}</div>
                              )}
                              {character.role && (
                                <Badge variant="outline" className="text-xs mt-1">
                                  {character.role}
                                </Badge>
                              )}
                            </div>
                            <div className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                              <GripVertical className="h-4 w-4 text-muted-foreground cursor-grab" />
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
                    onClick={() => setActiveCategory('characters')}
                  >
                    {characters.length === 0 ? 'Add First Character' : 'View All Characters'} →
                  </Button>
                </CardContent>
              </Card>

              {/* Locations Section */}
              <Card className="creative-card">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span className="flex items-center">
                      <MapPin className="h-5 w-5 mr-2" />
                      Important Locations
                    </span>
                    <Badge variant="outline">{categories.find(cat => cat.id === 'locations')?.count || 0}</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {locations.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <MapPin className="h-12 w-12 mx-auto mb-3 opacity-50" />
                      <p>No locations created yet</p>
                    </div>
                  ) : (
                    locations.slice(0, 3).map((location, index) => (
                      <div key={index} className="p-3 bg-muted/30 rounded-lg border-l-4 border-green-500/50">
                        <div className="font-medium">{location.name}</div>
                        <div className="text-sm text-muted-foreground">{location.description?.substring(0, 80)}...</div>
                      </div>
                    ))
                  )}
                  <Button variant="ghost" size="sm" className="w-full mt-3" onClick={() => setActiveCategory('locations')}>
                    View All Locations →
                  </Button>
                </CardContent>
              </Card>

              {/* Factions Section */}
              <Card className="creative-card">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span className="flex items-center">
                      <Shield className="h-5 w-5 mr-2" />
                      Major Factions
                    </span>
                    <Badge variant="outline">{categories.find(cat => cat.id === 'factions')?.count || 0}</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {worldData.factions.slice(0, 2).map((faction, index) => (
                    <div key={index} className="p-3 bg-muted/30 rounded-lg border-l-4 border-red-500/50">
                      <div className="font-medium">{faction.name}</div>
                      <div className="text-sm text-muted-foreground">{faction.type}</div>
                      <div className="flex gap-1 mt-1">
                        <Badge variant="destructive" className="text-xs">{faction.threat}</Badge>
                        <Badge variant="outline" className="text-xs">{faction.status}</Badge>
                      </div>
                    </div>
                  ))}
                  <Button variant="ghost" size="sm" className="w-full mt-3" onClick={() => setActiveCategory('factions')}>
                    View All Factions →
                  </Button>
                </CardContent>
              </Card>

              {/* Timeline Section */}
              <Card className="creative-card">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span className="flex items-center">
                      <Clock className="h-5 w-5 mr-2" />
                      Recent Timeline
                    </span>
                    <Badge variant="outline">{categories.find(cat => cat.id === 'timeline')?.count || 0}</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {worldData.timeline.slice(-2).map((era, index) => (
                    <div key={index} className="p-3 bg-muted/30 rounded-lg border-l-4 border-blue-500/50">
                      <div className="font-medium">{era.era}</div>
                      <div className="text-sm text-muted-foreground">{era.period}</div>
                      <Badge variant="secondary" className="mt-1 text-xs">
                        {era.events.length} events
                      </Badge>
                    </div>
                  ))}
                  <Button variant="ghost" size="sm" className="w-full mt-3" onClick={() => setActiveCategory('timeline')}>
                    View Full Timeline →
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
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <Button variant="outline" size="sm" onClick={() => setActiveCategory('characters')}>
                    <Users className="h-4 w-4 mr-2" />
                    Add Character
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => setActiveCategory('locations')}>
                    <MapPin className="h-4 w-4 mr-2" />
                    Add Location
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => setActiveCategory('magic')}>
                    <Sparkles className="h-4 w-4 mr-2" />
                    Add Magic System
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => setActiveCategory('timeline')}>
                    <Clock className="h-4 w-4 mr-2" />
                    Add Event
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case 'characters':
        return <CharacterManager projectId={project.id} selectedCharacterId={selectedItemId} onClearSelection={() => setSelectedItemId(null)} />;

      case 'locations':
        return <LocationManager projectId={project.id} selectedLocationId={selectedItemId} onClearSelection={() => setSelectedItemId(null)} />;

      case 'factions':
        return <FactionManager projectId={project.id} selectedFactionId={selectedItemId} onClearSelection={() => setSelectedItemId(null)} />;

      case 'magic':
        return <MagicSystemManager projectId={project.id} selectedMagicSystemId={selectedItemId} onClearSelection={() => setSelectedItemId(null)} />;

      case 'timeline':
        return <TimelineEventManager projectId={project.id} selectedTimelineEventId={selectedItemId} onClearSelection={() => setSelectedItemId(null)} />;

      case 'items':
        return <ItemManager projectId={project.id} selectedItemId={selectedItemId} onClearSelection={() => setSelectedItemId(null)} />;

      case 'organizations':
        return <OrganizationManager projectId={project.id} selectedOrganizationId={selectedItemId} onClearSelection={() => setSelectedItemId(null)} />;

      case 'bestiary':
        return <CreatureManager projectId={project.id} selectedCreatureId={selectedItemId} onClearSelection={() => setSelectedItemId(null)} />;

      case 'languages':
        return <LanguageManager projectId={project.id} selectedLanguageId={selectedItemId} onClearSelection={() => setSelectedItemId(null)} />;

      case 'culture':
        return <CultureManager projectId={project.id} selectedCultureId={selectedItemId} onClearSelection={() => setSelectedItemId(null)} />;

      case 'prophecies':
        return <ProphecyManager projectId={project.id} selectedProphecyId={selectedItemId} onClearSelection={() => setSelectedItemId(null)} />;

      case 'themes':
        return <ThemeManager projectId={project.id} selectedThemeId={selectedItemId} onClearSelection={() => setSelectedItemId(null)} />;

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