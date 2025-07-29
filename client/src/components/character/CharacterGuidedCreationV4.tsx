import React, { useState, useEffect } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import { 
  ArrowLeft, ArrowRight, Save, Check, X,
  User, Palette, Brain, Zap, BookOpen, Users, Target,
  Sparkles, Info
} from 'lucide-react';
import { apiRequest } from '@/lib/queryClient';
import type { Character } from '@/lib/types';
import { nanoid } from 'nanoid';

interface CharacterGuidedCreationV4Props {
  projectId: string;
  onBack: () => void;
  onComplete: (character: Character) => void;
  onClose: () => void;
}

interface Section {
  id: string;
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  fields: Field[];
}

interface Field {
  key: string;
  label: string;
  type: 'text' | 'textarea' | 'select';
  placeholder?: string;
  helpText?: string;
  required?: boolean;
  options?: { value: string; label: string }[];
}

const SECTIONS: Section[] = [
  {
    id: 'identity',
    title: 'Identity',
    icon: User,
    fields: [
      {
        key: 'name',
        label: 'Character Name',
        type: 'text',
        placeholder: 'Enter character name',
        required: true
      },
      {
        key: 'role',
        label: 'Story Role',
        type: 'select',
        options: [
          { value: 'protagonist', label: 'Protagonist' },
          { value: 'antagonist', label: 'Antagonist' },
          { value: 'supporting', label: 'Supporting' },
          { value: 'minor', label: 'Minor' }
        ]
      },
      {
        key: 'age',
        label: 'Age',
        type: 'text',
        placeholder: 'e.g., 25, young adult, ancient'
      },
      {
        key: 'occupation',
        label: 'Occupation',
        type: 'text',
        placeholder: 'What do they do?'
      }
    ]
  },
  {
    id: 'appearance',
    title: 'Appearance',
    icon: Palette,
    fields: [
      {
        key: 'appearance',
        label: 'Physical Description',
        type: 'textarea',
        placeholder: 'Describe their appearance...',
        helpText: 'Include distinctive features, style, and overall impression'
      }
    ]
  },
  {
    id: 'personality',
    title: 'Personality',
    icon: Brain,
    fields: [
      {
        key: 'personality',
        label: 'Personality Traits',
        type: 'textarea',
        placeholder: 'What are they like?',
        helpText: 'Core traits, temperament, and behavior patterns'
      },
      {
        key: 'values',
        label: 'Values & Beliefs',
        type: 'text',
        placeholder: 'What do they believe in?'
      },
      {
        key: 'fears',
        label: 'Fears',
        type: 'text',
        placeholder: 'What are they afraid of?'
      }
    ]
  },
  {
    id: 'abilities',
    title: 'Abilities',
    icon: Zap,
    fields: [
      {
        key: 'strengths',
        label: 'Strengths',
        type: 'textarea',
        placeholder: 'What are they good at?'
      },
      {
        key: 'weaknesses',
        label: 'Weaknesses',
        type: 'textarea',
        placeholder: 'Where do they struggle?'
      }
    ]
  },
  {
    id: 'backstory',
    title: 'Backstory',
    icon: BookOpen,
    fields: [
      {
        key: 'backstory',
        label: 'Background',
        type: 'textarea',
        placeholder: 'Their history and origin...',
        required: true
      }
    ]
  },
  {
    id: 'relationships',
    title: 'Relationships',
    icon: Users,
    fields: [
      {
        key: 'relationships',
        label: 'Key Relationships',
        type: 'textarea',
        placeholder: 'Important people in their life...'
      }
    ]
  },
  {
    id: 'goals',
    title: 'Goals & Arc',
    icon: Target,
    fields: [
      {
        key: 'goals',
        label: 'Goals',
        type: 'text',
        placeholder: 'What do they want?'
      },
      {
        key: 'arc',
        label: 'Character Arc',
        type: 'textarea',
        placeholder: 'How will they change?'
      }
    ]
  }
];

export function CharacterGuidedCreationV4({
  projectId,
  onBack,
  onComplete,
  onClose
}: CharacterGuidedCreationV4Props) {
  const [currentSection, setCurrentSection] = useState(0);
  const [characterData, setCharacterData] = useState<Record<string, any>>({
    projectId,
    id: nanoid(),
    name: '',
    role: 'supporting'
  });
  const [visitedSections, setVisitedSections] = useState<Set<number>>(new Set([0]));
  
  const queryClient = useQueryClient();
  const section = SECTIONS[currentSection];
  const progress = ((currentSection + 1) / SECTIONS.length) * 100;

  const saveMutation = useMutation({
    mutationFn: async (data: Partial<Character>) => {
      const response = await apiRequest('POST', `/api/projects/${projectId}/characters`, data);
      return response.json();
    },
    onSuccess: (character) => {
      queryClient.invalidateQueries({ queryKey: [`/api/projects/${projectId}/characters`] });
      onComplete(character);
    }
  });

  const updateField = (key: string, value: any) => {
    setCharacterData(prev => ({ ...prev, [key]: value }));
  };

  const canProceed = () => {
    const requiredFields = section.fields.filter(f => f.required);
    return requiredFields.every(field => {
      const value = characterData[field.key];
      return value && value.toString().trim().length > 0;
    });
  };

  const goToSection = (index: number) => {
    if (index <= Math.max(...visitedSections)) {
      setCurrentSection(index);
    }
  };

  const handleNext = () => {
    if (currentSection < SECTIONS.length - 1) {
      const nextSection = currentSection + 1;
      setCurrentSection(nextSection);
      setVisitedSections(prev => new Set([...prev, nextSection]));
    }
  };

  const handlePrevious = () => {
    if (currentSection > 0) {
      setCurrentSection(currentSection - 1);
    }
  };

  const handleSave = () => {
    saveMutation.mutate(characterData as Partial<Character>);
  };

  // Auto-save draft to localStorage
  useEffect(() => {
    const draft = {
      characterData,
      currentSection,
      visitedSections: Array.from(visitedSections)
    };
    localStorage.setItem(`character-draft-${projectId}`, JSON.stringify(draft));
  }, [characterData, currentSection, visitedSections, projectId]);

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={onBack}
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
          <div className="h-6 w-px bg-border" />
          <div>
            <h2 className="text-xl font-semibold">Build Your Character</h2>
            <p className="text-sm text-muted-foreground">
              Step {currentSection + 1} of {SECTIONS.length}: {section.title}
            </p>
          </div>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          className="rounded-full hover:bg-muted"
        >
          <X className="h-5 w-5" />
        </Button>
      </div>

      {/* Progress */}
      <div className="px-6 py-3 border-b bg-muted/30">
        <Progress value={progress} className="h-1.5" />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex">
        {/* Sidebar */}
        <div className="w-64 border-r bg-muted/10 p-4">
          <div className="space-y-1">
            {SECTIONS.map((s, index) => {
              const Icon = s.icon;
              const isActive = index === currentSection;
              const isVisited = visitedSections.has(index);
              const isAccessible = index <= Math.max(...visitedSections);
              
              return (
                <button
                  key={s.id}
                  onClick={() => goToSection(index)}
                  disabled={!isAccessible}
                  className={cn(
                    "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all",
                    isActive && "bg-primary text-primary-foreground",
                    !isActive && isVisited && "hover:bg-muted text-foreground",
                    !isActive && !isVisited && "text-muted-foreground",
                    !isAccessible && "opacity-50 cursor-not-allowed"
                  )}
                >
                  <Icon className="h-4 w-4 flex-shrink-0" />
                  <span className="text-left">{s.title}</span>
                  {isVisited && !isActive && (
                    <Check className="h-3 w-3 ml-auto opacity-50" />
                  )}
                </button>
              );
            })}
          </div>

          <div className="mt-6 p-3 bg-muted/50 rounded-lg">
            <div className="flex items-center gap-2 text-sm font-medium mb-2">
              <Sparkles className="h-4 w-4 text-blue-500" />
              Pro Tip
            </div>
            <p className="text-xs text-muted-foreground">
              Take your time with each section. Great characters come from thoughtful details.
            </p>
          </div>
        </div>

        {/* Form */}
        <div className="flex-1 p-6">
          <div className="max-w-2xl mx-auto">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 rounded-lg bg-primary/10">
                <section.icon className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">{section.title}</h3>
                <p className="text-sm text-muted-foreground">
                  Fill in the details below
                </p>
              </div>
            </div>

            <div className="space-y-6">
              {section.fields.map((field) => (
                <div key={field.key} className="space-y-2">
                  <Label className="flex items-center gap-2">
                    {field.label}
                    {field.required && (
                      <span className="text-xs text-destructive">Required</span>
                    )}
                  </Label>
                  
                  {field.helpText && (
                    <p className="text-sm text-muted-foreground flex items-start gap-2">
                      <Info className="h-4 w-4 flex-shrink-0 mt-0.5" />
                      {field.helpText}
                    </p>
                  )}

                  {field.type === 'text' && (
                    <Input
                      value={characterData[field.key] || ''}
                      onChange={(e) => updateField(field.key, e.target.value)}
                      placeholder={field.placeholder}
                      className="max-w-md"
                    />
                  )}

                  {field.type === 'textarea' && (
                    <Textarea
                      value={characterData[field.key] || ''}
                      onChange={(e) => updateField(field.key, e.target.value)}
                      placeholder={field.placeholder}
                      rows={4}
                      className="resize-none"
                    />
                  )}

                  {field.type === 'select' && (
                    <div className="grid grid-cols-2 gap-2 max-w-md">
                      {field.options?.map((option) => (
                        <button
                          key={option.value}
                          onClick={() => updateField(field.key, option.value)}
                          className={cn(
                            "p-3 rounded-lg border text-sm transition-all",
                            characterData[field.key] === option.value
                              ? "border-primary bg-primary/10 text-primary"
                              : "border-border hover:bg-muted"
                          )}
                        >
                          {option.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between p-6 border-t bg-muted/10">
        <div className="flex items-center gap-2">
          {currentSection > 0 && (
            <Button
              variant="outline"
              onClick={handlePrevious}
              className="gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Previous
            </Button>
          )}
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={() => saveMutation.mutate(characterData as Partial<Character>)}
            disabled={saveMutation.isPending}
          >
            <Save className="h-4 w-4 mr-2" />
            Save Draft
          </Button>
          
          {currentSection < SECTIONS.length - 1 ? (
            <Button
              onClick={handleNext}
              disabled={!canProceed()}
              className="gap-2"
            >
              Continue
              <ArrowRight className="h-4 w-4" />
            </Button>
          ) : (
            <Button
              onClick={handleSave}
              disabled={!characterData.name || saveMutation.isPending}
              className="gap-2 bg-primary"
            >
              <Check className="h-4 w-4" />
              Create Character
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}