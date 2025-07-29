import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { 
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue 
} from '@/components/ui/select';

import { 
  Plus, FileText, Sparkles, Upload, ArrowRight, ChevronLeft, Save, Info, Star, Clock,
  User, Eye, Brain, Zap, BookOpen, Users, PenTool, Shield, Heart, Map, Crown,
  ChevronDown, ChevronUp, AlertCircle, CheckCircle2, Circle, Lightbulb, Wand2
} from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import type { Character } from '@/lib/types';
import { nanoid } from 'nanoid';
import { debounce } from 'lodash-es';
import { CharacterGenerationModal } from './CharacterGenerationModal';

interface CharacterCreationWizardV2Props {
  isOpen: boolean;
  onClose: () => void;
  projectId: string;
  onComplete?: (character: Character) => void;
  onTemplatesClick?: () => void;
}

type WizardMode = 'selection' | 'guided' | 'templates' | 'ai-generation' | 'upload';
type ActiveTab = 'core' | 'appearance' | 'personality' | 'background' | 'abilities' | 'social' | 'story' | 'advanced';

interface FieldConfig {
  key: keyof Character;
  label: string;
  type: 'text' | 'textarea' | 'select' | 'array' | 'tags';
  category: 'essential' | 'important' | 'detailed' | 'optional';
  placeholder?: string;
  description?: string;
  options?: string[];
  aiSuggestionTrigger?: boolean;
  relatedFields?: (keyof Character)[];
  maxLength?: number;
  rows?: number;
}

interface FieldCategory {
  id: ActiveTab;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  fields: FieldConfig[];
  estimatedTime: string;
  completionWeight: number;
}

interface CharacterDraft {
  mode: WizardMode;
  data: Partial<Character>;
  progress: number;
  completedSections: Set<ActiveTab>;
  lastSaved: Date;
  aiSuggestions: Record<string, string[]>;
}

// Comprehensive field configuration following competitor analysis
const FIELD_CATEGORIES: FieldCategory[] = [
  {
    id: 'core',
    title: 'Core Identity',
    description: 'Essential character information and basic identity',
    icon: User,
    estimatedTime: '2-3 min',
    completionWeight: 0.25,
    fields: [
      { key: 'name', label: 'Full Name', type: 'text', category: 'essential', placeholder: 'Enter character\'s full name', aiSuggestionTrigger: true, maxLength: 100 },
      { key: 'nicknames', label: 'Nicknames', type: 'tags', category: 'important', placeholder: 'Common nicknames or pet names', maxLength: 200 },
      { key: 'title', label: 'Title/Rank', type: 'text', category: 'important', placeholder: 'Dr., Lord, Captain, Sir, etc.', maxLength: 50 },
      { key: 'age', label: 'Age', type: 'text', category: 'essential', placeholder: '25 or "appears mid-twenties"', maxLength: 50 },
      { key: 'race', label: 'Race/Species', type: 'text', category: 'essential', placeholder: 'Human, Elf, Dwarf, Dragon, etc.', aiSuggestionTrigger: true, maxLength: 50 },
      { key: 'class', label: 'Class/Profession', type: 'text', category: 'important', placeholder: 'Warrior, Mage, Detective, Scholar, etc.', aiSuggestionTrigger: true, maxLength: 100 },
      { key: 'role', label: 'Story Role', type: 'select', category: 'essential', 
        options: ['Protagonist', 'Antagonist', 'Deuteragonist', 'Supporting Character', 'Comic Relief', 'Mentor', 'Love Interest', 'Sidekick', 'Rival', 'Anti-Hero', 'Foil', 'Guardian', 'Trickster'] },
      { key: 'oneLine', label: 'One-Line Description', type: 'textarea', category: 'important', placeholder: 'Describe your character in one compelling sentence', rows: 2, maxLength: 200 }
    ]
  },
  {
    id: 'appearance',
    title: 'Physical Appearance',
    description: 'Visual characteristics and physical presence',
    icon: Eye,
    estimatedTime: '3-5 min',
    completionWeight: 0.15,
    fields: [
      { key: 'physicalDescription', label: 'Overall Appearance', type: 'textarea', category: 'important', placeholder: 'General physical appearance overview', rows: 3, maxLength: 500 },
      { key: 'height', label: 'Height', type: 'text', category: 'detailed', placeholder: '5\'8" or 173cm', maxLength: 20 },
      { key: 'build', label: 'Build/Body Type', type: 'select', category: 'important', 
        options: ['Slim', 'Athletic', 'Stocky', 'Muscular', 'Heavy', 'Petite', 'Tall', 'Average', 'Lanky', 'Robust', 'Delicate'] },
      { key: 'eyeColor', label: 'Eye Color', type: 'text', category: 'detailed', placeholder: 'Blue, brown, heterochromia, etc.', maxLength: 50 },
      { key: 'hairColor', label: 'Hair Color', type: 'text', category: 'detailed', placeholder: 'Natural and current color', maxLength: 50 },
      { key: 'hairStyle', label: 'Hair Style', type: 'text', category: 'detailed', placeholder: 'Length, cut, styling', maxLength: 100 },
      { key: 'skinTone', label: 'Skin Tone', type: 'text', category: 'detailed', placeholder: 'Complexion and tone', maxLength: 50 },
      { key: 'distinguishingMarks', label: 'Distinguishing Features', type: 'textarea', category: 'important', placeholder: 'Scars, tattoos, birthmarks, unique features', rows: 2, maxLength: 300 },
      { key: 'clothingStyle', label: 'Clothing Style', type: 'textarea', category: 'important', placeholder: 'How they typically dress and present themselves', rows: 2, maxLength: 300 }
    ]
  },
  {
    id: 'personality',
    title: 'Personality & Psychology',
    description: 'Core traits, motivations, and psychological profile',
    icon: Brain,
    estimatedTime: '5-8 min',
    completionWeight: 0.25,
    fields: [
      { key: 'personality', label: 'Personality Overview', type: 'textarea', category: 'essential', placeholder: 'Core personality description', rows: 4, maxLength: 800, aiSuggestionTrigger: true },
      { key: 'personalityTraits', label: 'Key Personality Traits', type: 'tags', category: 'essential', placeholder: 'brave, witty, stubborn, compassionate', aiSuggestionTrigger: true },
      { key: 'temperament', label: 'Temperament', type: 'select', category: 'important',
        options: ['Sanguine', 'Choleric', 'Melancholic', 'Phlegmatic', 'Optimistic', 'Pessimistic', 'Realistic', 'Idealistic', 'Cynical', 'Stoic', 'Emotional', 'Analytical', 'Intuitive', 'Impulsive', 'Cautious', 'Adventurous', 'Reserved', 'Outgoing'] },
      { key: 'motivations', label: 'Core Motivations', type: 'textarea', category: 'essential', placeholder: 'What drives this character forward?', rows: 3, maxLength: 400, aiSuggestionTrigger: true },
      { key: 'fears', label: 'Fears & Phobias', type: 'textarea', category: 'important', placeholder: 'What terrifies or deeply concerns them?', rows: 2, maxLength: 300 },
      { key: 'values', label: 'Core Values', type: 'textarea', category: 'important', placeholder: 'What they believe is most important in life', rows: 2, maxLength: 300 },
      { key: 'goals', label: 'Goals & Ambitions', type: 'textarea', category: 'essential', placeholder: 'What they want to achieve', rows: 3, maxLength: 400 },
      { key: 'secrets', label: 'Secrets & Hidden Aspects', type: 'textarea', category: 'detailed', placeholder: 'What they hide from others', rows: 2, maxLength: 300 },
      { key: 'quirks', label: 'Quirks & Mannerisms', type: 'tags', category: 'important', placeholder: 'taps fingers when nervous, always carries a book' }
    ]
  },
  {
    id: 'background',
    title: 'Background & History',
    description: 'Life story, upbringing, and formative experiences',
    icon: BookOpen,
    estimatedTime: '4-6 min',
    completionWeight: 0.15,
    fields: [
      { key: 'background', label: 'Background Overview', type: 'textarea', category: 'important', placeholder: 'General background and life story', rows: 4, maxLength: 800, aiSuggestionTrigger: true },
      { key: 'upbringing', label: 'Upbringing & Childhood', type: 'textarea', category: 'important', placeholder: 'How and where they grew up', rows: 3, maxLength: 400 },
      { key: 'education', label: 'Education & Training', type: 'textarea', category: 'detailed', placeholder: 'Formal and informal learning experiences', rows: 2, maxLength: 300 },
      { key: 'formativeEvents', label: 'Formative Events', type: 'textarea', category: 'important', placeholder: 'Key life events that shaped them', rows: 3, maxLength: 400 },
      { key: 'family', label: 'Family & Relations', type: 'textarea', category: 'detailed', placeholder: 'Family members and important relationships', rows: 2, maxLength: 300 },
      { key: 'socialClass', label: 'Social Background', type: 'select', category: 'detailed',
        options: ['Nobility', 'Upper Class', 'Middle Class', 'Working Class', 'Lower Class', 'Outcast', 'Refugee', 'Unknown', 'Royalty', 'Merchant Class', 'Artisan', 'Peasant'] },
      { key: 'achievements', label: 'Major Achievements', type: 'textarea', category: 'detailed', placeholder: 'Notable accomplishments and successes', rows: 2, maxLength: 300 },
      { key: 'trauma', label: 'Trauma & Challenges', type: 'textarea', category: 'detailed', placeholder: 'Difficult experiences and how they coped', rows: 2, maxLength: 300 }
    ]
  },
  {
    id: 'abilities',
    title: 'Abilities & Skills',
    description: 'Powers, talents, and competencies',
    icon: Zap,
    estimatedTime: '3-4 min',
    completionWeight: 0.1,
    fields: [
      { key: 'abilities', label: 'Special Abilities', type: 'tags', category: 'important', placeholder: 'magic, enhanced strength, telepathy', aiSuggestionTrigger: true },
      { key: 'skills', label: 'Skills & Expertise', type: 'tags', category: 'important', placeholder: 'swordsmanship, negotiation, medicine', aiSuggestionTrigger: true },
      { key: 'strengths', label: 'Strengths', type: 'textarea', category: 'important', placeholder: 'What they excel at', rows: 2, maxLength: 300 },
      { key: 'weaknesses', label: 'Weaknesses & Limitations', type: 'textarea', category: 'important', placeholder: 'Their limitations and vulnerable areas', rows: 2, maxLength: 300 },
      { key: 'training', label: 'Training & Experience', type: 'textarea', category: 'detailed', placeholder: 'How they developed their abilities', rows: 2, maxLength: 300 },
      { key: 'specialAbilities', label: 'Unique Powers', type: 'textarea', category: 'detailed', placeholder: 'Special or supernatural capabilities', rows: 2, maxLength: 300 }
    ]
  },
  {
    id: 'social',
    title: 'Social & Cultural',
    description: 'Relationships, culture, and social connections',
    icon: Users,
    estimatedTime: '3-4 min',
    completionWeight: 0.05,
    fields: [
      { key: 'allies', label: 'Allies & Friends', type: 'textarea', category: 'important', placeholder: 'Who supports and helps them', rows: 2, maxLength: 300 },
      { key: 'enemies', label: 'Enemies & Rivals', type: 'textarea', category: 'important', placeholder: 'Who opposes or competes with them', rows: 2, maxLength: 300 },
      { key: 'culturalBackground', label: 'Cultural Background', type: 'text', category: 'detailed', placeholder: 'Cultural heritage and traditions', maxLength: 200 },
      { key: 'religion', label: 'Religion & Beliefs', type: 'text', category: 'detailed', placeholder: 'Spiritual beliefs and practices', maxLength: 200 },
      { key: 'politicalViews', label: 'Political Views', type: 'text', category: 'detailed', placeholder: 'Political alignment and opinions', maxLength: 200 },
      { key: 'reputation', label: 'Reputation', type: 'textarea', category: 'detailed', placeholder: 'How others perceive them', rows: 2, maxLength: 300 }
    ]
  },
  {
    id: 'story',
    title: 'Story Elements',
    description: 'Narrative function and story integration',
    icon: PenTool,
    estimatedTime: '2-3 min',
    completionWeight: 0.05,
    fields: [
      { key: 'arc', label: 'Character Arc', type: 'textarea', category: 'important', placeholder: 'How they change throughout the story', rows: 3, maxLength: 400 },
      { key: 'conflicts', label: 'Internal Conflicts', type: 'textarea', category: 'important', placeholder: 'Internal struggles and contradictions', rows: 2, maxLength: 300 },
      { key: 'obstacles', label: 'External Obstacles', type: 'textarea', category: 'detailed', placeholder: 'External challenges they face', rows: 2, maxLength: 300 },
      { key: 'storyFunction', label: 'Story Function', type: 'textarea', category: 'detailed', placeholder: 'Their role in advancing the plot', rows: 2, maxLength: 300 }
    ]
  }
];

// AI suggestion prompts for different field types
const AI_SUGGESTION_PROMPTS = {
  name: (data: Partial<Character>) => `Suggest character names for a ${data.race || 'character'} ${data.class || ''} in a ${data.genre || 'fantasy'} setting`,
  race: (data: Partial<Character>) => `Suggest fantasy races that would work well for a character with the role: ${data.role || 'protagonist'}`,
  class: (data: Partial<Character>) => `Suggest character classes/professions for a ${data.race || 'character'} who is a ${data.role || 'protagonist'}`,
  personality: (data: Partial<Character>) => `Generate personality description for a ${data.race || 'character'} ${data.class || ''} who is a ${data.role || 'protagonist'}`,
  personalityTraits: (data: Partial<Character>) => `List personality traits for a ${data.role || 'protagonist'} character with ${data.personality ? 'personality: ' + data.personality : 'no specific personality defined'}`,
  motivations: (data: Partial<Character>) => `What would motivate a ${data.race || 'character'} ${data.class || ''} with traits: ${Array.isArray(data.personalityTraits) ? data.personalityTraits.join(', ') : data.personalityTraits || 'undefined'}`,
  background: (data: Partial<Character>) => `Create background story for a ${data.race || 'character'} ${data.class || ''} who is motivated by: ${data.motivations || 'undefined goals'}`,
  abilities: (data: Partial<Character>) => `Suggest abilities for a ${data.race || 'character'} ${data.class || ''} in a ${data.genre || 'fantasy'} setting`,
  skills: (data: Partial<Character>) => `List skills that a ${data.class || 'character'} would need based on their background: ${data.background?.slice(0, 100) || 'undefined background'}`
};

export function CharacterCreationWizardV2({ isOpen, onClose, projectId, onComplete, onTemplatesClick }: CharacterCreationWizardV2Props) {
  const [mode, setMode] = useState<WizardMode>('selection');
  const [activeTab, setActiveTab] = useState<ActiveTab>('core');
  const [formData, setFormData] = useState<Partial<Character>>({
    id: nanoid(),
    projectId,
    tags: []
  });
  const [completedSections, setCompletedSections] = useState<Set<ActiveTab>>(new Set());
  const [expandedFields, setExpandedFields] = useState<Set<string>>(new Set());
  const [isAutoSaving, setIsAutoSaving] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState<Record<string, string[]>>({});
  const [loadingSuggestions, setLoadingSuggestions] = useState<Set<string>>(new Set());
  const [isAIGenerationOpen, setIsAIGenerationOpen] = useState(false);
  
  const autoSaveTimeoutRef = useRef<NodeJS.Timeout>();
  const queryClient = useQueryClient();

  // Calculate overall completion percentage
  const completionPercentage = useMemo(() => {
    const totalWeight = FIELD_CATEGORIES.reduce((sum, cat) => sum + cat.completionWeight, 0);
    const completedWeight = Array.from(completedSections).reduce((sum, sectionId) => {
      const category = FIELD_CATEGORIES.find(cat => cat.id === sectionId);
      return sum + (category?.completionWeight || 0);
    }, 0);
    return Math.round((completedWeight / totalWeight) * 100);
  }, [completedSections]);

  // Auto-save functionality with debouncing
  const debouncedSave = useCallback(
    debounce((data: Partial<Character>) => {
      const draft: CharacterDraft = {
        mode,
        data,
        progress: completionPercentage,
        completedSections,
        lastSaved: new Date(),
        aiSuggestions
      };
      
      setIsAutoSaving(true);
      localStorage.setItem(`character-draft-v2-${projectId}`, JSON.stringify(draft));
      
      setTimeout(() => setIsAutoSaving(false), 1000);
    }, 2000),
    [mode, completionPercentage, completedSections, aiSuggestions, projectId]
  );

  // Update form data and trigger auto-save
  const updateField = useCallback((key: keyof Character, value: any) => {
    const newData = { ...formData, [key]: value };
    setFormData(newData);
    debouncedSave(newData);
  }, [formData, debouncedSave]);

  // Load draft on mount
  useEffect(() => {
    if (isOpen && projectId) {
      const savedDraft = localStorage.getItem(`character-draft-v2-${projectId}`);
      if (savedDraft) {
        try {
          const draft: CharacterDraft = JSON.parse(savedDraft);
          setFormData(draft.data);
          setMode(draft.mode);
          setCompletedSections(new Set(draft.completedSections));
          setAiSuggestions(draft.aiSuggestions || {});
        } catch (error) {
          console.error('Failed to load character draft:', error);
        }
      }
    }
  }, [isOpen, projectId]);

  // AI suggestion generation
  const generateAISuggestions = useCallback(async (fieldKey: keyof Character) => {
    if (loadingSuggestions.has(fieldKey)) return;
    
    setLoadingSuggestions(prev => new Set(prev).add(fieldKey));
    
    try {
      const prompt = AI_SUGGESTION_PROMPTS[fieldKey as keyof typeof AI_SUGGESTION_PROMPTS]?.(formData);
      if (!prompt) return;

      // Mock AI call - replace with actual AI service
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const mockSuggestions = {
        name: ['Aria Nightwhisper', 'Thorin Ironforge', 'Lyra Starweaver', 'Kael Shadowbane'],
        race: ['Elf', 'Human', 'Dwarf', 'Tiefling', 'Dragonborn'],
        class: ['Wizard', 'Rogue', 'Paladin', 'Ranger', 'Bard'],
        personality: ['A stoic warrior haunted by past failures', 'A cheerful optimist hiding deep trauma', 'A brilliant strategist with trust issues'],
        personalityTraits: ['brave', 'intelligent', 'stubborn', 'compassionate', 'analytical', 'impulsive'],
        motivations: ['Seek redemption for past mistakes', 'Protect family at all costs', 'Uncover ancient mysteries'],
        background: ['Raised in nobility but chose a different path', 'Former soldier turned scholar', 'Street orphan who discovered magical abilities'],
        abilities: ['Enhanced senses', 'Elemental magic', 'Supernatural strength', 'Telepathic communication'],
        skills: ['Swordsmanship', 'Diplomacy', 'Stealth', 'Arcane knowledge', 'Healing arts']
      };
      
      const suggestions = mockSuggestions[fieldKey as keyof typeof mockSuggestions] || [];
      setAiSuggestions(prev => ({ ...prev, [fieldKey]: suggestions }));
    } catch (error) {
      console.error('Failed to generate AI suggestions:', error);
    } finally {
      setLoadingSuggestions(prev => {
        const newSet = new Set(prev);
        newSet.delete(fieldKey);
        return newSet;
      });
    }
  }, [formData, loadingSuggestions]);

  // Check if a section is complete
  const isSectionComplete = useCallback((categoryId: ActiveTab) => {
    const category = FIELD_CATEGORIES.find(cat => cat.id === categoryId);
    if (!category) return false;
    
    const essentialFields = category.fields.filter(field => field.category === 'essential');
    const importantFields = category.fields.filter(field => field.category === 'important');
    
    const essentialComplete = essentialFields.every(field => {
      const value = formData[field.key];
      return value && value.toString().trim() !== '';
    });
    
    const importantComplete = importantFields.length === 0 || 
      importantFields.some(field => {
        const value = formData[field.key];
        return value && value.toString().trim() !== '';
      });
    
    return essentialComplete && importantComplete;
  }, [formData]);

  // Update completed sections when form data changes
  useEffect(() => {
    const newCompletedSections = new Set<ActiveTab>();
    FIELD_CATEGORIES.forEach(category => {
      if (isSectionComplete(category.id)) {
        newCompletedSections.add(category.id);
      }
    });
    setCompletedSections(newCompletedSections);
  }, [formData, isSectionComplete]);

  // Save character mutation
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
      localStorage.removeItem(`character-draft-v2-${projectId}`);
      onComplete?.(newCharacter);
      onClose();
    },
  });

  const handleSave = () => {
    saveMutation.mutate(formData);
  };

  const clearDraft = () => {
    localStorage.removeItem(`character-draft-v2-${projectId}`);
    setFormData({ id: nanoid(), projectId, tags: [] });
    setCompletedSections(new Set());
    setAiSuggestions({});
  };

  // Render different field types
  const renderField = (field: FieldConfig) => {
    const value = formData[field.key] || '';
    const hasAISuggestions = aiSuggestions[field.key] && aiSuggestions[field.key].length > 0;
    const isLoadingSuggestion = loadingSuggestions.has(field.key);

    return (
      <div key={field.key} className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor={field.key} className="text-sm font-medium flex items-center gap-2">
            {field.label}
            {field.category === 'essential' && <Badge variant="secondary" className="text-xs">Required</Badge>}
            {field.category === 'important' && <Badge variant="outline" className="text-xs">Important</Badge>}
          </Label>
          
          {field.aiSuggestionTrigger && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => generateAISuggestions(field.key)}
              disabled={isLoadingSuggestion}
              className="h-6 px-2 text-xs"
            >
              {isLoadingSuggestion ? (
                <div className="w-3 h-3 border border-accent border-t-transparent rounded-full animate-spin" />
              ) : (
                <Wand2 className="w-3 h-3" />
              )}
              AI
            </Button>
          )}
        </div>
        
        {field.description && (
          <p className="text-xs text-muted-foreground">{field.description}</p>
        )}

        {/* AI Suggestions */}
        {hasAISuggestions && (
          <div className="p-2 bg-accent/10 border border-accent/20 rounded-md">
            <p className="text-xs text-accent font-medium mb-1">AI Suggestions:</p>
            <div className="flex flex-wrap gap-1">
              {aiSuggestions[field.key].map((suggestion, idx) => (
                <Button
                  key={idx}
                  variant="outline"
                  size="sm"
                  className="h-6 px-2 text-xs"
                  onClick={() => {
                    if (field.type === 'tags') {
                      const currentTags = Array.isArray(value) ? value : 
                        typeof value === 'string' ? value.split(',').map(s => s.trim()).filter(Boolean) : [];
                      if (!currentTags.includes(suggestion)) {
                        updateField(field.key, [...currentTags, suggestion].join(', '));
                      }
                    } else {
                      updateField(field.key, suggestion);
                    }
                  }}
                >
                  {suggestion}
                </Button>
              ))}
            </div>
          </div>
        )}

        {/* Field Input */}
        {field.type === 'text' && (
          <Input
            id={field.key}
            value={value}
            onChange={(e) => updateField(field.key, e.target.value)}
            placeholder={field.placeholder}
            maxLength={field.maxLength}
            className="bg-background/50 border-border/20 focus:border-accent/50"
          />
        )}

        {field.type === 'textarea' && (
          <Textarea
            id={field.key}
            value={value}
            onChange={(e) => updateField(field.key, e.target.value)}
            placeholder={field.placeholder}
            rows={field.rows || 3}
            maxLength={field.maxLength}
            className="bg-background/50 border-border/20 focus:border-accent/50 resize-none"
          />
        )}

        {field.type === 'select' && (
          <Select value={value} onValueChange={(val) => updateField(field.key, val)}>
            <SelectTrigger className="bg-background/50 border-border/20">
              <SelectValue placeholder="Select an option" />
            </SelectTrigger>
            <SelectContent>
              {field.options?.map(option => (
                <SelectItem key={option} value={option}>{option}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}

        {(field.type === 'array' || field.type === 'tags') && (
          <Input
            id={field.key}
            value={Array.isArray(value) ? value.join(', ') : value}
            onChange={(e) => updateField(field.key, e.target.value)}
            placeholder={field.placeholder}
            className="bg-background/50 border-border/20 focus:border-accent/50"
          />
        )}

        {field.maxLength && (
          <p className="text-xs text-muted-foreground text-right">
            {value.toString().length} / {field.maxLength}
          </p>
        )}
      </div>
    );
  };

  if (mode === 'selection') {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-5xl max-h-[90vh] overflow-hidden p-0 bg-gradient-to-br from-background via-background to-muted/20">
          <div className="p-8">
            <DialogHeader className="border-b border-border/10 pb-6 mb-6">
              <DialogTitle className="text-2xl font-bold text-foreground flex items-center gap-3">
                <Crown className="h-6 w-6 text-accent" />
                Create New Character
              </DialogTitle>
              <p className="text-muted-foreground mt-2">
                Choose your creation method. Our advanced wizard retains all 164+ character fields with intelligent progressive disclosure.
              </p>
            </DialogHeader>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <Card className="group cursor-pointer transition-all duration-200 hover:shadow-lg border-2 border-accent/20 hover:border-accent/50 bg-card/30 hover:bg-card/50"
                   onClick={() => setMode('guided')}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <Plus className="h-5 w-5 text-accent" />
                    Smart Guided Creation
                    <Badge className="bg-accent/15 text-accent">Recommended</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    Intelligent progressive disclosure system that reveals relevant fields based on your character type. Complete creative control with smart organization.
                  </p>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="h-3 w-3 text-green-500" />
                      164+ character fields
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="h-3 w-3 text-green-500" />
                      AI-powered suggestions
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="h-3 w-3 text-green-500" />
                      Auto-save & draft recovery
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="h-3 w-3 text-green-500" />
                      Visual progress tracking
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="group cursor-pointer transition-all duration-200 hover:shadow-lg border border-border/20 hover:border-accent/30 bg-card/30 hover:bg-card/50"
                   onClick={onTemplatesClick}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <FileText className="h-5 w-5 text-accent" />
                    AI-Enhanced Templates
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    Professional character archetypes with AI expansion. Perfect starting points that maintain full field access.
                  </p>
                  <div className="text-xs text-muted-foreground">
                    <Clock className="h-3 w-3 inline mr-1" />
                    5-10 minutes • 20+ archetypes
                  </div>
                </CardContent>
              </Card>

              <Card className="group cursor-pointer transition-all duration-200 hover:shadow-lg border-2 border-purple-500/20 hover:border-purple-500/50 bg-gradient-to-br from-purple-500/5 to-pink-500/5 hover:from-purple-500/10 hover:to-pink-500/10"
                   onClick={() => setIsAIGenerationOpen(true)}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <Sparkles className="h-5 w-5 text-purple-500" />
                    AI Character Creator
                    <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">Popular</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    Describe your character in natural language and let AI create a complete profile with portrait. Instant, intelligent, and comprehensive.
                  </p>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="h-3 w-3 text-green-500" />
                      AI-generated portrait
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="h-3 w-3 text-green-500" />
                      Complete character data
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="h-3 w-3 text-green-500" />
                      Natural language input
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="h-3 w-3 text-green-500" />
                      2-3 minutes
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Continue from draft */}
            {localStorage.getItem(`character-draft-v2-${projectId}`) && (
              <div className="mt-6 p-4 bg-accent/10 border border-accent/20 rounded-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Save className="h-5 w-5 text-accent" />
                    <div>
                      <h4 className="font-semibold">Continue Previous Character</h4>
                      <p className="text-sm text-muted-foreground">Found saved progress</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={clearDraft}>
                      Start Fresh
                    </Button>
                    <Button size="sm" onClick={() => setMode('guided')}>
                      Continue
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl h-[90vh] p-0 gap-0">
        <DialogHeader className="border-b border-border/30 p-6 pb-4 bg-muted/30">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="sm" onClick={() => setMode('selection')}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <div>
                <DialogTitle className="text-xl font-bold">Smart Character Creation</DialogTitle>
                <p className="text-sm text-muted-foreground">
                  {formData.name || 'New Character'} • {completionPercentage}% Complete
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              {isAutoSaving && (
                <div className="flex items-center gap-2 text-xs text-accent">
                  <div className="w-3 h-3 border-2 border-accent border-t-transparent rounded-full animate-spin" />
                  Auto-saving...
                </div>
              )}
              <Button variant="outline" onClick={onClose}>Cancel</Button>
              <Button onClick={handleSave} disabled={saveMutation.isPending || completionPercentage < 25}>
                {saveMutation.isPending ? 'Saving...' : 'Create Character'}
              </Button>
            </div>
          </div>
          
          <div className="mt-4">
            <Progress value={completionPercentage} className="h-2" />
          </div>
        </DialogHeader>

        <div className="flex flex-1 overflow-hidden">
          {/* Navigation Sidebar */}
          <div className="w-80 border-r border-border/30 bg-muted/20 p-4 overflow-y-auto flex-shrink-0">
            <div className="space-y-2">
              {FIELD_CATEGORIES.map((category) => {
                const isComplete = completedSections.has(category.id);
                const isActive = activeTab === category.id;
                const Icon = category.icon;
                
                return (
                  <Button
                    key={category.id}
                    variant={isActive ? "default" : "ghost"}
                    className={`w-full justify-start h-auto p-4 ${isActive ? 'bg-accent text-accent-foreground' : 'hover:bg-muted/50'}`}
                    onClick={() => setActiveTab(category.id)}
                  >
                    <div className="flex items-start gap-3 w-full">
                      <div className="flex items-center gap-2 mt-0.5">
                        <Icon className="h-4 w-4" />
                        {isComplete ? (
                          <CheckCircle2 className="h-3 w-3 text-green-500" />
                        ) : (
                          <Circle className="h-3 w-3 text-muted-foreground" />
                        )}
                      </div>
                      <div className="flex-1 text-left min-w-0">
                        <div className="font-semibold text-sm leading-tight mb-1">{category.title}</div>
                        <div className="text-xs text-muted-foreground leading-relaxed mb-1 line-clamp-2">
                          {category.description}
                        </div>
                        <div className="text-xs text-muted-foreground font-medium">
                          {category.estimatedTime}
                        </div>
                      </div>
                    </div>
                  </Button>
                );
              })}
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 overflow-hidden">
            <ScrollArea className="h-full">
              <div className="p-6">
                {FIELD_CATEGORIES.map((category) => {
                  if (activeTab !== category.id) return null;
                  
                  const Icon = category.icon;
                  const essentialFields = category.fields.filter(f => f.category === 'essential');
                  const importantFields = category.fields.filter(f => f.category === 'important');
                  const detailedFields = category.fields.filter(f => f.category === 'detailed');
                  const optionalFields = category.fields.filter(f => f.category === 'optional');
                  
                  return (
                    <div key={category.id} className="space-y-6">
                      <div className="flex items-center gap-3 mb-6">
                        <Icon className="h-6 w-6 text-accent" />
                        <div>
                          <h2 className="text-2xl font-bold">{category.title}</h2>
                          <p className="text-muted-foreground">{category.description}</p>
                        </div>
                      </div>

                      {/* Essential Fields */}
                      {essentialFields.length > 0 && (
                        <Card>
                          <CardHeader className="pb-3">
                            <CardTitle className="text-lg flex items-center gap-2">
                              <Star className="h-4 w-4 text-red-500" />
                              Essential Information
                            </CardTitle>
                            <p className="text-sm text-muted-foreground">
                              Core information needed for this character
                            </p>
                          </CardHeader>
                          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {essentialFields.map(renderField)}
                          </CardContent>
                        </Card>
                      )}

                      {/* Important Fields */}
                      {importantFields.length > 0 && (
                        <Card>
                          <CardHeader className="pb-3">
                            <CardTitle className="text-lg flex items-center gap-2">
                              <AlertCircle className="h-4 w-4 text-orange-500" />
                              Important Details
                            </CardTitle>
                            <p className="text-sm text-muted-foreground">
                              Recommended information that adds depth
                            </p>
                          </CardHeader>
                          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {importantFields.map(renderField)}
                          </CardContent>
                        </Card>
                      )}

                      {/* Detailed Fields (Collapsible) */}
                      {detailedFields.length > 0 && (
                        <Card>
                          <CardHeader 
                            className="cursor-pointer hover:bg-muted/50 transition-colors pb-3"
                            onClick={() => {
                              const newExpanded = new Set(expandedFields);
                              if (expandedFields.has(`${category.id}-detailed`)) {
                                newExpanded.delete(`${category.id}-detailed`);
                              } else {
                                newExpanded.add(`${category.id}-detailed`);
                              }
                              setExpandedFields(newExpanded);
                            }}
                          >
                            <CardTitle className="text-lg flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <Info className="h-4 w-4 text-blue-500" />
                                Detailed Information
                              </div>
                              {expandedFields.has(`${category.id}-detailed`) ? (
                                <ChevronUp className="h-4 w-4" />
                              ) : (
                                <ChevronDown className="h-4 w-4" />
                              )}
                            </CardTitle>
                            <p className="text-sm text-muted-foreground">
                              Additional details for enhanced characterization
                            </p>
                          </CardHeader>
                          {expandedFields.has(`${category.id}-detailed`) && (
                            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              {detailedFields.map(renderField)}
                            </CardContent>
                          )}
                        </Card>
                      )}
                    </div>
                  );
                })}
              </div>
            </ScrollArea>
          </div>
        </div>
      </DialogContent>
    </Dialog>

    {/* AI Character Generation Modal */}
    {isAIGenerationOpen && (
      <CharacterGenerationModal
        isOpen={isAIGenerationOpen}
        onClose={() => setIsAIGenerationOpen(false)}
        projectId={projectId}
        onBack={() => setIsAIGenerationOpen(false)}
      />
    )}
  </>
  );
}