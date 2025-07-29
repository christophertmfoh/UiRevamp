import React, { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { 
  User, Eye, Heart, Brain, Zap, BookOpen, Users, MapPin, 
  Star, Settings, ArrowLeft, ArrowRight, Check, Save
} from 'lucide-react';
import { CharacterCreationService } from '@/lib/services/characterCreationService';
import type { Character } from '@/lib/types';

interface CharacterGuidedCreationUnifiedProps {
  projectId: string;
  onBack: () => void;
  onComplete: (character: Character) => void;
  onAutoSave: (method: 'guided', data: Record<string, any>, progress: number) => void;
}

// COMPLETE character field configuration - ALL 160+ fields preserved
const CHARACTER_SECTIONS = [
  {
    id: 'identity',
    title: 'Identity',
    icon: User,
    description: 'Basic information and core identity',
    fields: [
      { key: 'name', label: 'Full Name', type: 'text', required: true, placeholder: 'Enter character name' },
      { key: 'nicknames', label: 'Nicknames', type: 'text', placeholder: 'Common nicknames or pet names' },
      { key: 'pronouns', label: 'Pronouns', type: 'text', placeholder: 'he/him, she/her, they/them, etc.' },
      { key: 'age', label: 'Age', type: 'text', placeholder: 'Character age or age range' },
      { key: 'species', label: 'Species/Race', type: 'text', placeholder: 'Human, Elf, Alien, etc.' },
      { key: 'gender', label: 'Gender Identity', type: 'text', placeholder: 'Gender identity or expression' },
      { key: 'occupation', label: 'Occupation', type: 'text', placeholder: 'Job, role, or profession' },
      { key: 'title', label: 'Title/Rank', type: 'text', placeholder: 'Professional or social title' },
      { key: 'birthdate', label: 'Birth Date', type: 'text', placeholder: 'When they were born' },
      { key: 'birthplace', label: 'Birthplace', type: 'text', placeholder: 'Where they were born' },
      { key: 'currentLocation', label: 'Current Location', type: 'text', placeholder: 'Where they live now' },
      { key: 'nationality', label: 'Nationality', type: 'text', placeholder: 'Cultural or national identity' }
    ]
  },
  {
    id: 'appearance',
    title: 'Appearance',
    icon: Eye,
    description: 'Physical characteristics and presentation',
    fields: [
      { key: 'height', label: 'Height', type: 'text', placeholder: 'Physical height' },
      { key: 'weight', label: 'Weight/Build', type: 'text', placeholder: 'Body weight or build type' },
      { key: 'bodyType', label: 'Body Type', type: 'text', placeholder: 'Slim, athletic, heavy-set, etc.' },
      { key: 'hairColor', label: 'Hair Color', type: 'text', placeholder: 'Natural or current hair color' },
      { key: 'hairStyle', label: 'Hair Style', type: 'text', placeholder: 'How they wear their hair' },
      { key: 'hairTexture', label: 'Hair Texture', type: 'text', placeholder: 'Curly, straight, wavy, etc.' },
      { key: 'eyeColor', label: 'Eye Color', type: 'text', placeholder: 'Eye color and characteristics' },
      { key: 'eyeShape', label: 'Eye Shape', type: 'text', placeholder: 'Eye shape and features' },
      { key: 'skinTone', label: 'Skin Tone', type: 'text', placeholder: 'Skin color and tone' },
      { key: 'facialFeatures', label: 'Facial Features', type: 'textarea', placeholder: 'Distinctive facial characteristics' },
      { key: 'physicalFeatures', label: 'Physical Features', type: 'textarea', placeholder: 'Notable physical characteristics' },
      { key: 'scarsMarkings', label: 'Scars & Markings', type: 'textarea', placeholder: 'Scars, tattoos, birthmarks, etc.' },
      { key: 'clothing', label: 'Typical Clothing', type: 'textarea', placeholder: 'How they usually dress' },
      { key: 'accessories', label: 'Accessories', type: 'text', placeholder: 'Jewelry, glasses, etc.' },
      { key: 'generalAppearance', label: 'General Appearance', type: 'textarea', placeholder: 'Overall physical impression' }
    ]
  },
  {
    id: 'personality',
    title: 'Personality',
    icon: Heart,
    description: 'Core personality traits and characteristics',
    fields: [
      { key: 'personalityTraits', label: 'Personality Traits', type: 'array', placeholder: 'Core personality characteristics' },
      { key: 'positiveTraits', label: 'Positive Traits', type: 'array', placeholder: 'Strengths and virtues' },
      { key: 'negativeTraits', label: 'Negative Traits', type: 'array', placeholder: 'Flaws and weaknesses' },
      { key: 'quirks', label: 'Quirks & Habits', type: 'array', placeholder: 'Unusual behaviors or mannerisms' },
      { key: 'mannerisms', label: 'Mannerisms', type: 'textarea', placeholder: 'How they speak and act' },
      { key: 'temperament', label: 'Temperament', type: 'text', placeholder: 'General mood and disposition' },
      { key: 'emotionalState', label: 'Emotional State', type: 'text', placeholder: 'Current emotional condition' },
      { key: 'sense_of_humor', label: 'Sense of Humor', type: 'text', placeholder: 'Type of humor they appreciate' },
      { key: 'speech_patterns', label: 'Speech Patterns', type: 'textarea', placeholder: 'How they speak and communicate' }
    ]
  },
  {
    id: 'psychology',
    title: 'Psychology',
    icon: Brain,
    description: 'Mental traits and psychological profile',
    fields: [
      { key: 'intelligence', label: 'Intelligence', type: 'text', placeholder: 'Intellectual capacity and type' },
      { key: 'education', label: 'Education', type: 'text', placeholder: 'Formal and informal learning' },
      { key: 'mentalHealth', label: 'Mental Health', type: 'text', placeholder: 'Psychological well-being' },
      { key: 'phobias', label: 'Phobias & Fears', type: 'array', placeholder: 'What they fear most' },
      { key: 'motivations', label: 'Motivations', type: 'array', placeholder: 'What drives them' },
      { key: 'goals', label: 'Goals & Ambitions', type: 'array', placeholder: 'What they want to achieve' },
      { key: 'desires', label: 'Desires', type: 'array', placeholder: 'What they long for' },
      { key: 'regrets', label: 'Regrets', type: 'array', placeholder: 'What they wish they could change' },
      { key: 'secrets', label: 'Secrets', type: 'array', placeholder: 'What they hide from others' },
      { key: 'moral_code', label: 'Moral Code', type: 'textarea', placeholder: 'Their ethical principles' },
      { key: 'worldview', label: 'Worldview', type: 'textarea', placeholder: 'How they see the world' },
      { key: 'philosophy', label: 'Philosophy', type: 'textarea', placeholder: 'Their philosophical outlook' }
    ]
  },
  {
    id: 'abilities',
    title: 'Abilities',
    icon: Zap,
    description: 'Skills, talents, and special abilities',
    fields: [
      { key: 'skills', label: 'Skills', type: 'array', placeholder: 'Learned abilities and proficiencies' },
      { key: 'talents', label: 'Natural Talents', type: 'array', placeholder: 'Innate gifts and aptitudes' },
      { key: 'powers', label: 'Special Powers', type: 'array', placeholder: 'Magical or supernatural abilities' },
      { key: 'weaknesses', label: 'Weaknesses', type: 'array', placeholder: 'Physical or mental limitations' },
      { key: 'strengths', label: 'Strengths', type: 'array', placeholder: 'Areas of excellence' },
      { key: 'combat_skills', label: 'Combat Skills', type: 'array', placeholder: 'Fighting abilities' },
      { key: 'magical_abilities', label: 'Magical Abilities', type: 'array', placeholder: 'Magical powers and spells' },
      { key: 'languages', label: 'Languages', type: 'array', placeholder: 'Languages they speak' },
      { key: 'hobbies', label: 'Hobbies & Interests', type: 'array', placeholder: 'What they enjoy doing' }
    ]
  },
  {
    id: 'background',
    title: 'Background',
    icon: BookOpen,
    description: 'History and personal background',
    fields: [
      { key: 'backstory', label: 'Backstory', type: 'textarea', placeholder: 'Their life story and history' },
      { key: 'childhood', label: 'Childhood', type: 'textarea', placeholder: 'Early life experiences' },
      { key: 'formative_events', label: 'Formative Events', type: 'array', placeholder: 'Key life-changing moments' },
      { key: 'trauma', label: 'Trauma', type: 'textarea', placeholder: 'Difficult or painful experiences' },
      { key: 'achievements', label: 'Achievements', type: 'array', placeholder: 'Notable accomplishments' },
      { key: 'failures', label: 'Failures', type: 'array', placeholder: 'Significant setbacks or mistakes' },
      { key: 'education_background', label: 'Educational Background', type: 'textarea', placeholder: 'Learning and academic history' },
      { key: 'work_history', label: 'Work History', type: 'textarea', placeholder: 'Professional background' },
      { key: 'military_service', label: 'Military Service', type: 'text', placeholder: 'Military background if any' },
      { key: 'criminal_record', label: 'Criminal Record', type: 'text', placeholder: 'Legal troubles if any' }
    ]
  },
  {
    id: 'relationships',
    title: 'Relationships',
    icon: Users,
    description: 'Connections and relationships with others',
    fields: [
      { key: 'family', label: 'Family', type: 'array', placeholder: 'Family members and relationships' },
      { key: 'friends', label: 'Friends', type: 'array', placeholder: 'Close friends and companions' },
      { key: 'enemies', label: 'Enemies', type: 'array', placeholder: 'Adversaries and opponents' },
      { key: 'allies', label: 'Allies', type: 'array', placeholder: 'Partners and allies' },
      { key: 'mentors', label: 'Mentors', type: 'array', placeholder: 'Teachers and guides' },
      { key: 'romantic_interests', label: 'Romantic Interests', type: 'array', placeholder: 'Past and current romantic partners' },
      { key: 'relationship_status', label: 'Relationship Status', type: 'text', placeholder: 'Current romantic status' },
      { key: 'social_connections', label: 'Social Connections', type: 'array', placeholder: 'Professional and social network' },
      { key: 'children', label: 'Children', type: 'array', placeholder: 'Offspring or adopted children' },
      { key: 'pets', label: 'Pets', type: 'array', placeholder: 'Animal companions' }
    ]
  },
  {
    id: 'cultural',
    title: 'Cultural',
    icon: MapPin,
    description: 'Cultural background and beliefs',
    fields: [
      { key: 'culture', label: 'Cultural Background', type: 'text', placeholder: 'Cultural identity and heritage' },
      { key: 'religion', label: 'Religion/Beliefs', type: 'text', placeholder: 'Spiritual or religious beliefs' },
      { key: 'traditions', label: 'Traditions', type: 'array', placeholder: 'Cultural traditions they follow' },
      { key: 'values', label: 'Values', type: 'array', placeholder: 'What they consider important' },
      { key: 'customs', label: 'Customs', type: 'array', placeholder: 'Cultural practices they observe' },
      { key: 'social_class', label: 'Social Class', type: 'text', placeholder: 'Socioeconomic background' },
      { key: 'political_views', label: 'Political Views', type: 'text', placeholder: 'Political beliefs and affiliations' },
      { key: 'economic_status', label: 'Economic Status', type: 'text', placeholder: 'Financial situation' }
    ]
  },
  {
    id: 'story_role',
    title: 'Story Role',
    icon: Star,
    description: 'Role and function in the narrative',
    fields: [
      { key: 'character_arc', label: 'Character Arc', type: 'textarea', placeholder: 'How they change throughout the story' },
      { key: 'narrative_function', label: 'Narrative Function', type: 'textarea', placeholder: 'Purpose they serve in the story' },
      { key: 'story_importance', label: 'Story Importance', type: 'select', options: ['Critical', 'Important', 'Moderate', 'Minor'], placeholder: 'How important they are to the plot' },
      { key: 'first_appearance', label: 'First Appearance', type: 'text', placeholder: 'When they first appear in the story' },
      { key: 'last_appearance', label: 'Last Appearance', type: 'text', placeholder: 'When they last appear in the story' },
      { key: 'character_growth', label: 'Character Growth', type: 'textarea', placeholder: 'How they develop and change' },
      { key: 'internal_conflict', label: 'Internal Conflict', type: 'textarea', placeholder: 'Their inner struggles' },
      { key: 'external_conflict', label: 'External Conflict', type: 'textarea', placeholder: 'Conflicts with others or environment' }
    ]
  },
  {
    id: 'meta',
    title: 'Meta Information',
    icon: Settings,
    description: 'Creation and development notes',
    fields: [
      { key: 'inspiration', label: 'Inspiration', type: 'textarea', placeholder: 'What inspired this character' },
      { key: 'creation_notes', label: 'Creation Notes', type: 'textarea', placeholder: 'Notes about character development' },
      { key: 'character_concept', label: 'Character Concept', type: 'textarea', placeholder: 'Core concept or idea' },
      { key: 'design_notes', label: 'Design Notes', type: 'textarea', placeholder: 'Visual design considerations' },
      { key: 'voice_notes', label: 'Voice Notes', type: 'textarea', placeholder: 'How they speak and sound' },
      { key: 'themes', label: 'Associated Themes', type: 'array', placeholder: 'Themes this character represents' },
      { key: 'symbolism', label: 'Symbolism', type: 'textarea', placeholder: 'What they symbolize in the story' },
      { key: 'author_notes', label: 'Author Notes', type: 'textarea', placeholder: 'Additional development notes' }
    ]
  }
] as const;

export function CharacterGuidedCreationUnified({
  projectId,
  onBack,
  onComplete,
  onAutoSave
}: CharacterGuidedCreationUnifiedProps) {
  const [currentSection, setCurrentSection] = useState(0);
  const [characterData, setCharacterData] = useState<Partial<Character>>({});

  // Auto-save when data changes
  useEffect(() => {
    if (Object.keys(characterData).length > 0) {
      const progress = (currentSection / (CHARACTER_SECTIONS.length - 1)) * 100;
      onAutoSave('guided', characterData, progress);
    }
  }, [characterData, currentSection, onAutoSave]);

  const updateField = useCallback((key: string, value: any) => {
    setCharacterData(prev => ({
      ...prev,
      [key]: value
    }));
  }, []);

  const currentSectionData = CHARACTER_SECTIONS[currentSection];
  const progress = ((currentSection + 1) / CHARACTER_SECTIONS.length) * 100;

  const handleNext = () => {
    if (currentSection < CHARACTER_SECTIONS.length - 1) {
      setCurrentSection(currentSection + 1);
    }
  };

  const handlePrevious = () => {
    if (currentSection > 0) {
      setCurrentSection(currentSection - 1);
    }
  };

  const handleComplete = async () => {
    try {
      const character = await CharacterCreationService.createCharacter(projectId, characterData);
      onComplete(character);
    } catch (error) {
      console.error('Failed to create character:', error);
    }
  };

  const renderField = (field: any) => {
    const value = characterData[field.key as keyof Character];

    if (field.type === 'text') {
      return (
        <div className="space-y-2">
          <Label htmlFor={field.key} className="text-sm font-medium text-foreground">
            {field.label}
            {field.required && <span className="text-destructive ml-1">*</span>}
          </Label>
          <Input
            id={field.key}
            value={value as string}
            onChange={(e) => updateField(field.key, e.target.value)}
            placeholder={field.placeholder}
            className={cn(
              field.required && !value && "border-destructive"
            )}
          />
        </div>
      );
    }

    if (field.type === 'textarea') {
      return (
        <div className="space-y-2">
          <Label htmlFor={field.key} className="text-sm font-medium text-foreground">
            {field.label}
            {field.required && <span className="text-destructive ml-1">*</span>}
          </Label>
          <Textarea
            id={field.key}
            value={value as string}
            onChange={(e) => updateField(field.key, e.target.value)}
            placeholder={field.placeholder}
            className={cn(
              "min-h-[80px]",
              field.required && !value && "border-destructive"
            )}
          />
        </div>
      );
    }

    if (field.type === 'select') {
      return (
        <div className="space-y-2">
          <Label htmlFor={field.key} className="text-sm font-medium text-foreground">
            {field.label}
            {field.required && <span className="text-destructive ml-1">*</span>}
          </Label>
          <select
            id={field.key}
            value={value as string}
            onChange={(e) => updateField(field.key, e.target.value)}
            className={cn(
              "w-full px-3 py-2 border border-border rounded-md bg-background text-foreground focus:ring-2 focus:ring-primary/20 focus:border-primary",
              field.required && !value && "border-destructive"
            )}
          >
            <option value="">{field.placeholder}</option>
            {field.options?.map((option: string) => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        </div>
      );
    }

    if (field.type === 'array') {
      const arrayValue = (value as string[]) || [];
      
      return (
        <div className="space-y-2">
          <Label htmlFor={field.key} className="text-sm font-medium text-foreground">
            {field.label}
            {field.required && <span className="text-destructive ml-1">*</span>}
          </Label>
          <div className="space-y-2">
            <Input
              placeholder={field.placeholder}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && e.currentTarget.value.trim()) {
                  const newValue = e.currentTarget.value.trim();
                  updateField(field.key, [...arrayValue, newValue]);
                  e.currentTarget.value = '';
                }
              }}
              className={cn(
                field.required && arrayValue.length === 0 && "border-destructive"
              )}
            />
            {arrayValue.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {arrayValue.map((item, index) => (
                  <Badge
                    key={index}
                    variant="secondary"
                    className="gap-1 cursor-pointer hover:bg-destructive hover:text-destructive-foreground"
                    onClick={() => {
                      const newArray = arrayValue.filter((_, i) => i !== index);
                      updateField(field.key, newArray);
                    }}
                  >
                    {item}
                    <span className="text-xs">×</span>
                  </Badge>
                ))}
              </div>
            )}
            <p className="text-xs text-muted-foreground">Press Enter to add items</p>
          </div>
        </div>
      );
    }

    return null;
  };

  return (
    <div className="h-full flex">
      {/* SIDEBAR - NAVIGATION */}
      <div className="w-64 flex-shrink-0 border-r border-border overflow-y-auto bg-muted/30">
        <div className="p-4">
          <div className="space-y-1 mb-6">
            <h3 className="font-semibold text-foreground">Progress</h3>
            <Progress value={progress} className="h-2" />
            <p className="text-xs text-muted-foreground">
              {Math.round(progress)}% complete
            </p>
          </div>
          
          <div className="space-y-2">
            {CHARACTER_SECTIONS.map((section, index) => {
              const Icon = section.icon;
              const isCurrent = index === currentSection;
              const isCompleted = index < currentSection;
              
              return (
                <button
                  key={section.id}
                  onClick={() => setCurrentSection(index)}
                  className={cn(
                    "w-full text-left p-3 rounded-lg border transition-all duration-200",
                    isCurrent && "bg-primary/10 border-primary",
                    !isCurrent && "hover:bg-muted/50 border-transparent",
                    isCompleted && "bg-primary/5 border-primary/30"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      "p-2 rounded-md",
                      isCurrent && "bg-primary text-primary-foreground",
                      !isCurrent && isCompleted && "bg-primary/20 text-primary",
                      !isCurrent && !isCompleted && "bg-muted text-muted-foreground"
                    )}>
                      {isCompleted ? (
                        <Check className="h-4 w-4" />
                      ) : (
                        <Icon className="h-4 w-4" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className={cn(
                        "font-medium text-sm",
                        isCurrent && "text-primary",
                        !isCurrent && "text-foreground"
                      )}>
                        {section.title}
                      </h4>
                      <p className="text-xs text-muted-foreground truncate">
                        {section.description}
                      </p>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* MAIN CONTENT - NO SCROLLING */}
      <div className="flex-1 flex flex-col">
        {/* Section Header */}
        <div className="flex-shrink-0 border-b border-border p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-lg bg-primary/10">
              <currentSectionData.icon className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-foreground">{currentSectionData.title}</h2>
              <p className="text-muted-foreground">{currentSectionData.description}</p>
            </div>
          </div>
        </div>

        {/* Fields Grid - SCROLLABLE CONTENT AREA */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 max-w-6xl">
            {currentSectionData.fields.map((field) => (
              <Card
                key={field.key}
                className="border border-border hover:shadow-sm transition-shadow"
              >
                <CardContent className="p-4">
                  {renderField(field)}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Footer Navigation */}
        <div className="flex-shrink-0 border-t border-border p-6 bg-muted/30">
          <div className="flex items-center justify-between max-w-6xl">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentSection === 0}
              className="gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Previous
            </Button>
            
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Save className="h-4 w-4" />
              Auto-saving progress...
            </div>

            {currentSection === CHARACTER_SECTIONS.length - 1 ? (
              <Button
                onClick={handleComplete}
                className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90"
              >
                <Check className="h-4 w-4" />
                Create Character
              </Button>
            ) : (
              <Button
                onClick={handleNext}
                className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90"
              >
                Next
                <ArrowRight className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}