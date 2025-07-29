import React, { useState, useEffect } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  User, Sparkles, Heart, Brain, Zap, BookOpen, 
  Users, Target, ChevronRight, Save, Check, Plus,
  Wand2, Info, Eye, Palette, MessageSquare
} from 'lucide-react';
import { apiRequest } from '@/lib/queryClient';
import type { Character } from '@/lib/types';
import { nanoid } from 'nanoid';
import { cn } from '@/lib/utils';
import { CharacterCreationLayout } from './CharacterCreationLayout';
import { CreationTheme, CreationSection, FieldConfig } from './CharacterCreationSystem';

interface CharacterGuidedCreationProProps {
  isOpen: boolean;
  onClose: () => void;
  projectId: string;
  onBack?: () => void;
}

// Professional sections that guide writers through character creation
const CREATION_SECTIONS: CreationSection[] = [
  {
    id: 'essence',
    title: 'Character Essence',
    subtitle: 'The heart of your character',
    icon: Heart,
    fields: [
      {
        key: 'name',
        label: 'Character Name',
        type: 'text',
        placeholder: 'What do others call them?',
        helpText: 'The name that defines their identity',
        required: true,
        maxLength: 100,
        showCharCount: true
      },
      {
        key: 'concept',
        label: 'Core Concept',
        type: 'textarea',
        placeholder: 'In one sentence, who is this character?',
        helpText: 'The elevator pitch for your character',
        rows: 2,
        maxLength: 200,
        showCharCount: true
      },
      {
        key: 'role',
        label: 'Story Role',
        type: 'select',
        options: [
          { value: 'protagonist', label: 'Protagonist - The main character' },
          { value: 'antagonist', label: 'Antagonist - The opposition' },
          { value: 'deuteragonist', label: 'Deuteragonist - The secondary lead' },
          { value: 'mentor', label: 'Mentor - The guide' },
          { value: 'sidekick', label: 'Sidekick - The companion' },
          { value: 'love_interest', label: 'Love Interest - The romantic lead' },
          { value: 'comic_relief', label: 'Comic Relief - The humor' },
          { value: 'supporting', label: 'Supporting - Important but not central' }
        ],
        helpText: 'Their function in your story'
      }
    ]
  },
  {
    id: 'identity',
    title: 'Identity',
    subtitle: 'Basic characteristics',
    icon: User,
    fields: [
      {
        key: 'age',
        label: 'Age',
        type: 'text',
        placeholder: 'How old are they?',
        helpText: 'Can be specific (25) or descriptive (young adult)'
      },
      {
        key: 'gender',
        label: 'Gender Identity',
        type: 'text',
        placeholder: 'How do they identify?',
        helpText: 'Their gender identity and pronouns'
      },
      {
        key: 'species',
        label: 'Species/Type',
        type: 'text',
        placeholder: 'Human, elf, android, etc.',
        helpText: 'What kind of being are they?'
      },
      {
        key: 'occupation',
        label: 'Occupation',
        type: 'text',
        placeholder: 'What do they do?',
        helpText: 'Their job, calling, or primary activity'
      }
    ]
  },
  {
    id: 'appearance',
    title: 'Appearance',
    subtitle: 'How they look',
    icon: Eye,
    fields: [
      {
        key: 'appearance',
        label: 'Physical Description',
        type: 'textarea',
        placeholder: 'Paint a picture with words...',
        helpText: 'Height, build, distinguishing features, style',
        rows: 4,
        suggestions: [
          'Athletic build with calloused hands',
          'Piercing green eyes that seem to see through you',
          'Always impeccably dressed, even in crisis',
          'Numerous scars tell stories of past battles'
        ]
      },
      {
        key: 'firstImpression',
        label: 'First Impression',
        type: 'text',
        placeholder: 'What do people notice first?',
        helpText: 'The immediate impact they have on others'
      }
    ]
  },
  {
    id: 'personality',
    title: 'Personality',
    subtitle: 'Their inner world',
    icon: Brain,
    fields: [
      {
        key: 'personalityTraits',
        label: 'Core Traits',
        type: 'tags',
        placeholder: 'Add personality traits...',
        helpText: 'The qualities that define them',
        suggestions: [
          'Brave', 'Cautious', 'Ambitious', 'Loyal', 'Cunning',
          'Compassionate', 'Ruthless', 'Optimistic', 'Cynical',
          'Charismatic', 'Introverted', 'Analytical', 'Impulsive'
        ]
      },
      {
        key: 'values',
        label: 'Core Values',
        type: 'textarea',
        placeholder: 'What principles guide their decisions?',
        helpText: 'The beliefs they hold most dear',
        rows: 2
      },
      {
        key: 'fears',
        label: 'Greatest Fear',
        type: 'text',
        placeholder: 'What keeps them awake at night?',
        helpText: 'Their deepest fear or phobia'
      },
      {
        key: 'desires',
        label: 'Deepest Desire',
        type: 'text',
        placeholder: 'What do they want most in the world?',
        helpText: 'Their ultimate goal or wish'
      }
    ]
  },
  {
    id: 'abilities',
    title: 'Abilities',
    subtitle: 'What they can do',
    icon: Zap,
    fields: [
      {
        key: 'strengths',
        label: 'Key Strengths',
        type: 'tags',
        placeholder: 'What are they good at?',
        helpText: 'Skills, talents, and advantages',
        suggestions: [
          'Master swordsman', 'Photographic memory', 'Natural leader',
          'Expert negotiator', 'Survival skills', 'Technical genius',
          'Empathic abilities', 'Strategic thinking'
        ]
      },
      {
        key: 'weaknesses',
        label: 'Critical Weaknesses',
        type: 'tags',
        placeholder: 'Where do they struggle?',
        helpText: 'Flaws, limitations, and vulnerabilities',
        suggestions: [
          'Quick temper', 'Trusts too easily', 'Fear of heights',
          'Poor social skills', 'Overconfident', 'Chronic illness',
          'Haunted by past', 'Addiction'
        ]
      },
      {
        key: 'specialAbilities',
        label: 'Special Abilities',
        type: 'textarea',
        placeholder: 'Any unique powers or skills?',
        helpText: 'Magical abilities, mutations, specialized training',
        rows: 3
      }
    ]
  },
  {
    id: 'backstory',
    title: 'Backstory',
    subtitle: 'Where they came from',
    icon: BookOpen,
    fields: [
      {
        key: 'backstory',
        label: 'Life Story',
        type: 'textarea',
        placeholder: 'Tell their story before the story begins...',
        helpText: 'Key events that shaped who they are',
        rows: 5,
        required: true
      },
      {
        key: 'secretOrTwist',
        label: 'Hidden Secret',
        type: 'textarea',
        placeholder: 'What are they hiding?',
        helpText: 'A secret that could change everything',
        rows: 2
      }
    ]
  },
  {
    id: 'relationships',
    title: 'Relationships',
    subtitle: 'Their connections',
    icon: Users,
    fields: [
      {
        key: 'relationships',
        label: 'Key Relationships',
        type: 'relationship',
        placeholder: 'Who matters to them?',
        helpText: 'Family, friends, enemies, mentors'
      },
      {
        key: 'socialDynamics',
        label: 'Social Dynamics',
        type: 'textarea',
        placeholder: 'How do they interact with others?',
        helpText: 'Their social style and relationship patterns',
        rows: 2
      }
    ]
  },
  {
    id: 'arc',
    title: 'Story Arc',
    subtitle: 'Their journey',
    icon: Target,
    fields: [
      {
        key: 'goals',
        label: 'Primary Goal',
        type: 'text',
        placeholder: 'What are they trying to achieve?',
        helpText: 'Their main objective in the story'
      },
      {
        key: 'motivations',
        label: 'Core Motivation',
        type: 'text',
        placeholder: 'Why do they want this?',
        helpText: 'The driving force behind their actions'
      },
      {
        key: 'arc',
        label: 'Character Arc',
        type: 'textarea',
        placeholder: 'How will they change throughout the story?',
        helpText: 'Their journey of growth or decline',
        rows: 3
      }
    ]
  }
];

export function CharacterGuidedCreationPro({ 
  isOpen, 
  onClose, 
  projectId,
  onBack 
}: CharacterGuidedCreationProProps) {
  const [currentSection, setCurrentSection] = useState(0);
  const [characterData, setCharacterData] = useState<Partial<Character>>({
    projectId,
    id: nanoid(),
    name: '',
    role: 'supporting'
  });
  const [completedSections, setCompletedSections] = useState<Set<number>>(new Set());
  const [showPreview, setShowPreview] = useState(true);
  
  const queryClient = useQueryClient();
  const theme = CreationTheme.guided;
  const section = CREATION_SECTIONS[currentSection];
  const progress = ((completedSections.size + 1) / CREATION_SECTIONS.length) * 100;

  const saveMutation = useMutation({
    mutationFn: async (data: Partial<Character>) => {
      const response = await apiRequest('POST', `/api/projects/${projectId}/characters`, data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/projects/${projectId}/characters`] });
      onClose();
    }
  });

  const updateField = (key: string, value: any) => {
    setCharacterData(prev => ({ ...prev, [key]: value }));
  };

  const isSectionValid = () => {
    const requiredFields = section.fields.filter(f => f.required);
    return requiredFields.every(field => {
      const value = characterData[field.key as keyof Character];
      return value && value.toString().trim().length > 0;
    });
  };

  const handleNext = () => {
    if (isSectionValid()) {
      setCompletedSections(prev => new Set([...prev, currentSection]));
      if (currentSection < CREATION_SECTIONS.length - 1) {
        setCurrentSection(currentSection + 1);
      }
    }
  };

  const handlePrevious = () => {
    if (currentSection > 0) {
      setCurrentSection(currentSection - 1);
    }
  };

  const handleSectionClick = (index: number) => {
    if (index <= currentSection || completedSections.has(index)) {
      setCurrentSection(index);
    }
  };

  const renderField = (field: FieldConfig) => {
    const value = characterData[field.key as keyof Character] || '';
    
    switch (field.type) {
      case 'text':
        return (
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              {field.label}
              {field.required && <Badge variant="destructive" className="text-xs px-1 py-0">Required</Badge>}
            </Label>
            {field.helpText && (
              <p className="text-xs text-muted-foreground">{field.helpText}</p>
            )}
            <div className="relative">
              <Input
                value={value as string}
                onChange={(e) => updateField(field.key, e.target.value)}
                placeholder={field.placeholder}
                maxLength={field.maxLength}
                className="pr-16"
              />
              {field.showCharCount && field.maxLength && (
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
                  {(value as string).length}/{field.maxLength}
                </span>
              )}
            </div>
          </div>
        );
      
      case 'textarea':
        return (
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              {field.label}
              {field.required && <Badge variant="destructive" className="text-xs px-1 py-0">Required</Badge>}
            </Label>
            {field.helpText && (
              <p className="text-xs text-muted-foreground">{field.helpText}</p>
            )}
            <div className="relative">
              <Textarea
                value={value as string}
                onChange={(e) => updateField(field.key, e.target.value)}
                placeholder={field.placeholder}
                rows={field.rows || 3}
                maxLength={field.maxLength}
                className="resize-none"
              />
              {field.showCharCount && field.maxLength && (
                <span className="absolute right-3 bottom-3 text-xs text-muted-foreground">
                  {(value as string).length}/{field.maxLength}
                </span>
              )}
            </div>
            {field.suggestions && (
              <div className="flex flex-wrap gap-2 mt-2">
                <span className="text-xs text-muted-foreground">Try:</span>
                {field.suggestions.slice(0, 3).map((suggestion, i) => (
                  <Button
                    key={i}
                    variant="ghost"
                    size="sm"
                    className="h-6 text-xs"
                    onClick={() => updateField(field.key, suggestion)}
                  >
                    <Wand2 className="h-3 w-3 mr-1" />
                    {suggestion.substring(0, 30)}...
                  </Button>
                ))}
              </div>
            )}
          </div>
        );
      
      case 'select':
        return (
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              {field.label}
              {field.required && <Badge variant="destructive" className="text-xs px-1 py-0">Required</Badge>}
            </Label>
            {field.helpText && (
              <p className="text-xs text-muted-foreground">{field.helpText}</p>
            )}
            <div className="grid grid-cols-1 gap-2">
              {field.options?.map((option) => (
                <button
                  key={option.value}
                  onClick={() => updateField(field.key, option.value)}
                  className={cn(
                    "text-left p-3 rounded-lg border transition-all",
                    "hover:bg-muted/50",
                    value === option.value
                      ? `${theme.border} ${theme.icon}`
                      : "border-border"
                  )}
                >
                  <div className="font-medium text-sm">{option.label.split(' - ')[0]}</div>
                  {option.label.includes(' - ') && (
                    <div className="text-xs text-muted-foreground mt-0.5">
                      {option.label.split(' - ')[1]}
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>
        );
      
      case 'tags':
        const tags = Array.isArray(value) ? value : [];
        return (
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              {field.label}
              {field.required && <Badge variant="destructive" className="text-xs px-1 py-0">Required</Badge>}
            </Label>
            {field.helpText && (
              <p className="text-xs text-muted-foreground">{field.helpText}</p>
            )}
            <div className="space-y-3">
              <div className="flex flex-wrap gap-2">
                {tags.map((tag, i) => (
                  <Badge
                    key={i}
                    variant="secondary"
                    className="pl-3 pr-1 py-1 flex items-center gap-1"
                  >
                    {tag}
                    <button
                      onClick={() => {
                        const newTags = tags.filter((_, index) => index !== i);
                        updateField(field.key, newTags);
                      }}
                      className="ml-1 hover:bg-muted rounded p-0.5"
                    >
                      ×
                    </button>
                  </Badge>
                ))}
                <Input
                  placeholder={field.placeholder}
                  className="w-40 h-7 text-sm"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && e.currentTarget.value) {
                      e.preventDefault();
                      updateField(field.key, [...tags, e.currentTarget.value]);
                      e.currentTarget.value = '';
                    }
                  }}
                />
              </div>
              {field.suggestions && (
                <div className="flex flex-wrap gap-1">
                  {field.suggestions.map((suggestion) => (
                    <Button
                      key={suggestion}
                      variant="ghost"
                      size="sm"
                      className="h-6 text-xs"
                      onClick={() => {
                        if (!tags.includes(suggestion)) {
                          updateField(field.key, [...tags, suggestion]);
                        }
                      }}
                      disabled={tags.includes(suggestion)}
                    >
                      <Plus className="h-3 w-3 mr-1" />
                      {suggestion}
                    </Button>
                  ))}
                </div>
              )}
            </div>
          </div>
        );
      
      default:
        return null;
    }
  };

  const actions = (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        {currentSection > 0 && (
          <Button variant="outline" onClick={handlePrevious}>
            Previous
          </Button>
        )}
      </div>
      
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          onClick={() => saveMutation.mutate(characterData)}
          disabled={saveMutation.isPending}
        >
          <Save className="h-4 w-4 mr-2" />
          Save Draft
        </Button>
        
        {currentSection < CREATION_SECTIONS.length - 1 ? (
          <Button
            onClick={handleNext}
            disabled={!isSectionValid()}
            className={theme.button}
          >
            Continue
            <ChevronRight className="h-4 w-4 ml-2" />
          </Button>
        ) : (
          <Button
            onClick={() => saveMutation.mutate(characterData)}
            disabled={!characterData.name || saveMutation.isPending}
            className="bg-emerald-600 hover:bg-emerald-700"
          >
            <Check className="h-4 w-4 mr-2" />
            Create Character
          </Button>
        )}
      </div>
    </div>
  );

  return (
    <CharacterCreationLayout
      title="Guided Character Creation"
      subtitle="Build your character step by step"
      icon={<Plus className="h-5 w-5" />}
      iconColor={theme.icon}
      progress={progress}
      onBack={onBack}
      actions={actions}
    >
      <div className="max-w-4xl mx-auto">
        {/* Section Progress */}
        <div className="mb-6">
          <div className="flex items-center gap-1 p-1 bg-muted/30 rounded-lg overflow-x-auto">
            {CREATION_SECTIONS.map((s, index) => {
              const Icon = s.icon;
              const isCompleted = completedSections.has(index);
              const isCurrent = index === currentSection;
              const isAccessible = index <= currentSection || isCompleted;
              
              return (
                <button
                  key={s.id}
                  onClick={() => handleSectionClick(index)}
                  disabled={!isAccessible}
                  className={cn(
                    "flex items-center gap-2 px-3 py-2 rounded-md transition-all whitespace-nowrap",
                    "hover:bg-background/50",
                    isCurrent && `${theme.icon} bg-opacity-100`,
                    isCompleted && "bg-emerald-500/10 text-emerald-600",
                    !isAccessible && "opacity-50 cursor-not-allowed",
                    isAccessible && !isCurrent && !isCompleted && "hover:bg-muted"
                  )}
                >
                  {isCompleted ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    <Icon className="h-4 w-4" />
                  )}
                  <span className="text-sm font-medium hidden md:block">
                    {s.title}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Section Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Form */}
          <div className="lg:col-span-2">
            <div className="bg-card rounded-lg border p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className={cn("p-3 rounded-lg", theme.icon)}>
                  <section.icon className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold">{section.title}</h3>
                  <p className="text-sm text-muted-foreground">{section.subtitle}</p>
                </div>
              </div>
              
              <div className="space-y-6">
                {section.fields.map((field) => (
                  <div key={field.key}>
                    {renderField(field)}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Live Preview */}
          <div className="hidden lg:block">
            <div className="sticky top-4">
              <div className={cn(
                "bg-gradient-to-b rounded-lg border p-6",
                theme.gradient,
                theme.border
              )}>
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                  <Eye className="h-4 w-4" />
                  Character Preview
                </h3>
                
                <div className="space-y-3 text-sm">
                  {characterData.name && (
                    <div>
                      <div className="text-xs text-muted-foreground mb-1">Name</div>
                      <div className="font-medium">{characterData.name}</div>
                    </div>
                  )}
                  
                  {characterData.concept && (
                    <div>
                      <div className="text-xs text-muted-foreground mb-1">Concept</div>
                      <div className="text-sm">{characterData.concept}</div>
                    </div>
                  )}
                  
                  {characterData.role && (
                    <div>
                      <div className="text-xs text-muted-foreground mb-1">Role</div>
                      <Badge variant="secondary" className="text-xs">
                        {characterData.role}
                      </Badge>
                    </div>
                  )}
                  
                  {characterData.personalityTraits && Array.isArray(characterData.personalityTraits) && characterData.personalityTraits.length > 0 && (
                    <div>
                      <div className="text-xs text-muted-foreground mb-1">Traits</div>
                      <div className="flex flex-wrap gap-1">
                        {(characterData.personalityTraits as string[]).map((trait, i) => (
                          <Badge key={i} variant="outline" className="text-xs">
                            {trait}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  <div className="pt-3 mt-3 border-t">
                    <div className="text-xs text-muted-foreground">
                      {completedSections.size} of {CREATION_SECTIONS.length} sections complete
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </CharacterCreationLayout>
  );
}