import React, { useState, useEffect } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { 
  ArrowLeft, 
  ArrowRight, 
  User, 
  Eye, 
  Brain, 
  Zap, 
  BookOpen, 
  Users, 
  PenTool,
  Check,
  Star,
  Sparkles,
  Save
} from 'lucide-react';
import { apiRequest } from '@/lib/queryClient';
import type { Character } from '../../lib/types';
import { nanoid } from 'nanoid';

interface CharacterGuidedCreationProps {
  projectId: string;
  character?: Character;
  onCancel: () => void;
  onComplete?: (character: Character) => void;
}

interface Step {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  fields: Array<{
    key: keyof Character;
    label: string;
    type: 'text' | 'textarea' | 'select' | 'array';
    placeholder?: string;
    options?: string[];
    required?: boolean;
    description?: string;
  }>;
}

const CREATION_STEPS: Step[] = [
  {
    id: 'identity',
    title: 'Identity',
    description: 'Basic information that defines who your character is',
    icon: User,
    fields: [
      { key: 'name', label: 'Full Name', type: 'text', placeholder: 'Enter character name', required: true },
      { key: 'nicknames', label: 'Nicknames', type: 'text', placeholder: 'Common nicknames or pet names' },
      { key: 'title', label: 'Title', type: 'text', placeholder: 'Dr., Lord, Captain, etc.' },
      { key: 'aliases', label: 'Aliases', type: 'text', placeholder: 'Secret identities or false names' },
      { key: 'age', label: 'Age', type: 'text', placeholder: '25 or "appears to be in their 20s"' },
      { key: 'race', label: 'Race/Species', type: 'text', placeholder: 'Human, Elf, Dragon, etc.' },
      { key: 'class', label: 'Class/Profession', type: 'text', placeholder: 'Warrior, Mage, Detective, etc.' },
      { key: 'role', label: 'Story Role', type: 'select', options: ['Protagonist', 'Antagonist', 'Supporting', 'Minor', 'Cameo'] }
    ]
  },
  {
    id: 'appearance',
    title: 'Appearance',
    description: 'Physical characteristics and how they present themselves',
    icon: Eye,
    fields: [
      { key: 'physicalDescription', label: 'Overall Description', type: 'textarea', placeholder: 'General physical appearance overview', description: 'A comprehensive description of their overall look' },
      { key: 'height', label: 'Height', type: 'text', placeholder: '5\'8" or 173cm' },
      { key: 'build', label: 'Build', type: 'select', options: ['Slim', 'Athletic', 'Stocky', 'Muscular', 'Heavy', 'Petite', 'Tall', 'Average'] },
      { key: 'eyeColor', label: 'Eye Color', type: 'text', placeholder: 'Blue, brown, heterochromia, etc.' },
      { key: 'hairColor', label: 'Hair Color', type: 'text', placeholder: 'Natural and current color' },
      { key: 'hairStyle', label: 'Hair Style', type: 'text', placeholder: 'Length, cut, styling' },
      { key: 'skinTone', label: 'Skin Tone', type: 'text', placeholder: 'Complexion and tone' },
      { key: 'distinguishingMarks', label: 'Distinguishing Marks', type: 'textarea', placeholder: 'Scars, tattoos, birthmarks, etc.' },
      { key: 'clothingStyle', label: 'Clothing Style', type: 'textarea', placeholder: 'How they typically dress' }
    ]
  },
  {
    id: 'personality',
    title: 'Personality',
    description: 'Core traits, temperament, and psychological profile',
    icon: Brain,
    fields: [
      { key: 'personality', label: 'Personality Overview', type: 'textarea', placeholder: 'Core personality description', required: true },
      { key: 'personalityTraits', label: 'Key Traits', type: 'array', placeholder: 'Brave, cynical, optimistic (separate with commas)' },
      { key: 'temperament', label: 'Temperament', type: 'select', options: ['Sanguine', 'Choleric', 'Melancholic', 'Phlegmatic', 'Mixed'] },
      { key: 'worldview', label: 'Worldview', type: 'textarea', placeholder: 'How they see the world and their place in it' },
      { key: 'values', label: 'Core Values', type: 'textarea', placeholder: 'What they believe is most important' },
      { key: 'goals', label: 'Goals', type: 'textarea', placeholder: 'What they want to achieve' },
      { key: 'motivations', label: 'Motivations', type: 'textarea', placeholder: 'What drives them forward', required: true },
      { key: 'fears', label: 'Fears', type: 'textarea', placeholder: 'What they are afraid of' },
      { key: 'desires', label: 'Desires', type: 'textarea', placeholder: 'What they want most' },
      { key: 'vices', label: 'Character Flaws', type: 'textarea', placeholder: 'Weaknesses and imperfections' }
    ]
  },
  {
    id: 'abilities',
    title: 'Abilities',
    description: 'Skills, talents, and special capabilities',
    icon: Zap,
    fields: [
      { key: 'abilities', label: 'Core Abilities', type: 'array', placeholder: 'Swordsmanship, magic, investigation (separate with commas)' },
      { key: 'skills', label: 'Skills', type: 'array', placeholder: 'Learned skills and competencies' },
      { key: 'talents', label: 'Natural Talents', type: 'array', placeholder: 'Innate gifts and aptitudes' },
      { key: 'specialAbilities', label: 'Special Abilities', type: 'textarea', placeholder: 'Unique powers or supernatural abilities' },
      { key: 'powers', label: 'Powers', type: 'textarea', placeholder: 'Magical, psychic, or superhuman powers' },
      { key: 'strengths', label: 'Strengths', type: 'textarea', placeholder: 'What they excel at' },
      { key: 'weaknesses', label: 'Weaknesses', type: 'textarea', placeholder: 'What they struggle with' },
      { key: 'training', label: 'Training', type: 'textarea', placeholder: 'Formal education and training received' }
    ]
  },
  {
    id: 'background',
    title: 'Background',
    description: 'History, upbringing, and formative experiences',
    icon: BookOpen,
    fields: [
      { key: 'background', label: 'Background Overview', type: 'textarea', placeholder: 'General background and history', required: true },
      { key: 'backstory', label: 'Detailed Backstory', type: 'textarea', placeholder: 'Comprehensive life story' },
      { key: 'childhood', label: 'Childhood', type: 'textarea', placeholder: 'Early years and upbringing' },
      { key: 'familyHistory', label: 'Family History', type: 'textarea', placeholder: 'Family background and lineage' },
      { key: 'education', label: 'Education', type: 'textarea', placeholder: 'Formal and informal learning' },
      { key: 'formativeEvents', label: 'Formative Events', type: 'textarea', placeholder: 'Key life-changing moments' },
      { key: 'socialClass', label: 'Social Class', type: 'select', options: ['Upper Class', 'Upper Middle', 'Middle Class', 'Working Class', 'Lower Class', 'Outcast', 'Noble', 'Commoner'] },
      { key: 'occupation', label: 'Occupation', type: 'text', placeholder: 'Current job or profession' }
    ]
  },
  {
    id: 'relationships',
    title: 'Relationships',
    description: 'Connections with other characters and social dynamics',
    icon: Users,
    fields: [
      { key: 'family', label: 'Family', type: 'textarea', placeholder: 'Parents, siblings, spouse, children' },
      { key: 'friends', label: 'Friends', type: 'textarea', placeholder: 'Close friends and companions' },
      { key: 'allies', label: 'Allies', type: 'textarea', placeholder: 'Trusted allies and supporters' },
      { key: 'enemies', label: 'Enemies', type: 'textarea', placeholder: 'Opponents and adversaries' },
      { key: 'rivals', label: 'Rivals', type: 'textarea', placeholder: 'Competitive relationships' },
      { key: 'mentors', label: 'Mentors', type: 'textarea', placeholder: 'Teachers and guides' },
      { key: 'relationships', label: 'Other Relationships', type: 'textarea', placeholder: 'Additional important connections' },
      { key: 'socialCircle', label: 'Social Circle', type: 'textarea', placeholder: 'General social environment' }
    ]
  },
  {
    id: 'meta',
    title: 'Meta',
    description: 'Story function, themes, and creative elements',
    icon: PenTool,
    fields: [
      { key: 'storyFunction', label: 'Story Function', type: 'textarea', placeholder: 'Their role in advancing the plot' },
      { key: 'theme', label: 'Associated Themes', type: 'textarea', placeholder: 'Themes they represent or explore' },
      { key: 'symbolism', label: 'Symbolism', type: 'textarea', placeholder: 'What they symbolize in the story' },
      { key: 'inspiration', label: 'Inspiration', type: 'textarea', placeholder: 'Real people, characters, or concepts that inspired them' },
      { key: 'archetypes', label: 'Archetypes', type: 'array', placeholder: 'Hero, mentor, trickster (separate with commas)' },
      { key: 'notes', label: 'Writer\'s Notes', type: 'textarea', placeholder: 'Development notes and ideas' }
    ]
  }
];

export function CharacterGuidedCreation({ 
  projectId, 
  character, 
  onCancel,
  onComplete 
}: CharacterGuidedCreationProps) {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [formData, setFormData] = useState<Partial<Character>>(() => {
    if (character) return character;
    return {
      id: nanoid(),
      projectId,
      name: '',
      description: '',
      imageUrl: '',
      personalityTraits: [],
      abilities: [],
      skills: [],
      talents: [],
      expertise: [],
      languages: [],
      archetypes: [],
      tropes: [],
      tags: []
    };
  });
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());
  
  const queryClient = useQueryClient();
  const currentStep = CREATION_STEPS[currentStepIndex];
  const progress = ((currentStepIndex + 1) / CREATION_STEPS.length) * 100;

  const saveMutation = useMutation({
    mutationFn: async (data: Partial<Character>) => {
      const processedData = processDataForSave(data);
      if (character?.id) {
        const response = await apiRequest('PUT', `/api/characters/${character.id}`, processedData);
        return await response.json();
      } else {
        const response = await apiRequest('POST', `/api/projects/${projectId}/characters`, processedData);
        return await response.json();
      }
    },
    onSuccess: (savedCharacter: Character) => {
      queryClient.invalidateQueries({ queryKey: ['/api/projects', projectId, 'characters'] });
      if (onComplete) {
        onComplete(savedCharacter);
      }
    },
    onError: (error) => {
      console.error('Failed to save character:', error);
    }
  });

  const processDataForSave = (data: Partial<Character>) => {
    const processedData = { ...data };
    const arrayFields = [
      'personalityTraits', 'abilities', 'skills', 'talents', 'expertise', 
      'languages', 'archetypes', 'tropes', 'tags'
    ];
    
    arrayFields.forEach(field => {
      const value = (data as any)[field];
      if (typeof value === 'string') {
        (processedData as any)[field] = value.trim() ? value.split(',').map((s: string) => s.trim()) : [];
      } else if (Array.isArray(value)) {
        (processedData as any)[field] = value;
      } else {
        (processedData as any)[field] = [];
      }
    });
    
    return processedData;
  };

  const updateField = (key: keyof Character, value: any) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  const isStepComplete = (stepIndex: number) => {
    const step = CREATION_STEPS[stepIndex];
    const requiredFields = step.fields.filter(field => field.required);
    return requiredFields.every(field => {
      const value = (formData as any)[field.key];
      return value && value.toString().trim() !== '';
    });
  };

  const canProceed = () => {
    return isStepComplete(currentStepIndex);
  };

  const handleNext = () => {
    if (canProceed()) {
      setCompletedSteps(prev => new Set(Array.from(prev).concat(currentStepIndex)));
      if (currentStepIndex < CREATION_STEPS.length - 1) {
        setCurrentStepIndex(currentStepIndex + 1);
      }
    }
  };

  const handlePrevious = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(currentStepIndex - 1);
    }
  };

  const handleFinish = () => {
    if (canProceed()) {
      setCompletedSteps(prev => new Set(Array.from(prev).concat(currentStepIndex)));
      saveMutation.mutate(formData);
    }
  };

  const jumpToStep = (stepIndex: number) => {
    setCurrentStepIndex(stepIndex);
  };

  const renderField = (field: Step['fields'][0]) => {
    const value = (formData as any)[field.key] || '';

    switch (field.type) {
      case 'text':
        return (
          <Input
            value={value}
            onChange={(e) => updateField(field.key, e.target.value)}
            placeholder={field.placeholder}
            className="bg-card border-border/30 focus:border-accent/70 text-foreground placeholder:text-muted-foreground"
          />
        );
      
      case 'textarea':
        return (
          <Textarea
            value={value}
            onChange={(e) => updateField(field.key, e.target.value)}
            placeholder={field.placeholder}
            rows={3}
            className="bg-card border-border/30 focus:border-accent/70 text-foreground placeholder:text-muted-foreground resize-none"
          />
        );
      
      case 'select':
        return (
          <Select value={value} onValueChange={(val) => updateField(field.key, val)}>
            <SelectTrigger className="bg-card border-border/30 focus:border-accent/70 text-foreground">
              <SelectValue placeholder="Select an option" className="text-muted-foreground" />
            </SelectTrigger>
            <SelectContent className="bg-card border-border/30">
              {field.options?.map(option => (
                <SelectItem key={option} value={option} className="text-foreground hover:bg-accent/10">{option}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        );
      
      case 'array':
        const arrayValue = Array.isArray(value) ? value.join(', ') : value;
        return (
          <Input
            value={arrayValue}
            onChange={(e) => updateField(field.key, e.target.value)}
            placeholder={field.placeholder}
            className="bg-card border-border/30 focus:border-accent/70 text-foreground placeholder:text-muted-foreground"
          />
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/98 to-accent/5">
      {/* Header */}
      <div className="border-b border-border/30 bg-background/95 backdrop-blur-xl sticky top-0 z-20">
        <div className="flex items-center justify-between p-6">
          <div className="flex items-center gap-4">
            <Button onClick={onCancel} variant="ghost" size="sm" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Cancel
            </Button>
            <div>
              <h1 className="text-2xl font-bold">Create Character</h1>
              <p className="text-sm text-muted-foreground">
                Step {currentStepIndex + 1} of {CREATION_STEPS.length}: {currentStep.title}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="text-sm text-muted-foreground">
              {Math.round(progress)}% Complete
            </div>
            <Progress value={progress} className="w-32" />
          </div>
        </div>
      </div>

      <div className="flex min-h-[calc(100vh-88px)]">
        {/* Step Navigation Sidebar */}
        <div className="w-80 border-r border-border/30 bg-card/30 backdrop-blur-sm p-6">
          <div className="space-y-2">
            {CREATION_STEPS.map((step, index) => {
              const Icon = step.icon;
              const isCompleted = completedSteps.has(index);
              const isCurrent = index === currentStepIndex;
              const isAccessible = index <= currentStepIndex || completedSteps.has(index);

              return (
                <button
                  key={step.id}
                  onClick={() => isAccessible && jumpToStep(index)}
                  disabled={!isAccessible}
                  className={`w-full text-left p-4 rounded-lg transition-all duration-200 ${
                    isCurrent 
                      ? 'bg-accent/15 border-2 border-accent/40 shadow-sm text-foreground' 
                      : isCompleted
                      ? 'bg-accent/8 border border-accent/25 hover:bg-accent/12 text-foreground'
                      : isAccessible
                      ? 'hover:bg-card/60 border border-transparent text-foreground hover:text-accent'
                      : 'opacity-50 cursor-not-allowed border border-transparent text-muted-foreground'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${
                      isCurrent 
                        ? 'bg-accent text-accent-foreground' 
                        : isCompleted
                        ? 'bg-accent/20 text-accent'
                        : 'bg-muted'
                    }`}>
                      {isCompleted ? <Check className="h-4 w-4" /> : <Icon className="h-4 w-4" />}
                    </div>
                    <div className="flex-1">
                      <div className={`font-semibold ${
                        isCurrent ? 'text-accent' : isCompleted ? 'text-foreground' : ''
                      }`}>
                        {step.title}
                      </div>
                      <div className={`text-xs line-clamp-2 ${
                        isCurrent ? 'text-accent/70' : 'text-muted-foreground'
                      }`}>
                        {step.description}
                      </div>
                    </div>
                    {isCompleted && (
                      <Star className="h-4 w-4 text-accent fill-accent/20" />
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-8">
          <div className="max-w-2xl mx-auto">
            <Card className="border-border/30 shadow-lg bg-card/50 backdrop-blur-sm">
              <CardHeader className="pb-6 bg-gradient-to-r from-accent/5 to-accent/10 rounded-t-lg">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-accent/20 rounded-xl border border-accent/30">
                    <currentStep.icon className="h-6 w-6 text-accent" />
                  </div>
                  <div>
                    <CardTitle className="text-2xl text-foreground">{currentStep.title}</CardTitle>
                    <p className="text-muted-foreground mt-1">{currentStep.description}</p>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-6">
                {currentStep.fields.map((field) => (
                  <div key={field.key} className="space-y-2">
                    <Label className="text-sm font-medium flex items-center gap-2">
                      {field.label}
                      {field.required && <span className="text-destructive">*</span>}
                    </Label>
                    {field.description && (
                      <p className="text-xs text-muted-foreground">{field.description}</p>
                    )}
                    {renderField(field)}
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Navigation */}
            <div className="flex items-center justify-between mt-8">
              <Button
                onClick={handlePrevious}
                disabled={currentStepIndex === 0}
                variant="outline"
                className="gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Previous
              </Button>

              <div className="flex items-center gap-2">
                {!canProceed() && (
                  <Badge variant="outline" className="text-xs">
                    Complete required fields to continue
                  </Badge>
                )}
                
                {currentStepIndex === CREATION_STEPS.length - 1 ? (
                  <Button
                    onClick={handleFinish}
                    disabled={!canProceed() || saveMutation.isPending}
                    className="gap-2 bg-gradient-to-r from-accent to-accent/90"
                  >
                    {saveMutation.isPending ? (
                      <>
                        <div className="w-4 h-4 border-2 border-accent-foreground/30 border-t-accent-foreground rounded-full animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4" />
                        Create Character
                      </>
                    )}
                  </Button>
                ) : (
                  <Button
                    onClick={handleNext}
                    disabled={!canProceed()}
                    className="gap-2"
                  >
                    Next
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}