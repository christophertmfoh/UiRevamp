import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  ArrowLeft, ArrowRight, Save, Check, ChevronLeft,
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
    title: 'Basic Identity',
    description: 'Core character information',
    icon: User,
    fields: [
      { 
        key: 'name', 
        label: 'Character Name', 
        type: 'text', 
        placeholder: 'Enter character name',
        required: true,
        description: 'The full name or designation of your character'
      },
      { 
        key: 'age', 
        label: 'Age', 
        type: 'text', 
        placeholder: 'e.g., 25, Ancient, Unknown',
        description: 'Character age or apparent age'
      },
      { 
        key: 'species', 
        label: 'Species/Race', 
        type: 'text', 
        placeholder: 'e.g., Human, Elf, Android',
        description: 'The species, race, or type of being'
      },
      { 
        key: 'gender', 
        label: 'Gender', 
        type: 'text', 
        placeholder: 'e.g., Male, Female, Non-binary',
        description: 'Gender identity of the character'
      },
      { 
        key: 'occupation', 
        label: 'Occupation/Role', 
        type: 'text', 
        placeholder: 'e.g., Knight, Scholar, Thief',
        description: 'Primary occupation or role in the story'
      }
    ]
  },
  {
    id: 'appearance',
    title: 'Physical Appearance',
    description: 'Visual characteristics',
    icon: Eye,
    fields: [
      { 
        key: 'height', 
        label: 'Height', 
        type: 'text', 
        placeholder: 'e.g., 6\'2", Tall, Average' 
      },
      { 
        key: 'build', 
        label: 'Build/Body Type', 
        type: 'text', 
        placeholder: 'e.g., Athletic, Slender, Stocky' 
      },
      { 
        key: 'hairColor', 
        label: 'Hair Color', 
        type: 'text', 
        placeholder: 'e.g., Black, Silver, None' 
      },
      { 
        key: 'eyeColor', 
        label: 'Eye Color', 
        type: 'text', 
        placeholder: 'e.g., Blue, Heterochromatic, Glowing' 
      },
      { 
        key: 'appearance', 
        label: 'Detailed Appearance', 
        type: 'textarea', 
        placeholder: 'Describe distinguishing features, style, etc.',
        description: 'Notable physical features, scars, tattoos, clothing style'
      }
    ]
  },
  {
    id: 'personality',
    title: 'Personality',
    description: 'Character traits and behavior',
    icon: Brain,
    fields: [
      { 
        key: 'personalityTraits', 
        label: 'Personality Traits', 
        type: 'array', 
        placeholder: 'e.g., Brave, Cunning, Compassionate',
        description: 'Core personality traits (comma-separated)'
      },
      { 
        key: 'values', 
        label: 'Core Values', 
        type: 'text', 
        placeholder: 'e.g., Honor, Freedom, Knowledge',
        description: 'What the character values most'
      },
      { 
        key: 'fears', 
        label: 'Fears', 
        type: 'text', 
        placeholder: 'e.g., Failure, Abandonment, Heights',
        description: 'Deep fears or phobias'
      },
      { 
        key: 'quirks', 
        label: 'Quirks & Habits', 
        type: 'textarea', 
        placeholder: 'Unique behaviors, speech patterns, habits',
        description: 'Distinctive mannerisms or habits'
      }
    ]
  },
  {
    id: 'abilities',
    title: 'Abilities & Skills',
    description: 'Character capabilities',
    icon: Zap,
    fields: [
      { 
        key: 'abilities', 
        label: 'Primary Abilities', 
        type: 'textarea', 
        placeholder: 'List main abilities, powers, or skills',
        description: 'Natural or learned abilities'
      },
      { 
        key: 'strengths', 
        label: 'Strengths', 
        type: 'text', 
        placeholder: 'e.g., Strategic thinking, Physical prowess',
        description: 'Areas where the character excels'
      },
      { 
        key: 'weaknesses', 
        label: 'Weaknesses', 
        type: 'text', 
        placeholder: 'e.g., Impulsive, Poor social skills',
        description: 'Character limitations or vulnerabilities'
      },
      { 
        key: 'equipment', 
        label: 'Equipment/Items', 
        type: 'textarea', 
        placeholder: 'Notable possessions, weapons, tools',
        description: 'Important items the character carries'
      }
    ]
  },
  {
    id: 'background',
    title: 'Background',
    description: 'History and origins',
    icon: BookOpen,
    fields: [
      { 
        key: 'backstory', 
        label: 'Backstory', 
        type: 'textarea', 
        placeholder: 'Character history and important events',
        description: 'Key events that shaped the character',
        required: true
      },
      { 
        key: 'homeLocation', 
        label: 'Origin/Home', 
        type: 'text', 
        placeholder: 'Where the character is from',
        description: 'Birthplace or current home'
      },
      { 
        key: 'family', 
        label: 'Family', 
        type: 'textarea', 
        placeholder: 'Family members and relationships',
        description: 'Important family connections'
      }
    ]
  },
  {
    id: 'relationships',
    title: 'Relationships',
    description: 'Connections to others',
    icon: Users,
    fields: [
      { 
        key: 'relationships', 
        label: 'Key Relationships', 
        type: 'textarea', 
        placeholder: 'Important connections to other characters',
        description: 'Friends, enemies, mentors, rivals'
      },
      { 
        key: 'alliances', 
        label: 'Alliances', 
        type: 'text', 
        placeholder: 'Groups or factions aligned with',
        description: 'Organizations or groups the character belongs to'
      }
    ]
  },
  {
    id: 'story',
    title: 'Story Role',
    description: 'Purpose in the narrative',
    icon: PenTool,
    fields: [
      { 
        key: 'goals', 
        label: 'Goals', 
        type: 'text', 
        placeholder: 'What the character wants to achieve',
        description: 'Primary objectives or desires'
      },
      { 
        key: 'motivations', 
        label: 'Motivations', 
        type: 'text', 
        placeholder: 'Why they pursue their goals',
        description: 'Driving forces behind their actions'
      },
      { 
        key: 'arc', 
        label: 'Character Arc', 
        type: 'textarea', 
        placeholder: 'How the character will grow or change',
        description: 'Planned development throughout the story'
      },
      { 
        key: 'role', 
        label: 'Story Role', 
        type: 'select', 
        options: ['Protagonist', 'Antagonist', 'Supporting', 'Minor'],
        description: 'Role in the overall narrative'
      }
    ]
  }
];

export function CharacterGuidedCreation({ 
  isOpen, 
  onClose, 
  projectId,
  onBack 
}: CharacterGuidedCreationProps) {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [characterData, setCharacterData] = useState<Partial<Character>>({
    projectId,
    id: nanoid(),
    name: '',
    role: 'Supporting'
  });
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());
  
  const queryClient = useQueryClient();
  const currentStep = CREATION_STEPS[currentStepIndex];
  const progress = ((currentStepIndex + 1) / CREATION_STEPS.length) * 100;

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

  const updateField = (key: keyof Character, value: any) => {
    setCharacterData(prev => ({ ...prev, [key]: value }));
  };

  const handleNext = () => {
    setCompletedSteps(prev => new Set([...prev, currentStepIndex]));
    if (currentStepIndex < CREATION_STEPS.length - 1) {
      setCurrentStepIndex(currentStepIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(currentStepIndex - 1);
    }
  };

  const handleSave = () => {
    saveMutation.mutate(characterData);
  };

  const isStepValid = () => {
    const requiredFields = currentStep.fields.filter(f => f.required);
    return requiredFields.every(field => {
      const value = characterData[field.key];
      return value && value.toString().trim().length > 0;
    });
  };

  const renderField = (field: typeof currentStep.fields[0]) => {
    const value = characterData[field.key] || '';
    
    switch (field.type) {
      case 'text':
        return (
          <Input
            value={value as string}
            onChange={(e) => updateField(field.key, e.target.value)}
            placeholder={field.placeholder}
            className="bg-background/50"
          />
        );
      
      case 'textarea':
        return (
          <Textarea
            value={value as string}
            onChange={(e) => updateField(field.key, e.target.value)}
            placeholder={field.placeholder}
            className="bg-background/50 min-h-[100px]"
          />
        );
      
      case 'select':
        return (
          <Select value={value as string} onValueChange={(v) => updateField(field.key, v)}>
            <SelectTrigger className="bg-background/50">
              <SelectValue placeholder="Select an option" />
            </SelectTrigger>
            <SelectContent>
              {field.options?.map((option) => (
                <SelectItem key={option} value={option}>{option}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        );
      
      case 'array':
        const arrayValue = Array.isArray(value) ? value.join(', ') : value;
        return (
          <Input
            value={arrayValue as string}
            onChange={(e) => updateField(field.key, e.target.value.split(',').map(s => s.trim()))}
            placeholder={field.placeholder}
            className="bg-background/50"
          />
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Progress Bar */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">
            Step {currentStepIndex + 1} of {CREATION_STEPS.length}
          </span>
          <span className="text-muted-foreground">
            {Math.round(progress)}% Complete
          </span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      {/* Step Indicators */}
      <div className="flex items-center justify-between gap-2">
        {CREATION_STEPS.map((step, index) => {
          const Icon = step.icon;
          const isCompleted = completedSteps.has(index);
          const isCurrent = index === currentStepIndex;
          const isAccessible = index <= currentStepIndex || completedSteps.has(index);
          
          return (
            <button
              key={step.id}
              onClick={() => isAccessible && setCurrentStepIndex(index)}
              disabled={!isAccessible}
              className={`
                flex-1 p-3 rounded-lg border transition-all
                ${isCurrent 
                  ? 'border-accent bg-accent/10' 
                  : isCompleted
                    ? 'border-emerald-500/30 bg-emerald-500/10'
                    : 'border-border/50 bg-background/50'
                }
                ${isAccessible ? 'cursor-pointer hover:bg-accent/5' : 'cursor-not-allowed opacity-50'}
              `}
            >
              <div className="flex items-center gap-2">
                <div className={`
                  p-1.5 rounded-md
                  ${isCurrent 
                    ? 'bg-accent/20 text-accent' 
                    : isCompleted
                      ? 'bg-emerald-500/20 text-emerald-500'
                      : 'bg-muted/50 text-muted-foreground'
                  }
                `}>
                  {isCompleted ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    <Icon className="h-4 w-4" />
                  )}
                </div>
                <span className={`
                  text-sm font-medium hidden sm:block
                  ${isCurrent ? 'text-foreground' : 'text-muted-foreground'}
                `}>
                  {step.title}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Current Step Content */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-accent/10 rounded-lg">
              <currentStep.icon className="h-5 w-5 text-accent" />
            </div>
            <div>
              <CardTitle>{currentStep.title}</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                {currentStep.description}
              </p>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {currentStep.fields.map((field) => (
            <div key={field.key} className="space-y-2">
              <Label className="flex items-center gap-2">
                {field.label}
                {field.required && <span className="text-destructive text-xs">*</span>}
              </Label>
              {field.description && (
                <p className="text-xs text-muted-foreground">
                  {field.description}
                </p>
              )}
              {renderField(field)}
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {onBack && (
            <Button
              variant="ghost"
              onClick={onBack}
              className="text-muted-foreground"
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Back to selection
            </Button>
          )}
          {currentStepIndex > 0 && (
            <Button
              variant="outline"
              onClick={handlePrevious}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
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
          
          {currentStepIndex < CREATION_STEPS.length - 1 ? (
            <Button
              onClick={handleNext}
              disabled={!isStepValid()}
            >
              Next
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          ) : (
            <Button
              onClick={handleSave}
              disabled={!characterData.name || saveMutation.isPending}
              className="bg-emerald-600 hover:bg-emerald-700"
            >
              <Check className="h-4 w-4 mr-2" />
              Create Character
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}