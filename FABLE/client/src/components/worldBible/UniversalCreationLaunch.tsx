/**
 * Universal Creation Launch
 * Replicates CharacterCreationLaunch for all world bible entity types
 * Provides 4 creation methods: Blank, Templates, AI Generation, Document Upload
 */

import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Plus, Sparkles, FileText, Upload, Wand2 } from 'lucide-react';
import type { WorldBibleCategory } from '@/lib/worldBibleTypes';

// Creation method configurations for each entity type
const CREATION_CONFIGS = {
  locations: {
    blank: {
      title: 'Start from Scratch',
      description: 'Create a location completely from your imagination',
      features: ['Complete creative control', 'Build geography step by step', 'Perfect for unique places']
    },
    template: {
      title: 'Location Templates',
      description: 'Choose from professional location archetypes with AI expansion',
      features: ['Cities, Towns, Dungeons, Realms', 'AI expands template foundations', 'Geographic generation included']
    },
    ai: {
      title: 'AI Location Generation',
      description: 'Create completely unique locations with custom prompts',
      features: ['Custom geography prompts', 'World-context awareness', 'Map generation included']
    },
    document: {
      title: 'Import Location Data',
      description: 'Upload existing location documents and let AI parse them',
      features: ['PDF, Word, Text support', 'AI extracts geographic data', 'Auto-populates all location fields']
    }
  },
  timeline: {
    blank: {
      title: 'Start from Scratch',
      description: 'Create a timeline event from your imagination',
      features: ['Complete creative control', 'Build chronology step by step', 'Perfect for custom history']
    },
    template: {
      title: 'Event Templates',
      description: 'Choose from historical event archetypes with AI expansion',
      features: ['Wars, Discoveries, Catastrophes', 'AI expands event foundations', 'Timeline integration included']
    },
    ai: {
      title: 'AI Event Generation',
      description: 'Create unique historical events with custom prompts',
      features: ['Custom history prompts', 'Causal chain awareness', 'Character integration included']
    },
    document: {
      title: 'Import Timeline Data',
      description: 'Upload existing timeline documents and let AI parse them',
      features: ['PDF, Word, Text support', 'AI extracts chronological data', 'Auto-populates all event fields']
    }
  },
  factions: {
    blank: {
      title: 'Start from Scratch',
      description: 'Create an organization from your imagination',
      features: ['Complete creative control', 'Build structure step by step', 'Perfect for unique groups']
    },
    template: {
      title: 'Organization Templates',
      description: 'Choose from faction archetypes with AI expansion',
      features: ['Guilds, Cults, Armies, Courts', 'AI expands organizational foundations', 'Member generation included']
    },
    ai: {
      title: 'AI Faction Generation',
      description: 'Create unique organizations with custom prompts',
      features: ['Custom organization prompts', 'Political context awareness', 'Leadership generation included']
    },
    document: {
      title: 'Import Faction Data',
      description: 'Upload existing organization documents and let AI parse them',
      features: ['PDF, Word, Text support', 'AI extracts organizational data', 'Auto-populates all faction fields']
    }
  },
  items: {
    blank: {
      title: 'Start from Scratch',
      description: 'Create an item or artifact from your imagination',
      features: ['Complete creative control', 'Build properties step by step', 'Perfect for unique objects']
    },
    template: {
      title: 'Item Templates',
      description: 'Choose from artifact archetypes with AI expansion',
      features: ['Weapons, Magic Items, Relics', 'AI expands item foundations', 'History generation included']
    },
    ai: {
      title: 'AI Item Generation',
      description: 'Create unique items and artifacts with custom prompts',
      features: ['Custom artifact prompts', 'Magic system awareness', 'Visual generation included']
    },
    document: {
      title: 'Import Item Data',
      description: 'Upload existing item documents and let AI parse them',
      features: ['PDF, Word, Text support', 'AI extracts item properties', 'Auto-populates all item fields']
    }
  },
  magic: {
    blank: {
      title: 'Start from Scratch',
      description: 'Create a magic system from your imagination',
      features: ['Complete creative control', 'Build rules step by step', 'Perfect for unique magic']
    },
    template: {
      title: 'Magic Templates',
      description: 'Choose from magical system archetypes with AI expansion',
      features: ['Elemental, Divine, Arcane', 'AI expands magical foundations', 'Spell generation included']
    },
    ai: {
      title: 'AI Magic Generation',
      description: 'Create unique magical systems with custom prompts',
      features: ['Custom magic prompts', 'World balance awareness', 'Visual effects included']
    },
    document: {
      title: 'Import Magic Data',
      description: 'Upload existing magic documents and let AI parse them',
      features: ['PDF, Word, Text support', 'AI extracts magical rules', 'Auto-populates all magic fields']
    }
  },
  bestiary: {
    blank: {
      title: 'Start from Scratch',
      description: 'Create a creature from your imagination',
      features: ['Complete creative control', 'Build biology step by step', 'Perfect for unique species']
    },
    template: {
      title: 'Creature Templates',
      description: 'Choose from creature archetypes with AI expansion',
      features: ['Dragons, Beasts, Constructs', 'AI expands biological foundations', 'Art generation included']
    },
    ai: {
      title: 'AI Creature Generation',
      description: 'Create unique creatures with custom prompts',
      features: ['Custom creature prompts', 'Ecosystem awareness', 'Visual generation included']
    },
    document: {
      title: 'Import Creature Data',
      description: 'Upload existing creature documents and let AI parse them',
      features: ['PDF, Word, Text support', 'AI extracts biological data', 'Auto-populates all creature fields']
    }
  },
  languages: {
    blank: {
      title: 'Start from Scratch',
      description: 'Create a language from your imagination',
      features: ['Complete creative control', 'Build linguistics step by step', 'Perfect for constructed languages']
    },
    template: {
      title: 'Language Templates',
      description: 'Choose from linguistic archetypes with AI expansion',
      features: ['Real-world inspired, Fantasy', 'AI expands linguistic foundations', 'Vocabulary generation included']
    },
    ai: {
      title: 'AI Language Generation',
      description: 'Create unique languages with custom prompts',
      features: ['Custom linguistic prompts', 'Cultural context awareness', 'Script generation included']
    },
    document: {
      title: 'Import Language Data',
      description: 'Upload existing language documents and let AI parse them',
      features: ['PDF, Word, Text support', 'AI extracts linguistic data', 'Auto-populates all language fields']
    }
  },
  cultures: {
    blank: {
      title: 'Start from Scratch',
      description: 'Create a culture from your imagination',
      features: ['Complete creative control', 'Build society step by step', 'Perfect for unique civilizations']
    },
    template: {
      title: 'Culture Templates',
      description: 'Choose from civilization archetypes with AI expansion',
      features: ['Historical, Fantasy, Sci-fi', 'AI expands cultural foundations', 'Art generation included']
    },
    ai: {
      title: 'AI Culture Generation',
      description: 'Create unique cultures with custom prompts',
      features: ['Custom society prompts', 'Geographic context awareness', 'Visual elements included']
    },
    document: {
      title: 'Import Culture Data',
      description: 'Upload existing culture documents and let AI parse them',
      features: ['PDF, Word, Text support', 'AI extracts cultural data', 'Auto-populates all culture fields']
    }
  },
  prophecies: {
    blank: {
      title: 'Start from Scratch',
      description: 'Create a prophecy from your imagination',
      features: ['Complete creative control', 'Build predictions step by step', 'Perfect for unique oracles']
    },
    template: {
      title: 'Prophecy Templates',
      description: 'Choose from prophetic archetypes with AI expansion',
      features: ['Doom, Hope, Riddles, Visions', 'AI expands prophetic foundations', 'Interpretation included']
    },
    ai: {
      title: 'AI Prophecy Generation',
      description: 'Create unique prophecies with custom prompts',
      features: ['Custom oracle prompts', 'Plot relevance awareness', 'Symbolism generation included']
    },
    document: {
      title: 'Import Prophecy Data',
      description: 'Upload existing prophecy documents and let AI parse them',
      features: ['PDF, Word, Text support', 'AI extracts prophetic data', 'Auto-populates all prophecy fields']
    }
  },
  themes: {
    blank: {
      title: 'Start from Scratch',
      description: 'Create a narrative theme from your imagination',
      features: ['Complete creative control', 'Build meaning step by step', 'Perfect for unique concepts']
    },
    template: {
      title: 'Theme Templates',
      description: 'Choose from thematic archetypes with AI expansion',
      features: ['Universal themes, Motifs', 'AI expands thematic foundations', 'Symbol generation included']
    },
    ai: {
      title: 'AI Theme Generation',
      description: 'Create unique themes with custom prompts',
      features: ['Custom thematic prompts', 'Story context awareness', 'Metaphor generation included']
    },
    document: {
      title: 'Import Theme Data',
      description: 'Upload existing theme documents and let AI parse them',
      features: ['PDF, Word, Text support', 'AI extracts thematic data', 'Auto-populates all theme fields']
    }
  }
};

interface UniversalCreationLaunchProps {
  category: WorldBibleCategory;
  isOpen: boolean;
  onClose: () => void;
  onCreateBlank: () => void;
  onOpenTemplates: () => void;
  onOpenAIGeneration: () => void;
  onOpenDocumentUpload: () => void;
}

export function UniversalCreationLaunch({
  category,
  isOpen,
  onClose,
  onCreateBlank,
  onOpenTemplates,
  onOpenAIGeneration,
  onOpenDocumentUpload
}: UniversalCreationLaunchProps) {
  const [selectedOption, setSelectedOption] = useState<string>('');
  const config = CREATION_CONFIGS[category];

  const creationOptions = [
    {
      id: 'blank',
      ...config.blank,
      icon: Plus,
      action: onCreateBlank
    },
    {
      id: 'template',
      ...config.template,
      icon: FileText,
      action: onOpenTemplates
    },
    {
      id: 'ai',
      ...config.ai,
      icon: Sparkles,
      action: onOpenAIGeneration
    },
    {
      id: 'document',
      ...config.document,
      icon: Upload,
      action: onOpenDocumentUpload
    }
  ];

  const handleOptionSelect = (optionId: string, action: () => void) => {
    setSelectedOption(optionId);
    setTimeout(() => {
      action();
      onClose();
      setSelectedOption('');
    }, 200);
  };

  const categoryDisplayNames = {
    locations: 'Location',
    timeline: 'Timeline Event', 
    factions: 'Faction',
    items: 'Item',
    magic: 'Magic System',
    bestiary: 'Creature',
    languages: 'Language',
    cultures: 'Culture',
    prophecies: 'Prophecy',
    themes: 'Theme'
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
        <DialogHeader className="pb-6 border-b border-border/30">
          <DialogTitle className="flex items-center gap-3 text-2xl">
            <div className="p-3 bg-gradient-to-br from-accent/20 to-accent/10 rounded-2xl">
              <Wand2 className="w-6 h-6 text-primary" />
            </div>
            Create New {categoryDisplayNames[category]}
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-6 overflow-y-auto max-h-[60vh]">
          {creationOptions.map((option) => {
            const Icon = option.icon;
            const isSelected = selectedOption === option.id;
            
            return (
              <Card
                key={option.id}
                className={`cursor-pointer transition-all duration-200 border-2 hover:shadow-lg ${
                  isSelected 
                    ? 'border-primary shadow-lg scale-105' 
                    : 'border-border hover:border-primary/50'
                }`}
                onClick={() => handleOptionSelect(option.id, option.action)}
              >
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className={`p-3 rounded-xl transition-colors ${
                      isSelected 
                        ? 'bg-primary text-primary-foreground' 
                        : 'bg-accent/10 text-primary'
                    }`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    
                    <div className="flex-1 space-y-3">
                      <div>
                        <h3 className="font-semibold text-lg mb-1">{option.title}</h3>
                        <p className="text-muted-foreground text-sm leading-relaxed">
                          {option.description}
                        </p>
                      </div>
                      
                      <div className="space-y-1">
                        {option.features.map((feature, index) => (
                          <div key={index} className="flex items-center gap-2 text-xs text-muted-foreground">
                            <div className="w-1 h-1 bg-primary rounded-full"></div>
                            {feature}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="flex justify-center pt-4 border-t border-border/30">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}