import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Sparkles, Brain, Zap, BookOpen, Users, PenTool, User, Eye, MapPin, Flag, Package, Building } from 'lucide-react';

interface UniversalAIAssistModalProps {
  entity: any;
  entityType: 'character' | 'creature' | 'location' | 'faction' | 'item' | 'organization' | 'magic-system' | 'timeline-event' | 'language' | 'culture' | 'prophecy' | 'theme';
  isOpen: boolean;
  onClose: () => void;
  onEnhance: (selectedCategories: string[]) => void;
}

const ENTITY_ENHANCEMENT_CATEGORIES = {
  character: [
    { id: 'identity', name: 'Identity & Basics', description: 'Name, age, race, background', icon: User },
    { id: 'physical', name: 'Physical Traits', description: 'Appearance, build, distinguishing features', icon: Eye },
    { id: 'personality', name: 'Personality', description: 'Traits, quirks, behavior patterns', icon: Brain },
    { id: 'background', name: 'Background', description: 'History, upbringing, formative events', icon: BookOpen },
    { id: 'skills', name: 'Skills & Abilities', description: 'Talents, expertise, magical abilities', icon: Zap },
    { id: 'story', name: 'Story Elements', description: 'Goals, motivations, character arcs', icon: PenTool }
  ],
  
  location: [
    { id: 'geography', name: 'Geography', description: 'Terrain, climate, natural features', icon: MapPin },
    { id: 'culture', name: 'Culture & Society', description: 'Inhabitants, customs, way of life', icon: Users },
    { id: 'history', name: 'History', description: 'Past events, founding, major changes', icon: BookOpen },
    { id: 'politics', name: 'Politics & Power', description: 'Government, rulers, factions', icon: Flag },
    { id: 'economy', name: 'Economy & Trade', description: 'Commerce, resources, industries', icon: Package }
  ],
  
  faction: [
    { id: 'identity', name: 'Identity & Purpose', description: 'Name, ideology, core mission', icon: Flag },
    { id: 'structure', name: 'Structure', description: 'Hierarchy, leadership, organization', icon: Building },
    { id: 'politics', name: 'Politics & Relations', description: 'Alliances, enemies, diplomacy', icon: Users },
    { id: 'military', name: 'Military & Power', description: 'Forces, strategy, capabilities', icon: Zap },
    { id: 'culture', name: 'Culture & Values', description: 'Beliefs, traditions, practices', icon: Brain }
  ],
  
  item: [
    { id: 'properties', name: 'Properties', description: 'Magical/mundane abilities, effects', icon: Zap },
    { id: 'history', name: 'History & Origins', description: 'Creation, past owners, journey', icon: BookOpen },
    { id: 'craftsmanship', name: 'Craftsmanship', description: 'Materials, construction, artistry', icon: PenTool },
    { id: 'lore', name: 'Lore & Legends', description: 'Stories, myths, cultural significance', icon: Brain }
  ],
  
  organization: [
    { id: 'structure', name: 'Structure', description: 'Hierarchy, departments, chain of command', icon: Building },
    { id: 'operations', name: 'Operations', description: 'Activities, projects, daily functions', icon: Zap },
    { id: 'influence', name: 'Influence & Reach', description: 'Political power, network, resources', icon: Users },
    { id: 'culture', name: 'Culture', description: 'Values, practices, internal dynamics', icon: Brain },
    { id: 'history', name: 'History', description: 'Founding, evolution, major milestones', icon: BookOpen }
  ]
};

// Default categories for entity types not specifically configured
const DEFAULT_CATEGORIES = [
  { id: 'identity', name: 'Identity', description: 'Basic information and characteristics', icon: User },
  { id: 'details', name: 'Details', description: 'Specific attributes and features', icon: Eye },
  { id: 'background', name: 'Background', description: 'History and context', icon: BookOpen },
  { id: 'significance', name: 'Significance', description: 'Role and importance in the story', icon: Brain }
];

const ENTITY_ICONS = {
  character: User,
  creature: User,
  location: MapPin,
  faction: Flag,
  item: Package,
  organization: Building,
  'magic-system': Sparkles,
  'timeline-event': BookOpen,
  language: PenTool,
  culture: Users,
  prophecy: Brain,
  theme: Eye
};

export function UniversalAIAssistModal({
  entity,
  entityType,
  isOpen,
  onClose,
  onEnhance
}: UniversalAIAssistModalProps) {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  const categories = ENTITY_ENHANCEMENT_CATEGORIES[entityType] || DEFAULT_CATEGORIES;
  const EntityIcon = ENTITY_ICONS[entityType] || User;

  const handleCategoryToggle = (categoryId: string) => {
    setSelectedCategories(prev => 
      prev.includes(categoryId)
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const handleSelectAll = () => {
    if (selectedCategories.length === categories.length) {
      setSelectedCategories([]);
    } else {
      setSelectedCategories(categories.map(cat => cat.id));
    }
  };

  const handleEnhance = () => {
    if (selectedCategories.length > 0) {
      onEnhance(selectedCategories);
      setSelectedCategories([]);
    }
  };

  const calculateProgress = () => {
    // Simple progress calculation based on filled fields
    const totalFields = Object.keys(entity).length;
    const filledFields = Object.values(entity).filter(value => {
      if (typeof value === 'string') return value.trim() !== '';
      if (Array.isArray(value)) return value.length > 0;
      return value != null;
    }).length;
    
    return Math.min(100, Math.round((filledFields / Math.max(totalFields, 10)) * 100));
  };

  const progress = calculateProgress();

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader className="shrink-0">
          <DialogTitle className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-accent/20 to-accent/10 rounded-xl">
              <EntityIcon className="h-5 w-5 text-accent" />
            </div>
            <div>
              <div className="font-bold">AI Enhancement Assistant</div>
              <div className="text-sm font-normal text-muted-foreground">
                Enhance {entity.name || `this ${entityType}`} with AI-generated content
              </div>
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-auto space-y-6 p-1">
          {/* Progress Overview */}
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Brain className="h-4 w-4 text-accent" />
                  <span className="font-medium">Development Progress</span>
                </div>
                <Badge variant="outline">{progress}% Complete</Badge>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-accent/80 to-accent h-2 rounded-full transition-all duration-500"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                AI enhancement will add depth and detail to underdeveloped areas
              </p>
            </CardContent>
          </Card>

          {/* Category Selection */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-accent" />
                  Enhancement Categories
                </CardTitle>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={handleSelectAll}
                >
                  {selectedCategories.length === categories.length ? 'Deselect All' : 'Select All'}
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {categories.map((category) => {
                const Icon = category.icon;
                const isSelected = selectedCategories.includes(category.id);
                
                return (
                  <div 
                    key={category.id}
                    className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-all ${
                      isSelected 
                        ? 'border-accent/50 bg-accent/5' 
                        : 'border-border hover:border-accent/30 hover:bg-muted/30'
                    }`}
                    onClick={() => handleCategoryToggle(category.id)}
                  >
                    <Checkbox 
                      checked={isSelected}
                      onChange={() => handleCategoryToggle(category.id)}
                      className="mt-1"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <Icon className="h-4 w-4 text-accent" />
                        <span className="font-medium">{category.name}</span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {category.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>

          {/* Enhancement Info */}
          <Card className="border-accent/20 bg-gradient-to-br from-accent/5 to-transparent">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-accent/10 rounded-lg">
                  <Sparkles className="h-4 w-4 text-accent" />
                </div>
                <div className="flex-1">
                  <h4 className="font-medium mb-1">How AI Enhancement Works</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• AI analyzes existing {entityType} information</li>
                    <li>• Generates contextually relevant content for selected categories</li>
                    <li>• Adds depth while maintaining consistency with your world</li>
                    <li>• You can review and edit all generated content</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Action Buttons */}
        <div className="shrink-0 flex gap-3 pt-4 border-t">
          <Button 
            variant="outline" 
            onClick={onClose} 
            className="flex-1"
          >
            Cancel
          </Button>
          <Button 
            onClick={handleEnhance}
            disabled={selectedCategories.length === 0}
            className="flex-1"
          >
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4" />
              Enhance {selectedCategories.length} Categories
            </div>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}