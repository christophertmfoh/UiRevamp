import React, { useState, useEffect } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { 
  User, Eye, Brain, Zap, BookOpen, Users, PenTool, Globe,
  ArrowRight, ArrowLeft, Save, Check, Info
} from 'lucide-react';
import { apiRequest } from '@/lib/queryClient';
import type { Character } from '@/lib/types';
import { nanoid } from 'nanoid';

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
      { key: 'title', label: 'Title', type: 'text', placeholder: 'Dr., Lord, Captain, etc.' },
      { key: 'aliases', label: 'Aliases', type: 'text', placeholder: 'Secret identities or false names' },
      { key: 'age', label: 'Age', type: 'text', placeholder: '25 or "appears to be in their 20s"' },
      { key: 'birthdate', label: 'Birthdate', type: 'text', placeholder: 'Date of birth if known' },
      { key: 'zodiacSign', label: 'Zodiac Sign', type: 'text', placeholder: 'Astrological sign' },
      { key: 'race', label: 'Race/Species', type: 'text', placeholder: 'Human, Elf, Dragon, etc.' },
      { key: 'ethnicity', label: 'Ethnicity', type: 'text', placeholder: 'Cultural or ethnic background' },
      { key: 'class', label: 'Class', type: 'text', placeholder: 'Warrior, Mage, etc.' },
      { key: 'profession', label: 'Profession', type: 'text', placeholder: 'Current job or role' },
      { key: 'occupation', label: 'Occupation', type: 'text', placeholder: 'What they do for work' },
      { key: 'role', label: 'Story Role', type: 'select', options: [
        'Protagonist', 'Antagonist', 'Deuteragonist', 'Supporting Character', 'Minor Character',
        'Comic Relief', 'Mentor', 'Love Interest', 'Sidekick', 'Rival', 'Anti-Hero'
      ]}
    ]
  },
  {
    id: 'appearance',
    title: 'Appearance',
    icon: Eye,
    description: 'Physical characteristics and visual details',
    fields: [
      { key: 'physicalDescription', label: 'Overall Description', type: 'textarea', placeholder: 'General physical description' },
      { key: 'height', label: 'Height', type: 'text', placeholder: '6\'2", Tall, Average, etc.' },
      { key: 'weight', label: 'Weight', type: 'text', placeholder: 'Weight or build description' },
      { key: 'build', label: 'Build/Body Type', type: 'text', placeholder: 'Athletic, Slender, Stocky, etc.' },
      { key: 'bodyType', label: 'Body Type Details', type: 'text', placeholder: 'More specific body type' },
      { key: 'facialFeatures', label: 'Facial Features', type: 'textarea', placeholder: 'Describe face shape, features' },
      { key: 'eyes', label: 'Eyes', type: 'text', placeholder: 'Eye description' },
      { key: 'eyeColor', label: 'Eye Color', type: 'text', placeholder: 'Blue, Brown, Heterochromatic, etc.' },
      { key: 'hair', label: 'Hair', type: 'text', placeholder: 'Hair description' },
      { key: 'hairColor', label: 'Hair Color', type: 'text', placeholder: 'Black, Blonde, Silver, etc.' },
      { key: 'hairStyle', label: 'Hair Style', type: 'text', placeholder: 'Long, Short, Braided, etc.' },
      { key: 'facialHair', label: 'Facial Hair', type: 'text', placeholder: 'Beard, mustache, clean-shaven' },
      { key: 'skin', label: 'Skin', type: 'text', placeholder: 'Skin description' },
      { key: 'skinTone', label: 'Skin Tone', type: 'text', placeholder: 'Skin color and tone' },
      { key: 'complexion', label: 'Complexion', type: 'text', placeholder: 'Clear, freckled, weathered, etc.' },
      { key: 'scars', label: 'Scars', type: 'text', placeholder: 'Notable scars and their origins' },
      { key: 'tattoos', label: 'Tattoos', type: 'text', placeholder: 'Tattoo descriptions and meanings' },
      { key: 'piercings', label: 'Piercings', type: 'text', placeholder: 'Body piercings' },
      { key: 'birthmarks', label: 'Birthmarks', type: 'text', placeholder: 'Natural marks or blemishes' },
      { key: 'distinguishingMarks', label: 'Distinguishing Marks', type: 'text', placeholder: 'Unique physical identifiers' },
      { key: 'attire', label: 'Typical Attire', type: 'text', placeholder: 'Usual clothing choices' },
      { key: 'clothingStyle', label: 'Clothing Style', type: 'text', placeholder: 'Fashion sense and preferences' },
      { key: 'accessories', label: 'Accessories', type: 'text', placeholder: 'Jewelry, glasses, etc.' },
      { key: 'posture', label: 'Posture', type: 'text', placeholder: 'How they carry themselves' },
      { key: 'gait', label: 'Gait', type: 'text', placeholder: 'How they walk or move' },
      { key: 'gestures', label: 'Gestures', type: 'text', placeholder: 'Hand movements and body language' },
      { key: 'mannerisms', label: 'Mannerisms', type: 'text', placeholder: 'Distinctive behaviors or habits' }
    ]
  },
  {
    id: 'personality',
    title: 'Personality',
    icon: Brain,
    description: 'Psychological profile and character traits',
    fields: [
      { key: 'personality', label: 'Personality Overview', type: 'textarea', placeholder: 'General personality description' },
      { key: 'personalityTraits', label: 'Personality Traits', type: 'array', placeholder: 'Brave, Cunning, Compassionate (comma-separated)' },
      { key: 'temperament', label: 'Temperament', type: 'text', placeholder: 'Basic emotional disposition' },
      { key: 'disposition', label: 'General Disposition', type: 'text', placeholder: 'Overall attitude and mood' },
      { key: 'worldview', label: 'Worldview', type: 'textarea', placeholder: 'How they see the world' },
      { key: 'beliefs', label: 'Beliefs', type: 'textarea', placeholder: 'Core beliefs and convictions' },
      { key: 'values', label: 'Values', type: 'text', placeholder: 'What they value most' },
      { key: 'principles', label: 'Principles', type: 'text', placeholder: 'Guiding principles' },
      { key: 'morals', label: 'Morals', type: 'text', placeholder: 'Moral compass and ethics' },
      { key: 'ethics', label: 'Ethics', type: 'text', placeholder: 'Ethical framework' },
      { key: 'virtues', label: 'Virtues', type: 'text', placeholder: 'Positive character traits' },
      { key: 'vices', label: 'Vices', type: 'text', placeholder: 'Character flaws and negative traits' },
      { key: 'habits', label: 'Habits', type: 'text', placeholder: 'Regular behaviors and routines' },
      { key: 'quirks', label: 'Quirks', type: 'text', placeholder: 'Unusual or distinctive traits' },
      { key: 'idiosyncrasies', label: 'Idiosyncrasies', type: 'text', placeholder: 'Personal peculiarities' },
      { key: 'petPeeves', label: 'Pet Peeves', type: 'text', placeholder: 'Things that annoy them' },
      { key: 'likes', label: 'Likes', type: 'text', placeholder: 'Things they enjoy' },
      { key: 'dislikes', label: 'Dislikes', type: 'text', placeholder: 'Things they dislike' },
      { key: 'hobbies', label: 'Hobbies', type: 'text', placeholder: 'Leisure activities' },
      { key: 'interests', label: 'Interests', type: 'text', placeholder: 'Areas of interest' },
      { key: 'passions', label: 'Passions', type: 'text', placeholder: 'What they are passionate about' }
    ]
  },
  {
    id: 'psychology',
    title: 'Psychology',
    icon: Brain,
    description: 'Deep psychological and emotional profile',
    fields: [
      { key: 'motivations', label: 'Motivations', type: 'textarea', placeholder: 'What drives them' },
      { key: 'desires', label: 'Desires', type: 'text', placeholder: 'What they want' },
      { key: 'needs', label: 'Needs', type: 'text', placeholder: 'What they need' },
      { key: 'drives', label: 'Drives', type: 'text', placeholder: 'Internal driving forces' },
      { key: 'ambitions', label: 'Ambitions', type: 'text', placeholder: 'Long-term goals and aspirations' },
      { key: 'fears', label: 'Fears', type: 'text', placeholder: 'What they fear most' },
      { key: 'phobias', label: 'Phobias', type: 'text', placeholder: 'Specific phobias' },
      { key: 'anxieties', label: 'Anxieties', type: 'text', placeholder: 'Sources of anxiety' },
      { key: 'insecurities', label: 'Insecurities', type: 'text', placeholder: 'Personal insecurities' },
      { key: 'secrets', label: 'Secrets', type: 'textarea', placeholder: 'Hidden secrets' },
      { key: 'shame', label: 'Shame', type: 'text', placeholder: 'Sources of shame' },
      { key: 'guilt', label: 'Guilt', type: 'text', placeholder: 'Things they feel guilty about' },
      { key: 'regrets', label: 'Regrets', type: 'text', placeholder: 'Past regrets' },
      { key: 'trauma', label: 'Trauma', type: 'textarea', placeholder: 'Past traumatic experiences' },
      { key: 'wounds', label: 'Emotional Wounds', type: 'text', placeholder: 'Deep emotional injuries' },
      { key: 'copingMechanisms', label: 'Coping Mechanisms', type: 'text', placeholder: 'How they cope with stress' },
      { key: 'defenses', label: 'Defense Mechanisms', type: 'text', placeholder: 'Psychological defenses' },
      { key: 'vulnerabilities', label: 'Vulnerabilities', type: 'text', placeholder: 'Emotional vulnerabilities' },
      { key: 'weaknesses', label: 'Weaknesses', type: 'text', placeholder: 'Character weaknesses' },
      { key: 'blindSpots', label: 'Blind Spots', type: 'text', placeholder: 'What they cannot see about themselves' },
      { key: 'mentalHealth', label: 'Mental Health', type: 'text', placeholder: 'Mental health status' },
      { key: 'emotionalState', label: 'Emotional State', type: 'text', placeholder: 'Current emotional condition' },
      { key: 'maturityLevel', label: 'Maturity Level', type: 'text', placeholder: 'Emotional maturity' },
      { key: 'intelligenceType', label: 'Intelligence Type', type: 'text', placeholder: 'Type of intelligence' },
      { key: 'learningStyle', label: 'Learning Style', type: 'text', placeholder: 'How they learn best' }
    ]
  },
  {
    id: 'abilities',
    title: 'Abilities',
    icon: Zap,
    description: 'Skills, talents, and capabilities',
    fields: [
      { key: 'abilities', label: 'General Abilities', type: 'array', placeholder: 'Combat, Magic, Leadership (comma-separated)' },
      { key: 'skills', label: 'Skills', type: 'array', placeholder: 'Specific skills (comma-separated)' },
      { key: 'talents', label: 'Talents', type: 'array', placeholder: 'Natural talents (comma-separated)' },
      { key: 'expertise', label: 'Areas of Expertise', type: 'array', placeholder: 'Expert knowledge areas (comma-separated)' },
      { key: 'specialAbilities', label: 'Special Abilities', type: 'textarea', placeholder: 'Unique or supernatural abilities' },
      { key: 'powers', label: 'Powers', type: 'textarea', placeholder: 'Magical or superhuman powers' },
      { key: 'superpowers', label: 'Superpowers', type: 'textarea', placeholder: 'Extraordinary abilities' },
      { key: 'abilityLimitations', label: 'Ability Limitations', type: 'textarea', placeholder: 'Limits on abilities and powers' },
      { key: 'strengths', label: 'Strengths', type: 'text', placeholder: 'Areas where they excel' },
      { key: 'competencies', label: 'Competencies', type: 'text', placeholder: 'Professional competencies' },
      { key: 'training', label: 'Training', type: 'textarea', placeholder: 'Formal training received' },
      { key: 'experience', label: 'Experience', type: 'textarea', placeholder: 'Relevant life experiences' }
    ]
  },
  {
    id: 'background',
    title: 'Background',
    icon: BookOpen,
    description: 'History, origins, and life story',
    fields: [
      { key: 'background', label: 'Background Overview', type: 'textarea', placeholder: 'General background information' },
      { key: 'backstory', label: 'Backstory', type: 'textarea', placeholder: 'Detailed life history', required: true },
      { key: 'origin', label: 'Origin', type: 'text', placeholder: 'Where they come from' },
      { key: 'upbringing', label: 'Upbringing', type: 'textarea', placeholder: 'How they were raised' },
      { key: 'childhood', label: 'Childhood', type: 'textarea', placeholder: 'Childhood experiences' },
      { key: 'familyHistory', label: 'Family History', type: 'textarea', placeholder: 'Family background and history' },
      { key: 'socialClass', label: 'Social Class', type: 'text', placeholder: 'Socioeconomic background' },
      { key: 'economicStatus', label: 'Economic Status', type: 'text', placeholder: 'Financial situation' },
      { key: 'education', label: 'Education', type: 'textarea', placeholder: 'Educational background' },
      { key: 'academicHistory', label: 'Academic History', type: 'text', placeholder: 'Academic achievements' },
      { key: 'formativeEvents', label: 'Formative Events', type: 'textarea', placeholder: 'Events that shaped them' },
      { key: 'lifeChangingMoments', label: 'Life-Changing Moments', type: 'textarea', placeholder: 'Pivotal moments in life' },
      { key: 'personalStruggle', label: 'Personal Struggles', type: 'textarea', placeholder: 'Major life struggles' },
      { key: 'challenges', label: 'Challenges', type: 'text', placeholder: 'Ongoing challenges they face' },
      { key: 'achievements', label: 'Achievements', type: 'text', placeholder: 'Notable accomplishments' },
      { key: 'failures', label: 'Failures', type: 'text', placeholder: 'Significant failures' },
      { key: 'losses', label: 'Losses', type: 'text', placeholder: 'Important losses' },
      { key: 'victories', label: 'Victories', type: 'text', placeholder: 'Personal victories' },
      { key: 'reputation', label: 'Reputation', type: 'text', placeholder: 'How others see them' }
    ]
  },
  {
    id: 'relationships',
    title: 'Relationships',
    icon: Users,
    description: 'Social connections and relationships',
    fields: [
      { key: 'family', label: 'Family', type: 'textarea', placeholder: 'Family members and relationships' },
      { key: 'parents', label: 'Parents', type: 'text', placeholder: 'Information about parents' },
      { key: 'siblings', label: 'Siblings', type: 'text', placeholder: 'Brothers and sisters' },
      { key: 'spouse', label: 'Spouse/Partner', type: 'text', placeholder: 'Romantic partner or spouse' },
      { key: 'children', label: 'Children', type: 'text', placeholder: 'Information about children' },
      { key: 'friends', label: 'Friends', type: 'textarea', placeholder: 'Close friends and companions' },
      { key: 'allies', label: 'Allies', type: 'text', placeholder: 'People who support them' },
      { key: 'enemies', label: 'Enemies', type: 'text', placeholder: 'Those who oppose them' },
      { key: 'rivals', label: 'Rivals', type: 'text', placeholder: 'Competitive relationships' },
      { key: 'mentors', label: 'Mentors', type: 'text', placeholder: 'Teachers and guides' },
      { key: 'socialCircle', label: 'Social Circle', type: 'text', placeholder: 'Broader social connections' },
      { key: 'community', label: 'Community', type: 'text', placeholder: 'Community involvement' }
    ]
  },
  {
    id: 'cultural',
    title: 'Cultural',
    icon: Globe,
    description: 'Cultural background and communication',
    fields: [
      { key: 'culturalBackground', label: 'Cultural Background', type: 'textarea', placeholder: 'Cultural heritage and influences' },
      { key: 'traditions', label: 'Traditions', type: 'text', placeholder: 'Cultural traditions they follow' },
      { key: 'customs', label: 'Customs', type: 'text', placeholder: 'Personal and cultural customs' },
      { key: 'religion', label: 'Religion', type: 'text', placeholder: 'Religious beliefs and practices' },
      { key: 'spirituality', label: 'Spirituality', type: 'text', placeholder: 'Spiritual beliefs' },
      { key: 'politicalViews', label: 'Political Views', type: 'text', placeholder: 'Political beliefs and opinions' },
      { key: 'spokenLanguages', label: 'Languages', type: 'text', placeholder: 'Languages they speak' },
      { key: 'accent', label: 'Accent', type: 'text', placeholder: 'Speech accent' },
      { key: 'dialect', label: 'Dialect', type: 'text', placeholder: 'Regional dialect' },
      { key: 'voiceDescription', label: 'Voice Description', type: 'text', placeholder: 'How their voice sounds' },
      { key: 'speechPatterns', label: 'Speech Patterns', type: 'text', placeholder: 'How they speak' },
      { key: 'vocabulary', label: 'Vocabulary', type: 'text', placeholder: 'Type of vocabulary they use' },
      { key: 'catchphrases', label: 'Catchphrases', type: 'text', placeholder: 'Memorable phrases they use' },
      { key: 'slang', label: 'Slang', type: 'text', placeholder: 'Slang or informal language' },
      { key: 'communicationStyle', label: 'Communication Style', type: 'text', placeholder: 'How they communicate' }
    ]
  },
  {
    id: 'story',
    title: 'Story Role',
    icon: PenTool,
    description: 'Narrative function and story elements',
    fields: [
      { key: 'goals', label: 'Goals', type: 'text', placeholder: 'What they want to achieve' },
      { key: 'objectives', label: 'Objectives', type: 'text', placeholder: 'Specific objectives' },
      { key: 'wants', label: 'Wants', type: 'text', placeholder: 'What they want' },
      { key: 'obstacles', label: 'Obstacles', type: 'text', placeholder: 'What stands in their way' },
      { key: 'conflicts', label: 'Conflicts', type: 'text', placeholder: 'Internal and external conflicts' },
      { key: 'conflictSources', label: 'Conflict Sources', type: 'text', placeholder: 'Sources of conflict' },
      { key: 'stakes', label: 'Stakes', type: 'text', placeholder: 'What they stand to gain or lose' },
      { key: 'consequences', label: 'Consequences', type: 'text', placeholder: 'Potential consequences of actions' },
      { key: 'arc', label: 'Character Arc', type: 'textarea', placeholder: 'How they change throughout the story' },
      { key: 'journey', label: 'Character Journey', type: 'textarea', placeholder: 'Their journey through the story' },
      { key: 'transformation', label: 'Transformation', type: 'text', placeholder: 'How they transform' },
      { key: 'growth', label: 'Character Growth', type: 'text', placeholder: 'How they grow and develop' },
      { key: 'connectionToEvents', label: 'Connection to Events', type: 'text', placeholder: 'How they relate to plot events' },
      { key: 'plotRelevance', label: 'Plot Relevance', type: 'text', placeholder: 'Their importance to the plot' },
      { key: 'storyFunction', label: 'Story Function', type: 'text', placeholder: 'Their role in the narrative' }
    ]
  },
  {
    id: 'meta',
    title: 'Meta',
    icon: PenTool,
    description: 'Writing notes and creative elements',
    fields: [
      { key: 'description', label: 'Character Summary', type: 'textarea', placeholder: 'Brief character summary' },
      { key: 'oneLine', label: 'One-Line Description', type: 'text', placeholder: 'Character in one sentence' },
      { key: 'characterSummary', label: 'Detailed Summary', type: 'textarea', placeholder: 'Comprehensive character summary' },
      { key: 'archetypes', label: 'Archetypes', type: 'array', placeholder: 'Character archetypes (comma-separated)' },
      { key: 'tropes', label: 'Tropes', type: 'array', placeholder: 'Character tropes (comma-separated)' },
      { key: 'inspiration', label: 'Inspiration', type: 'text', placeholder: 'What inspired this character' },
      { key: 'basedOn', label: 'Based On', type: 'text', placeholder: 'Real people or characters they are based on' },
      { key: 'tags', label: 'Tags', type: 'array', placeholder: 'Character tags (comma-separated)' },
      { key: 'genre', label: 'Genre', type: 'text', placeholder: 'Story genre' },
      { key: 'proseVibe', label: 'Prose Vibe', type: 'text', placeholder: 'Writing style for this character' },
      { key: 'narrativeRole', label: 'Narrative Role', type: 'text', placeholder: 'Role in the narrative structure' },
      { key: 'characterType', label: 'Character Type', type: 'text', placeholder: 'Type of character' },
      { key: 'importance', label: 'Importance', type: 'text', placeholder: 'How important to the story' },
      { key: 'screenTime', label: 'Screen Time', type: 'text', placeholder: 'How much they appear' },
      { key: 'firstAppearance', label: 'First Appearance', type: 'text', placeholder: 'When they first appear' },
      { key: 'lastAppearance', label: 'Last Appearance', type: 'text', placeholder: 'When they last appear' },
      { key: 'notes', label: 'Writer Notes', type: 'textarea', placeholder: 'Notes for yourself about this character' },
      { key: 'development', label: 'Development Notes', type: 'textarea', placeholder: 'Character development notes' },
      { key: 'evolution', label: 'Evolution', type: 'text', placeholder: 'How the character evolved during creation' },
      { key: 'alternatives', label: 'Alternatives', type: 'text', placeholder: 'Alternative versions considered' },
      { key: 'unused', label: 'Unused Ideas', type: 'text', placeholder: 'Ideas that were not used' },
      { key: 'research', label: 'Research', type: 'textarea', placeholder: 'Research done for this character' },
      { key: 'references', label: 'References', type: 'text', placeholder: 'Reference materials used' },
      { key: 'mood', label: 'Character Mood', type: 'text', placeholder: 'Overall mood or atmosphere' },
      { key: 'personalTheme', label: 'Personal Theme', type: 'text', placeholder: 'Character\'s personal theme' },
      { key: 'symbolism', label: 'Symbolism', type: 'text', placeholder: 'What this character symbolizes' }
    ]
  }
] as const;

type FieldType = 'text' | 'textarea' | 'select' | 'array';

interface CharacterField {
  key: string;
  label: string;
  type: FieldType;
  required?: boolean;
  placeholder?: string;
  options?: string[];
}

export function CharacterGuidedCreationUnified({
  projectId,
  onBack,
  onComplete,
  onAutoSave
}: CharacterGuidedCreationUnifiedProps) {
  const [currentSection, setCurrentSection] = useState(0);
  const [characterData, setCharacterData] = useState<Partial<Character>>({
    projectId,
    id: nanoid(),
    name: '',
    role: 'Supporting Character'
  });
  const [completedSections, setCompletedSections] = useState<Set<number>>(new Set());
  const queryClient = useQueryClient();

  const progress = ((currentSection + 1) / CHARACTER_SECTIONS.length) * 100;

  // Auto-save functionality
  useEffect(() => {
    const timer = setTimeout(() => {
      onAutoSave('guided', characterData, progress);
    }, 2000);
    return () => clearTimeout(timer);
  }, [characterData, progress, onAutoSave]);

  const saveMutation = useMutation({
    mutationFn: async (data: Partial<Character>) => {
      const response = await apiRequest('POST', `/api/projects/${projectId}/characters`, data);
      return response.json();
    },
    onSuccess: (newCharacter) => {
      queryClient.invalidateQueries({ queryKey: [`/api/projects/${projectId}/characters`] });
      onComplete(newCharacter);
    }
  });

  const updateField = (key: string, value: any) => {
    setCharacterData(prev => ({ ...prev, [key]: value }));
  };

  const handleNext = () => {
    setCompletedSections(prev => new Set([...prev, currentSection]));
    if (currentSection < CHARACTER_SECTIONS.length - 1) {
      setCurrentSection(currentSection + 1);
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

  const handleSave = () => {
    saveMutation.mutate(characterData);
  };

  const isCurrentSectionValid = () => {
    const section = CHARACTER_SECTIONS[currentSection];
    const requiredFields = section.fields.filter(f => f.required);
    return requiredFields.every(field => {
      const value = (characterData as any)[field.key];
      return value && value.toString().trim().length > 0;
    });
  };

  const renderField = (field: CharacterField) => {
    const value = (characterData as any)[field.key] || '';
    
    switch (field.type) {
      case 'text':
        return (
          <Input
            value={value as string}
            onChange={(e) => updateField(field.key, e.target.value)}
            placeholder={field.placeholder}
            style={{
              borderColor: theme.border,
              '--tw-ring-color': theme.primary + '20',
              '&:focus': {
                borderColor: theme.primary,
                boxShadow: `0 0 0 3px ${theme.primary}20`
              }
            } as any}
          />
        );
      
      case 'textarea':
        return (
          <Textarea
            value={value as string}
            onChange={(e) => updateField(field.key, e.target.value)}
            placeholder={field.placeholder}
            className="min-h-[80px] resize-none"
            style={{
              borderColor: theme.border,
              '--tw-ring-color': theme.primary + '20',
              '&:focus': {
                borderColor: theme.primary,
                boxShadow: `0 0 0 3px ${theme.primary}20`
              }
            } as any}
            rows={3}
          />
        );
      
      case 'select':
        return (
          <select
            value={value as string}
            onChange={(e) => updateField(field.key, e.target.value)}
            className="w-full p-2 border rounded-md bg-white"
            style={{
              borderColor: theme.border,
              '--tw-ring-color': theme.primary + '20',
              '&:focus': {
                borderColor: theme.primary,
                boxShadow: `0 0 0 3px ${theme.primary}20`
              }
            } as any}
          >
            <option value="">Select an option</option>
            {field.options?.map((option) => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        );
      
      case 'array':
        const arrayValue = Array.isArray(value) ? value.join(', ') : value;
        return (
          <Input
            value={arrayValue as string}
            onChange={(e) => {
              const val = e.target.value;
              const arrayVal = val.trim() ? val.split(',').map(s => s.trim()) : [];
              updateField(field.key, arrayVal);
            }}
            placeholder={field.placeholder}
            style={{
              borderColor: theme.border,
              '--tw-ring-color': theme.primary + '20',
              '&:focus': {
                borderColor: theme.primary,
                boxShadow: `0 0 0 3px ${theme.primary}20`
              }
            } as any}
          />
        );
      
      default:
        return null;
    }
  };

  const currentSectionData = CHARACTER_SECTIONS[currentSection];

  return (
    <div className="h-full flex">
      {/* SIDEBAR - NAVIGATION */}
      <div 
        className="w-64 flex-shrink-0 border-r overflow-y-auto"
        style={{ 
          backgroundColor: theme.background,
          borderColor: theme.border
        }}
      >
        <div className="p-4">
          <div className="mb-4">
            <h3 className="font-semibold text-gray-900 mb-2">Progress</h3>
            <div className="space-y-2">
              <Progress 
                value={progress} 
                className="h-2"
              />
              <div className="flex justify-between text-xs text-gray-500">
                <span>Step {currentSection + 1} of {CHARACTER_SECTIONS.length}</span>
                <span>{Math.round(progress)}%</span>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            {CHARACTER_SECTIONS.map((section, index) => {
              const Icon = section.icon;
              const isCompleted = completedSections.has(index);
              const isCurrent = index === currentSection;
              const isAccessible = index <= currentSection || completedSections.has(index);
              
              return (
                <button
                  key={section.id}
                  onClick={() => handleSectionClick(index)}
                  disabled={!isAccessible}
                  className={cn(
                    "w-full p-3 rounded-lg border text-left transition-all",
                    isCurrent && "ring-2",
                    isCompleted && "bg-green-50 border-green-200",
                    !isCompleted && isCurrent && "border-gray-300",
                    !isCompleted && !isCurrent && "border-gray-200",
                    isAccessible ? "cursor-pointer hover:bg-gray-50" : "cursor-not-allowed opacity-50"
                  )}
                  style={{
                    ...(isCurrent && {
                      backgroundColor: theme.background,
                      borderColor: theme.primary,
                      ['--tw-ring-color' as any]: theme.primary + '40'
                    })
                  }}
                >
                  <div className="flex items-center gap-3">
                    <div 
                      className={cn(
                        "p-2 rounded-md",
                        isCompleted && "bg-green-100 text-green-600",
                        !isCompleted && isCurrent && "text-white",
                        !isCompleted && !isCurrent && "bg-gray-100 text-gray-500"
                      )}
                      style={{
                        ...(isCurrent && !isCompleted && {
                          backgroundColor: theme.primary
                        })
                      }}
                    >
                      {isCompleted ? (
                        <Check className="h-4 w-4" />
                      ) : (
                        <Icon className="h-4 w-4" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-sm text-gray-900">{section.title}</div>
                      <div className="text-xs text-gray-500 mt-1">
                        {section.fields.length} fields
                      </div>
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
        <div className="flex-shrink-0 border-b p-6" style={{ borderBottomColor: theme.border }}>
          <div className="flex items-center gap-4">
            <div 
              className="p-3 rounded-lg"
              style={{ backgroundColor: theme.background }}
            >
              <currentSectionData.icon 
                className="h-6 w-6" 
                style={{ color: theme.primary }}
              />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">{currentSectionData.title}</h2>
              <p className="text-sm text-gray-600 mt-1">{currentSectionData.description}</p>
            </div>
          </div>
        </div>

        {/* Fields Grid - SCROLLABLE CONTENT AREA */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 max-w-6xl">
            {currentSectionData.fields.map((field) => (
              <Card 
              key={field.key} 
              className="border hover:shadow-sm transition-shadow"
              style={{ borderColor: theme.border }}
            >
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <Label className="text-sm font-medium text-gray-900 flex items-center gap-2">
                      {field.label}
                      {field.required && <span className="text-red-500 text-xs">*</span>}
                    </Label>
                    {field.placeholder && (
                      <Info className="h-3 w-3 text-gray-400" title={field.placeholder} />
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  {renderField(field)}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Footer Navigation */}
        <div 
          className="flex-shrink-0 border-t p-6"
          style={{ 
            borderTopColor: theme.border,
            backgroundColor: theme.background
          }}
        >
          <div className="flex items-center justify-between">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentSection === 0}
              className="gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Previous
            </Button>

            <div className="flex items-center gap-3">
              {currentSection === CHARACTER_SECTIONS.length - 1 ? (
                <Button
                  onClick={handleSave}
                  disabled={saveMutation.isPending}
                  className="gap-2 text-white"
                  style={{ backgroundColor: theme.primary }}
                >
                  <Save className="h-4 w-4" />
                  {saveMutation.isPending ? 'Creating...' : 'Create Character'}
                </Button>
              ) : (
                <Button
                  onClick={handleNext}
                  disabled={!isCurrentSectionValid()}
                  className="gap-2 text-white"
                  style={{ backgroundColor: theme.primary }}
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
  );
}