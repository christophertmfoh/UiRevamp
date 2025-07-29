import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { 
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue 
} from '@/components/ui/select';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { 
  Plus, FileText, Sparkles, Upload, ArrowRight, ChevronLeft, Save, Info, Star, Clock,
  User, Eye, Brain, Zap, BookOpen, Users, PenTool, Shield, Heart, Map, Crown,
  ChevronDown, ChevronUp, AlertCircle, CheckCircle2, Circle, Lightbulb, Wand2,
  MapPin, Castle, Flag, TreePine, Globe, Mountain, Building, Compass
} from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { nanoid } from 'nanoid';
import { debounce } from 'lodash-es';

// Entity Types Configuration
export type EntityType = 'character' | 'location' | 'faction' | 'culture' | 'organization' | 'item' | 'creature' | 'event';

export interface UniversalField {
  key: string;
  label: string;
  type: 'text' | 'textarea' | 'select' | 'array' | 'tags' | 'number' | 'date';
  category: 'essential' | 'important' | 'detailed' | 'optional';
  placeholder?: string;
  description?: string;
  options?: string[];
  aiSuggestionTrigger?: boolean;
  relatedFields?: string[];
  maxLength?: number;
  rows?: number;
  validation?: (value: any) => string | null;
}

export interface UniversalFieldCategory {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  fields: UniversalField[];
  estimatedTime: string;
  completionWeight: number;
  showForEntityTypes?: EntityType[];
  hideForEntityTypes?: EntityType[];
}

export interface EntityTemplate {
  id: string;
  name: string;
  description: string;
  entityType: EntityType;
  category: string;
  icon: React.ComponentType<any>;
  fields: Record<string, any>;
  tags: string[];
  popularity: number;
}

export interface UniversalEntityCreationSystemProps {
  isOpen: boolean;
  onClose: () => void;
  projectId: string;
  entityType: EntityType;
  onComplete?: (entity: any) => void;
  initialData?: Partial<any>;
  templates?: EntityTemplate[];
}

type CreationMode = 'selection' | 'guided' | 'templates' | 'ai-generation' | 'upload';

interface EntityDraft {
  mode: CreationMode;
  data: Record<string, any>;
  progress: number;
  completedSections: Set<string>;
  lastSaved: Date;
  aiSuggestions: Record<string, string[]>;
  entityType: EntityType;
}

// Universal Entity Configuration
const ENTITY_CONFIGS: Record<EntityType, {
  displayName: string;
  icon: React.ComponentType<{ className?: string }>;
  apiEndpoint: string;
  categories: UniversalFieldCategory[];
}> = {
  character: {
    displayName: 'Character',
    icon: User,
    apiEndpoint: 'characters',
    categories: [
      {
        id: 'core',
        title: 'Core Identity',
        description: 'Essential character information',
        icon: User,
        estimatedTime: '2-3 min',
        completionWeight: 0.3,
        fields: [
          { key: 'name', label: 'Full Name', type: 'text', category: 'essential', placeholder: 'Enter character\'s full name', aiSuggestionTrigger: true, maxLength: 100 },
          { key: 'age', label: 'Age', type: 'text', category: 'essential', placeholder: '25 or "appears mid-twenties"', maxLength: 50 },
          { key: 'race', label: 'Race/Species', type: 'text', category: 'essential', placeholder: 'Human, Elf, Dwarf, etc.', aiSuggestionTrigger: true },
          { key: 'role', label: 'Story Role', type: 'select', category: 'essential', 
            options: ['Protagonist', 'Antagonist', 'Supporting Character', 'Mentor', 'Love Interest', 'Rival'] }
        ]
      },
      {
        id: 'personality',
        title: 'Personality',
        description: 'Character traits and psychology',
        icon: Brain,
        estimatedTime: '4-6 min',
        completionWeight: 0.4,
        fields: [
          { key: 'personality', label: 'Personality Overview', type: 'textarea', category: 'essential', placeholder: 'Core personality description', rows: 4, aiSuggestionTrigger: true },
          { key: 'personalityTraits', label: 'Key Traits', type: 'tags', category: 'essential', placeholder: 'brave, witty, stubborn', aiSuggestionTrigger: true },
          { key: 'motivations', label: 'Motivations', type: 'textarea', category: 'essential', placeholder: 'What drives them?', rows: 3 }
        ]
      }
    ]
  },
  location: {
    displayName: 'Location',
    icon: MapPin,
    apiEndpoint: 'locations',
    categories: [
      {
        id: 'core',
        title: 'Core Information',
        description: 'Essential location details',
        icon: MapPin,
        estimatedTime: '2-3 min',
        completionWeight: 0.3,
        fields: [
          { key: 'name', label: 'Location Name', type: 'text', category: 'essential', placeholder: 'Enter location name', aiSuggestionTrigger: true, maxLength: 100 },
          { key: 'type', label: 'Location Type', type: 'select', category: 'essential',
            options: ['City', 'Town', 'Village', 'Castle', 'Fortress', 'Temple', 'Forest', 'Mountain', 'Desert', 'Ocean', 'Lake', 'Cave', 'Ruins', 'Dungeon'] },
          { key: 'size', label: 'Size Scale', type: 'select', category: 'important',
            options: ['Tiny', 'Small', 'Medium', 'Large', 'Massive', 'Continental'] },
          { key: 'population', label: 'Population', type: 'text', category: 'important', placeholder: 'Approximate population or "uninhabited"' }
        ]
      },
      {
        id: 'description',
        title: 'Description & Atmosphere',
        description: 'Physical appearance and feeling',
        icon: Eye,
        estimatedTime: '3-4 min',
        completionWeight: 0.4,
        fields: [
          { key: 'description', label: 'General Description', type: 'textarea', category: 'essential', placeholder: 'Describe the location\'s appearance', rows: 4, aiSuggestionTrigger: true },
          { key: 'atmosphere', label: 'Atmosphere & Mood', type: 'textarea', category: 'important', placeholder: 'How does this place feel?', rows: 3 },
          { key: 'climate', label: 'Climate', type: 'text', category: 'detailed', placeholder: 'Weather patterns and seasons' },
          { key: 'geography', label: 'Geography', type: 'textarea', category: 'detailed', placeholder: 'Terrain, landmarks, natural features', rows: 2 }
        ]
      },
      {
        id: 'culture',
        title: 'Culture & Society',
        description: 'Social aspects and inhabitants',
        icon: Users,
        estimatedTime: '3-4 min',
        completionWeight: 0.3,
        fields: [
          { key: 'culture', label: 'Local Culture', type: 'textarea', category: 'important', placeholder: 'Cultural practices and traditions', rows: 3 },
          { key: 'government', label: 'Government/Leadership', type: 'text', category: 'detailed', placeholder: 'How is this place governed?' },
          { key: 'economy', label: 'Economy & Trade', type: 'textarea', category: 'detailed', placeholder: 'Economic activities and trade', rows: 2 },
          { key: 'notableNPCs', label: 'Notable NPCs', type: 'tags', category: 'detailed', placeholder: 'Important people in this location' }
        ]
      }
    ]
  },
  faction: {
    displayName: 'Faction',
    icon: Flag,
    apiEndpoint: 'factions',
    categories: [
      {
        id: 'core',
        title: 'Core Information',
        description: 'Essential faction details',
        icon: Flag,
        estimatedTime: '2-3 min',
        completionWeight: 0.3,
        fields: [
          { key: 'name', label: 'Faction Name', type: 'text', category: 'essential', placeholder: 'Enter faction name', aiSuggestionTrigger: true, maxLength: 100 },
          { key: 'type', label: 'Faction Type', type: 'select', category: 'essential',
            options: ['Military', 'Religious', 'Political', 'Criminal', 'Merchant', 'Academic', 'Secret Society', 'Noble House', 'Guild', 'Tribe'] },
          { key: 'size', label: 'Size', type: 'select', category: 'important',
            options: ['Tiny (5-20)', 'Small (20-100)', 'Medium (100-500)', 'Large (500-2000)', 'Massive (2000+)', 'Unknown'] },
          { key: 'alignment', label: 'Moral Alignment', type: 'select', category: 'important',
            options: ['Lawful Good', 'Neutral Good', 'Chaotic Good', 'Lawful Neutral', 'True Neutral', 'Chaotic Neutral', 'Lawful Evil', 'Neutral Evil', 'Chaotic Evil'] }
        ]
      },
      {
        id: 'purpose',
        title: 'Purpose & Goals',
        description: 'What this faction aims to achieve',
        icon: Zap,
        estimatedTime: '3-4 min',
        completionWeight: 0.4,
        fields: [
          { key: 'goals', label: 'Primary Goals', type: 'textarea', category: 'essential', placeholder: 'What does this faction want to achieve?', rows: 3, aiSuggestionTrigger: true },
          { key: 'methods', label: 'Methods & Tactics', type: 'textarea', category: 'important', placeholder: 'How do they pursue their goals?', rows: 3 },
          { key: 'beliefs', label: 'Core Beliefs', type: 'textarea', category: 'important', placeholder: 'What principles guide them?', rows: 2 },
          { key: 'motto', label: 'Motto/Slogan', type: 'text', category: 'detailed', placeholder: 'Their rallying cry or motto' }
        ]
      },
      {
        id: 'structure',
        title: 'Structure & Relationships',
        description: 'Organization and external relations',
        icon: Users,
        estimatedTime: '3-4 min',
        completionWeight: 0.3,
        fields: [
          { key: 'leadership', label: 'Leadership Structure', type: 'textarea', category: 'important', placeholder: 'How is the faction organized?', rows: 2 },
          { key: 'allies', label: 'Allies', type: 'tags', category: 'detailed', placeholder: 'Friendly factions or groups' },
          { key: 'enemies', label: 'Enemies', type: 'tags', category: 'detailed', placeholder: 'Opposing factions or groups' },
          { key: 'resources', label: 'Resources & Assets', type: 'textarea', category: 'detailed', placeholder: 'What resources do they control?', rows: 2 }
        ]
      }
    ]
  },
  culture: {
    displayName: 'Culture',
    icon: Globe,
    apiEndpoint: 'cultures',
    categories: [
      {
        id: 'core',
        title: 'Core Information',
        description: 'Essential cultural details',
        icon: Globe,
        estimatedTime: '2-3 min',
        completionWeight: 0.25,
        fields: [
          { key: 'name', label: 'Culture Name', type: 'text', category: 'essential', placeholder: 'Enter culture name', aiSuggestionTrigger: true, maxLength: 100 },
          { key: 'origin', label: 'Origin', type: 'text', category: 'important', placeholder: 'Where did this culture originate?', maxLength: 200 },
          { key: 'language', label: 'Primary Language', type: 'text', category: 'important', placeholder: 'Main language spoken' },
          { key: 'population', label: 'Population Size', type: 'select', category: 'detailed',
            options: ['Small Tribe (50-500)', 'Large Tribe (500-5000)', 'Regional (5K-50K)', 'National (50K-1M)', 'Imperial (1M+)', 'Diaspora'] }
        ]
      }
    ]
  },
  organization: {
    displayName: 'Organization',
    icon: Building,
    apiEndpoint: 'organizations',
    categories: [
      {
        id: 'core',
        title: 'Core Information',
        description: 'Essential organization details',
        icon: Building,
        estimatedTime: '2-3 min',
        completionWeight: 0.3,
        fields: [
          { key: 'name', label: 'Organization Name', type: 'text', category: 'essential', placeholder: 'Enter organization name', aiSuggestionTrigger: true, maxLength: 100 },
          { key: 'type', label: 'Organization Type', type: 'select', category: 'essential',
            options: ['Corporation', 'Non-Profit', 'Government Agency', 'Educational', 'Religious', 'Military', 'Research', 'Entertainment', 'Healthcare'] },
          { key: 'founded', label: 'Founded', type: 'text', category: 'detailed', placeholder: 'When was it established?' },
          { key: 'headquarters', label: 'Headquarters', type: 'text', category: 'important', placeholder: 'Main location or base' }
        ]
      }
    ]
  },
  item: {
    displayName: 'Item',
    icon: Crown,
    apiEndpoint: 'items',
    categories: [
      {
        id: 'core',
        title: 'Core Information',
        description: 'Essential item details',
        icon: Crown,
        estimatedTime: '2-3 min',
        completionWeight: 0.4,
        fields: [
          { key: 'name', label: 'Item Name', type: 'text', category: 'essential', placeholder: 'Enter item name', aiSuggestionTrigger: true, maxLength: 100 },
          { key: 'type', label: 'Item Type', type: 'select', category: 'essential',
            options: ['Weapon', 'Armor', 'Tool', 'Artifact', 'Consumable', 'Jewelry', 'Document', 'Container', 'Vehicle', 'Currency'] },
          { key: 'rarity', label: 'Rarity', type: 'select', category: 'important',
            options: ['Common', 'Uncommon', 'Rare', 'Very Rare', 'Legendary', 'Artifact', 'Unique'] },
          { key: 'value', label: 'Estimated Value', type: 'text', category: 'detailed', placeholder: 'Market value or worth' }
        ]
      }
    ]
  },
  creature: {
    displayName: 'Creature',
    icon: TreePine,
    apiEndpoint: 'creatures',
    categories: [
      {
        id: 'core',
        title: 'Core Information',
        description: 'Essential creature details',
        icon: TreePine,
        estimatedTime: '2-3 min',
        completionWeight: 0.3,
        fields: [
          { key: 'name', label: 'Creature Name', type: 'text', category: 'essential', placeholder: 'Enter creature name', aiSuggestionTrigger: true, maxLength: 100 },
          { key: 'species', label: 'Species/Type', type: 'text', category: 'essential', placeholder: 'Dragon, Wolf, Unicorn, etc.', aiSuggestionTrigger: true },
          { key: 'size', label: 'Size Category', type: 'select', category: 'important',
            options: ['Tiny', 'Small', 'Medium', 'Large', 'Huge', 'Gargantuan'] },
          { key: 'intelligence', label: 'Intelligence Level', type: 'select', category: 'important',
            options: ['Mindless', 'Animal', 'Low', 'Average', 'High', 'Genius', 'Cosmic'] }
        ]
      }
    ]
  },
  event: {
    displayName: 'Event',
    icon: Clock,
    apiEndpoint: 'events',
    categories: [
      {
        id: 'core',
        title: 'Core Information',
        description: 'Essential event details',
        icon: Clock,
        estimatedTime: '2-3 min',
        completionWeight: 0.4,
        fields: [
          { key: 'name', label: 'Event Name', type: 'text', category: 'essential', placeholder: 'Enter event name', aiSuggestionTrigger: true, maxLength: 100 },
          { key: 'type', label: 'Event Type', type: 'select', category: 'essential',
            options: ['Battle', 'Festival', 'Natural Disaster', 'Political', 'Religious', 'Discovery', 'Founding', 'Destruction', 'Meeting', 'Journey'] },
          { key: 'date', label: 'Date/Time Period', type: 'text', category: 'important', placeholder: 'When did this occur?' },
          { key: 'location', label: 'Location', type: 'text', category: 'important', placeholder: 'Where did this happen?' }
        ]
      }
    ]
  }
};

// AI suggestion prompts for different entity types
const AI_SUGGESTION_PROMPTS: Record<EntityType, Record<string, (data: any) => string>> = {
  character: {
    name: (data) => `Suggest character names for a ${data.race || 'character'} ${data.class || ''} in a fantasy setting`,
    race: (data) => `Suggest fantasy races that would work well for a character with the role: ${data.role || 'protagonist'}`,
    personality: (data) => `Generate personality description for a ${data.race || 'character'} who is a ${data.role || 'protagonist'}`,
    personalityTraits: (data) => `List personality traits for a ${data.role || 'protagonist'} character`
  },
  location: {
    name: (data) => `Suggest names for a ${data.type || 'location'} in a fantasy setting`,
    description: (data) => `Describe a ${data.type || 'location'} called ${data.name || 'this place'} with ${data.size || 'medium'} size`,
    atmosphere: (data) => `What atmosphere and mood would a ${data.type || 'location'} have?`
  },
  faction: {
    name: (data) => `Suggest names for a ${data.type || 'faction'} organization`,
    goals: (data) => `What goals would a ${data.type || 'faction'} with ${data.alignment || 'neutral'} alignment pursue?`,
    methods: (data) => `How would a ${data.type || 'faction'} pursue their goals: ${data.goals?.slice(0, 100) || 'power and influence'}`
  },
  culture: {
    name: (data) => `Suggest names for a culture that originated in ${data.origin || 'unknown lands'}`
  },
  organization: {
    name: (data) => `Suggest names for a ${data.type || 'organization'}`
  },
  item: {
    name: (data) => `Suggest names for a ${data.rarity || 'common'} ${data.type || 'item'}`
  },
  creature: {
    name: (data) => `Suggest names for a ${data.size || 'medium'} ${data.species || 'creature'} with ${data.intelligence || 'average'} intelligence`,
    species: (data) => `Suggest creature types for a ${data.size || 'medium'} sized being`
  },
  event: {
    name: (data) => `Suggest names for a ${data.type || 'historical'} event that took place in ${data.location || 'a fantasy world'}`
  }
};

export function UniversalEntityCreationSystem({
  isOpen,
  onClose,
  projectId,
  entityType,
  onComplete,
  initialData = {},
  templates = []
}: UniversalEntityCreationSystemProps) {
  const entityConfig = ENTITY_CONFIGS[entityType];
  const [mode, setMode] = useState<CreationMode>('selection');
  const [activeSection, setActiveSection] = useState<string>('');
  const [formData, setFormData] = useState<Record<string, any>>({
    id: nanoid(),
    projectId,
    entityType,
    ...initialData
  });
  const [completedSections, setCompletedSections] = useState<Set<string>>(new Set());
  const [expandedFields, setExpandedFields] = useState<Set<string>>(new Set());
  const [isAutoSaving, setIsAutoSaving] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState<Record<string, string[]>>({});
  const [loadingSuggestions, setLoadingSuggestions] = useState<Set<string>>(new Set());

  const autoSaveTimeoutRef = useRef<NodeJS.Timeout>();
  const queryClient = useQueryClient();

  // Initialize active section
  useEffect(() => {
    if (entityConfig.categories.length > 0 && !activeSection) {
      setActiveSection(entityConfig.categories[0].id);
    }
  }, [entityConfig, activeSection]);

  // Calculate completion percentage
  const completionPercentage = useMemo(() => {
    const totalWeight = entityConfig.categories.reduce((sum, cat) => sum + cat.completionWeight, 0);
    const completedWeight = Array.from(completedSections).reduce((sum, sectionId) => {
      const category = entityConfig.categories.find(cat => cat.id === sectionId);
      return sum + (category?.completionWeight || 0);
    }, 0);
    return Math.round((completedWeight / totalWeight) * 100);
  }, [completedSections, entityConfig.categories]);

  // Auto-save functionality
  const debouncedSave = useCallback(
    debounce((data: Record<string, any>) => {
      const draft: EntityDraft = {
        mode,
        data,
        progress: completionPercentage,
        completedSections,
        lastSaved: new Date(),
        aiSuggestions,
        entityType
      };
      
      setIsAutoSaving(true);
      localStorage.setItem(`entity-draft-${entityType}-${projectId}`, JSON.stringify(draft));
      setTimeout(() => setIsAutoSaving(false), 1000);
    }, 2000),
    [mode, completionPercentage, completedSections, aiSuggestions, entityType, projectId]
  );

  // Update form data
  const updateField = useCallback((key: string, value: any) => {
    const newData = { ...formData, [key]: value };
    setFormData(newData);
    debouncedSave(newData);
  }, [formData, debouncedSave]);

  // Load draft on mount
  useEffect(() => {
    if (isOpen && projectId) {
      const savedDraft = localStorage.getItem(`entity-draft-${entityType}-${projectId}`);
      if (savedDraft) {
        try {
          const draft: EntityDraft = JSON.parse(savedDraft);
          if (draft.entityType === entityType) {
            setFormData(draft.data);
            setMode(draft.mode);
            setCompletedSections(new Set(draft.completedSections));
            setAiSuggestions(draft.aiSuggestions || {});
          }
        } catch (error) {
          console.error('Failed to load entity draft:', error);
        }
      }
    }
  }, [isOpen, projectId, entityType]);

  // AI suggestion generation
  const generateAISuggestions = useCallback(async (fieldKey: string) => {
    if (loadingSuggestions.has(fieldKey) || !AI_SUGGESTION_PROMPTS[entityType]) return;
    
    setLoadingSuggestions(prev => new Set(prev).add(fieldKey));
    
    try {
      const promptGenerator = AI_SUGGESTION_PROMPTS[entityType][fieldKey];
      if (!promptGenerator) return;

      const prompt = promptGenerator(formData);
      
      // Mock AI call - replace with actual AI service
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Mock suggestions based on entity type and field
      const mockSuggestions: Record<string, string[]> = {
        name: ['Ethereal Sanctum', 'Crimson Highlands', 'Whispering Grove', 'Shadowmere Keep'],
        description: ['A mystical place shrouded in ancient magic', 'Rolling hills covered in strange red grass', 'An ancient forest where secrets are whispered'],
        goals: ['Expand territorial control', 'Preserve ancient knowledge', 'Seek vengeance against enemies'],
        personality: ['Stoic and disciplined warrior', 'Cunning political manipulator', 'Wise but secretive scholar']
      };
      
      const suggestions = mockSuggestions[fieldKey] || [];
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
  }, [formData, loadingSuggestions, entityType]);

  // Check if section is complete
  const isSectionComplete = useCallback((categoryId: string) => {
    const category = entityConfig.categories.find(cat => cat.id === categoryId);
    if (!category) return false;
    
    const essentialFields = category.fields.filter(field => field.category === 'essential');
    return essentialFields.every(field => {
      const value = formData[field.key];
      return value && value.toString().trim() !== '';
    });
  }, [formData, entityConfig.categories]);

  // Update completed sections
  useEffect(() => {
    const newCompletedSections = new Set<string>();
    entityConfig.categories.forEach(category => {
      if (isSectionComplete(category.id)) {
        newCompletedSections.add(category.id);
      }
    });
    setCompletedSections(newCompletedSections);
  }, [formData, isSectionComplete, entityConfig.categories]);

  // Save entity mutation
  const saveMutation = useMutation({
    mutationFn: async (data: Record<string, any>) => {
      const response = await apiRequest({
        url: `/api/projects/${projectId}/${entityConfig.apiEndpoint}`,
        method: 'POST',
        data,
      });
      return response;
    },
    onSuccess: (newEntity) => {
      queryClient.invalidateQueries({ queryKey: [`/api/projects/${projectId}/${entityConfig.apiEndpoint}`] });
      localStorage.removeItem(`entity-draft-${entityType}-${projectId}`);
      onComplete?.(newEntity);
      onClose();
    },
  });

  const handleSave = () => {
    saveMutation.mutate(formData);
  };

  const clearDraft = () => {
    localStorage.removeItem(`entity-draft-${entityType}-${projectId}`);
    setFormData({ id: nanoid(), projectId, entityType });
    setCompletedSections(new Set());
    setAiSuggestions({});
  };

  // Render field input
  const renderField = (field: UniversalField) => {
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
                    if (field.type === 'tags' || field.type === 'array') {
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

        {field.type === 'number' && (
          <Input
            id={field.key}
            type="number"
            value={value}
            onChange={(e) => updateField(field.key, e.target.value)}
            placeholder={field.placeholder}
            className="bg-background/50 border-border/20 focus:border-accent/50"
          />
        )}

        {field.type === 'date' && (
          <Input
            id={field.key}
            type="date"
            value={value}
            onChange={(e) => updateField(field.key, e.target.value)}
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

  const EntityIcon = entityConfig.icon;

  if (mode === 'selection') {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-5xl max-h-[90vh] overflow-hidden p-0 bg-gradient-to-br from-background via-background to-muted/20">
          <div className="p-8">
            <DialogHeader className="border-b border-border/10 pb-6 mb-6">
              <DialogTitle className="text-2xl font-bold text-foreground flex items-center gap-3">
                <EntityIcon className="h-6 w-6 text-accent" />
                Create New {entityConfig.displayName}
              </DialogTitle>
              <p className="text-muted-foreground mt-2">
                Choose your creation method. Our universal system adapts to provide the most relevant fields for {entityConfig.displayName.toLowerCase()} creation.
              </p>
            </DialogHeader>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                    Intelligent field organization with progressive disclosure. All fields retained with smart categorization for {entityConfig.displayName.toLowerCase()}s.
                  </p>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="h-3 w-3 text-green-500" />
                      Smart field organization
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
                      Progress tracking
                    </div>
                  </div>
                </CardContent>
              </Card>

              {templates.length > 0 && (
                <Card className="group cursor-pointer transition-all duration-200 hover:shadow-lg border border-border/20 hover:border-accent/30 bg-card/30 hover:bg-card/50"
                     onClick={() => setMode('templates')}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3">
                      <FileText className="h-5 w-5 text-accent" />
                      Templates & Archetypes
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">
                      Pre-configured {entityConfig.displayName.toLowerCase()} templates with AI enhancement capabilities.
                    </p>
                    <div className="text-xs text-muted-foreground">
                      <Clock className="h-3 w-3 inline mr-1" />
                      2-5 minutes • {templates.length} templates
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Continue from draft */}
            {localStorage.getItem(`entity-draft-${entityType}-${projectId}`) && (
              <div className="mt-6 p-4 bg-accent/10 border border-accent/20 rounded-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Save className="h-5 w-5 text-accent" />
                    <div>
                      <h4 className="font-semibold">Continue Previous {entityConfig.displayName}</h4>
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
      <DialogContent className="max-w-7xl h-[95vh] p-0 gap-0">
        <DialogHeader className="border-b border-border/30 p-6 pb-4 bg-muted/30">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="sm" onClick={() => setMode('selection')}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <div>
                <DialogTitle className="text-xl font-bold flex items-center gap-2">
                  <EntityIcon className="h-5 w-5" />
                  Create {entityConfig.displayName}
                </DialogTitle>
                <p className="text-sm text-muted-foreground">
                  {formData.name || `New ${entityConfig.displayName}`} • {completionPercentage}% Complete
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
                {saveMutation.isPending ? 'Saving...' : `Create ${entityConfig.displayName}`}
              </Button>
            </div>
          </div>
          
          <div className="mt-4">
            <Progress value={completionPercentage} className="h-2" />
          </div>
        </DialogHeader>

        <div className="flex h-full">
          {/* Navigation Sidebar */}
          <div className="w-80 border-r border-border/30 bg-muted/20 p-4 overflow-y-auto">
            <div className="space-y-2">
              {entityConfig.categories.map((category) => {
                const isComplete = completedSections.has(category.id);
                const isActive = activeSection === category.id;
                const Icon = category.icon;
                
                return (
                  <Button
                    key={category.id}
                    variant={isActive ? "default" : "ghost"}
                    className={`w-full justify-start h-auto p-3 ${isActive ? 'bg-accent text-accent-foreground' : ''}`}
                    onClick={() => setActiveSection(category.id)}
                  >
                    <div className="flex items-center gap-3 w-full">
                      <div className="flex items-center gap-2">
                        <Icon className="h-4 w-4" />
                        {isComplete ? (
                          <CheckCircle2 className="h-3 w-3 text-green-500" />
                        ) : (
                          <Circle className="h-3 w-3 text-muted-foreground" />
                        )}
                      </div>
                      <div className="flex-1 text-left">
                        <div className="font-medium">{category.title}</div>
                        <div className="text-xs text-muted-foreground truncate">
                          {category.description}
                        </div>
                        <div className="text-xs text-muted-foreground">
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
          <div className="flex-1 overflow-y-auto">
            <ScrollArea className="h-full">
              <div className="p-6">
                {entityConfig.categories.map((category) => {
                  if (activeSection !== category.id) return null;
                  
                  const Icon = category.icon;
                  const essentialFields = category.fields.filter(f => f.category === 'essential');
                  const importantFields = category.fields.filter(f => f.category === 'important');
                  const detailedFields = category.fields.filter(f => f.category === 'detailed');
                  
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
                              Core information needed for this {entityConfig.displayName.toLowerCase()}
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
                        <Collapsible 
                          open={expandedFields.has(`${category.id}-detailed`)}
                          onOpenChange={(open) => {
                            const newExpanded = new Set(expandedFields);
                            if (open) {
                              newExpanded.add(`${category.id}-detailed`);
                            } else {
                              newExpanded.delete(`${category.id}-detailed`);
                            }
                            setExpandedFields(newExpanded);
                          }}
                        >
                          <Card>
                            <CollapsibleTrigger asChild>
                              <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors pb-3">
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
                                  Additional details for enhanced {entityConfig.displayName.toLowerCase()} development
                                </p>
                              </CardHeader>
                            </CollapsibleTrigger>
                            <CollapsibleContent>
                              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {detailedFields.map(renderField)}
                              </CardContent>
                            </CollapsibleContent>
                          </Card>
                        </Collapsible>
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
  );
}