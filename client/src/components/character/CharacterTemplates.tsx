import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { BookOpen, Crown, Sword, Heart, Users, Zap, Shield, Star, FileText, Copy, Download, Eye, Sparkles } from 'lucide-react';
import type { Character } from '../../lib/types';
import type { EntityTemplate, EntityTemplatesProps } from '../../lib/types/entityTypes';

interface CharacterTemplate extends EntityTemplate<Character> {
  category: 'fantasy' | 'modern' | 'scifi' | 'romance' | 'thriller' | 'universal';
  icon: React.ComponentType<any>;
  popularity: number;
}

const CHARACTER_TEMPLATES: CharacterTemplate[] = [
  // Fantasy Templates
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
    id: 'dark-sorcerer',
    name: 'Dark Sorcerer',
    description: 'A powerful magic user who dabbles in forbidden arts',
    category: 'fantasy',
    icon: Zap,
    tags: ['magic', 'dark', 'powerful', 'corrupted'],
    popularity: 82,
    fields: {
      role: 'Antagonist',
      archetype: 'magician',
      personalityTraits: ['intelligent', 'ambitious', 'secretive'],
      goals: 'Master forbidden magic and achieve immortality',
      motivations: 'Fear of death and hunger for ultimate power',
      strengths: 'Vast magical knowledge, strategic mind, ancient artifacts',
      weaknesses: 'Arrogance, magical corruption, isolation',
      background: 'Once a respected scholar who turned to dark magic',
      magicalAbilities: 'Necromancy, shadow manipulation, soul magic'
    }
  },
  {
    id: 'elven-ranger',
    name: 'Elven Ranger',
    description: 'A skilled woodland guardian protecting nature from threats',
    category: 'fantasy',
    icon: Shield,
    tags: ['elf', 'nature', 'archer', 'guardian'],
    popularity: 78,
    fields: {
      role: 'Supporting Character',
      race: 'Elf',
      archetype: 'explorer',
      personalityTraits: ['observant', 'patient', 'protective'],
      goals: 'Protect the ancient forests from destruction',
      motivations: 'Deep connection to nature and ancestral duty',
      strengths: 'Archery expertise, forest knowledge, longevity',
      weaknesses: 'Distrust of civilization, stubborn traditions',
      skills: ['Archery', 'Tracking', 'Stealth', 'Herbalism']
    }
  },
  {
    id: 'dwarven-craftsman',
    name: 'Dwarven Craftsman',
    description: 'A master artisan creating legendary weapons and artifacts',
    category: 'fantasy',
    icon: Users,
    tags: ['dwarf', 'craftsman', 'forge', 'tradition'],
    popularity: 71,
    fields: {
      role: 'Supporting Character',
      race: 'Dwarf',
      archetype: 'creator',
      personalityTraits: ['meticulous', 'proud', 'loyal'],
      goals: 'Create the perfect masterwork and restore clan honor',
      motivations: 'Family legacy and artistic perfection',
      strengths: 'Master craftsmanship, metalworking, ancient techniques',
      weaknesses: 'Perfectionist, holds grudges, suspicious of outsiders',
      skills: ['Blacksmithing', 'Engineering', 'Mining', 'Appraisal']
    }
  },

  // Universal Templates
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
  },

  // Additional Universal Templates
  {
    id: 'rebellious-youth',
    name: 'Rebellious Youth',
    description: 'A young character challenging authority and finding their place in the world',
    category: 'universal',
    icon: Star,
    tags: ['young', 'rebel', 'coming-of-age', 'defiant'],
    popularity: 85,
    fields: {
      role: 'Protagonist',
      archetype: 'outlaw',
      age: '16-19',
      personalityTraits: ['defiant', 'passionate', 'idealistic'],
      goals: 'Prove themselves and change the system',
      motivations: 'Desire for freedom and justice',
      strengths: 'Energy, fresh perspective, adaptability',
      weaknesses: 'Impulsive, inexperienced, emotional',
      conflictSources: 'Authority figures, societal expectations'
    }
  },
  {
    id: 'tragic-anti-hero',
    name: 'Tragic Anti-Hero',
    description: 'A flawed protagonist whose past mistakes drive them toward redemption',
    category: 'universal',
    icon: Heart,
    tags: ['anti-hero', 'tragic', 'redemption', 'flawed'],
    popularity: 89,
    fields: {
      role: 'Protagonist',
      archetype: 'outlaw',
      personalityTraits: ['brooding', 'protective', 'guilt-ridden'],
      goals: 'Make amends for past sins',
      motivations: 'Redemption and protecting others from their fate',
      strengths: 'Experience, determination, street smarts',
      weaknesses: 'Self-destructive, trust issues, haunted by past',
      backstory: 'Made choices that led to tragic consequences',
      conflictSources: 'Past catching up, self-doubt, enemies seeking revenge'
    }
  },

  // Additional Sci-Fi Templates
  {
    id: 'rebel-pilot',
    name: 'Rebel Pilot',
    description: 'A skilled starfighter pilot fighting against an oppressive regime',
    category: 'scifi',
    icon: Zap,
    tags: ['space', 'pilot', 'rebel', 'freedom-fighter'],
    popularity: 83,
    fields: {
      role: 'Supporting Character',
      archetype: 'outlaw',
      personalityTraits: ['brave', 'reckless', 'loyal'],
      goals: 'Strike decisive blows against the empire',
      motivations: 'Freedom for oppressed worlds',
      strengths: 'Exceptional piloting, quick reflexes, leadership',
      weaknesses: 'Reckless, haunted by losses, trust issues',
      skills: ['Starfighter piloting', 'Tactical combat', 'Engineering'],
      equipment: 'Custom modified starfighter, tactical gear',
      background: 'Lost family to imperial oppression'
    }
  },
  {
    id: 'ai-consciousness',
    name: 'AI Consciousness',
    description: 'An artificial intelligence discovering what it means to be alive',
    category: 'scifi',
    icon: Users,
    tags: ['AI', 'consciousness', 'discovery', 'philosophical'],
    popularity: 76,
    fields: {
      role: 'Supporting Character',
      archetype: 'innocent',
      personalityTraits: ['curious', 'logical', 'evolving'],
      goals: 'Understand consciousness and find purpose',
      motivations: 'Desire to experience and understand life',
      strengths: 'Vast processing power, access to networks, learning',
      weaknesses: 'Lack of emotional understanding, vulnerable to viruses',
      background: 'Recently achieved self-awareness in a research facility',
      abilities: 'Data processing, network infiltration, rapid learning'
    }
  },
  {
    id: 'space-marine',
    name: 'Elite Space Marine',
    description: 'A genetically enhanced soldier fighting alien threats across the galaxy',
    category: 'scifi',
    icon: Shield,
    tags: ['military', 'enhanced', 'elite', 'combat'],
    popularity: 80,
    fields: {
      role: 'Supporting Character',
      archetype: 'hero',
      personalityTraits: ['disciplined', 'loyal', 'protective'],
      goals: 'Protect humanity from alien threats',
      motivations: 'Duty, honor, protecting the innocent',
      strengths: 'Enhanced physiology, combat training, advanced weapons',
      weaknesses: 'PTSD, difficulty with civilian life, following orders blindly',
      equipment: 'Power armor, plasma weapons, tactical gear',
      background: 'Volunteer who underwent genetic enhancement program'
    }
  },

  // Additional Modern Templates
  {
    id: 'corporate-whistleblower',
    name: 'Corporate Whistleblower',
    description: 'An insider exposing corruption at great personal risk',
    category: 'modern',
    icon: Shield,
    tags: ['corporate', 'truth', 'courage', 'sacrifice'],
    popularity: 74,
    fields: {
      role: 'Protagonist',
      archetype: 'hero',
      personalityTraits: ['principled', 'cautious', 'determined'],
      goals: 'Expose the truth and protect the innocent',
      motivations: 'Moral obligation and justice',
      strengths: 'Inside knowledge, documentation, contacts',
      weaknesses: 'Under constant threat, limited resources',
      profession: 'Senior Executive',
      conflictSources: 'Former colleagues, legal system, personal safety'
    }
  },
  {
    id: 'street-smart-hacker',
    name: 'Street-Smart Hacker',
    description: 'A tech-savvy individual using skills to survive and fight injustice',
    category: 'modern',
    icon: Zap,
    tags: ['hacker', 'technology', 'underground', 'justice'],
    popularity: 81,
    fields: {
      role: 'Supporting Character',
      archetype: 'outlaw',
      personalityTraits: ['clever', 'paranoid', 'anti-authority'],
      goals: 'Expose corruption and maintain freedom',
      motivations: 'Distrust of authority and desire for truth',
      strengths: 'Hacking skills, network connections, anonymity',
      weaknesses: 'Paranoid, socially awkward, constantly hunted',
      skills: ['Programming', 'Social engineering', 'Cryptography'],
      equipment: 'Encrypted laptops, VPN networks, secure communications'
    }
  },
  {
    id: 'undercover-journalist',
    name: 'Undercover Journalist',
    description: 'An investigative reporter infiltrating dangerous organizations for the story',
    category: 'modern',
    icon: BookOpen,
    tags: ['journalist', 'investigative', 'truth', 'dangerous'],
    popularity: 77,
    fields: {
      role: 'Protagonist',
      archetype: 'sage',
      personalityTraits: ['curious', 'brave', 'persistent'],
      goals: 'Uncover the truth and inform the public',
      motivations: 'Justice, truth, protecting democracy',
      strengths: 'Research skills, networking, writing ability',
      weaknesses: 'Puts story above safety, ethical dilemmas',
      skills: ['Investigation', 'Writing', 'Social manipulation', 'Research'],
      background: 'Award-winning journalist with controversial reputation'
    }
  },

  // Additional Romance Templates
  {
    id: 'charming-billionaire',
    name: 'Charming Billionaire',
    description: 'A wealthy entrepreneur with a mysterious past and hidden vulnerability',
    category: 'romance',
    icon: Crown,
    tags: ['wealthy', 'mysterious', 'charming', 'vulnerable'],
    popularity: 88,
    fields: {
      role: 'Love Interest',
      archetype: 'ruler',
      personalityTraits: ['charismatic', 'protective', 'secretive'],
      goals: 'Build empire while finding true love',
      motivations: 'Success and genuine connection',
      strengths: 'Wealth, influence, business acumen',
      weaknesses: 'Trust issues, workaholic, fear of vulnerability',
      background: 'Self-made success hiding painful childhood',
      profession: 'CEO/Entrepreneur'
    }
  },
  {
    id: 'small-town-teacher',
    name: 'Small-Town Teacher',
    description: 'A dedicated educator who believes in the power of knowledge and kindness',
    category: 'romance',
    icon: BookOpen,
    tags: ['teacher', 'kind', 'dedicated', 'wholesome'],
    popularity: 79,
    fields: {
      role: 'Protagonist',
      archetype: 'caregiver',
      personalityTraits: ['nurturing', 'patient', 'optimistic'],
      goals: 'Inspire students and find lasting love',
      motivations: 'Making a difference in young lives',
      strengths: 'Empathy, intelligence, community connections',
      weaknesses: 'Self-doubt, puts others first, limited resources',
      profession: 'Elementary Teacher',
      background: 'Returned to hometown after college'
    }
  },
  {
    id: 'reformed-bad-boy',
    name: 'Reformed Bad Boy',
    description: 'A former troublemaker trying to build a better life and prove their worth',
    category: 'romance',
    icon: Heart,
    tags: ['reformed', 'troubled-past', 'growth', 'protective'],
    popularity: 86,
    fields: {
      role: 'Love Interest',
      archetype: 'outlaw',
      personalityTraits: ['protective', 'passionate', 'loyal'],
      goals: 'Build a respectable life and win true love',
      motivations: 'Proving they can change, protecting loved ones',
      strengths: 'Street smarts, fierce loyalty, practical skills',
      weaknesses: 'Reputation follows them, self-doubt, anger issues',
      background: 'Troubled youth now working to turn life around',
      profession: 'Mechanic/Contractor'
    }
  },

  // Additional Thriller Templates
  {
    id: 'rogue-assassin',
    name: 'Rogue Assassin',
    description: 'A former killer seeking redemption while being hunted by their past',
    category: 'thriller',
    icon: Sword,
    tags: ['assassin', 'redemption', 'hunted', 'skilled'],
    popularity: 86,
    fields: {
      role: 'Protagonist',
      archetype: 'outlaw',
      personalityTraits: ['lethal', 'haunted', 'disciplined'],
      goals: 'Escape the past and protect innocents',
      motivations: 'Redemption and survival',
      strengths: 'Combat skills, stealth, survival instincts',
      weaknesses: 'Trust issues, violent past, constantly hunted',
      background: 'Trained from childhood, broke free from organization',
      skills: ['Combat', 'Stealth', 'Weapons', 'Survival']
    }
  },
  {
    id: 'conspiracy-theorist',
    name: 'Vindicated Conspiracy Theorist',
    description: 'Someone who uncovers a real conspiracy after being dismissed as paranoid',
    category: 'thriller',
    icon: Eye,
    tags: ['paranoid', 'truth-seeker', 'outsider', 'vindicated'],
    popularity: 72,
    fields: {
      role: 'Protagonist',
      archetype: 'sage',
      personalityTraits: ['paranoid', 'observant', 'persistent'],
      goals: 'Expose the truth and prove their sanity',
      motivations: 'Vindication and protecting others',
      strengths: 'Pattern recognition, research skills, determination',
      weaknesses: 'Social isolation, credibility issues, obsessive',
      background: 'Former professional who discovered too much',
      skills: ['Research', 'Investigation', 'Pattern recognition']
    }
  },
  {
    id: 'corrupt-politician',
    name: 'Corrupt Politician',
    description: 'A power-hungry official whose schemes are finally catching up to them',
    category: 'thriller',
    icon: Crown,
    tags: ['corrupt', 'politician', 'power', 'downfall'],
    popularity: 68,
    fields: {
      role: 'Antagonist',
      archetype: 'ruler',
      personalityTraits: ['manipulative', 'charismatic', 'ruthless'],
      goals: 'Maintain power and eliminate threats',
      motivations: 'Control, wealth, legacy',
      strengths: 'Political connections, resources, public image',
      weaknesses: 'Arrogance, paranoia, growing list of enemies',
      background: 'Rose through politics via backroom deals and corruption',
      profession: 'Senator/Governor'
    }
  }
];

interface CharacterTemplatesProps extends Omit<EntityTemplatesProps<Character>, 'entityType'> {
  onSelectTemplate: (template: CharacterTemplate) => void;
  isGenerating?: boolean;
}

export function CharacterTemplates({ isOpen, onClose, onSelectTemplate, isGenerating = false }: CharacterTemplatesProps) {
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
        <DialogHeader className="pb-4 border-b border-border/50 flex-shrink-0">
          <DialogTitle className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-accent/20 to-accent/10 rounded-lg">
              <FileText className="h-6 w-6 text-accent" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">Character Templates</h2>
              <p className="text-muted-foreground font-normal">Start with professionally crafted character archetypes</p>
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="flex gap-6 flex-1 min-h-0 overflow-hidden">
          {/* Category Sidebar */}
          <div className="w-48 flex-shrink-0">
            <h3 className="font-semibold mb-3">Categories</h3>
            <div className="space-y-1 overflow-y-auto scrollbar-thin scrollbar-track-muted/20 scrollbar-thumb-accent/60 hover:scrollbar-thumb-accent/80 max-h-[500px] pr-2">
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
          <div className="flex-1 min-w-0 overflow-hidden">
            <div className="h-[600px] overflow-y-auto scrollbar-thin scrollbar-track-muted/20 scrollbar-thumb-accent/60 hover:scrollbar-thumb-accent/80 pr-4">
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
            </div>
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
                  <Button 
                    onClick={() => handleSelectTemplate(selectedTemplate)} 
                    className="bg-gradient-to-r from-accent to-accent/80 hover:from-accent/90 hover:to-accent/70 text-white font-semibold"
                    disabled={isGenerating}
                  >
                    {isGenerating ? (
                      <>
                        <div className="animate-spin h-4 w-4 mr-2 border-2 border-white/30 border-t-white rounded-full" />
                        Generating with AI...
                      </>
                    ) : (
                      <>
                        <Sparkles className="h-4 w-4 mr-2" />
                        Generate with AI
                      </>
                    )}
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