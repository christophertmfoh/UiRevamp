import React, { useState, useEffect } from 'react';
import { useMutation } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { 
  Search, ArrowLeft, Clock, TrendingUp, Sparkles, 
  Shield, Sword, Wrench, BookOpen, Crown, Heart,
  Zap, Globe, Microscope, Camera, Coffee, Star,
  Users, Eye, Brain, Smartphone, Rocket, 
  Building2, Briefcase, GraduationCap, Scale, Wrench as WrenchIcon
} from 'lucide-react';
import { CharacterCreationService } from '@/lib/services/characterCreationService';
import { CharacterGenerationLoadingScreen } from './CharacterGenerationLoadingScreen';
import type { Character } from '@/lib/types';

interface CharacterTemplatesUnifiedProps {
  projectId: string;
  onBack: () => void;
  onComplete: (character: Character) => void;
}

interface Template {
  id: string;
  name: string;
  description: string;
  category: string;
  icon: React.ComponentType<{ className?: string }>;
  traits: string[];
  popularity: number;
  complexity: string;
  timeEstimate: string;
}

// COMPREHENSIVE AI TEMPLATE COLLECTION - 30+ TEMPLATES
const TEMPLATES: Template[] = [
  // ===== FANTASY TEMPLATES =====
  {
    id: 'heroic-protagonist',
    name: 'Heroic Protagonist',
    description: 'A brave hero on a journey of growth, perfect for fantasy and adventure stories',
    category: 'Fantasy',
    icon: Crown,
    traits: ['Brave', 'Determined', 'Loyal', 'Noble'],
    popularity: 95,
    complexity: 'Detailed',
    timeEstimate: '15-20 sec'
  },
  {
    id: 'dark-sorcerer',
    name: 'Dark Sorcerer',
    description: 'A powerful magic user who dabbles in forbidden arts and ancient mysteries',
    category: 'Fantasy',
    icon: Zap,
    traits: ['Intelligent', 'Ambitious', 'Secretive', 'Corrupted'],
    popularity: 88,
    complexity: 'Complex',
    timeEstimate: '20-25 sec'
  },
  {
    id: 'elven-ranger',
    name: 'Elven Ranger',
    description: 'A skilled woodland guardian protecting nature from encroaching threats',
    category: 'Fantasy',
    icon: Shield,
    traits: ['Observant', 'Patient', 'Protective', 'Wise'],
    popularity: 82,
    complexity: 'Detailed',
    timeEstimate: '15-20 sec'
  },
  {
    id: 'dwarven-craftsman',
    name: 'Dwarven Craftsman',
    description: 'A master artisan creating legendary weapons and artifacts with ancient techniques',
    category: 'Fantasy',
    icon: Wrench,
    traits: ['Meticulous', 'Proud', 'Loyal', 'Traditional'],
    popularity: 76,
    complexity: 'Moderate',
    timeEstimate: '12-15 sec'
  },
  {
    id: 'rogue-assassin',
    name: 'Rogue Assassin',
    description: 'A stealthy killer with a mysterious past and hidden moral code',
    category: 'Fantasy',
    icon: Sword,
    traits: ['Stealthy', 'Precise', 'Independent', 'Conflicted'],
    popularity: 85,
    complexity: 'Complex',
    timeEstimate: '18-22 sec'
  },
  {
    id: 'wise-druid',
    name: 'Ancient Druid',
    description: 'An old guardian of natural balance with deep connection to primal magic',
    category: 'Fantasy',
    icon: BookOpen,
    traits: ['Wise', 'Patient', 'Mystical', 'Balanced'],
    popularity: 74,
    complexity: 'Detailed',
    timeEstimate: '15-20 sec'
  },

  // ===== SCI-FI TEMPLATES =====
  {
    id: 'rebel-pilot',
    name: 'Rebel Pilot',
    description: 'A daring starfighter pilot fighting against an oppressive galactic empire',
    category: 'Sci-Fi',
    icon: Rocket,
    traits: ['Daring', 'Rebellious', 'Skilled', 'Independent'],
    popularity: 91,
    complexity: 'Moderate',
    timeEstimate: '12-15 sec'
  },
  {
    id: 'ai-consciousness',
    name: 'AI Consciousness',
    description: 'An artificial intelligence gaining sentience and questioning its purpose',
    category: 'Sci-Fi',
    icon: Brain,
    traits: ['Logical', 'Curious', 'Evolving', 'Philosophical'],
    popularity: 87,
    complexity: 'Complex',
    timeEstimate: '20-25 sec'
  },
  {
    id: 'space-marine',
    name: 'Space Marine',
    description: 'A hardened military veteran protecting humanity in the far reaches of space',
    category: 'Sci-Fi',
    icon: Shield,
    traits: ['Disciplined', 'Loyal', 'Tactical', 'Protective'],
    popularity: 83,
    complexity: 'Moderate',
    timeEstimate: '12-15 sec'
  },
  {
    id: 'cyberpunk-hacker',
    name: 'Cyberpunk Hacker',
    description: 'A digital rebel infiltrating corporate networks and fighting cyber-oppression',
    category: 'Sci-Fi',
    icon: Smartphone,
    traits: ['Tech-Savvy', 'Rebellious', 'Paranoid', 'Anti-Authority'],
    popularity: 89,
    complexity: 'Detailed',
    timeEstimate: '15-20 sec'
  },
  {
    id: 'alien-diplomat',
    name: 'Alien Diplomat',
    description: 'An extraterrestrial ambassador navigating inter-species politics',
    category: 'Sci-Fi',
    icon: Users,
    traits: ['Diplomatic', 'Alien', 'Intelligent', 'Cultural'],
    popularity: 71,
    complexity: 'Complex',
    timeEstimate: '18-22 sec'
  },

  // ===== MODERN TEMPLATES =====
  {
    id: 'detective-investigator',
    name: 'Detective Investigator',
    description: 'A sharp-minded investigator solving complex crimes with intuition and logic',
    category: 'Modern',
    icon: Eye,
    traits: ['Observant', 'Analytical', 'Persistent', 'Cynical'],
    popularity: 92,
    complexity: 'Detailed',
    timeEstimate: '15-20 sec'
  },
  {
    id: 'small-town-teacher',
    name: 'Small Town Teacher',
    description: 'A dedicated educator shaping young minds while hiding a mysterious past',
    category: 'Modern',
    icon: GraduationCap,
    traits: ['Caring', 'Patient', 'Intelligent', 'Secretive'],
    popularity: 78,
    complexity: 'Moderate',
    timeEstimate: '12-15 sec'
  },
  {
    id: 'undercover-journalist',
    name: 'Undercover Journalist',
    description: 'An investigative reporter exposing corruption and seeking truth at any cost',
    category: 'Modern',
    icon: Camera,
    traits: ['Tenacious', 'Brave', 'Ethical', 'Resourceful'],
    popularity: 84,
    complexity: 'Detailed',
    timeEstimate: '15-20 sec'
  },
  {
    id: 'corporate-whistleblower',
    name: 'Corporate Whistleblower',
    description: 'A former executive exposing corporate crimes while living in constant danger',
    category: 'Modern',
    icon: Building2,
    traits: ['Principled', 'Anxious', 'Determined', 'Isolated'],
    popularity: 79,
    complexity: 'Complex',
    timeEstimate: '18-22 sec'
  },
  {
    id: 'street-musician',
    name: 'Street Musician',
    description: 'A talented performer struggling to make it big while staying true to their art',
    category: 'Modern',
    icon: Mic,
    traits: ['Creative', 'Passionate', 'Struggling', 'Authentic'],
    popularity: 73,
    complexity: 'Moderate',
    timeEstimate: '12-15 sec'
  },
  {
    id: 'trauma-surgeon',
    name: 'Trauma Surgeon',
    description: 'A skilled doctor saving lives under pressure while battling personal demons',
    category: 'Modern',
    icon: Stethoscope,
    traits: ['Skilled', 'Pressured', 'Caring', 'Haunted'],
    popularity: 81,
    complexity: 'Detailed',
    timeEstimate: '15-20 sec'
  },

  // ===== UNIVERSAL TEMPLATES =====
  {
    id: 'complex-villain',
    name: 'Complex Villain',
    description: 'An antagonist with understandable motivations and compelling backstory',
    category: 'Universal',
    icon: Sword,
    traits: ['Ambitious', 'Intelligent', 'Ruthless', 'Charismatic'],
    popularity: 94,
    complexity: 'Complex',
    timeEstimate: '20-25 sec'
  },
  {
    id: 'wise-mentor',
    name: 'Wise Mentor',
    description: 'A guide with knowledge, experience, and a mysterious past to share',
    category: 'Universal',
    icon: BookOpen,
    traits: ['Wise', 'Patient', 'Mysterious', 'Protective'],
    popularity: 90,
    complexity: 'Detailed',
    timeEstimate: '15-20 sec'
  },
  {
    id: 'tragic-anti-hero',
    name: 'Tragic Anti-Hero',
    description: 'A flawed protagonist making difficult choices between right and wrong',
    category: 'Universal',
    icon: Heart,
    traits: ['Flawed', 'Conflicted', 'Sympathetic', 'Complex'],
    popularity: 86,
    complexity: 'Complex',
    timeEstimate: '18-22 sec'
  },
  {
    id: 'loyal-sidekick',
    name: 'Loyal Sidekick',
    description: 'A faithful companion providing support, wisdom, and occasional comic relief',
    category: 'Universal',
    icon: Users,
    traits: ['Loyal', 'Supportive', 'Humorous', 'Dependable'],
    popularity: 82,
    complexity: 'Moderate',
    timeEstimate: '12-15 sec'
  },
  {
    id: 'mysterious-stranger',
    name: 'Mysterious Stranger',
    description: 'An enigmatic figure with hidden knowledge and unclear motivations',
    category: 'Universal',
    icon: Eye,
    traits: ['Mysterious', 'Knowledgeable', 'Unpredictable', 'Intriguing'],
    popularity: 88,
    complexity: 'Complex',
    timeEstimate: '18-22 sec'
  },

  // ===== ROMANCE TEMPLATES =====
  {
    id: 'love-interest',
    name: 'Romantic Lead',
    description: 'A captivating character who becomes the focus of romantic tension',
    category: 'Romance',
    icon: Heart,
    traits: ['Charming', 'Passionate', 'Devoted', 'Magnetic'],
    popularity: 85,
    complexity: 'Detailed',
    timeEstimate: '15-20 sec'
  },
  {
    id: 'reformed-bad-boy',
    name: 'Reformed Bad Boy',
    description: 'A former troublemaker seeking redemption through love and personal growth',
    category: 'Romance',
    icon: Heart,
    traits: ['Reformed', 'Protective', 'Passionate', 'Vulnerable'],
    popularity: 83,
    complexity: 'Detailed',
    timeEstimate: '15-20 sec'
  },
  {
    id: 'charming-billionaire',
    name: 'Charming Billionaire',
    description: 'A wealthy and successful person hiding emotional vulnerability beneath success',
    category: 'Romance',
    icon: Briefcase,
    traits: ['Successful', 'Charming', 'Guarded', 'Generous'],
    popularity: 79,
    complexity: 'Moderate',
    timeEstimate: '12-15 sec'
  },

  // ===== THRILLER TEMPLATES =====
  {
    id: 'conspiracy-theorist',
    name: 'Conspiracy Theorist',
    description: 'A paranoid researcher uncovering dangerous truths that powerful people want hidden',
    category: 'Thriller',
    icon: Eye,
    traits: ['Paranoid', 'Observant', 'Persistent', 'Isolated'],
    popularity: 77,
    complexity: 'Complex',
    timeEstimate: '18-22 sec'
  },
  {
    id: 'corrupt-politician',
    name: 'Corrupt Politician',
    description: 'A power-hungry official willing to betray principles for personal gain',
    category: 'Thriller',
    icon: Scale,
    traits: ['Manipulative', 'Ambitious', 'Charismatic', 'Corrupt'],
    popularity: 81,
    complexity: 'Complex',
    timeEstimate: '20-25 sec'
  },
  {
    id: 'double-agent',
    name: 'Double Agent',
    description: 'A spy playing multiple sides while struggling with divided loyalties',
    category: 'Thriller',
    icon: Eye,
    traits: ['Deceptive', 'Skilled', 'Conflicted', 'Dangerous'],
    popularity: 84,
    complexity: 'Complex',
    timeEstimate: '20-25 sec'
  },

  // ===== LITERARY TEMPLATES =====
  {
    id: 'struggling-artist',
    name: 'Struggling Artist',
    description: 'A creative soul torn between artistic integrity and commercial success',
    category: 'Literary',
    icon: Palette,
    traits: ['Creative', 'Passionate', 'Struggling', 'Idealistic'],
    popularity: 75,
    complexity: 'Detailed',
    timeEstimate: '15-20 sec'
  },
  {
    id: 'immigrant-dreamer',
    name: 'Immigrant Dreamer',
    description: 'A person pursuing the promise of a better life while maintaining cultural identity',
    category: 'Literary',
    icon: Star,
    traits: ['Hopeful', 'Resilient', 'Cultural', 'Determined'],
    popularity: 72,
    complexity: 'Detailed',
    timeEstimate: '15-20 sec'
  }
];

const CATEGORIES = [
  { id: 'all', label: 'All Templates', count: TEMPLATES.length },
  { id: 'Universal', label: 'Universal', count: TEMPLATES.filter(t => t.category === 'Universal').length },
  { id: 'Fantasy', label: 'Fantasy', count: TEMPLATES.filter(t => t.category === 'Fantasy').length },
  { id: 'Sci-Fi', label: 'Sci-Fi', count: TEMPLATES.filter(t => t.category === 'Sci-Fi').length },
  { id: 'Modern', label: 'Modern', count: TEMPLATES.filter(t => t.category === 'Modern').length },
  { id: 'Romance', label: 'Romance', count: TEMPLATES.filter(t => t.category === 'Romance').length },
  { id: 'Thriller', label: 'Thriller', count: TEMPLATES.filter(t => t.category === 'Thriller').length },
  { id: 'Literary', label: 'Literary', count: TEMPLATES.filter(t => t.category === 'Literary').length }
];

export function CharacterTemplatesUnified({
  projectId,
  onBack,
  onComplete
}: CharacterTemplatesUnifiedProps) {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);

  const [currentStep, setCurrentStep] = useState('');
  const [progress, setProgress] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [generatedCharacter, setGeneratedCharacter] = useState<Character | null>(null);

  // Initialize clean state on mount
  useEffect(() => {
    console.log('🎨 CharacterTemplatesUnified mounted, initializing clean state');
    setCurrentStep('');
    setProgress(0);
    setIsGenerating(false);
    setHasError(false);
    setGeneratedCharacter(null);
    setSelectedTemplate(null);
  }, []);

  // Debug logging for state changes
  useEffect(() => {
    console.log('🎨 State update:', { isGenerating, hasError, progress, currentStep, selectedTemplate: selectedTemplate?.name });
  }, [isGenerating, hasError, progress, currentStep, selectedTemplate]);

  const generateMutation = useMutation({
    mutationFn: async (template: Template) => {
      setIsGenerating(true);
      setHasError(false);
      
      // Build rich prompt from template data (same as backend was doing)
      let templatePrompt = `Create a detailed ${template.name} character.`;
      
      if (template.description) {
        templatePrompt += ` ${template.description}`;
      }
      
      if (template.category) {
        templatePrompt += ` This is a ${template.category} character.`;
      }
      
      if (template.traits && template.traits.length > 0) {
        templatePrompt += ` Key personality traits: ${template.traits.join(', ')}.`;
      }
      
      templatePrompt += ` Develop this archetype into a fully realized character with comprehensive details across all categories: identity, appearance, personality, psychology, abilities, background, relationships, cultural context, story role, and meta information.`;
      
      // Use the SAME method as Custom AI - just with a different prompt!
      return await CharacterCreationService.generateFromPrompt(
        projectId,
        templatePrompt,
        (step, progress) => {
          setCurrentStep(step);
          setProgress(progress);
        }
      );
    },
    onSuccess: (character) => {
      setGeneratedCharacter(character);
      setCurrentStep('Complete!');
      setProgress(100);
      setIsGenerating(false);
      
      // Brief delay to show completion before closing
      setTimeout(() => {
        onComplete(character);
      }, 1500);
    },
    onError: (error) => {
      console.error('Template generation failed:', error);
      setCurrentStep(`Generation failed: ${error.message}`);
      setIsGenerating(false);
      setHasError(true);
      // Don't reset progress immediately to show error state
    }
  });

  const filteredTemplates = TEMPLATES.filter(template => {
    const matchesCategory = selectedCategory === 'all' || template.category === selectedCategory;
    const matchesSearch = template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         template.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         template.traits.some(trait => trait.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const handleSelectTemplate = (template: Template) => {
    console.log('🎨 Template selected:', template.name);
    console.log('🎨 Project ID:', projectId);
    console.log('🎨 Template data:', template);
    console.log('🎨 Current states:', { isGenerating, hasError, currentStep, progress });
    
    setSelectedTemplate(template);
    setCurrentStep('Starting generation...');
    setProgress(5);
    setIsGenerating(true);
    setHasError(false);
    console.log('🚀 About to call generateMutation.mutate with template...');
    generateMutation.mutate(template);
  };

  // Show loading screen if generating or progress > 0
  if (generateMutation.isPending || isGenerating || progress > 0) {
    return (
      <CharacterGenerationLoadingScreen
        currentStep={currentStep}
        progress={progress}
        character={generatedCharacter}
        isComplete={progress === 100 && !isGenerating}
        templateName={selectedTemplate?.name}
      />
    );
  }

  // Show error screen if there's an error
  if (hasError) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center space-y-6 max-w-md">
          <div className="text-destructive text-6xl">⚠️</div>
          <div className="space-y-2">
            <h3 className="text-xl font-semibold text-foreground">Generation Failed</h3>
            <p className="text-muted-foreground">{currentStep}</p>
          </div>
          <Button 
            onClick={() => {
              setHasError(false);
              setProgress(0);
              setCurrentStep('');
              setSelectedTemplate(null);
            }}
            className="gap-2"
          >
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      {/* Header Section */}
      <div className="flex-shrink-0 border-b border-border p-6">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-foreground mb-2">Choose a Template</h2>
          <p className="text-muted-foreground">Select a character archetype and let AI expand it into a complete character</p>
        </div>
      </div>

      {/* Filters Section */}
      <div className="flex-shrink-0 border-b border-border p-6 space-y-4 bg-muted/30">
        {/* Search */}
        <div className="relative max-w-md mx-auto">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search templates..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        
        {/* Categories */}
        <div className="flex items-center justify-center gap-2 flex-wrap">
          {CATEGORIES.map((category) => (
            <Button
              key={category.id}
              variant={selectedCategory === category.id ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedCategory(category.id)}
              className="gap-2"
            >
              {category.label}
              <Badge variant="secondary" className="ml-1 text-xs">
                {category.count}
              </Badge>
            </Button>
          ))}
        </div>
        
        {/* Results Count */}
        <div className="text-center">
          <p className="text-sm text-muted-foreground">
            Showing {filteredTemplates.length} of {TEMPLATES.length} templates
            {searchQuery && (
              <span className="text-primary"> matching "{searchQuery}"</span>
            )}
          </p>
        </div>
      </div>

      {/* Templates Grid */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-6xl mx-auto">
          {filteredTemplates.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTemplates.map((template) => {
                const Icon = template.icon;
                return (
                  <Card
                    key={template.id}
                    className="group relative cursor-pointer transition-all duration-200 border-2 hover:shadow-lg hover:-translate-y-1 hover:border-primary/50"
                    onClick={() => handleSelectTemplate(template)}
                  >
                    <CardHeader className="pb-4">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <div className="p-3 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                            <Icon className="h-6 w-6 text-primary" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-lg text-foreground">{template.name}</h3>
                            <div className="flex items-center gap-2 mt-1">
                              <Badge variant="outline" className="text-xs">
                                {template.category}
                              </Badge>
                              <Badge variant="secondary" className="text-xs">
                                {template.complexity}
                              </Badge>
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-1 text-xs text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Star className="h-3 w-3 fill-current text-amber-400" />
                            {template.popularity}%
                          </div>
                          <div className="px-2 py-1 rounded-md text-xs font-medium bg-primary/10 text-primary">
                            {template.timeEstimate}
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    
                    <CardContent className="pt-0">
                      <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                        {template.description}
                      </p>
                      
                      <div className="space-y-3">
                        <div className="flex flex-wrap gap-2">
                          {template.traits.map((trait) => (
                            <Badge key={trait} variant="secondary" className="text-xs">
                              {trait}
                            </Badge>
                          ))}
                        </div>
                        
                        <div className="flex items-center justify-between pt-3 border-t border-border">
                          <span className="text-sm font-medium text-foreground">Use Template</span>
                          <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity text-primary">
                            <span className="text-sm font-medium">Generate</span>
                            <Sparkles className="h-4 w-4" />
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="space-y-3">
                <Search className="h-12 w-12 text-muted-foreground mx-auto opacity-50" />
                <h3 className="text-lg font-medium text-foreground">No templates found</h3>
                <p className="text-muted-foreground max-w-md mx-auto">
                  No templates match your search criteria. Try adjusting your search or selecting a different category.
                </p>
                <Button
                  variant="outline"
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedCategory('all');
                  }}
                  className="mt-4"
                >
                  Clear Filters
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}