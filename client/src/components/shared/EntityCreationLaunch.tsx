import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Plus, FileText, Sparkles, User, MapPin, Users, Package, Building, Wand2, Clock, Languages, Palette, Scroll, Lightbulb } from 'lucide-react';

// Entity type configurations for creation options
const ENTITY_CONFIGS = {
  character: {
    icon: User,
    displayName: 'Character',
    description: 'People, creatures, and beings in your story',
    blankFeatures: ['Complete creative control', 'Build step by step', 'Perfect for unique concepts'],
    templateFeatures: ['20+ comprehensive archetypes', 'AI expands template foundations', 'Full character generation included'],
    aiFeatures: ['Custom prompts and parameters', 'Story-context awareness', 'Portrait generation included']
  },
  location: {
    icon: MapPin,
    displayName: 'Location',
    description: 'Places, settings, and environments in your world',
    blankFeatures: ['Design from imagination', 'Build atmosphere gradually', 'Perfect for unique settings'],
    templateFeatures: ['Common location archetypes', 'AI-enhanced descriptions', 'Environmental details included'],
    aiFeatures: ['Custom location prompts', 'Atmospheric generation', 'Map generation included']
  },
  faction: {
    icon: Users,
    displayName: 'Faction',
    description: 'Groups, organizations, and alliances',
    blankFeatures: ['Create unique organizations', 'Design hierarchies', 'Build from your vision'],
    templateFeatures: ['Organization archetypes', 'AI-generated structures', 'Member roles included'],
    aiFeatures: ['Custom faction prompts', 'Political dynamics', 'Emblem generation included']
  },
  item: {
    icon: Package,
    displayName: 'Item',
    description: 'Objects, artifacts, and equipment',
    blankFeatures: ['Design unique objects', 'Craft special properties', 'Build legendary items'],
    templateFeatures: ['Item type archetypes', 'AI-enhanced properties', 'Usage descriptions included'],
    aiFeatures: ['Custom item prompts', 'Magical properties', 'Visual generation included']
  },
  organization: {
    icon: Building,
    displayName: 'Organization',
    description: 'Institutions, companies, and formal groups',
    blankFeatures: ['Create institutions', 'Design structures', 'Build unique entities'],
    templateFeatures: ['Organization templates', 'AI-generated details', 'Structure included'],
    aiFeatures: ['Custom org prompts', 'Institutional dynamics', 'Logo generation included']
  },
  'magic-system': {
    icon: Wand2,
    displayName: 'Magic System',
    description: 'Supernatural forces and magical mechanics',
    blankFeatures: ['Design unique magic', 'Create rules & limits', 'Build from imagination'],
    templateFeatures: ['Magic type templates', 'AI-enhanced mechanics', 'Rules included'],
    aiFeatures: ['Custom magic prompts', 'System generation', 'Visual effects included']
  },
  'timeline-event': {
    icon: Clock,
    displayName: 'Timeline Event',
    description: 'Historical moments and significant occurrences',
    blankFeatures: ['Create key moments', 'Design consequences', 'Build unique history'],
    templateFeatures: ['Event type templates', 'AI-enhanced impact', 'Details included'],
    aiFeatures: ['Custom event prompts', 'Historical generation', 'Timeline integration']
  },
  language: {
    icon: Languages,
    displayName: 'Language',
    description: 'Constructed languages and communication systems',
    blankFeatures: ['Design unique languages', 'Create grammar rules', 'Build from linguistics'],
    templateFeatures: ['Language family templates', 'AI-enhanced structure', 'Examples included'],
    aiFeatures: ['Custom language prompts', 'Grammar generation', 'Sample text included']
  },
  culture: {
    icon: Palette,
    displayName: 'Culture',
    description: 'Societies, traditions, and ways of life',
    blankFeatures: ['Design unique societies', 'Create traditions', 'Build social structures'],
    templateFeatures: ['Cultural archetypes', 'AI-enhanced customs', 'Traditions included'],
    aiFeatures: ['Custom culture prompts', 'Society generation', 'Artwork included']
  },
  prophecy: {
    icon: Scroll,
    displayName: 'Prophecy',
    description: 'Predictions, visions, and foretold events',
    blankFeatures: ['Craft mystical visions', 'Design interpretations', 'Build unique prophecies'],
    templateFeatures: ['Prophecy type templates', 'AI-enhanced meaning', 'Interpretations included'],
    aiFeatures: ['Custom prophecy prompts', 'Vision generation', 'Symbolic imagery included']
  },
  theme: {
    icon: Lightbulb,
    displayName: 'Theme',
    description: 'Concepts, motifs, and underlying messages',
    blankFeatures: ['Explore unique concepts', 'Design symbolic meaning', 'Build thematic depth'],
    templateFeatures: ['Thematic archetypes', 'AI-enhanced exploration', 'Examples included'],
    aiFeatures: ['Custom theme prompts', 'Concept generation', 'Symbol creation included']
  }
};

interface EntityCreationLaunchProps {
  entityType: string;
  isOpen: boolean;
  onClose: () => void;
  onCreateBlank: () => void;
  onOpenTemplates: () => void;
  onOpenAIGeneration: () => void;
}

export function EntityCreationLaunch({
  entityType,
  isOpen,
  onClose,
  onCreateBlank,
  onOpenTemplates,
  onOpenAIGeneration
}: EntityCreationLaunchProps) {
  const [selectedOption, setSelectedOption] = useState<string>('');
  
  const config = ENTITY_CONFIGS[entityType as keyof typeof ENTITY_CONFIGS];
  if (!config) return null;

  const Icon = config.icon;

  const creationOptions = [
    {
      id: 'blank',
      title: 'Start from Scratch',
      description: `Create a ${config.displayName.toLowerCase()} completely from your imagination`,
      icon: Plus,
      action: onCreateBlank,
      features: config.blankFeatures
    },
    {
      id: 'template',
      title: 'AI-Enhanced Templates',
      description: `Choose from professional ${config.displayName.toLowerCase()} archetypes with AI expansion`,
      icon: FileText,
      action: onOpenTemplates,
      features: config.templateFeatures
    },
    {
      id: 'ai',
      title: 'Custom AI Generation',
      description: `Create completely unique ${config.displayName.toLowerCase()}s with custom prompts`,
      icon: Sparkles,
      action: onOpenAIGeneration,
      features: config.aiFeatures
    }
  ];

  const handleOptionSelect = (optionId: string, action?: () => void) => {
    setSelectedOption(optionId);
    setTimeout(() => {
      if (action && typeof action === 'function') {
        action();
      }
      onClose();
      setSelectedOption('');
    }, 200);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
        <DialogHeader className="pb-6 border-b border-border/30">
          <DialogTitle className="flex items-center gap-3 text-2xl">
            <div className="p-3 bg-gradient-to-br from-accent/20 to-accent/10 rounded-2xl">
              <Icon className="h-6 w-6 text-accent" />
            </div>
            <div>
              <div className="font-bold">Create New {config.displayName}</div>
              <div className="text-sm font-normal text-muted-foreground mt-1">
                {config.description}
              </div>
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {creationOptions.map((option) => {
              const OptionIcon = option.icon;
              const isSelected = selectedOption === option.id;
              
              return (
                <Card 
                  key={option.id}
                  className={`group cursor-pointer transition-all duration-300 hover:scale-[1.02] hover:shadow-xl border border-border/50 hover:border-accent/50 bg-card/50 backdrop-blur-sm relative overflow-hidden ${
                    isSelected ? 'scale-[1.02] shadow-xl border-accent/70 bg-accent/5' : ''
                  }`}
                  onClick={() => handleOptionSelect(option.id, option.action)}
                >
                  <CardContent className="p-8 relative h-full flex flex-col text-center">
                    {/* Subtle glow effect on hover */}
                    <div className="absolute inset-0 bg-gradient-to-br from-accent/5 via-transparent to-accent/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg" />
                    
                    {/* Icon */}
                    <div className="relative mb-6">
                      <div className="w-20 h-20 mx-auto bg-gradient-to-br from-accent/20 via-accent/15 to-accent/25 rounded-3xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg">
                        <OptionIcon className="h-10 w-10 text-accent" />
                      </div>
                      {isSelected && (
                        <div className="absolute inset-0 w-20 h-20 mx-auto bg-accent/20 rounded-3xl animate-pulse" />
                      )}
                    </div>
                    
                    {/* Content */}
                    <div className="relative flex-1 flex flex-col">
                      <h3 className="font-bold text-lg mb-3 group-hover:text-accent transition-colors duration-300">
                        {option.title}
                      </h3>
                      <p className="text-muted-foreground text-sm mb-6 leading-relaxed flex-1">
                        {option.description}
                      </p>
                      
                      {/* Features */}
                      <div className="space-y-2">
                        {option.features.map((feature, index) => (
                          <div key={index} className="flex items-center gap-2 text-xs text-muted-foreground">
                            <div className="w-1.5 h-1.5 rounded-full bg-accent/60 flex-shrink-0" />
                            <span>{feature}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    {/* Selection indicator */}
                    {isSelected && (
                      <div className="absolute top-4 right-4 w-6 h-6 bg-accent rounded-full flex items-center justify-center">
                        <div className="w-2 h-2 bg-white rounded-full" />
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Bottom tip */}
          <div className="text-center mt-8 p-4 bg-muted/30 rounded-lg border border-border/30">
            <p className="text-sm text-muted-foreground">
              💡 <strong>Pro tip:</strong> You can always switch between creation methods or combine approaches as you develop your {config.displayName.toLowerCase()}.
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}