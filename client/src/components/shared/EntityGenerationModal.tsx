import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Sparkles, Crown, Users, BookOpen, Eye, User, MapPin, Package, Building, Wand2, Clock, Languages, Palette, Scroll, Lightbulb } from 'lucide-react';

// Entity type configurations
const ENTITY_ICONS = {
  character: User,
  location: MapPin,
  faction: Users,
  item: Package,
  organization: Building,
  'magic-system': Wand2,
  'timeline-event': Clock,
  language: Languages,
  culture: Palette,
  prophecy: Scroll,
  theme: Lightbulb
};

// Generic entity types for AI generation
const ENTITY_TYPES = {
  character: [
    { value: 'protagonist', label: 'Protagonist', description: 'Main character driving the story forward', icon: Crown },
    { value: 'antagonist', label: 'Antagonist', description: 'Opposing force creating conflict', icon: Crown },
    { value: 'supporting', label: 'Supporting Character', description: 'Important secondary character', icon: Users },
    { value: 'minor', label: 'Minor Character', description: 'Background character with specific purpose', icon: Users },
    { value: 'love-interest', label: 'Love Interest', description: 'Romantic connection for main characters', icon: Users },
    { value: 'mentor', label: 'Mentor', description: 'Wise guide providing wisdom and training', icon: BookOpen }
  ],
  location: [
    { value: 'city', label: 'City/Town', description: 'Urban settlement with buildings and infrastructure', icon: Building },
    { value: 'wilderness', label: 'Wilderness', description: 'Natural environment away from civilization', icon: MapPin },
    { value: 'building', label: 'Building/Structure', description: 'Specific architectural location', icon: Building },
    { value: 'landmark', label: 'Landmark', description: 'Notable geographical or constructed feature', icon: MapPin },
    { value: 'realm', label: 'Realm/Dimension', description: 'Separate world or dimensional space', icon: Wand2 },
    { value: 'dungeon', label: 'Dungeon/Cave', description: 'Underground or enclosed dangerous area', icon: MapPin }
  ],
  faction: [
    { value: 'guild', label: 'Guild', description: 'Professional organization of craftsmen or merchants', icon: Users },
    { value: 'military', label: 'Military Force', description: 'Armed group with hierarchical structure', icon: Crown },
    { value: 'cult', label: 'Cult/Religious Group', description: 'Spiritual organization with shared beliefs', icon: Scroll },
    { value: 'rebels', label: 'Rebel Group', description: 'Underground resistance movement', icon: Users },
    { value: 'nobles', label: 'Noble House', description: 'Aristocratic family with political power', icon: Crown },
    { value: 'bandits', label: 'Bandit/Criminal Group', description: 'Outlaw organization operating outside law', icon: Users }
  ],
  item: [
    { value: 'weapon', label: 'Weapon', description: 'Tool designed for combat or defense', icon: Crown },
    { value: 'armor', label: 'Armor/Protection', description: 'Defensive equipment and protective gear', icon: Crown },
    { value: 'artifact', label: 'Magical Artifact', description: 'Item imbued with supernatural properties', icon: Wand2 },
    { value: 'tool', label: 'Tool/Utility', description: 'Practical item for specific tasks', icon: Package },
    { value: 'treasure', label: 'Treasure/Valuable', description: 'Precious object of monetary or cultural value', icon: Crown },
    { value: 'consumable', label: 'Consumable Item', description: 'Single-use item like potions or scrolls', icon: Package }
  ]
};

// Generic archetypes for different entity types
const ENTITY_ARCHETYPES = {
  character: [
    { value: 'hero', label: 'The Hero', description: 'Noble protagonist on a quest', traits: ['Brave', 'Determined', 'Moral'] },
    { value: 'villain', label: 'The Villain', description: 'Complex antagonist with clear motivations', traits: ['Ambitious', 'Ruthless', 'Intelligent'] },
    { value: 'mentor', label: 'The Mentor', description: 'Wise guide who teaches others', traits: ['Wise', 'Patient', 'Experienced'] },
    { value: 'trickster', label: 'The Trickster', description: 'Clever character who bends rules', traits: ['Clever', 'Unpredictable', 'Charismatic'] }
  ],
  location: [
    { value: 'sanctuary', label: 'The Sanctuary', description: 'Safe haven in a dangerous world', traits: ['Peaceful', 'Protected', 'Sacred'] },
    { value: 'crossroads', label: 'The Crossroads', description: 'Meeting place of different paths', traits: ['Bustling', 'Diverse', 'Strategic'] },
    { value: 'fortress', label: 'The Fortress', description: 'Stronghold of power and defense', traits: ['Imposing', 'Defended', 'Strategic'] },
    { value: 'wasteland', label: 'The Wasteland', description: 'Desolate area of danger and mystery', traits: ['Dangerous', 'Mysterious', 'Hostile'] }
  ],
  faction: [
    { value: 'guardians', label: 'The Guardians', description: 'Protectors of something valuable', traits: ['Loyal', 'Protective', 'Disciplined'] },
    { value: 'seekers', label: 'The Seekers', description: 'Group pursuing knowledge or truth', traits: ['Curious', 'Persistent', 'Scholarly'] },
    { value: 'rebels', label: 'The Rebels', description: 'Underground resistance movement', traits: ['Defiant', 'Secretive', 'Idealistic'] },
    { value: 'merchants', label: 'The Merchants', description: 'Trade-focused organization', traits: ['Pragmatic', 'Wealthy', 'Connected'] }
  ],
  item: [
    { value: 'legendary', label: 'Legendary Weapon', description: 'Weapon of great power and renown', traits: ['Powerful', 'Ancient', 'Renowned'] },
    { value: 'cursed', label: 'Cursed Object', description: 'Item with dangerous supernatural effects', traits: ['Dangerous', 'Mysterious', 'Tempting'] },
    { value: 'utility', label: 'Utility Item', description: 'Practical tool with special properties', traits: ['Useful', 'Reliable', 'Versatile'] },
    { value: 'treasure', label: 'Ancient Treasure', description: 'Valuable relic from the past', traits: ['Valuable', 'Historical', 'Coveted'] }
  ]
};

interface EntityGenerationModalProps {
  entityType: string;
  isOpen: boolean;
  onClose: () => void;
  onGenerate: (data: any) => Promise<void>;
  isGenerating: boolean;
}

export function EntityGenerationModal({ 
  entityType,
  isOpen, 
  onClose, 
  onGenerate, 
  isGenerating 
}: EntityGenerationModalProps) {
  const [entityTypeValue, setEntityTypeValue] = useState('');
  const [role, setRole] = useState('');
  const [customPrompt, setCustomPrompt] = useState('');
  const [personality, setPersonality] = useState('');
  const [archetype, setArchetype] = useState('');
  const [selectedTab, setSelectedTab] = useState('type');

  // Get configuration for current entity type
  const entityTypes = ENTITY_TYPES[entityType as keyof typeof ENTITY_TYPES] || [];
  const archetypes = ENTITY_ARCHETYPES[entityType as keyof typeof ENTITY_ARCHETYPES] || [];
  const EntityIcon = ENTITY_ICONS[entityType as keyof typeof ENTITY_ICONS] || User;

  // Get display name for entity type
  const getEntityDisplayName = (type: string) => {
    const names = {
      character: 'Character',
      location: 'Location',
      faction: 'Faction',
      item: 'Item',
      organization: 'Organization',
      'magic-system': 'Magic System',
      'timeline-event': 'Timeline Event',
      language: 'Language',
      culture: 'Culture',
      prophecy: 'Prophecy',
      theme: 'Theme'
    };
    return names[type as keyof typeof names] || 'Entity';
  };

  const handleGenerate = async () => {
    await onGenerate({
      entityType: entityTypeValue,
      role,
      customPrompt,
      personality,
      archetype
    });
  };

  const handleReset = () => {
    setEntityTypeValue('');
    setRole('');
    setCustomPrompt('');
    setPersonality('');
    setArchetype('');
    setSelectedTab('type');
  };

  const selectedEntityType = entityTypes.find(t => t.value === entityTypeValue);
  const selectedArchetypeData = archetypes.find(a => a.value === archetype);

  const isComplete = entityTypeValue && (role || archetype || personality || customPrompt);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
        <DialogHeader className="pb-4 border-b border-border/50 flex-shrink-0">
          <DialogTitle className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-accent/20 to-accent/10 rounded-lg">
              <Sparkles className="h-6 w-6 text-accent" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">AI {getEntityDisplayName(entityType)} Generator</h2>
              <p className="text-muted-foreground font-normal">Create a detailed {entityType} with artificial intelligence</p>
            </div>
          </DialogTitle>
        </DialogHeader>
        
        <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-track-muted/20 scrollbar-thumb-accent/60 hover:scrollbar-thumb-accent/80 pr-2">
          <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
            <TabsList className="grid w-full grid-cols-4 mb-6">
              <TabsTrigger value="type" className="gap-2">
                <EntityIcon className="h-4 w-4" />
                {getEntityDisplayName(entityType)} Type
              </TabsTrigger>
              <TabsTrigger value="archetype" className="gap-2">
                <Users className="h-4 w-4" />
                Archetype
              </TabsTrigger>
              <TabsTrigger value="details" className="gap-2">
                <BookOpen className="h-4 w-4" />
                Details
              </TabsTrigger>
              <TabsTrigger value="review" className="gap-2">
                <Eye className="h-4 w-4" />
                Review
              </TabsTrigger>
            </TabsList>

            {/* Entity Type Selection */}
            <TabsContent value="type" className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-3">What type of {entityType} do you want to create?</h3>
                <div className="grid grid-cols-3 gap-3">
                  {entityTypes.map((type) => {
                    const Icon = type.icon;
                    return (
                      <Card 
                        key={type.value}
                        className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
                          entityTypeValue === type.value 
                            ? 'border-accent bg-accent/5 shadow-md' 
                            : 'border-border hover:border-accent/50'
                        }`}
                        onClick={() => setEntityTypeValue(type.value)}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 bg-accent/10 rounded-lg">
                              <Icon className="h-4 w-4 text-accent" />
                            </div>
                            <h4 className="font-medium">{type.label}</h4>
                          </div>
                          <p className="text-sm text-muted-foreground">{type.description}</p>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </div>
            </TabsContent>

            {/* Archetype Selection */}
            <TabsContent value="archetype" className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-3">Choose an archetype (optional)</h3>
                <div className="grid grid-cols-2 gap-4">
                  {archetypes.map((arch) => (
                    <Card 
                      key={arch.value}
                      className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
                        archetype === arch.value 
                          ? 'border-accent bg-accent/5 shadow-md' 
                          : 'border-border hover:border-accent/50'
                      }`}
                      onClick={() => setArchetype(archetype === arch.value ? '' : arch.value)}
                    >
                      <CardContent className="p-4">
                        <h4 className="font-medium mb-2">{arch.label}</h4>
                        <p className="text-sm text-muted-foreground mb-3">{arch.description}</p>
                        <div className="flex flex-wrap gap-1">
                          {arch.traits.map((trait, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {trait}
                            </Badge>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </TabsContent>

            {/* Details Tab */}
            <TabsContent value="details" className="space-y-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="role" className="text-sm font-medium">Role or Function</Label>
                  <Input
                    id="role"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    placeholder={`What role does this ${entityType} play in your story?`}
                    className="mt-2"
                  />
                </div>

                <div>
                  <Label htmlFor="personality" className="text-sm font-medium">Key Characteristics</Label>
                  <Input
                    id="personality"
                    value={personality}
                    onChange={(e) => setPersonality(e.target.value)}
                    placeholder={`Describe the main characteristics of this ${entityType}`}
                    className="mt-2"
                  />
                </div>

                <div>
                  <Label htmlFor="customPrompt" className="text-sm font-medium">Custom Description</Label>
                  <Textarea
                    id="customPrompt"
                    value={customPrompt}
                    onChange={(e) => setCustomPrompt(e.target.value)}
                    placeholder={`Add any specific details or requirements for your ${entityType}...`}
                    rows={4}
                    className="mt-2"
                  />
                </div>
              </div>
            </TabsContent>

            {/* Review Tab */}
            <TabsContent value="review" className="space-y-6">
              <div className="bg-muted/30 rounded-lg p-6 border border-border/50">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Eye className="h-5 w-5 text-accent" />
                  Generation Preview
                </h3>
                
                <div className="space-y-4">
                  {selectedEntityType && (
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">Type</Label>
                      <p className="font-medium">{selectedEntityType.label}</p>
                    </div>
                  )}
                  
                  {selectedArchetypeData && (
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">Archetype</Label>
                      <p className="font-medium">{selectedArchetypeData.label}</p>
                    </div>
                  )}
                  
                  {role && (
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">Role</Label>
                      <p>{role}</p>
                    </div>
                  )}
                  
                  {personality && (
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">Characteristics</Label>
                      <p>{personality}</p>
                    </div>
                  )}
                  
                  {customPrompt && (
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">Custom Details</Label>
                      <p className="text-sm bg-background/60 p-3 rounded border">{customPrompt}</p>
                    </div>
                  )}
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-border/50 flex items-center justify-between">
          <Button 
            variant="outline" 
            onClick={handleReset}
            disabled={isGenerating}
          >
            Reset Form
          </Button>
          
          <div className="flex items-center gap-3">
            <Button 
              variant="outline" 
              onClick={onClose}
              disabled={isGenerating}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleGenerate}
              disabled={!isComplete || isGenerating}
              className="bg-gradient-to-r from-accent to-accent/80 hover:from-accent/90 hover:to-accent text-accent-foreground"
            >
              {isGenerating ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4 mr-2" />
                  Generate {getEntityDisplayName(entityType)}
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}