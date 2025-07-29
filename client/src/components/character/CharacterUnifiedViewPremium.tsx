import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Edit, Save, X, User, Eye, Brain, Zap, BookOpen, Users, PenTool, Camera, Trash2, Sparkles, Plus } from 'lucide-react';
import { apiRequest } from '@/lib/queryClient';
import type { Character } from '@/lib/types';
import { CharacterPortraitModal } from './CharacterPortraitModalImproved';
import { LoadingModal } from '@/components/ui/loading-modal';
import { AIAssistModal } from './AIAssistModal';
import { FieldAIAssist } from './FieldAIAssist';

interface CharacterUnifiedViewPremiumProps {
  projectId: string;
  character: Character;
  onBack: () => void;
  onDelete: (character: Character) => void;
}

const ICON_COMPONENTS = {
  User, Eye, Brain, Zap, BookOpen, Users, PenTool,
};

export function CharacterUnifiedViewPremium({ 
  projectId,
  character, 
  onBack, 
  onDelete 
}: CharacterUnifiedViewPremiumProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<Character>(character);
  const [activeTab, setActiveTab] = useState('identity');
  const [isPortraitModalOpen, setIsPortraitModalOpen] = useState(false);
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [isAIAssistModalOpen, setIsAIAssistModalOpen] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [abortController, setAbortController] = useState<AbortController | null>(null);
  const queryClient = useQueryClient();

  // Calculate character completeness based on all editor fields
  const calculateCompleteness = (char: Character) => {
    if (!char) return 0;
    
    // Define all character fields organized by category (matching the wizard 1:1)
    const identityFields = [
      'name', 'nicknames', 'pronouns', 'age', 'species', 'gender', 
      'occupation', 'title', 'birthdate', 'birthplace', 'currentLocation', 'nationality'
    ];
    
    const appearanceFields = [
      'physicalDescription', 'height', 'weight', 'build', 'eyeColor', 'hairColor', 
      'hairStyle', 'skinTone', 'distinguishingMarks', 'clothingStyle', 'posture',
      'gait', 'gestures', 'mannerisms', 'imageUrl'
    ];
    
    const personalityFields = [
      'personalityOverview', 'personality', 'personalityTraits', 'temperament', 'worldview',
      'values', 'goals', 'motivations', 'fears', 'desires', 'vices', 'habits', 'quirks'
    ];
    
    const abilitiesFields = [
      'coreAbilities', 'skills', 'talents', 'specialAbilities', 'powers', 'strengths',
      'weaknesses', 'training'
    ];
    
    const backgroundFields = [
      'backstory', 'background', 'childhood', 'familyHistory', 'education', 
      'formativeEvents', 'socialClass', 'spokenLanguages'
    ];
    
    const relationshipsFields = [
      'family', 'friends', 'allies', 'enemies', 'rivals', 'mentors', 
      'relationships', 'socialCircle'
    ];
    
    const metaFields = [
      'storyFunction', 'personalTheme', 'symbolism', 'inspiration', 'archetypes', 
      'notes', 'description', 'oneLine'
    ];
    
    // Count filled fields in each category
    const countFilledFields = (fields: string[]) => {
      return fields.reduce((count, field) => {
        const value = (char as any)[field];
        if (value !== undefined && value !== null && value !== '') {
          if (typeof value === 'string') {
            return count + (value.trim().length > 0 ? 1 : 0);
          } else if (Array.isArray(value)) {
            return count + (value.length > 0 ? 1 : 0);
          } else {
            return count + 1;
          }
        }
        return count;
      }, 0);
    };
    
    const identityCount = countFilledFields(identityFields);
    const appearanceCount = countFilledFields(appearanceFields);
    const personalityCount = countFilledFields(personalityFields);
    const abilitiesCount = countFilledFields(abilitiesFields);
    const backgroundCount = countFilledFields(backgroundFields);
    const relationshipsCount = countFilledFields(relationshipsFields);
    const metaCount = countFilledFields(metaFields);
    
    const totalFields = identityFields.length + appearanceFields.length + personalityFields.length + 
                       abilitiesFields.length + backgroundFields.length + relationshipsFields.length + metaFields.length;
    const totalFilled = identityCount + appearanceCount + personalityCount + abilitiesCount + 
                       backgroundCount + relationshipsCount + metaCount;
    
    return Math.max(1, Math.round((totalFilled / totalFields) * 100));
  };

  const saveMutation = useMutation({
    mutationFn: async (data: Character) => {
      const processedData = processDataForSave(data);
      return await apiRequest('PUT', `/api/characters/${character.id}`, processedData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/projects', projectId, 'characters'] });
      setIsEditing(false);
    },
    onError: (error) => {
      console.error('Failed to save character:', error);
    }
  });

  const processDataForSave = (data: Character) => {
    const processedData = { ...data };
    const arrayFields = [
      'personalityTraits', 'abilities', 'skills', 'talents', 'expertise', 
      'languages', 'archetypes', 'tropes', 'tags'
    ];
    
    arrayFields.forEach(field => {
      const value = (data as any)[field];
      if (typeof value === 'string') {
        (processedData as any)[field] = value.trim() ? value.split(',').map(s => s.trim()) : [];
      } else if (Array.isArray(value)) {
        (processedData as any)[field] = value;
      } else {
        (processedData as any)[field] = [];
      }
    });
    
    return processedData;
  };

  const handleSave = () => {
    const cleanData = {
      ...formData,
      updatedAt: undefined,
      createdAt: undefined
    };
    saveMutation.mutate(cleanData as any);
  };

  const handleCancel = () => {
    setFormData(character);
    setIsEditing(false);
  };

  const handleImageGenerated = (imageUrl: string) => {
    // Always update the local form data to reflect the change immediately
    setFormData({ ...formData, imageUrl });
    
    // If not in editing mode, auto-save the image change
    if (!isEditing) {
      saveMutation.mutate({ ...formData, imageUrl });
    }
  };

  const handleAIEnhance = async (selectedCategories: string[]) => {
    setIsAIAssistModalOpen(false);
    setIsEnhancing(true);
    setSelectedCategories(selectedCategories);
    
    // Create abort controller for this request
    const controller = new AbortController();
    setAbortController(controller);
    
    try {
      console.log('Starting AI enhancement for character:', character.id, 'Categories:', selectedCategories);
      
      const response = await fetch(`/api/characters/${character.id}/enhance`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          selectedCategories
        }),
        signal: controller.signal
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const enhancedData = await response.json();
      console.log('AI enhancement response received:', enhancedData);
      
      // Process the enhanced data to ensure correct types before updating form
      const processedEnhancedData = processDataForSave({ ...character, ...enhancedData });
      
      // Update form data with processed data
      setFormData({ ...character, ...processedEnhancedData } as Character);
      
      console.log('Form data updated with enhanced character');
    } catch (error: any) {
      if (error.name === 'AbortError') {
        console.log('AI enhancement was aborted by user');
      } else {
        console.error('Failed to enhance character:', error);
        alert('AI enhancement failed. This may be due to API rate limits. Please try again in a moment.');
      }
    } finally {
      setIsEnhancing(false);
      setAbortController(null);
    }
  };

  const handleAbortAI = () => {
    if (abortController) {
      abortController.abort();
      setAbortController(null);
    }
    setIsEnhancing(false);
  };

  const handleInputChange = (field: keyof Character, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const completeness = calculateCompleteness(formData);

  return (
    <div className="min-h-full bg-gradient-to-br from-background via-background/98 to-accent/5">
      {/* Premium Header */}
      <div className="border-b border-border/30 bg-background/95 backdrop-blur-xl sticky top-0 z-20 shadow-sm">
        <div className="flex items-center justify-between p-6">
          <div className="flex items-center gap-4">
            <Button 
              onClick={onBack} 
              variant="ghost" 
              size="sm"
              className="gap-2 hover:bg-accent/10 hover:text-accent transition-all duration-200"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Characters
            </Button>
          </div>
          
          <div className="flex items-center gap-3">
            {isEditing ? (
              <>
                <Button 
                  onClick={() => setIsAIAssistModalOpen(true)}
                  disabled={isEnhancing || saveMutation.isPending}
                  variant="outline"
                  size="sm"
                  className="gap-2 bg-gradient-to-r from-accent/10 to-accent/15 border-accent/30 hover:from-accent/20 hover:to-accent/25 hover:border-accent/50 text-accent transition-all duration-200"
                >
                  <Sparkles className="h-4 w-4" />
                  {isEnhancing ? 'AI Working...' : 'AI Assist'}
                </Button>
                <Button 
                  onClick={handleCancel} 
                  variant="outline" 
                  size="sm"
                  disabled={saveMutation.isPending}
                  className="gap-2 border-border/40 hover:bg-muted/50 hover:text-foreground text-muted-foreground"
                >
                  <X className="h-4 w-4" />
                  Cancel
                </Button>
                <Button 
                  onClick={() => onDelete(character)} 
                  variant="outline" 
                  size="sm"
                  disabled={saveMutation.isPending}
                  className="gap-2 border-red-300/50 hover:bg-red-50 hover:border-red-400/60 hover:text-red-600 dark:hover:bg-red-950/50 dark:hover:border-red-700 dark:hover:text-red-400 transition-all duration-200"
                >
                  <Trash2 className="h-4 w-4" />
                  Delete
                </Button>
                <Button 
                  onClick={handleSave} 
                  size="sm"
                  disabled={saveMutation.isPending}
                  className="gap-2 bg-gradient-to-r from-accent to-accent/80 hover:from-accent/90 hover:to-accent/70 text-accent-foreground shadow-lg"
                >
                  {saveMutation.isPending ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-accent-foreground" />
                  ) : (
                    <Save className="h-4 w-4" />
                  )}
                  {saveMutation.isPending ? 'Saving...' : 'Save Changes'}
                </Button>
              </>
            ) : (
              <>
                <Button 
                  onClick={() => setIsEditing(true)} 
                  variant="outline" 
                  size="sm"
                  className="gap-2 border-accent/30 hover:bg-accent/10 hover:border-accent/50 hover:text-accent transition-all duration-200"
                >
                  <Edit className="h-4 w-4" />
                  Edit Character
                </Button>
                <Button 
                  onClick={() => onDelete(character)} 
                  variant="outline" 
                  size="sm"
                  className="gap-2 border-red-300/50 hover:bg-red-50 hover:border-red-400/60 hover:text-red-600 dark:hover:bg-red-950/50 dark:hover:border-red-700 dark:hover:text-red-400 transition-all duration-200"
                >
                  <Trash2 className="h-4 w-4" />
                  Delete
                </Button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Premium Character Hero Section */}
      <div className="p-8 border-b border-border/20">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-start gap-8">
            {/* Character Portrait - Clickable */}
            <div className="relative group cursor-pointer" onClick={() => setIsPortraitModalOpen(true)}>
              <div className="w-48 h-64 rounded-3xl bg-gradient-to-br from-accent/10 via-muted/20 to-accent/15 border border-accent/20 shadow-xl overflow-hidden transition-all duration-300 group-hover:shadow-2xl group-hover:border-accent/40">
                {formData.imageUrl ? (
                  <img 
                    src={formData.imageUrl} 
                    alt={formData.name}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <div className="text-center">
                      <div className="w-16 h-16 mx-auto mb-4 bg-accent/20 rounded-full flex items-center justify-center">
                        <User className="h-8 w-8 text-accent/60" />
                      </div>
                      <p className="text-sm text-muted-foreground font-medium">Click to add portrait</p>
                    </div>
                  </div>
                )}
                
                {/* Clean Hover Overlay */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-3xl flex items-center justify-center">
                  <div className="w-12 h-12 bg-accent/90 rounded-full flex items-center justify-center shadow-lg backdrop-blur-sm">
                    <Camera className="h-6 w-6 text-accent-foreground" />
                  </div>
                </div>
              </div>
            </div>

            {/* Character Info */}
            <div className="flex-1 space-y-6">
              <div>
                <div className="flex items-center gap-4 mb-2">
                  <h1 className="text-4xl font-bold bg-gradient-to-r from-foreground via-accent to-foreground bg-clip-text text-transparent">
                    {formData.name || 'Unnamed Character'}
                  </h1>
                  <Badge className="bg-gradient-to-r from-accent via-accent/90 to-accent/80 text-accent-foreground font-medium text-sm px-3 py-1.5 shadow-md border-0 rounded-full">
                    Character
                  </Badge>
                </div>
                
                {formData.title && (
                  <p className="text-xl text-accent/80 font-medium italic mb-1">
                    "{formData.title}"
                  </p>
                )}

                {(formData.race || formData.class || formData.age) && (
                  <div className="flex items-center gap-3 mb-4">
                    {formData.race && (
                      <Badge variant="outline" className="bg-accent/5 border-accent/30 text-accent/80 font-medium">
                        {formData.race}
                      </Badge>
                    )}
                    {formData.class && (
                      <Badge variant="outline" className="bg-accent/5 border-accent/30 text-accent/80 font-medium">
                        {formData.class}
                      </Badge>
                    )}
                    {formData.age && (
                      <Badge variant="outline" className="bg-accent/5 border-accent/30 text-accent/80 font-medium">
                        Age {formData.age}
                      </Badge>
                    )}
                  </div>
                )}
              </div>

              {formData.description && (
                <p className="text-lg text-muted-foreground leading-relaxed">
                  {formData.description}
                </p>
              )}

              {/* Character Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-accent rounded-full" />
                    <span className="text-sm font-medium text-muted-foreground">Development Progress</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex-1 h-2 bg-muted/30 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-accent to-accent/80 transition-all duration-300"
                        style={{ width: `${completeness}%` }}
                      />
                    </div>
                    <span className="text-sm font-bold text-accent">{completeness}%</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full" />
                    <span className="text-sm font-medium text-muted-foreground">Story Readiness</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={`text-xs font-medium ${
                      completeness >= 80 ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                      completeness >= 50 ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
                      'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                    }`}>
                      {completeness >= 80 ? 'Ready' : completeness >= 50 ? 'In Progress' : 'Needs Work'}
                    </Badge>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-purple-500 rounded-full" />
                    <span className="text-sm font-medium text-muted-foreground">Character Traits</span>
                  </div>
                  <div className="text-sm font-bold text-foreground">
                    {formData.personalityTraits?.length || 0} defined
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Premium Character Details */}
      <div className="max-w-7xl mx-auto p-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
          <TabsList className="grid w-full grid-cols-8 bg-muted/20 p-1 rounded-xl">
            <TabsTrigger value="identity" className="flex flex-col gap-1 py-3 data-[state=active]:bg-accent data-[state=active]:text-accent-foreground rounded-lg transition-all duration-200">
              <User className="h-4 w-4" />
              <span className="text-xs font-medium hidden sm:block">Identity</span>
            </TabsTrigger>
            <TabsTrigger value="appearance" className="flex flex-col gap-1 py-3 data-[state=active]:bg-accent data-[state=active]:text-accent-foreground rounded-lg transition-all duration-200">
              <Eye className="h-4 w-4" />
              <span className="text-xs font-medium hidden sm:block">Appearance</span>
            </TabsTrigger>
            <TabsTrigger value="personality" className="flex flex-col gap-1 py-3 data-[state=active]:bg-accent data-[state=active]:text-accent-foreground rounded-lg transition-all duration-200">
              <Brain className="h-4 w-4" />
              <span className="text-xs font-medium hidden sm:block">Personality</span>
            </TabsTrigger>
            <TabsTrigger value="abilities" className="flex flex-col gap-1 py-3 data-[state=active]:bg-accent data-[state=active]:text-accent-foreground rounded-lg transition-all duration-200">
              <Zap className="h-4 w-4" />
              <span className="text-xs font-medium hidden sm:block">Abilities</span>
            </TabsTrigger>
            <TabsTrigger value="background" className="flex flex-col gap-1 py-3 data-[state=active]:bg-accent data-[state=active]:text-accent-foreground rounded-lg transition-all duration-200">
              <BookOpen className="h-4 w-4" />
              <span className="text-xs font-medium hidden sm:block">Background</span>
            </TabsTrigger>
            <TabsTrigger value="relationships" className="flex flex-col gap-1 py-3 data-[state=active]:bg-accent data-[state=active]:text-accent-foreground rounded-lg transition-all duration-200">
              <Users className="h-4 w-4" />
              <span className="text-xs font-medium hidden sm:block">Relationships</span>
            </TabsTrigger>
            <TabsTrigger value="arcs" className="flex flex-col gap-1 py-3 data-[state=active]:bg-accent data-[state=active]:text-accent-foreground rounded-lg transition-all duration-200">
              <BookOpen className="h-4 w-4" />
              <span className="text-xs font-medium hidden sm:block">Arcs</span>
            </TabsTrigger>
            <TabsTrigger value="meta" className="flex flex-col gap-1 py-3 data-[state=active]:bg-accent data-[state=active]:text-accent-foreground rounded-lg transition-all duration-200">
              <PenTool className="h-4 w-4" />
              <span className="text-xs font-medium hidden sm:block">Meta</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="identity" className="space-y-6">
            <div className="border-b border-border/30 pb-4">
              <h2 className="text-2xl font-bold text-foreground">Identity</h2>
              <p className="text-muted-foreground mt-1">Basic information that defines who your character is</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {[
                { key: 'name', label: 'Full Name', type: 'text', placeholder: 'Enter character name' },
                { key: 'nicknames', label: 'Nicknames', type: 'text', placeholder: 'Common nicknames or pet names' },
                { key: 'title', label: 'Title', type: 'text', placeholder: 'Dr., Lord, Captain, etc.' },
                { key: 'aliases', label: 'Aliases', type: 'text', placeholder: 'Secret identities or false names' },
                { key: 'age', label: 'Age', type: 'text', placeholder: '25 or "appears to be in their 20s"' },
                { key: 'race', label: 'Race/Species', type: 'text', placeholder: 'Human, Elf, Dragon, etc.' },
                { key: 'class', label: 'Class/Profession', type: 'text', placeholder: 'Warrior, Mage, Detective, etc.' },
                { key: 'role', label: 'Story Role', type: 'select', placeholder: 'Select an option', options: [
                  'Protagonist', 'Antagonist', 'Deuteragonist', 'Tritagonist', 'Supporting Character', 
                  'Comic Relief', 'Mentor', 'Love Interest', 'Sidekick', 'Rival', 'Anti-Hero', 'Anti-Villain',
                  'Foil Character', 'Catalyst', 'Guardian', 'Threshold Guardian', 'Shapeshifter', 'Shadow',
                  'Herald', 'Trickster', 'Innocent', 'Explorer', 'Sage', 'Hero', 'Outlaw', 'Magician',
                  'Regular Guy/Girl', 'Lover', 'Jester', 'Caregiver', 'Creator', 'Ruler', 'Minor Character',
                  'Background Character', 'Cameo', 'Narrator', 'Confidant', 'Red Herring', 'MacGuffin Guardian'
                ]}
              ].map((field) => (
                <Card key={field.key} className="border border-border/30 bg-gradient-to-br from-background to-accent/5 hover:shadow-lg transition-all duration-200">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base font-semibold text-foreground">{field.label}</CardTitle>
                      {isEditing && (
                        <FieldAIAssist
                          character={character}
                          fieldKey={field.key}
                          fieldLabel={field.label}
                          currentValue={(formData as any)[field.key]}
                          onFieldUpdate={(value) => setFormData({...formData, [field.key]: value})}
                          disabled={isEnhancing}
                        />
                      )}
                    </div>
                  </CardHeader>
                  <CardContent>
                    {isEditing ? (
                      field.type === 'select' ? (
                        <select
                          value={(formData as any)[field.key] || ''}
                          onChange={(e) => setFormData({...formData, [field.key]: e.target.value})}
                          className="w-full p-2 border border-accent/20 rounded-md bg-background text-foreground focus:border-accent focus:ring-accent/20"
                        >
                          <option value="">{field.placeholder}</option>
                          {field.options?.map((option) => (
                            <option key={option} value={option}>
                              {option}
                            </option>
                          ))}
                        </select>
                      ) : field.type === 'array' ? (
                        <Input
                          value={Array.isArray((formData as any)[field.key]) 
                            ? ((formData as any)[field.key] as string[]).join(', ')
                            : (formData as any)[field.key] || ''
                          }
                          onChange={(e) => {
                            const value = e.target.value;
                            const arrayValue = value.trim() ? value.split(',').map(s => s.trim()) : [];
                            setFormData({...formData, [field.key]: arrayValue});
                          }}
                          placeholder={field.placeholder}
                          className="border-accent/20 focus:border-accent focus:ring-accent/20"
                        />
                      ) : field.type === 'textarea' ? (
                        <Textarea
                          value={(formData as any)[field.key] || ''}
                          onChange={(e) => setFormData({...formData, [field.key]: e.target.value})}
                          placeholder={field.placeholder}
                          className="min-h-[100px] border-accent/20 focus:border-accent focus:ring-accent/20"
                          rows={4}
                        />
                      ) : (
                        <Input
                          value={(formData as any)[field.key] || ''}
                          onChange={(e) => setFormData({...formData, [field.key]: e.target.value})}
                          placeholder={field.placeholder}
                          className="border-accent/20 focus:border-accent focus:ring-accent/20"
                        />
                      )
                    ) : (
                      <div className="space-y-2">
                        {(field.type === 'array' && Array.isArray((formData as any)[field.key])) ? (
                          // Handle array fields (like spokenLanguages)
                          ((formData as any)[field.key] as string[]).length > 0 ? (
                            <div className="flex flex-wrap gap-1">
                              {((formData as any)[field.key] as string[]).map((item: string, index: number) => (
                                <Badge key={index} className="text-xs bg-accent/15 text-accent border border-accent/20">
                                  {item}
                                </Badge>
                              ))}
                            </div>
                          ) : (
                            <div className="text-center py-4">
                              <p className="text-sm text-muted-foreground italic">
                                No {field.label.toLowerCase()} added yet
                              </p>
                              <Button 
                                onClick={() => setIsEditing(true)}
                                variant="ghost" 
                                size="sm" 
                                className="mt-2 text-accent hover:bg-accent/10 hover:text-accent"
                              >
                                <Plus className="h-3 w-3 mr-1" />
                                Add {field.label}
                              </Button>
                            </div>
                          )
                        ) : (formData as any)[field.key] ? (
                          // Handle non-array fields
                          <p className="text-sm text-foreground leading-relaxed whitespace-pre-wrap">
                            {(formData as any)[field.key]}
                          </p>
                        ) : (
                          // Handle empty non-array fields
                          <div className="text-center py-4">
                            <p className="text-sm text-muted-foreground italic">
                              No {field.label.toLowerCase()} added yet
                            </p>
                            <Button 
                              onClick={() => setIsEditing(true)}
                              variant="ghost" 
                              size="sm" 
                              className="mt-2 text-accent hover:bg-accent/10 hover:text-accent"
                            >
                              <Plus className="h-3 w-3 mr-1" />
                              Add {field.label}
                            </Button>
                          </div>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="appearance" className="space-y-6">
            <div className="border-b border-border/30 pb-4">
              <h2 className="text-2xl font-bold text-foreground">Appearance</h2>
              <p className="text-muted-foreground mt-1">Physical characteristics and how they present themselves</p>
            </div>

            <div className="space-y-6">
              {/* Full-width Overall Description */}
              <Card className="border border-border/30 bg-gradient-to-br from-background to-accent/5 hover:shadow-lg transition-all duration-200">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base font-semibold text-foreground">Overall Description</CardTitle>
                    {isEditing && (
                      <FieldAIAssist
                        character={character}
                        fieldKey="physicalDescription"
                        fieldLabel="Overall Description"
                        currentValue={formData.physicalDescription}
                        onFieldUpdate={(value) => setFormData({...formData, physicalDescription: value})}
                        disabled={isEnhancing}
                      />
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  {isEditing ? (
                    <Textarea
                      value={formData.physicalDescription || ''}
                      onChange={(e) => setFormData({...formData, physicalDescription: e.target.value})}
                      placeholder="General physical appearance overview"
                      className="min-h-[100px] border-accent/20 focus:border-accent focus:ring-accent/20"
                      rows={4}
                    />
                  ) : (
                    <div className="space-y-2">
                      {formData.physicalDescription ? (
                        <p className="text-sm text-foreground leading-relaxed whitespace-pre-wrap">
                          {formData.physicalDescription}
                        </p>
                      ) : (
                        <div className="text-center py-4">
                          <p className="text-sm text-muted-foreground italic">
                            No overall description added yet
                          </p>
                          <Button 
                            onClick={() => setIsEditing(true)}
                            variant="ghost" 
                            size="sm" 
                            className="mt-2 text-accent hover:bg-accent/10 hover:text-accent"
                          >
                            <Plus className="h-3 w-3 mr-1" />
                            Add Overall Description
                          </Button>
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Other appearance fields in grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {[
                  { key: 'height', label: 'Height', type: 'text', placeholder: '5\'8" or 173cm' },
                  { key: 'build', label: 'Build', type: 'select', options: ['Slim', 'Athletic', 'Stocky', 'Muscular', 'Heavy', 'Petite', 'Tall', 'Average'] },
                  { key: 'eyeColor', label: 'Eye Color', type: 'text', placeholder: 'Blue, brown, heterochromia, etc.' },
                  { key: 'hairColor', label: 'Hair Color', type: 'text', placeholder: 'Natural and current color' },
                  { key: 'hairStyle', label: 'Hair Style', type: 'text', placeholder: 'Length, cut, styling' },
                  { key: 'skinTone', label: 'Skin Tone', type: 'text', placeholder: 'Complexion and tone' },
                  { key: 'distinguishingMarks', label: 'Distinguishing Marks', type: 'textarea', placeholder: 'Scars, tattoos, birthmarks, etc.' },
                  { key: 'clothingStyle', label: 'Clothing Style', type: 'textarea', placeholder: 'How they typically dress' }
                ].map((field) => (
                <Card key={field.key} className="border border-border/30 bg-gradient-to-br from-background to-accent/5 hover:shadow-lg transition-all duration-200">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base font-semibold text-foreground">{field.label}</CardTitle>
                      {isEditing && (
                        <FieldAIAssist
                          character={character}
                          fieldKey={field.key}
                          fieldLabel={field.label}
                          currentValue={(formData as any)[field.key]}
                          onFieldUpdate={(value) => setFormData({...formData, [field.key]: value})}
                          disabled={isEnhancing}
                        />
                      )}
                    </div>
                  </CardHeader>
                  <CardContent>
                    {isEditing ? (
                      field.type === 'textarea' ? (
                        <Textarea
                          value={(formData as any)[field.key] || ''}
                          onChange={(e) => setFormData({...formData, [field.key]: e.target.value})}
                          placeholder={field.placeholder}
                          className="min-h-[100px] border-accent/20 focus:border-accent focus:ring-accent/20"
                          rows={4}
                        />
                      ) : (
                        <Input
                          value={(formData as any)[field.key] || ''}
                          onChange={(e) => setFormData({...formData, [field.key]: e.target.value})}
                          placeholder={field.placeholder}
                          className="border-accent/20 focus:border-accent focus:ring-accent/20"
                        />
                      )
                    ) : (
                      <div className="space-y-2">
                        {(formData as any)[field.key] ? (
                          <p className="text-sm text-foreground leading-relaxed whitespace-pre-wrap">
                            {(formData as any)[field.key]}
                          </p>
                        ) : (
                          <div className="text-center py-4">
                            <p className="text-sm text-muted-foreground italic">
                              No {field.label.toLowerCase()} added yet
                            </p>
                            <Button 
                              onClick={() => setIsEditing(true)}
                              variant="ghost" 
                              size="sm" 
                              className="mt-2 text-accent hover:bg-accent/10 hover:text-accent"
                            >
                              <Plus className="h-3 w-3 mr-1" />
                              Add {field.label}
                            </Button>
                          </div>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="personality" className="space-y-6">
            <div className="border-b border-border/30 pb-4">
              <h2 className="text-2xl font-bold text-foreground">Personality</h2>
              <p className="text-muted-foreground mt-1">Character traits, motivations, and psychology</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {[
                { key: 'personality', label: 'Personality Overview', type: 'textarea', placeholder: 'Core personality description' },
                { key: 'personalityTraits', label: 'Key Traits', type: 'array', placeholder: 'Brave, cynical, optimistic (separate with commas)' },
                { key: 'temperament', label: 'Temperament', type: 'select', options: [
                  'Sanguine', 'Choleric', 'Melancholic', 'Phlegmatic', 'Sanguine-Choleric', 'Sanguine-Phlegmatic',
                  'Choleric-Sanguine', 'Choleric-Melancholic', 'Melancholic-Choleric', 'Melancholic-Phlegmatic',
                  'Phlegmatic-Sanguine', 'Phlegmatic-Melancholic', 'Optimistic', 'Pessimistic', 'Realistic',
                  'Idealistic', 'Cynical', 'Stoic', 'Emotional', 'Analytical', 'Intuitive', 'Impulsive',
                  'Cautious', 'Adventurous', 'Reserved', 'Outgoing', 'Aggressive', 'Passive', 'Balanced'
                ] },
                { key: 'worldview', label: 'Worldview', type: 'textarea', placeholder: 'How they see the world and their place in it' },
                { key: 'values', label: 'Core Values', type: 'textarea', placeholder: 'What they believe is most important' },
                { key: 'goals', label: 'Goals', type: 'textarea', placeholder: 'What they want to achieve' },
                { key: 'motivations', label: 'Motivations', type: 'textarea', placeholder: 'What drives them forward' },
                { key: 'fears', label: 'Fears', type: 'textarea', placeholder: 'What they are afraid of' },
                { key: 'desires', label: 'Desires', type: 'textarea', placeholder: 'What they want most' },
                { key: 'vices', label: 'Character Flaws', type: 'textarea', placeholder: 'Weaknesses and imperfections' }
              ].map((field) => (
                <Card key={field.key} className="border border-border/30 bg-gradient-to-br from-background to-accent/5 hover:shadow-lg transition-all duration-200">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base font-semibold text-foreground">{field.label}</CardTitle>
                      {isEditing && (
                        <FieldAIAssist
                          character={character}
                          fieldKey={field.key}
                          fieldLabel={field.label}
                          currentValue={(formData as any)[field.key]}
                          onFieldUpdate={(value) => setFormData({...formData, [field.key]: value})}
                          disabled={isEnhancing}
                        />
                      )}
                    </div>
                  </CardHeader>
                  <CardContent>
                    {isEditing ? (
                      field.type === 'textarea' ? (
                        <Textarea
                          value={(formData as any)[field.key] || ''}
                          onChange={(e) => setFormData({...formData, [field.key]: e.target.value})}
                          placeholder={field.placeholder}
                          className="min-h-[100px] border-accent/20 focus:border-accent focus:ring-accent/20"
                          rows={4}
                        />
                      ) : field.type === 'array' ? (
                        <Input
                          value={Array.isArray((formData as any)[field.key]) ? ((formData as any)[field.key] as string[]).join(', ') : (formData as any)[field.key] || ''}
                          onChange={(e) => setFormData({...formData, [field.key]: e.target.value.split(',').map(s => s.trim()).filter(Boolean)})}
                          placeholder={field.placeholder}
                          className="border-accent/20 focus:border-accent focus:ring-accent/20"
                        />
                      ) : (
                        <Input
                          value={(formData as any)[field.key] || ''}
                          onChange={(e) => setFormData({...formData, [field.key]: e.target.value})}
                          placeholder={field.placeholder}
                          className="border-accent/20 focus:border-accent focus:ring-accent/20"
                        />
                      )
                    ) : (
                      <div className="space-y-2">
                        {/* Fixed empty state logic to handle empty arrays properly */}
                        {(field.type === 'array' && Array.isArray((formData as any)[field.key])) ? (
                          // Handle array fields (like personalityTraits)
                          ((formData as any)[field.key] as string[]).length > 0 ? (
                            <div className="flex flex-wrap gap-1">
                              {((formData as any)[field.key] as string[]).map((item: string, index: number) => (
                                <Badge key={index} className="text-xs bg-accent/15 text-accent border border-accent/20">
                                  {item}
                                </Badge>
                              ))}
                            </div>
                          ) : (
                            <div className="text-center py-4">
                              <p className="text-sm text-muted-foreground italic">
                                No {field.label.toLowerCase()} added yet
                              </p>
                              <Button 
                                onClick={() => setIsEditing(true)}
                                variant="ghost" 
                                size="sm" 
                                className="mt-2 text-accent hover:bg-accent/10 hover:text-accent"
                              >
                                <Plus className="h-3 w-3 mr-1" />
                                Add {field.label}
                              </Button>
                            </div>
                          )
                        ) : (formData as any)[field.key] ? (
                          // Handle non-array fields
                          <p className="text-sm text-foreground leading-relaxed whitespace-pre-wrap">
                            {(formData as any)[field.key]}
                          </p>
                        ) : (
                          // Handle empty non-array fields
                          <div className="text-center py-4">
                            <p className="text-sm text-muted-foreground italic">
                              No {field.label.toLowerCase()} added yet
                            </p>
                            <Button 
                              onClick={() => setIsEditing(true)}
                              variant="ghost" 
                              size="sm" 
                              className="mt-2 text-accent hover:bg-accent/10 hover:text-accent"
                            >
                              <Plus className="h-3 w-3 mr-1" />
                              Add {field.label}
                            </Button>
                          </div>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
              </div>
          </TabsContent>

          <TabsContent value="background" className="space-y-6">
            <div className="border-b border-border/30 pb-4">
              <h2 className="text-2xl font-bold text-foreground">Background</h2>
              <p className="text-muted-foreground mt-1">History, upbringing, and formative experiences</p>
            </div>

              {/* Full-width Background Overview */}
              <Card className="border border-border/30 bg-gradient-to-br from-background to-accent/5 hover:shadow-lg transition-all duration-200">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base font-semibold text-foreground">Background Overview</CardTitle>
                    {isEditing && (
                      <FieldAIAssist
                        character={character}
                        fieldKey="background"
                        fieldLabel="Background Overview"
                        currentValue={formData.background}
                        onFieldUpdate={(value) => setFormData({...formData, background: value})}
                        disabled={isEnhancing}
                      />
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  {isEditing ? (
                    <Textarea
                      value={formData.background || ''}
                      onChange={(e) => setFormData({...formData, background: e.target.value})}
                      placeholder="General background and history"
                      className="min-h-[100px] border-accent/20 focus:border-accent focus:ring-accent/20"
                      rows={4}
                    />
                  ) : (
                    <div className="space-y-2">
                      {formData.background ? (
                        <p className="text-sm text-foreground leading-relaxed whitespace-pre-wrap">
                          {formData.background}
                        </p>
                      ) : (
                        <div className="text-center py-4">
                          <p className="text-sm text-muted-foreground italic">
                            No background overview added yet
                          </p>
                          <Button 
                            onClick={() => setIsEditing(true)}
                            variant="ghost" 
                            size="sm" 
                            className="mt-2 text-accent hover:bg-accent/10 hover:text-accent"
                          >
                            <Plus className="h-3 w-3 mr-1" />
                            Add Background Overview
                          </Button>
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Other background fields in grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {[
                  { key: 'backstory', label: 'Detailed Backstory', type: 'textarea', placeholder: 'Comprehensive life story' },
                  { key: 'childhood', label: 'Childhood', type: 'textarea', placeholder: 'Early years and upbringing' },
                  { key: 'familyHistory', label: 'Family History', type: 'textarea', placeholder: 'Family background and lineage' },
                  { key: 'education', label: 'Education', type: 'textarea', placeholder: 'Formal and informal learning' },
                  { key: 'formativeEvents', label: 'Formative Events', type: 'textarea', placeholder: 'Key life-changing moments' },
                  { key: 'socialClass', label: 'Social Class', type: 'select', options: ['Upper Class', 'Upper Middle', 'Middle Class', 'Working Class', 'Lower Class', 'Outcast', 'Noble', 'Commoner'] },
                  { key: 'occupation', label: 'Occupation', type: 'text', placeholder: 'Current job or profession' },
                  { key: 'spokenLanguages', label: 'Spoken Languages', type: 'array', placeholder: 'Languages they can speak (separate with commas)' }
                ].map((field) => (
                <Card key={field.key} className="border border-border/30 bg-gradient-to-br from-background to-accent/5 hover:shadow-lg transition-all duration-200">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base font-semibold text-foreground">{field.label}</CardTitle>
                      {isEditing && (
                        <FieldAIAssist
                          character={character}
                          fieldKey={field.key}
                          fieldLabel={field.label}
                          currentValue={(formData as any)[field.key]}
                          onFieldUpdate={(value) => setFormData({...formData, [field.key]: value})}
                          disabled={isEnhancing}
                        />
                      )}
                    </div>
                  </CardHeader>
                  <CardContent>
                    {isEditing ? (
                      field.type === 'array' ? (
                        <Input
                          value={Array.isArray((formData as any)[field.key]) 
                            ? (formData as any)[field.key].join(', ')
                            : (formData as any)[field.key] || ''
                          }
                          onChange={(e) => {
                            const value = e.target.value;
                            const arrayValue = value.trim() ? value.split(',').map(s => s.trim()) : [];
                            setFormData({...formData, [field.key]: arrayValue});
                          }}
                          placeholder={field.placeholder}
                          className="border-accent/20 focus:border-accent focus:ring-accent/20"
                        />
                      ) : field.type === 'textarea' ? (
                        <Textarea
                          value={(formData as any)[field.key] || ''}
                          onChange={(e) => setFormData({...formData, [field.key]: e.target.value})}
                          placeholder={field.placeholder}
                          className="min-h-[100px] border-accent/20 focus:border-accent focus:ring-accent/20"
                          rows={4}
                        />
                      ) : field.type === 'select' ? (
                        <select
                          value={(formData as any)[field.key] || ''}
                          onChange={(e) => setFormData({...formData, [field.key]: e.target.value})}
                          className="w-full p-2 border border-accent/20 rounded-md focus:border-accent focus:ring-accent/20 bg-background"
                        >
                          <option value="">Select {field.label}</option>
                          {field.options?.map(option => (
                            <option key={option} value={option}>{option}</option>
                          ))}
                        </select>
                      ) : (
                        <Input
                          value={(formData as any)[field.key] || ''}
                          onChange={(e) => setFormData({...formData, [field.key]: e.target.value})}
                          placeholder={field.placeholder}
                          className="border-accent/20 focus:border-accent focus:ring-accent/20"
                        />
                      )
                    ) : (
                      <div className="space-y-2">
                        {field.type === 'array' ? (
                          Array.isArray((formData as any)[field.key]) && ((formData as any)[field.key] as string[]).length > 0 ? (
                            <div className="flex flex-wrap gap-2">
                              {((formData as any)[field.key] as string[]).map((item: string, index: number) => (
                                <Badge key={index} variant="secondary" className="bg-accent/15 text-accent border border-accent/20">
                                  {item}
                                </Badge>
                              ))}
                            </div>
                          ) : (
                            <div className="text-center py-4">
                              <p className="text-sm text-muted-foreground italic">
                                No {field.label.toLowerCase()} added yet
                              </p>
                              <Button 
                                onClick={() => setIsEditing(true)}
                                variant="ghost" 
                                size="sm" 
                                className="mt-2 text-accent hover:bg-accent/10 hover:text-accent"
                              >
                                <Plus className="h-3 w-3 mr-1" />
                                Add {field.label}
                              </Button>
                            </div>
                          )
                        ) : (formData as any)[field.key] ? (
                          <p className="text-sm text-foreground leading-relaxed whitespace-pre-wrap">
                            {(formData as any)[field.key]}
                          </p>
                        ) : (
                          <div className="text-center py-4">
                            <p className="text-sm text-muted-foreground italic">
                              No {field.label.toLowerCase()} added yet
                            </p>
                            <Button 
                              onClick={() => setIsEditing(true)}
                              variant="ghost" 
                              size="sm" 
                              className="mt-2 text-accent hover:bg-accent/10 hover:text-accent"
                            >
                              <Plus className="h-3 w-3 mr-1" />
                              Add {field.label}
                            </Button>
                          </div>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="abilities" className="space-y-6">
            <div className="border-b border-border/30 pb-4">
              <h2 className="text-2xl font-bold text-foreground">Abilities</h2>
              <p className="text-muted-foreground mt-1">Skills, talents, and special capabilities</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {[
                { key: 'abilities', label: 'Core Abilities', type: 'array', placeholder: 'Swordsmanship, magic, investigation (separate with commas)' },
                { key: 'skills', label: 'Skills', type: 'array', placeholder: 'Learned skills and competencies' },
                { key: 'talents', label: 'Natural Talents', type: 'array', placeholder: 'Innate gifts and aptitudes' },
                { key: 'specialAbilities', label: 'Special Abilities', type: 'textarea', placeholder: 'Unique powers or supernatural abilities' },
                { key: 'powers', label: 'Powers', type: 'textarea', placeholder: 'Magical, psychic, or superhuman powers' },
                { key: 'strengths', label: 'Strengths', type: 'textarea', placeholder: 'What they excel at' },
                { key: 'weaknesses', label: 'Weaknesses', type: 'textarea', placeholder: 'What they struggle with' },
                { key: 'training', label: 'Training', type: 'textarea', placeholder: 'Formal education and training received' }
              ].map((field) => (
                <Card key={field.key} className="border border-border/30 bg-gradient-to-br from-background to-accent/5 hover:shadow-lg transition-all duration-200">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base font-semibold text-foreground">{field.label}</CardTitle>
                      {isEditing && (
                        <FieldAIAssist
                          character={character}
                          fieldKey={field.key}
                          fieldLabel={field.label}
                          currentValue={(formData as any)[field.key]}
                          onFieldUpdate={(value) => setFormData({...formData, [field.key]: value})}
                          disabled={isEnhancing}
                        />
                      )}
                    </div>
                  </CardHeader>
                  <CardContent>
                    {isEditing ? (
                      field.type === 'array' ? (
                        <Input
                          value={Array.isArray((formData as any)[field.key]) 
                            ? (formData as any)[field.key].join(', ')
                            : (formData as any)[field.key] || ''
                          }
                          onChange={(e) => {
                            const value = e.target.value;
                            const arrayValue = value.trim() ? value.split(',').map(s => s.trim()) : [];
                            setFormData({...formData, [field.key]: arrayValue});
                          }}
                          placeholder={field.placeholder}
                          className="border-accent/20 focus:border-accent focus:ring-accent/20"
                        />
                      ) : field.type === 'textarea' ? (
                        <Textarea
                          value={(formData as any)[field.key] || ''}
                          onChange={(e) => setFormData({...formData, [field.key]: e.target.value})}
                          placeholder={field.placeholder}
                          className="min-h-[100px] border-accent/20 focus:border-accent focus:ring-accent/20"
                          rows={4}
                        />
                      ) : (
                        <Input
                          value={(formData as any)[field.key] || ''}
                          onChange={(e) => setFormData({...formData, [field.key]: e.target.value})}
                          placeholder={field.placeholder}
                          className="border-accent/20 focus:border-accent focus:ring-accent/20"
                        />
                      )
                    ) : (
                      <div className="space-y-2">
                        {/* Fixed abilities section array empty state logic */}
                        {(field.type === 'array' && Array.isArray((formData as any)[field.key])) ? (
                          ((formData as any)[field.key] as string[]).length > 0 ? (
                            <div className="flex flex-wrap gap-2">
                              {(formData as any)[field.key].map((item: string, index: number) => (
                                <Badge key={index} variant="secondary" className="bg-accent/10 text-accent border-accent/20">
                                  {item}
                                </Badge>
                              ))}
                            </div>
                          ) : (
                            <div className="text-center py-4">
                              <p className="text-sm text-muted-foreground italic">
                                No {field.label.toLowerCase()} added yet
                              </p>
                              <Button 
                                onClick={() => setIsEditing(true)}
                                variant="ghost" 
                                size="sm" 
                                className="mt-2 text-accent hover:bg-accent/10 hover:text-accent"
                              >
                                <Plus className="h-3 w-3 mr-1" />
                                Add {field.label}
                              </Button>
                            </div>
                          )
                        ) : (formData as any)[field.key] ? (
                          <p className="text-sm text-foreground leading-relaxed whitespace-pre-wrap">
                            {(formData as any)[field.key]}
                          </p>
                        ) : (
                          <div className="text-center py-4">
                            <p className="text-sm text-muted-foreground italic">
                              No {field.label.toLowerCase()} added yet
                            </p>
                            <Button 
                              onClick={() => setIsEditing(true)}
                              variant="ghost" 
                              size="sm" 
                              className="mt-2 text-accent hover:bg-accent/10 hover:text-accent"
                            >
                              <Plus className="h-3 w-3 mr-1" />
                              Add {field.label}
                            </Button>
                          </div>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
              </div>
          </TabsContent>

          <TabsContent value="relationships" className="space-y-6">
            <div className="border-b border-border/30 pb-4">
              <h2 className="text-2xl font-bold text-foreground">Relationships</h2>
              <p className="text-muted-foreground mt-1">Connections with other characters and social dynamics</p>
            </div>

            <div className="space-y-6">
              {/* Current Manual Relationships */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {[
                  { key: 'family', label: 'Family', type: 'textarea', placeholder: 'Parents, siblings, spouse, children' },
                  { key: 'friends', label: 'Friends', type: 'textarea', placeholder: 'Close friends and companions' },
                  { key: 'allies', label: 'Allies', type: 'textarea', placeholder: 'Trusted allies and supporters' },
                  { key: 'enemies', label: 'Enemies', type: 'textarea', placeholder: 'Opponents and adversaries' },
                  { key: 'rivals', label: 'Rivals', type: 'textarea', placeholder: 'Competitive relationships' },
                  { key: 'mentors', label: 'Mentors', type: 'textarea', placeholder: 'Teachers and guides' },
                  { key: 'relationships', label: 'Other Relationships', type: 'textarea', placeholder: 'Additional important connections' },
                  { key: 'socialCircle', label: 'Social Circle', type: 'textarea', placeholder: 'General social environment' }
                ].map((field) => (
                <Card key={field.key} className="border border-border/30 bg-gradient-to-br from-background to-accent/5 hover:shadow-lg transition-all duration-200">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base font-semibold text-foreground">{field.label}</CardTitle>
                      {isEditing && (
                        <FieldAIAssist
                          character={character}
                          fieldKey={field.key}
                          fieldLabel={field.label}
                          currentValue={(formData as any)[field.key]}
                          onFieldUpdate={(value) => setFormData({...formData, [field.key]: value})}
                          disabled={isEnhancing}
                        />
                      )}
                    </div>
                  </CardHeader>
                  <CardContent>
                    {isEditing ? (
                      <Textarea
                        value={(formData as any)[field.key] || ''}
                        onChange={(e) => setFormData({...formData, [field.key]: e.target.value})}
                        placeholder={field.placeholder}
                        className="min-h-[100px] border-accent/20 focus:border-accent focus:ring-accent/20"
                        rows={4}
                      />
                    ) : (
                      <div className="space-y-2">
                        {(formData as any)[field.key] ? (
                          <p className="text-sm text-foreground leading-relaxed whitespace-pre-wrap">
                            {(formData as any)[field.key]}
                          </p>
                        ) : (
                          <div className="text-center py-4">
                            <p className="text-sm text-muted-foreground italic">
                              No {field.label.toLowerCase()} added yet
                            </p>
                            <Button 
                              onClick={() => setIsEditing(true)}
                              variant="ghost" 
                              size="sm" 
                              className="mt-2 text-accent hover:bg-accent/10 hover:text-accent"
                            >
                              <Plus className="h-3 w-3 mr-1" />
                              Add {field.label}
                            </Button>
                          </div>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
              </div>

              {/* Coming Soon Dynamic Features */}
              <Card className="border border-accent/30 bg-gradient-to-br from-accent/5 to-accent/10 hover:shadow-lg transition-all duration-200">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base font-semibold text-foreground">Dynamic Relationship Mapping</CardTitle>
                    <Badge className="bg-accent/20 text-accent border-accent/30">Coming Soon</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <p className="text-sm text-muted-foreground">
                      Relationships will automatically update based on story events and character interactions:
                    </p>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-accent/50" />
                        Auto-detect character connections from manuscript
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-accent/50" />
                        Visual relationship mapping with strength indicators
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-accent/50" />
                        Dynamic relationship evolution tracking
                      </li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="meta" className="space-y-6">
            <div className="border-b border-border/30 pb-4">
              <h2 className="text-2xl font-bold text-foreground">Meta</h2>
              <p className="text-muted-foreground mt-1">Story function, themes, and creative elements</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {[
                { key: 'storyFunction', label: 'Story Function', type: 'textarea', placeholder: 'Their role in advancing the plot' },
                { key: 'personalTheme', label: 'Associated Themes', type: 'textarea', placeholder: 'Themes they represent or explore' },
                { key: 'symbolism', label: 'Symbolism', type: 'textarea', placeholder: 'What they symbolize in the story' },
                { key: 'inspiration', label: 'Inspiration', type: 'textarea', placeholder: 'Real people, characters, or concepts that inspired them' },
                { key: 'archetypes', label: 'Archetypes', type: 'select', options: [
                  'The Hero', 'The Mentor', 'The Threshold Guardian', 'The Herald', 'The Shapeshifter', 'The Shadow',
                  'The Ally', 'The Trickster', 'The Innocent', 'The Explorer', 'The Sage', 'The Outlaw', 'The Magician',
                  'The Regular Guy/Girl', 'The Lover', 'The Jester', 'The Caregiver', 'The Creator', 'The Ruler',
                  'The Warrior', 'The Orphan', 'The Seeker', 'The Destroyer', 'The Rebel', 'The Fool', 'The Wise Woman/Man',
                  'The Mother', 'The Father', 'The Child', 'The Maiden', 'The Crone', 'The Anima', 'The Animus',
                  'The Self', 'The Persona', 'The Great Mother', 'The Terrible Mother', 'The Wise Old Man',
                  'The Divine Child', 'The Wounded Healer', 'The Scapegoat', 'The Martyr', 'The Savior',
                  'The Temptress', 'The Femme Fatale', 'The Damsel in Distress', 'The Dark Lord', 'The Prophet',
                  'The Shaman', 'The Guide', 'The Guardian', 'The Gatekeeper', 'The Threshold Dweller'
                ] },
                { key: 'notes', label: 'Writer\'s Notes', type: 'textarea', placeholder: 'Development notes and ideas' }
              ].map((field) => (
                <Card key={field.key} className="border border-border/30 bg-gradient-to-br from-background to-accent/5 hover:shadow-lg transition-all duration-200">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base font-semibold text-foreground">{field.label}</CardTitle>
                      {isEditing && (
                        <FieldAIAssist
                          character={character}
                          fieldKey={field.key}
                          fieldLabel={field.label}
                          currentValue={(formData as any)[field.key]}
                          onFieldUpdate={(value) => setFormData({...formData, [field.key]: value})}
                          disabled={isEnhancing}
                        />
                      )}
                    </div>
                  </CardHeader>
                  <CardContent>
                    {isEditing ? (
                      field.type === 'array' ? (
                        <Input
                          value={Array.isArray((formData as any)[field.key]) 
                            ? (formData as any)[field.key].join(', ')
                            : (formData as any)[field.key] || ''
                          }
                          onChange={(e) => {
                            const value = e.target.value;
                            const arrayValue = value.trim() ? value.split(',').map(s => s.trim()) : [];
                            setFormData({...formData, [field.key]: arrayValue});
                          }}
                          placeholder={field.placeholder}
                          className="border-accent/20 focus:border-accent focus:ring-accent/20"
                        />
                      ) : field.type === 'textarea' ? (
                        <Textarea
                          value={(formData as any)[field.key] || ''}
                          onChange={(e) => setFormData({...formData, [field.key]: e.target.value})}
                          placeholder={field.placeholder}
                          className="min-h-[100px] border-accent/20 focus:border-accent focus:ring-accent/20"
                          rows={4}
                        />
                      ) : (
                        <Input
                          value={(formData as any)[field.key] || ''}
                          onChange={(e) => setFormData({...formData, [field.key]: e.target.value})}
                          placeholder={field.placeholder}
                          className="border-accent/20 focus:border-accent focus:ring-accent/20"
                        />
                      )
                    ) : (
                      <div className="space-y-2">
                        {/* Fixed meta section array empty state logic */}
                        {(field.type === 'array' && Array.isArray((formData as any)[field.key])) ? (
                          ((formData as any)[field.key] as string[]).length > 0 ? (
                            <div className="flex flex-wrap gap-2">
                              {(formData as any)[field.key].map((item: string, index: number) => (
                                <Badge key={index} variant="secondary" className="bg-accent/10 text-accent border-accent/20">
                                  {item}
                                </Badge>
                              ))}
                            </div>
                          ) : (
                            <div className="text-center py-4">
                              <p className="text-sm text-muted-foreground italic">
                                No {field.label.toLowerCase()} added yet
                              </p>
                              <Button 
                                onClick={() => setIsEditing(true)}
                                variant="ghost" 
                                size="sm" 
                                className="mt-2 text-accent hover:bg-accent/10 hover:text-accent"
                              >
                                <Plus className="h-3 w-3 mr-1" />
                                Add {field.label}
                              </Button>
                            </div>
                          )
                        ) : (formData as any)[field.key] ? (
                          <p className="text-sm text-foreground leading-relaxed whitespace-pre-wrap">
                            {(formData as any)[field.key]}
                          </p>
                        ) : (
                          <div className="text-center py-4">
                            <p className="text-sm text-muted-foreground italic">
                              No {field.label.toLowerCase()} added yet
                            </p>
                            <Button 
                              onClick={() => setIsEditing(true)}
                              variant="ghost" 
                              size="sm" 
                              className="mt-2 text-accent hover:bg-accent/10 hover:text-accent"
                            >
                              <Plus className="h-3 w-3 mr-1" />
                              Add {field.label}
                            </Button>
                          </div>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="arcs" className="space-y-6">
            <div className="border-b border-border/30 pb-4">
              <h2 className="text-2xl font-bold text-foreground">Character Arcs</h2>
              <p className="text-muted-foreground mt-1">Character development and transformation journey</p>
            </div>

            <div className="space-y-6">
              {/* Current Manual Arc Content */}
              <Card className="border border-border/30 bg-gradient-to-br from-background to-accent/5 hover:shadow-lg transition-all duration-200">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base font-semibold text-foreground">Character Arc</CardTitle>
                </CardHeader>
                <CardContent>
                  {isEditing ? (
                    <Textarea
                      value={formData.arc || ''}
                      onChange={(e) => setFormData({...formData, arc: e.target.value})}
                      placeholder="Character development and transformation..."
                      className="min-h-[100px] border-accent/20 focus:border-accent focus:ring-accent/20"
                      rows={4}
                    />
                  ) : (
                    <div className="space-y-2">
                      {formData.arc ? (
                        <p className="text-sm text-foreground leading-relaxed whitespace-pre-wrap">
                          {formData.arc}
                        </p>
                      ) : (
                        <div className="text-center py-4">
                          <p className="text-sm text-muted-foreground italic">
                            No character arc added yet
                          </p>
                          <Button 
                            onClick={() => setIsEditing(true)}
                            variant="ghost" 
                            size="sm" 
                            className="mt-2 text-accent hover:bg-accent/10 hover:text-accent"
                          >
                            <Plus className="h-3 w-3 mr-1" />
                            Add Character Arc
                          </Button>
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Coming Soon Dynamic Features */}
              <Card className="border border-accent/30 bg-gradient-to-br from-accent/5 to-accent/10 hover:shadow-lg transition-all duration-200">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base font-semibold text-foreground">Dynamic Arc Tracking</CardTitle>
                    <Badge className="bg-accent/20 text-accent border-accent/30">Coming Soon</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <p className="text-sm text-muted-foreground">
                      Arc progression will automatically update based on your story outline and manuscript content:
                    </p>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-accent/50" />
                        Real-time character development tracking
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-accent/50" />
                        AI-powered arc milestone detection
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-accent/50" />
                        Dynamic progression visualization
                      </li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>


        </Tabs>
      </div>

      {/* Portrait Modal */}
      <CharacterPortraitModal
        character={formData}
        isOpen={isPortraitModalOpen}
        onClose={() => setIsPortraitModalOpen(false)}
        onImageGenerated={handleImageGenerated}
        onImageUploaded={handleImageGenerated}
      />

      {/* AI Assist Explanation Modal */}
      <AIAssistModal
        isOpen={isAIAssistModalOpen}
        onClose={() => setIsAIAssistModalOpen(false)}
        onStartAssist={handleAIEnhance}
        isProcessing={isEnhancing}
      />

      {/* AI Enhancement Loading Modal */}
      <LoadingModal
        isOpen={isEnhancing}
        title="AI Assist is working..."
        message="Scanning your character data across all categories and generating contextual details for each field."
        onAbort={handleAbortAI}
      />

    </div>
  );
}