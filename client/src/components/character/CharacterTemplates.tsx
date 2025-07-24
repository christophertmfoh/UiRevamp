import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { BookOpen, Crown, Sword, Heart, Users, Zap, Shield, Star, FileText, Copy, Download } from 'lucide-react';

interface CharacterTemplate {
  id: string;
  name: string;
  description: string;
  category: 'fantasy' | 'modern' | 'scifi' | 'romance' | 'thriller' | 'universal';
  icon: React.ComponentType<any>;
  fields: Partial<any>; // Character fields pre-filled
  tags: string[];
  popularity: number;
}

const CHARACTER_TEMPLATES: CharacterTemplate[] = [
  {
    id: 'heroic-protagonist',
    name: 'Heroic Protagonist',
    description: 'A brave hero on a journey of growth, perfect for fantasy and adventure stories',
    category: 'fantasy',
    icon: Crown,
    tags: ['hero', 'protagonist', 'brave', 'growth'],
    popularity: 95,
    fields: {
      role: 'Protagonist',
      archetype: 'hero',
      personalityTraits: ['brave', 'determined', 'loyal'],
      goals: 'Save the world and protect loved ones',
      motivations: 'Justice and doing what is right',
      strengths: 'Courage, leadership, moral compass',
      weaknesses: 'Sometimes reckless, trusts too easily',
      values: 'Honor, justice, protecting the innocent',
      conflictSources: 'Self-doubt, overwhelming responsibility'
    }
  },
  {
    id: 'complex-villain',
    name: 'Complex Villain',
    description: 'A morally gray antagonist with compelling motivations and tragic backstory',
    category: 'universal',
    icon: Sword,
    tags: ['villain', 'complex', 'tragic', 'motivated'],
    popularity: 87,
    fields: {
      role: 'Antagonist',
      archetype: 'outlaw',
      personalityTraits: ['intelligent', 'charismatic', 'ruthless'],
      goals: 'Reshape the world according to their vision',
      motivations: 'Past trauma and desire for control',
      strengths: 'Strategic thinking, manipulation, resources',
      weaknesses: 'Inability to trust, obsessive, isolated',
      trauma: 'Betrayal by someone they loved and trusted',
      backstory: 'Once fought for justice but was corrupted by loss'
    }
  },
  {
    id: 'wise-mentor',
    name: 'Wise Mentor',
    description: 'An experienced guide who helps the protagonist grow and learn',
    category: 'universal',
    icon: BookOpen,
    tags: ['mentor', 'wise', 'guide', 'experienced'],
    popularity: 78,
    fields: {
      role: 'Mentor',
      archetype: 'sage',
      personalityTraits: ['wise', 'patient', 'mysterious'],
      goals: 'Guide the next generation and pass on knowledge',
      motivations: 'Redemption for past mistakes',
      strengths: 'Vast knowledge, magical abilities, insight',
      weaknesses: 'Fading power, reluctance to fully engage',
      secrets: 'Connected to the main conflict in unexpected ways',
      experience: 'Decades of study and adventure'
    }
  },
  {
    id: 'love-interest',
    name: 'Compelling Love Interest',
    description: 'A romantic partner with their own agency, goals, and character arc',
    category: 'romance',
    icon: Heart,
    tags: ['romance', 'independent', 'compelling'],
    popularity: 82,
    fields: {
      role: 'Love Interest',
      archetype: 'lover',
      personalityTraits: ['independent', 'passionate', 'witty'],
      goals: 'Achieve their own dreams while supporting their partner',
      motivations: 'Personal fulfillment and meaningful connections',
      strengths: 'Emotional intelligence, determination, creativity',
      weaknesses: 'Fear of vulnerability, perfectionism',
      relationships: 'Complex family dynamics that influence choices'
    }
  },
  {
    id: 'cyberpunk-hacker',
    name: 'Cyberpunk Hacker',
    description: 'A tech-savvy rebel fighting against corporate oppression in a dystopian future',
    category: 'scifi',
    icon: Zap,
    tags: ['cyberpunk', 'hacker', 'rebel', 'tech'],
    popularity: 71,
    fields: {
      role: 'Hacker/Rebel',
      archetype: 'outlaw',
      personalityTraits: ['rebellious', 'intelligent', 'paranoid'],
      goals: 'Expose corporate corruption and free information',
      motivations: 'Personal freedom and fighting oppression',
      skills: ['Hacking', 'Electronics', 'Stealth', 'Programming'],
      equipment: 'Custom cyberdeck, neural implants, encrypted devices',
      background: 'Former corporate employee turned whistleblower',
      enemies: 'Mega-corporations, corrupt government agents'
    }
  },
  {
    id: 'detective-investigator',
    name: 'Hard-boiled Detective',
    description: 'A world-weary investigator with a sharp mind and troubled past',
    category: 'thriller',
    icon: Shield,
    tags: ['detective', 'investigator', 'troubled', 'sharp'],
    popularity: 69,
    fields: {
      role: 'Detective/Investigator',
      archetype: 'everyman',
      personalityTraits: ['observant', 'cynical', 'persistent'],
      goals: 'Solve the case and find the truth',
      motivations: 'Justice for victims and personal redemption',
      skills: ['Investigation', 'Deduction', 'Firearms', 'Psychology'],
      habits: 'Chain smoking, drinking coffee, insomnia',
      trauma: 'Failed to save someone important in the past',
      experience: 'Years on the force, seen too much corruption'
    }
  }
];

interface CharacterTemplatesProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTemplate: (template: CharacterTemplate) => void;
}

export function CharacterTemplates({ isOpen, onClose, onSelectTemplate }: CharacterTemplatesProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedTemplate, setSelectedTemplate] = useState<CharacterTemplate | null>(null);

  const categories = [
    { id: 'all', name: 'All Templates', count: CHARACTER_TEMPLATES.length },
    { id: 'universal', name: 'Universal', count: CHARACTER_TEMPLATES.filter(t => t.category === 'universal').length },
    { id: 'fantasy', name: 'Fantasy', count: CHARACTER_TEMPLATES.filter(t => t.category === 'fantasy').length },
    { id: 'scifi', name: 'Sci-Fi', count: CHARACTER_TEMPLATES.filter(t => t.category === 'scifi').length },
    { id: 'modern', name: 'Modern', count: CHARACTER_TEMPLATES.filter(t => t.category === 'modern').length },
    { id: 'romance', name: 'Romance', count: CHARACTER_TEMPLATES.filter(t => t.category === 'romance').length },
    { id: 'thriller', name: 'Thriller', count: CHARACTER_TEMPLATES.filter(t => t.category === 'thriller').length },
  ];

  const filteredTemplates = selectedCategory === 'all' 
    ? CHARACTER_TEMPLATES 
    : CHARACTER_TEMPLATES.filter(t => t.category === selectedCategory);

  const sortedTemplates = [...filteredTemplates].sort((a, b) => b.popularity - a.popularity);

  const handleSelectTemplate = (template: CharacterTemplate) => {
    onSelectTemplate(template);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-hidden">
        <DialogHeader className="pb-4 border-b border-border/50">
          <DialogTitle className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-purple-500/20 to-blue-500/10 rounded-lg">
              <FileText className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">Character Templates</h2>
              <p className="text-muted-foreground font-normal">Start with professionally crafted character archetypes</p>
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="flex gap-6 flex-1 min-h-0">
          {/* Category Sidebar */}
          <div className="w-48 flex-shrink-0">
            <h3 className="font-semibold mb-3">Categories</h3>
            <div className="space-y-1">
              {categories.map((category) => (
                <Button
                  key={category.id}
                  variant={selectedCategory === category.id ? "secondary" : "ghost"}
                  className="w-full justify-between text-left"
                  onClick={() => setSelectedCategory(category.id)}
                >
                  <span>{category.name}</span>
                  <Badge variant="outline" className="text-xs">
                    {category.count}
                  </Badge>
                </Button>
              ))}
            </div>
          </div>

          {/* Templates Grid */}
          <div className="flex-1 min-w-0">
            <ScrollArea className="h-[600px] pr-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {sortedTemplates.map((template) => {
                  const Icon = template.icon;
                  return (
                    <Card
                      key={template.id}
                      className="cursor-pointer transition-all duration-200 hover:shadow-md hover:scale-[1.02] border border-border/50 hover:border-accent/30"
                      onClick={() => setSelectedTemplate(template)}
                    >
                      <CardHeader className="pb-3">
                        <div className="flex items-start gap-3">
                          <div className="p-2 bg-gradient-to-br from-accent/20 to-accent/10 rounded-lg">
                            <Icon className="h-5 w-5 text-accent" />
                          </div>
                          <div className="flex-1">
                            <CardTitle className="text-base">{template.name}</CardTitle>
                            <div className="flex items-center gap-2 mt-1">
                              <Badge variant="outline" className="text-xs capitalize">
                                {template.category}
                              </Badge>
                              <div className="flex items-center gap-1">
                                <Star className="h-3 w-3 text-yellow-500 fill-current" />
                                <span className="text-xs text-muted-foreground">
                                  {template.popularity}%
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {template.description}
                        </p>
                        <div className="flex flex-wrap gap-1">
                          {template.tags.slice(0, 3).map((tag) => (
                            <span
                              key={tag}
                              className="text-xs px-2 py-1 bg-muted/60 rounded-full"
                            >
                              {tag}
                            </span>
                          ))}
                          {template.tags.length > 3 && (
                            <span className="text-xs px-2 py-1 bg-muted/60 rounded-full text-muted-foreground">
                              +{template.tags.length - 3}
                            </span>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </ScrollArea>
          </div>
        </div>

        {/* Template Preview Modal */}
        {selectedTemplate && (
          <Dialog open={!!selectedTemplate} onOpenChange={() => setSelectedTemplate(null)}>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-3">
                  <selectedTemplate.icon className="h-6 w-6 text-accent" />
                  {selectedTemplate.name}
                </DialogTitle>
              </DialogHeader>
              
              <div className="space-y-4">
                <p className="text-muted-foreground">{selectedTemplate.description}</p>
                
                <div>
                  <h4 className="font-semibold mb-2">Pre-filled Fields:</h4>
                  <div className="space-y-2 max-h-60 overflow-y-auto">
                    {Object.entries(selectedTemplate.fields).map(([key, value]) => (
                      <div key={key} className="flex gap-2">
                        <span className="font-medium text-sm capitalize min-w-0 flex-shrink-0">
                          {key.replace(/([A-Z])/g, ' $1').toLowerCase()}:
                        </span>
                        <span className="text-sm text-muted-foreground">
                          {Array.isArray(value) ? value.join(', ') : String(value)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex justify-between pt-4">
                  <Button variant="outline" onClick={() => setSelectedTemplate(null)}>
                    Back to Templates
                  </Button>
                  <Button onClick={() => handleSelectTemplate(selectedTemplate)} className="interactive-warm">
                    <Copy className="h-4 w-4 mr-2" />
                    Use Template
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </DialogContent>
    </Dialog>
  );
}