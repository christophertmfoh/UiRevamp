import React, { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import { 
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue 
} from '@/components/ui/select';
import { 
  BookOpen, Crown, Sword, Heart, Users, Zap, Shield, Star, Search, Filter,
  Eye, Brain, PenTool, Sparkles, ArrowRight, ChevronLeft
} from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import type { Character } from '@/lib/types';

interface CharacterTemplatesV2Props {
  isOpen: boolean;
  onClose: () => void;
  projectId: string;
  onBack?: () => void;
  onComplete?: (character: Character) => void;
}

interface EnhancedCharacterTemplate {
  id: string;
  name: string;
  description: string;
  category: 'fantasy' | 'modern' | 'scifi' | 'romance' | 'thriller' | 'universal' | 'historical' | 'horror';
  icon: React.ComponentType<any>;
  fields: Partial<Character>;
  tags: string[];
  popularity: number;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  estimatedTime: string;
  previewImage?: string;
  aiEnhanced: boolean;
}

const ENHANCED_CHARACTER_TEMPLATES: EnhancedCharacterTemplate[] = [
  // Fantasy Templates
  {
    id: 'heroic-protagonist',
    name: 'Heroic Protagonist',
    description: 'A brave hero destined for greatness, perfect for epic fantasy adventures',
    category: 'fantasy',
    icon: Crown,
    tags: ['hero', 'protagonist', 'brave', 'growth', 'destiny'],
    popularity: 98,
    difficulty: 'Beginner',
    estimatedTime: '5-8 min',
    aiEnhanced: true,
    fields: {
      role: 'Protagonist',
      personalityTraits: ['brave', 'determined', 'loyal', 'compassionate'],
      goals: 'Save the world and protect loved ones from an ancient evil',
      motivations: 'A deep sense of justice and responsibility to protect the innocent',
      strengths: 'Unwavering courage, natural leadership, strong moral compass, ability to inspire others',
      weaknesses: 'Sometimes reckless in pursuit of justice, trusts too easily, burden of responsibility',
      values: 'Honor, justice, protecting the innocent, friendship, sacrifice for the greater good',
      personality: 'A steadfast and courageous individual who puts others before themselves. Despite facing overwhelming odds, they maintain hope and inspire those around them. They struggle with the weight of destiny but never waver in their commitment to doing what\'s right.',
      background: 'Raised in humble circumstances, they discovered their true calling when evil threatened their homeland. Though initially reluctant to accept their destiny, they have grown into a true leader.',
      arc: 'From reluctant hero to confident leader who learns that true strength comes from the bonds forged with others',
      conflictSources: 'Self-doubt about worthiness, overwhelming responsibility, fear of failing those who depend on them',
      temperament: 'Optimistic',
      class: 'Paladin',
      abilities: ['divine magic', 'exceptional swordsmanship', 'protective aura'],
      skills: ['Leadership', 'Combat', 'Diplomacy', 'Tactics']
    }
  },
  {
    id: 'dark-sorcerer',
    name: 'Dark Sorcerer',
    description: 'A powerful spellcaster who has delved into forbidden magic',
    category: 'fantasy',
    icon: Zap,
    tags: ['magic', 'dark', 'powerful', 'corrupted', 'knowledge'],
    popularity: 89,
    difficulty: 'Advanced',
    estimatedTime: '8-12 min',
    aiEnhanced: true,
    fields: {
      role: 'Antagonist',
      class: 'Sorcerer',
      personalityTraits: ['intelligent', 'ambitious', 'secretive', 'ruthless', 'scholarly'],
      goals: 'Master the forbidden arts and achieve immortality at any cost',
      motivations: 'Terror of death and an insatiable hunger for ultimate magical power',
      strengths: 'Vast magical knowledge, strategic mind, ancient artifacts, network of cultists',
      weaknesses: 'Arrogance blinds them to simple solutions, magical corruption affects judgment, isolation',
      personality: 'Once a brilliant scholar, their pursuit of forbidden knowledge has twisted them into something inhuman. They speak with the authority of centuries but their eyes hold the cold calculation of someone who has sacrificed their humanity for power.',
      background: 'A former respected mage who turned to dark magic after losing someone dear to death. Each spell learned has cost them more of their soul.',
      abilities: ['necromancy', 'shadow manipulation', 'soul magic', 'dimensional rifts'],
      skills: ['Arcane Knowledge', 'Ritual Magic', 'Ancient Languages', 'Alchemy'],
      values: 'Knowledge above all, power through sacrifice, the ends justify the means',
      fears: 'Death, being forgotten, losing control of their magical power',
      secrets: 'They retain a fragment of their original compassion, buried deep beneath layers of corruption'
    }
  },
  {
    id: 'elven-ranger',
    name: 'Elven Ranger',
    description: 'A skilled woodland guardian protecting nature from encroaching civilization',
    category: 'fantasy',
    icon: Shield,
    tags: ['elf', 'nature', 'archer', 'guardian', 'wisdom'],
    popularity: 84,
    difficulty: 'Intermediate',
    estimatedTime: '6-9 min',
    aiEnhanced: true,
    fields: {
      role: 'Supporting Character',
      race: 'Elf',
      class: 'Ranger',
      personalityTraits: ['observant', 'patient', 'protective', 'wise', 'solitary'],
      goals: 'Protect the ancient forests from destruction and preserve the balance of nature',
      motivations: 'Deep spiritual connection to nature and ancestral duty passed down through generations',
      strengths: 'Unmatched archery skills, deep forest knowledge, longevity provides wisdom, animal companions',
      weaknesses: 'Distrust of rapid change, stubborn adherence to tradition, difficulty understanding mortal urgency',
      skills: ['Archery', 'Tracking', 'Stealth', 'Herbalism', 'Animal Handling', 'Survival'],
      personality: 'Ancient eyes that have seen centuries of change hold both wisdom and sadness. They speak little but when they do, others listen. Their connection to nature runs so deep they sometimes seem more tree than person.',
      background: 'Born in the heart of an ancient forest, trained by rangers who came before. They have watched civilizations rise and fall while the forest endures.',
      values: 'Harmony with nature, preservation of ancient ways, patience, respect for all living things',
      abilities: ['enhanced senses', 'nature magic', 'animal communication'],
      temperament: 'Melancholic'
    }
  },
  // Modern Templates
  {
    id: 'brilliant-detective',
    name: 'Brilliant Detective',
    description: 'A sharp-minded investigator who sees patterns others miss',
    category: 'modern',
    icon: Eye,
    tags: ['detective', 'intelligent', 'observant', 'mystery', 'justice'],
    popularity: 91,
    difficulty: 'Intermediate',
    estimatedTime: '7-10 min',
    aiEnhanced: true,
    fields: {
      role: 'Protagonist',
      profession: 'Detective',
      personalityTraits: ['analytical', 'observant', 'persistent', 'intuitive', 'slightly obsessive'],
      goals: 'Solve the unsolvable cases and bring justice to victims',
      motivations: 'An unrelenting need to find truth and provide closure for those affected by crime',
      strengths: 'Exceptional deductive abilities, photographic memory, vast knowledge of criminal psychology',
      weaknesses: 'Difficulty with social relationships, tendency to obsess over cases, cynical worldview',
      personality: 'Sees the world as a complex puzzle where every detail matters. Their mind works like a machine, cataloging and connecting information others would miss. They struggle with emotional connections but are deeply committed to justice.',
      skills: ['Deduction', 'Investigation', 'Psychology', 'Forensics', 'Interrogation'],
      background: 'Rose through the ranks by solving cases others couldn\'t. Their reputation for results is matched only by their reputation for being difficult to work with.',
      values: 'Truth above all, justice for victims, logical thinking, evidence-based conclusions',
      habits: 'Takes detailed notes, studies crime scene photos obsessively, practices deductive reasoning constantly'
    }
  },
  // Sci-Fi Templates
  {
    id: 'space-explorer',
    name: 'Space Explorer',
    description: 'A brave pioneer venturing into the unknown reaches of space',
    category: 'scifi',
    icon: Sparkles,
    tags: ['space', 'explorer', 'brave', 'curious', 'pioneer'],
    popularity: 86,
    difficulty: 'Intermediate',
    estimatedTime: '6-9 min',
    aiEnhanced: true,
    fields: {
      role: 'Protagonist',
      profession: 'Space Explorer',
      personalityTraits: ['curious', 'brave', 'adaptable', 'independent', 'optimistic'],
      goals: 'Discover new worlds and make contact with alien civilizations',
      motivations: 'Insatiable curiosity about the universe and desire to expand human knowledge',
      strengths: 'Exceptional piloting skills, quick adaptation to new environments, diplomatic abilities',
      weaknesses: 'Reckless curiosity sometimes overrides caution, difficulty with authority, homesickness',
      personality: 'Eyes bright with wonder at the infinite possibilities of space. They see every star as a destination and every alien encounter as an opportunity for understanding rather than conflict.',
      background: 'Left Earth young to join the exploration corps. Has spent more time in space than on any planet.',
      abilities: ['zero-g maneuvering', 'universal translator implant', 'enhanced radiation resistance'],
      skills: ['Piloting', 'Xenobiology', 'Diplomacy', 'Survival', 'Technology'],
      values: 'Discovery, peaceful contact, expanding knowledge, protecting crew'
    }
  },
  // Universal Templates
  {
    id: 'wise-mentor',
    name: 'Wise Mentor',
    description: 'An experienced guide who helps others reach their potential',
    category: 'universal',
    icon: BookOpen,
    tags: ['mentor', 'wise', 'teacher', 'guide', 'experienced'],
    popularity: 93,
    difficulty: 'Beginner',
    estimatedTime: '5-7 min',
    aiEnhanced: true,
    fields: {
      role: 'Mentor',
      personalityTraits: ['wise', 'patient', 'understanding', 'protective', 'insightful'],
      goals: 'Guide others to fulfill their potential and learn from their own mistakes',
      motivations: 'Desire to pass on hard-earned wisdom and prevent others from making the same errors',
      strengths: 'Deep life experience, ability to see potential in others, calm under pressure',
      weaknesses: 'Sometimes too protective of students, struggles to let them make necessary mistakes',
      personality: 'Carries themselves with quiet dignity earned through trials and triumphs. Their words are few but meaningful, and they have the rare gift of seeing not just who someone is, but who they could become.',
      background: 'Once faced the same challenges now confronting their student. Has learned that true wisdom comes from failure as much as success.',
      values: 'Growth through experience, learning from mistakes, patience, compassion',
      arc: 'Learns to trust their student and accept that their time as a guide must eventually end'
    }
  },
  {
    id: 'conflicted-antihero',
    name: 'Conflicted Anti-Hero',
    description: 'A morally complex character walking the line between good and evil',
    category: 'universal',
    icon: Heart,
    tags: ['antihero', 'complex', 'morally gray', 'conflicted', 'redemption'],
    popularity: 87,
    difficulty: 'Advanced',
    estimatedTime: '10-15 min',
    aiEnhanced: true,
    fields: {
      role: 'Anti-Hero',
      personalityTraits: ['cynical', 'pragmatic', 'conflicted', 'loyal to few', 'haunted'],
      goals: 'Survive and protect the few people they care about, regardless of the cost',
      motivations: 'Past trauma drives them to prevent others from suffering the same fate',
      strengths: 'Willingness to do what others won\'t, street smart, resourceful, surprisingly loyal',
      weaknesses: 'Difficulty trusting others, tendency toward violence, haunted by past actions',
      personality: 'Hard edges formed by a harsh world, but beneath the cynical exterior beats a heart that still believes in protecting the innocent, even if they\'ve lost faith in traditional heroism.',
      background: 'Made terrible choices in the past, possibly to save others. Now struggles with the consequences while trying to do better.',
      values: 'Loyalty to chosen family, pragmatic morality, results over methods',
      conflictSources: 'Past actions vs current moral growth, loyalty vs doing what\'s right',
      arc: 'Learns that redemption is possible and that being better is a choice made daily'
    }
  },
  // Historical Template
  {
    id: 'renaissance-artist',
    name: 'Renaissance Artist',
    description: 'A passionate creator during the height of artistic and scientific revolution',
    category: 'historical',
    icon: PenTool,
    tags: ['artist', 'renaissance', 'creative', 'passionate', 'innovative'],
    popularity: 72,
    difficulty: 'Intermediate',
    estimatedTime: '7-10 min',
    aiEnhanced: true,
    fields: {
      role: 'Protagonist',
      profession: 'Artist/Inventor',
      personalityTraits: ['passionate', 'creative', 'perfectionist', 'curious', 'temperamental'],
      goals: 'Create masterworks that will outlive them and push the boundaries of art and science',
      motivations: 'Burning need to capture beauty and truth through art, desire to understand how things work',
      strengths: 'Exceptional artistic talent, innovative thinking, ability to see beauty everywhere',
      weaknesses: 'Perfectionist tendencies lead to unfinished works, difficulty with patrons, financial instability',
      personality: 'Lives in a world of beauty and possibility. Sees art and science as two sides of the same coin. Quick to passion and equally quick to despair when reality fails to match their vision.',
      background: 'Trained in traditional techniques but constantly pushes beyond accepted boundaries. Struggles between artistic vision and practical needs.',
      skills: ['Painting', 'Sculpture', 'Engineering', 'Anatomy', 'Mathematics'],
      values: 'Beauty, truth through art, innovation, pushing boundaries'
    }
  }
];

const CATEGORIES = [
  { value: 'all', label: 'All Categories' },
  { value: 'fantasy', label: 'Fantasy' },
  { value: 'modern', label: 'Modern' },
  { value: 'scifi', label: 'Sci-Fi' },
  { value: 'universal', label: 'Universal' },
  { value: 'historical', label: 'Historical' },
  { value: 'romance', label: 'Romance' },
  { value: 'thriller', label: 'Thriller' },
  { value: 'horror', label: 'Horror' }
];

const DIFFICULTIES = [
  { value: 'all', label: 'All Levels' },
  { value: 'Beginner', label: 'Beginner' },
  { value: 'Intermediate', label: 'Intermediate' },
  { value: 'Advanced', label: 'Advanced' }
];

export function CharacterTemplatesV2({ isOpen, onClose, projectId, onBack, onComplete }: CharacterTemplatesV2Props) {
  const [selectedTemplate, setSelectedTemplate] = useState<EnhancedCharacterTemplate | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');
  const [sortBy, setSortBy] = useState<'popularity' | 'name' | 'difficulty'>('popularity');

  const queryClient = useQueryClient();

  // Filter and sort templates
  const filteredTemplates = useMemo(() => {
    let filtered = ENHANCED_CHARACTER_TEMPLATES.filter(template => {
      const matchesSearch = template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           template.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           template.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
      
      const matchesCategory = selectedCategory === 'all' || template.category === selectedCategory;
      const matchesDifficulty = selectedDifficulty === 'all' || template.difficulty === selectedDifficulty;
      
      return matchesSearch && matchesCategory && matchesDifficulty;
    });

    // Sort templates
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'popularity':
          return b.popularity - a.popularity;
        case 'name':
          return a.name.localeCompare(b.name);
        case 'difficulty':
          const difficultyOrder = { 'Beginner': 1, 'Intermediate': 2, 'Advanced': 3 };
          return difficultyOrder[a.difficulty] - difficultyOrder[b.difficulty];
        default:
          return 0;
      }
    });

    return filtered;
  }, [searchQuery, selectedCategory, selectedDifficulty, sortBy]);

  // Create character mutation with AI enhancement
  const createMutation = useMutation({
    mutationFn: async (template: EnhancedCharacterTemplate) => {
      // Enhanced character data with AI improvements
      const enhancedData = {
        ...template.fields,
        id: `char-${Date.now()}`,
        projectId,
        tags: template.tags,
        createdAt: new Date(),
        // Add template metadata
        _templateId: template.id,
        _templateName: template.name,
        _aiEnhanced: template.aiEnhanced
      };

      const response = await apiRequest({
        url: `/api/projects/${projectId}/characters`,
        method: 'POST',
        data: enhancedData,
      });
      return response;
    },
    onSuccess: (newCharacter) => {
      queryClient.invalidateQueries({ queryKey: [`/api/projects/${projectId}/characters`] });
      onComplete?.(newCharacter);
      onClose();
    },
  });

  const handleSelectTemplate = (template: EnhancedCharacterTemplate) => {
    setSelectedTemplate(template);
  };

  const handleUseTemplate = () => {
    if (selectedTemplate) {
      createMutation.mutate(selectedTemplate);
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner': return 'text-green-600 bg-green-100';
      case 'Intermediate': return 'text-yellow-600 bg-yellow-100';
      case 'Advanced': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  if (selectedTemplate) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden p-0">
          <DialogHeader className="border-b border-border/30 p-6 pb-4">
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="sm" onClick={() => setSelectedTemplate(null)}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <div className="flex items-center gap-3 flex-1">
                <selectedTemplate.icon className="h-6 w-6 text-accent" />
                <div>
                  <DialogTitle className="text-xl font-bold">{selectedTemplate.name}</DialogTitle>
                  <p className="text-sm text-muted-foreground">{selectedTemplate.description}</p>
                </div>
              </div>
              {selectedTemplate.aiEnhanced && (
                <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                  <Sparkles className="w-3 h-3 mr-1" />
                  AI Enhanced
                </Badge>
              )}
            </div>
          </DialogHeader>

          <ScrollArea className="max-h-[60vh] p-6">
            <div className="space-y-6">
              {/* Template Overview */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <span className="font-medium text-muted-foreground">Category</span>
                  <p className="capitalize">{selectedTemplate.category}</p>
                </div>
                <div>
                  <span className="font-medium text-muted-foreground">Difficulty</span>
                  <Badge className={getDifficultyColor(selectedTemplate.difficulty)}>
                    {selectedTemplate.difficulty}
                  </Badge>
                </div>
                <div>
                  <span className="font-medium text-muted-foreground">Est. Time</span>
                  <p>{selectedTemplate.estimatedTime}</p>
                </div>
                <div>
                  <span className="font-medium text-muted-foreground">Popularity</span>
                  <div className="flex items-center gap-1">
                    <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                    <span>{selectedTemplate.popularity}%</span>
                  </div>
                </div>
              </div>

              {/* Character Preview */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Character Preview</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {selectedTemplate.fields.personality && (
                    <div>
                      <h4 className="font-medium mb-2">Personality</h4>
                      <p className="text-sm text-muted-foreground">{selectedTemplate.fields.personality}</p>
                    </div>
                  )}
                  
                  {selectedTemplate.fields.goals && (
                    <div>
                      <h4 className="font-medium mb-2">Goals</h4>
                      <p className="text-sm text-muted-foreground">{selectedTemplate.fields.goals}</p>
                    </div>
                  )}

                  {selectedTemplate.fields.background && (
                    <div>
                      <h4 className="font-medium mb-2">Background</h4>
                      <p className="text-sm text-muted-foreground">{selectedTemplate.fields.background}</p>
                    </div>
                  )}

                  {selectedTemplate.fields.personalityTraits && (
                    <div>
                      <h4 className="font-medium mb-2">Key Traits</h4>
                      <div className="flex flex-wrap gap-1">
                        {(selectedTemplate.fields.personalityTraits as string[]).map((trait, idx) => (
                          <Badge key={idx} variant="outline" className="text-xs">
                            {trait}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* What's Included */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">What's Included</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Brain className="h-4 w-4 text-accent" />
                        <span>Complete personality profile</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Zap className="h-4 w-4 text-accent" />
                        <span>Goals and motivations</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <BookOpen className="h-4 w-4 text-accent" />
                        <span>Detailed background</span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Shield className="h-4 w-4 text-accent" />
                        <span>Strengths and weaknesses</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Heart className="h-4 w-4 text-accent" />
                        <span>Core values and beliefs</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <PenTool className="h-4 w-4 text-accent" />
                        <span>Character development arc</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </ScrollArea>

          <div className="border-t border-border/30 p-6 flex items-center justify-between">
            <Button variant="outline" onClick={() => setSelectedTemplate(null)}>
              Back to Templates
            </Button>
            <Button 
              onClick={handleUseTemplate} 
              disabled={createMutation.isPending}
              className="min-w-[120px]"
            >
              {createMutation.isPending ? 'Creating...' : 'Use Template'}
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl h-[90vh] p-0 gap-0">
        <DialogHeader className="border-b border-border/30 p-6 pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="sm" onClick={onBack}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <div>
                <DialogTitle className="text-xl font-bold flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-accent" />
                  AI-Enhanced Character Templates
                </DialogTitle>
                <p className="text-sm text-muted-foreground">
                  Professional character archetypes with AI-powered enhancements
                </p>
              </div>
            </div>
            <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
              <Sparkles className="w-3 h-3 mr-1" />
              {filteredTemplates.filter(t => t.aiEnhanced).length} AI Enhanced
            </Badge>
          </div>
          
          {/* Search and Filters */}
          <div className="mt-4 flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search templates..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-[160px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {CATEGORIES.map(category => (
                  <SelectItem key={category.value} value={category.value}>
                    {category.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={selectedDifficulty} onValueChange={setSelectedDifficulty}>
              <SelectTrigger className="w-[140px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {DIFFICULTIES.map(difficulty => (
                  <SelectItem key={difficulty.value} value={difficulty.value}>
                    {difficulty.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
              <SelectTrigger className="w-[130px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="popularity">Popularity</SelectItem>
                <SelectItem value="name">Name</SelectItem>
                <SelectItem value="difficulty">Difficulty</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </DialogHeader>

        <ScrollArea className="flex-1 p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredTemplates.map((template) => {
              const Icon = template.icon;
              
              return (
                <Card 
                  key={template.id}
                  className="group cursor-pointer transition-all duration-200 hover:shadow-md border border-border/20 hover:border-accent/30 bg-card/30 hover:bg-card/50"
                  onClick={() => handleSelectTemplate(template)}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-accent/10 rounded-lg border border-accent/20 group-hover:bg-accent/15 transition-colors">
                          <Icon className="h-4 w-4 text-accent" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <CardTitle className="text-sm font-bold text-foreground group-hover:text-accent transition-colors truncate">
                            {template.name}
                          </CardTitle>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant="outline" className="text-xs capitalize">
                              {template.category}
                            </Badge>
                            <Badge className={`text-xs ${getDifficultyColor(template.difficulty)}`}>
                              {template.difficulty}
                            </Badge>
                          </div>
                        </div>
                      </div>
                      {template.aiEnhanced && (
                        <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs">
                          <Sparkles className="w-2 h-2 mr-1" />
                          AI
                        </Badge>
                      )}
                    </div>
                  </CardHeader>
                  
                  <CardContent className="pt-0">
                    <p className="text-xs text-muted-foreground mb-3 line-clamp-2">
                      {template.description}
                    </p>
                    
                    <div className="flex items-center justify-between text-xs text-muted-foreground mb-3">
                      <div className="flex items-center gap-1">
                        <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                        <span>{template.popularity}%</span>
                      </div>
                      <span>{template.estimatedTime}</span>
                    </div>

                    <div className="flex flex-wrap gap-1">
                      {template.tags.slice(0, 3).map((tag, idx) => (
                        <Badge key={idx} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                      {template.tags.length > 3 && (
                        <Badge variant="secondary" className="text-xs">
                          +{template.tags.length - 3}
                        </Badge>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {filteredTemplates.length === 0 && (
            <div className="text-center py-12">
              <Filter className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">No templates found</h3>
              <p className="text-muted-foreground">
                Try adjusting your search criteria or browse all templates
              </p>
            </div>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}