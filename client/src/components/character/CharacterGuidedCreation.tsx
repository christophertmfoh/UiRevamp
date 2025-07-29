import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  Dialog, DialogContent, DialogHeader, DialogTitle 
} from '@/components/ui/dialog';
import { 
  Card, CardContent, CardHeader, CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue 
} from '@/components/ui/select';
import { 
  ArrowLeft, ArrowRight, Save, Check,
  User, Eye, Brain, Zap, BookOpen, Users, PenTool
} from 'lucide-react';
import { apiRequest } from '@/lib/queryClient';
import type { Character } from '@/lib/types';
import { nanoid } from 'nanoid';

interface CharacterGuidedCreationProps {
  isOpen: boolean;
  onClose: () => void;
  projectId: string;
  onBack?: () => void;
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
    title: 'Identity & Basic Info',
    description: 'Essential identity markers and core characteristics',
    icon: User,
    fields: [
      { key: 'name', label: 'Full Name', type: 'text', placeholder: 'Enter character name', required: true },
      { key: 'nicknames', label: 'Nicknames', type: 'text', placeholder: 'Common nicknames or pet names' },
      { key: 'title', label: 'Title', type: 'text', placeholder: 'Dr., Lord, Captain, etc.' },
      { key: 'aliases', label: 'Aliases', type: 'text', placeholder: 'Secret identities or false names' },
      { key: 'age', label: 'Age', type: 'text', placeholder: '25 or "appears to be in their 20s"' },
      { key: 'race', label: 'Race/Species', type: 'text', placeholder: 'Human, Elf, Dragon, etc.' },
      { key: 'class', label: 'Class/Profession', type: 'text', placeholder: 'Warrior, Mage, Detective, etc.' },
      { key: 'role', label: 'Story Role', type: 'select', options: [
        'Protagonist', 'Antagonist', 'Deuteragonist', 'Supporting Character', 
        'Comic Relief', 'Mentor', 'Love Interest', 'Sidekick', 'Rival', 'Anti-Hero'
      ] }
    ]
  },
  {
    id: 'appearance',
    title: 'Physical Appearance',
    description: 'Physical characteristics and visual presentation',
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
    title: 'Personality & Psychology',
    description: 'Core traits, temperament, and psychological profile',
    icon: Brain,
    fields: [
      { key: 'personality', label: 'Personality Overview', type: 'textarea', placeholder: 'Core personality description', required: true },
      { key: 'personalityTraits', label: 'Key Traits', type: 'array', placeholder: 'Brave, cynical, optimistic (separate with commas)' },
      { key: 'temperament', label: 'Temperament', type: 'select', options: [
        'Sanguine', 'Choleric', 'Melancholic', 'Phlegmatic', 'Optimistic', 'Pessimistic', 'Realistic',
        'Idealistic', 'Cynical', 'Stoic', 'Emotional', 'Analytical', 'Intuitive', 'Impulsive',
        'Cautious', 'Adventurous', 'Reserved', 'Outgoing', 'Aggressive', 'Passive', 'Balanced'
      ] },
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
    title: 'Abilities & Skills',
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
    title: 'Background & History',
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
      { key: 'occupation', label: 'Occupation', type: 'text', placeholder: 'Current job or profession' },
      { key: 'spokenLanguages', label: 'Spoken Languages', type: 'array', placeholder: 'Languages they can speak (separate with commas)' }
    ]
  },
  {
    id: 'relationships',
    title: 'Relationships & Social',
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
    title: 'Story & Meta Elements',
    description: 'Story function, themes, and creative elements',
    icon: PenTool,
    fields: [
      { key: 'storyFunction', label: 'Story Function', type: 'textarea', placeholder: 'Their role in advancing the plot' },
      { key: 'personalTheme', label: 'Associated Themes', type: 'textarea', placeholder: 'Themes they represent or explore' },
      { key: 'symbolism', label: 'Symbolism', type: 'textarea', placeholder: 'What they symbolize in the story' },
      { key: 'inspiration', label: 'Inspiration', type: 'textarea', placeholder: 'Real people, characters, or concepts that inspired them' },
      { key: 'archetypes', label: 'Archetypes', type: 'select', options: [
        'The Hero', 'The Mentor', 'The Threshold Guardian', 'The Herald', 'The Shapeshifter', 'The Shadow',
        'The Ally', 'The Trickster', 'The Innocent', 'The Explorer', 'The Sage', 'The Outlaw', 'The Magician',
        'The Regular Guy/Girl', 'The Lover', 'The Jester', 'The Caregiver', 'The Creator', 'The Ruler'
      ] },
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
      const processedData = {
        ...data,
        personalityTraits: Array.isArray(data.personalityTraits) 
          ? data.personalityTraits 
          : typeof data.personalityTraits === 'string' 
            ? data.personalityTraits.split(',').map(s => s.trim()).filter(Boolean)
            : [],
        abilities: Array.isArray(data.abilities) 
          ? data.abilities 
          : typeof data.abilities === 'string' 
            ? data.abilities.split(',').map(s => s.trim()).filter(Boolean)
            : [],
        skills: Array.isArray(data.skills) 
          ? data.skills 
          : typeof data.skills === 'string' 
            ? data.skills.split(',').map(s => s.trim()).filter(Boolean)
            : []
      };

      const response = await apiRequest({
        url: `/api/projects/${projectId}/characters`,
        method: 'POST',
        data: processedData,
      });
      return response;
    },
    onSuccess: (newCharacter) => {
      queryClient.invalidateQueries({ queryKey: [`/api/projects/${projectId}/characters`] });
      onComplete?.(newCharacter);
      onCancel();
    },
  });

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
            className="bg-background/50 border-border/20 focus:border-accent/50 focus:ring-1 focus:ring-accent/20"
          />
        );
      
      case 'textarea':
        return (
          <Textarea
            value={value}
            onChange={(e) => updateField(field.key, e.target.value)}
            placeholder={field.placeholder}
            rows={3}
            className="bg-background/50 border-border/20 focus:border-accent/50 focus:ring-1 focus:ring-accent/20 resize-none"
          />
        );
      
      case 'select':
        return (
          <Select value={value} onValueChange={(val) => updateField(field.key, val)}>
            <SelectTrigger className="bg-background/50 border-border/20 focus:border-accent/50 focus:ring-1 focus:ring-accent/20">
              <SelectValue placeholder="Select an option" />
            </SelectTrigger>
            <SelectContent className="bg-card border-border/20">
              {field.options?.map(option => (
                <SelectItem key={option} value={option}>{option}</SelectItem>
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
            className="bg-background/50 border-border/20 focus:border-accent/50 focus:ring-1 focus:ring-accent/20"
          />
        );
      
      default:
        return null;
    }
  };

  return (
    <Dialog open={true} onOpenChange={onCancel}>
      <DialogContent className="max-w-6xl h-[90vh] p-0 gap-0">
        <DialogHeader className="border-b border-border/30 p-6 pb-4">
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="text-xl font-bold">Create Character</DialogTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Step {currentStepIndex + 1} of {CREATION_STEPS.length}: {currentStep?.title || 'Loading...'}
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-sm text-muted-foreground">
                {Math.round(progress)}% Complete
              </div>
              <Progress value={progress} className="w-32" />
            </div>
          </div>
        </DialogHeader>

        <div className="flex flex-1 overflow-hidden">
          {/* Step Navigation Sidebar */}
          <div className="w-72 border-r border-border/20 bg-background/50 p-4 overflow-y-auto">
            <div className="space-y-1">
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
                    className={`w-full text-left p-3 rounded-md transition-all duration-200 border ${
                      isCurrent 
                        ? 'bg-accent/5 border-accent/20 text-accent' 
                        : isCompleted
                        ? 'bg-card/50 border-border/20 hover:bg-card/70 text-foreground'
                        : isAccessible
                        ? 'hover:bg-card/30 border-transparent text-muted-foreground hover:text-foreground'
                        : 'opacity-40 cursor-not-allowed border-transparent text-muted-foreground'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`p-1.5 rounded-md ${
                        isCurrent 
                          ? 'bg-accent/10 text-accent' 
                          : isCompleted
                          ? 'bg-accent/10 text-accent'
                          : 'bg-muted/50 text-muted-foreground'
                      }`}>
                        {isCompleted ? <Check className="h-3.5 w-3.5" /> : <Icon className="h-3.5 w-3.5" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className={`font-medium text-sm leading-tight ${
                          isCurrent ? 'text-accent' : isCompleted ? 'text-foreground' : 'text-muted-foreground'
                        }`}>
                          {step.title}
                        </div>
                        <div className={`text-xs leading-tight mt-0.5 line-clamp-2 ${
                          isCurrent ? 'text-accent/70' : 'text-muted-foreground/80'
                        }`}>
                          {step.description}
                        </div>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 p-6 overflow-y-auto">
            <div className="max-w-2xl mx-auto">
              <Card className="border-border/20 shadow-sm bg-card/30 backdrop-blur-sm">
                <CardHeader className="pb-4 border-b border-border/10">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-accent/10 rounded-lg border border-accent/20">
                      {currentStep?.icon && <currentStep.icon className="h-5 w-5 text-accent" />}
                    </div>
                    <div>
                      <CardTitle className="text-lg text-foreground">{currentStep?.title || 'Loading...'}</CardTitle>
                      <p className="text-sm text-muted-foreground/80 mt-0.5">{currentStep?.description || ''}</p>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-5 max-h-[400px] overflow-y-auto">
                  {currentStep?.fields?.map((field) => (
                    <div key={field.key} className="space-y-2">
                      <Label className="text-sm font-medium text-foreground flex items-center gap-2">
                        {field.label}
                        {field.required && <span className="text-destructive text-xs">*</span>}
                      </Label>
                      {field.description && (
                        <p className="text-xs text-muted-foreground/70 leading-relaxed">{field.description}</p>
                      )}
                      {renderField(field)}
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Navigation */}
              <div className="flex items-center justify-between mt-6">
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
      </DialogContent>
    </Dialog>
  );
}