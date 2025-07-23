import React, { useState } from 'react';
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
  Sword
} from 'lucide-react';
import type { Project } from '../lib/types';

interface WorldBibleProps {
  project: Project;
  onBack: () => void;
}

export function WorldBible({ project, onBack }: WorldBibleProps) {
  const [activeCategory, setActiveCategory] = useState('overview');
  const [searchQuery, setSearchQuery] = useState('');

  // World Bible categories with drag-and-drop capability
  const [categories] = useState([
    { id: 'overview', label: 'World Overview', icon: Globe, count: 1 },
    { id: 'characters', label: 'Characters', icon: Users, count: 15 },
    { id: 'locations', label: 'Locations', icon: MapPin, count: 8 },
    { id: 'factions', label: 'Factions', icon: Shield, count: 6 },
    { id: 'organizations', label: 'Organizations', icon: Crown, count: 4 },
    { id: 'items', label: 'Items & Artifacts', icon: Package, count: 12 },
    { id: 'magic', label: 'Magic & Lore', icon: Sparkles, count: 7 },
    { id: 'timeline', label: 'Timeline', icon: Clock, count: 20 },
    { id: 'bestiary', label: 'Bestiary', icon: Eye, count: 9 },
    { id: 'languages', label: 'Languages', icon: Languages, count: 3 },
    { id: 'culture', label: 'Culture', icon: Heart, count: 5 },
    { id: 'prophecies', label: 'Prophecies', icon: Scroll, count: 2 },
    { id: 'themes', label: 'Themes', icon: Sword, count: 8 }
  ]);

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
    characters: [
      {
        name: "Essylt (The Witch/The Bloom)",
        role: "Cosmic Arcana - The Bloom",
        description: "Transformed herself into a sentient fungal entity out of unbearable longing for Somnus. Now exists as a realm-spanning hive mind seeking to engulf all in unified solace.",
        status: "Transformed/Active",
        relationships: ["Bound to Somnus by absolute magical love", "Origin of The Bloom"],
        powers: ["Sentient Flora Control", "Hive Mind Integration", "Reality Assimilation"],
        motivations: "End loneliness, create unified reality for Somnus's return"
      },
      {
        name: "Somnus (The Warlock/Dream Weaver)",
        role: "Cosmic Arcana - Dream Weaver", 
        description: "Journeyed into the Cosmos to master dreamweaving, returned to find Essylt transformed. Now corrupted by cultists, his nightmares manifest as Waking Phantoms.",
        status: "Corrupted/Active",
        relationships: ["Bound to Essylt by absolute magical love", "Manipulated by Cultists"],
        powers: ["Dream Manipulation", "Reality Weaving", "Nightmare Manifestation"],
        motivations: "Originally sought to commune with transformed Essylt, now corrupted toward chaos"
      },
      {
        name: "Aris Vellum",
        role: "The Chronicler",
        description: "A lone documenter seeking to record the truth of the apocalypse. Questions the meaning of preserving records of a world losing its dreams.",
        status: "Active/Investigating",
        relationships: ["Eventually converges with the party"],
        powers: ["Documentation", "Historical Research", "Truth Seeking"],
        motivations: "Document the horror, seek meaning in bearing witness"
      }
    ],
    locations: [
      {
        name: "The Garden of Expanse",
        type: "Cosmic Origin Point",
        description: "Heart of the tragic beginning where Essylt transformed into The Bloom. The place where Somnus solidified his essence as the Dream Weaver. Origin point of both the Bloom and corrupted dreams.",
        significance: "Epicenter of the cataclysm",
        threats: ["Concentrated Bloom presence", "Reality distortion", "Dream corruption"],
        connections: ["The Bloom's starting point", "Dream Weaver's manifestation site"]
      },
      {
        name: "The Somnus Verdant",
        type: "Central Continent",
        description: "Sprawling landmass with dense forests, winding rivers, and plains. Most fertile and populated region, now being rapidly consumed by The Bloom's expansion.",
        significance: "Primary populated area",
        threats: ["Bloom assimilation", "Waking Phantoms", "Stone Lord rampage"],
        connections: ["Contains Garden of Expanse", "Stone Lord territories"]
      }
    ],
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

  const renderCategoryContent = () => {
    switch (activeCategory) {
      case 'overview':
        return (
          <div className="space-y-6">
            <div>
              <h2 className="font-title text-3xl mb-2">{worldData.overview.title}</h2>
              <h3 className="text-xl text-muted-foreground mb-4">{worldData.overview.subtitle}</h3>
              <p className="text-lg leading-relaxed">{worldData.overview.description}</p>
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
          </div>
        );

      case 'characters':
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-title text-2xl">Characters</h2>
              <Button size="sm" className="interactive-warm">
                <Plus className="h-4 w-4 mr-2" />
                Add Character
              </Button>
            </div>
            
            <div className="grid gap-4">
              {worldData.characters.map((character, index) => (
                <Card key={index} className="creative-card">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-xl">{character.name}</CardTitle>
                        <CardDescription className="text-accent font-medium">
                          {character.role}
                        </CardDescription>
                      </div>
                      <Badge variant={character.status.includes('Active') ? 'default' : 'secondary'}>
                        {character.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="mb-4">{character.description}</p>
                    
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-semibold mb-2">Powers & Abilities</h4>
                        <div className="space-y-1">
                          {character.powers.map((power, i) => (
                            <Badge key={i} variant="outline" className="mr-2 mb-1 text-xs">
                              {power}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="font-semibold mb-2">Motivations</h4>
                        <p className="text-sm text-muted-foreground">{character.motivations}</p>
                      </div>
                    </div>
                    
                    <div className="mt-4">
                      <h4 className="font-semibold mb-2">Key Relationships</h4>
                      <div className="space-y-1">
                        {character.relationships.map((rel, i) => (
                          <div key={i} className="text-sm text-muted-foreground">• {rel}</div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        );

      case 'locations':
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-title text-2xl">Locations</h2>
              <Button size="sm" className="interactive-warm">
                <Plus className="h-4 w-4 mr-2" />
                Add Location
              </Button>
            </div>
            
            <div className="grid gap-4">
              {worldData.locations.map((location, index) => (
                <Card key={index} className="creative-card">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-xl">{location.name}</CardTitle>
                        <CardDescription className="text-accent font-medium">
                          {location.type}
                        </CardDescription>
                      </div>
                      <MapPin className="h-5 w-5 text-muted-foreground" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="mb-4">{location.description}</p>
                    
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-semibold mb-2">Significance</h4>
                        <p className="text-sm text-muted-foreground">{location.significance}</p>
                      </div>
                      
                      <div>
                        <h4 className="font-semibold mb-2">Threats</h4>
                        <div className="space-y-1">
                          {location.threats.map((threat, i) => (
                            <div key={i} className="text-sm text-red-400">• {threat}</div>
                          ))}
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-4">
                      <h4 className="font-semibold mb-2">Connections</h4>
                      <div className="space-y-1">
                        {location.connections.map((conn, i) => (
                          <div key={i} className="text-sm text-muted-foreground">• {conn}</div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        );

      case 'factions':
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-title text-2xl">Factions</h2>
              <Button size="sm" className="interactive-warm">
                <Plus className="h-4 w-4 mr-2" />
                Add Faction
              </Button>
            </div>
            
            <div className="grid gap-4">
              {worldData.factions.map((faction, index) => (
                <Card key={index} className="creative-card">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-xl">{faction.name}</CardTitle>
                        <CardDescription className="text-accent font-medium">
                          {faction.type}
                        </CardDescription>
                      </div>
                      <Badge variant={faction.status.includes('Active') ? 'destructive' : 'default'}>
                        {faction.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="mb-4">{faction.description}</p>
                    
                    <div className="grid md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <h4 className="font-semibold mb-2">Goals</h4>
                        <div className="space-y-1">
                          {faction.goals.map((goal, i) => (
                            <div key={i} className="text-sm text-muted-foreground">• {goal}</div>
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="font-semibold mb-2">Methods</h4>
                        <div className="space-y-1">
                          {faction.methods.map((method, i) => (
                            <div key={i} className="text-sm text-muted-foreground">• {method}</div>
                          ))}
                        </div>
                      </div>
                    </div>
                    
                    <div className="p-3 bg-red-950/20 border border-red-800/30 rounded-lg">
                      <h4 className="font-semibold mb-1 text-red-400">Threat Level</h4>
                      <p className="text-sm text-red-300">{faction.threat}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        );

      case 'magic':
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-title text-2xl">Magic & Lore</h2>
              <Button size="sm" className="interactive-warm">
                <Plus className="h-4 w-4 mr-2" />
                Add Magic System
              </Button>
            </div>
            
            <div className="grid gap-4">
              {worldData.magic.map((magic, index) => (
                <Card key={index} className="creative-card">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-xl">{magic.name}</CardTitle>
                        <CardDescription className="text-accent font-medium">
                          {magic.type}
                        </CardDescription>
                      </div>
                      <Sparkles className="h-5 w-5 text-purple-400" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="mb-4">{magic.description}</p>
                    
                    <div className="grid md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <h4 className="font-semibold mb-2">Source</h4>
                        <p className="text-sm text-muted-foreground">{magic.source}</p>
                      </div>
                      
                      <div>
                        <h4 className="font-semibold mb-2">Effects</h4>
                        <div className="space-y-1">
                          {magic.effects.map((effect, i) => (
                            <div key={i} className="text-sm text-muted-foreground">• {effect}</div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {magic.practitioners && (
                      <div className="mb-4">
                        <h4 className="font-semibold mb-2">Practitioners</h4>
                        <div className="flex flex-wrap gap-2">
                          {magic.practitioners.map((practitioner, i) => (
                            <Badge key={i} variant="outline">{practitioner}</Badge>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {magic.corruption && (
                      <div className="p-3 bg-red-950/20 border border-red-800/30 rounded-lg">
                        <h4 className="font-semibold mb-1 text-red-400">Corruption</h4>
                        <p className="text-sm text-red-300">{magic.corruption}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        );

      case 'timeline':
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-title text-2xl">Timeline</h2>
              <Button size="sm" className="interactive-warm">
                <Plus className="h-4 w-4 mr-2" />
                Add Event
              </Button>
            </div>
            
            <div className="space-y-6">
              {worldData.timeline.map((era, index) => (
                <Card key={index} className="creative-card">
                  <CardHeader>
                    <div className="flex items-center space-x-3">
                      <Clock className="h-6 w-6 text-accent" />
                      <div>
                        <CardTitle className="text-xl">{era.era}</CardTitle>
                        <CardDescription className="text-accent font-medium">
                          {era.period}
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {era.events.map((event, i) => (
                        <div key={i} className="flex items-start space-x-3 p-3 workbench-surface rounded-lg">
                          <div className="w-2 h-2 rounded-full bg-accent mt-2 flex-shrink-0" />
                          <div>
                            <p className="text-sm font-medium mb-1">{event}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        );

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
            <Input
              placeholder="Search world..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-48"
            />
            <Button size="sm" variant="outline">
              <Search className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar - Categories */}
          <div className="lg:col-span-1">
            <Card className="creative-card">
              <CardHeader>
                <CardTitle className="text-lg">Categories</CardTitle>
                <CardDescription>Drag to reorder</CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <ScrollArea className="h-[calc(100vh-300px)]">
                  <div className="space-y-1 p-4">
                    {categories.map((category) => {
                      const Icon = category.icon;
                      return (
                        <div
                          key={category.id}
                          className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-colors ${
                            activeCategory === category.id
                              ? 'bg-accent/10 text-accent border border-accent/20'
                              : 'hover:bg-muted/50'
                          }`}
                          onClick={() => setActiveCategory(category.id)}
                        >
                          <div className="flex items-center space-x-3">
                            <GripVertical className="h-4 w-4 text-muted-foreground" />
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
                </ScrollArea>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <Card className="creative-card">
              <CardContent className="p-6">
                {renderCategoryContent()}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}