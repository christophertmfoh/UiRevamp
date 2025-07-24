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
import type { Character } from '../../lib/types';
import { CharacterPortraitModal } from './CharacterPortraitModalImproved';

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
  const queryClient = useQueryClient();

  // Calculate character completeness
  const calculateCompleteness = (char: Character) => {
    return Math.min(100, (
      (char.name ? 10 : 0) + 
      (char.description ? 15 : 0) + 
      (char.imageUrl ? 15 : 0) + 
      (char.personalityTraits?.length ? 10 : 0) + 
      (char.race ? 10 : 0) +
      (char.class ? 10 : 0) +
      (char.age ? 5 : 0) +
      (char.background ? 10 : 0) +
      (char.goals ? 10 : 0) +
      (char.relationships ? 5 : 0)
    ));
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
    if (isEditing) {
      setFormData({ ...formData, imageUrl });
    }
  };

  const handleAIEnhance = async () => {
    setIsEnhancing(true);
    try {
      console.log('Starting AI enhancement for character:', character.id);
      
      const response = await apiRequest('POST', `/api/characters/${character.id}/enhance`, formData);
      const enhancedData = await response.json();
      console.log('AI enhancement response received:', enhancedData);
      
      // Process the enhanced data to ensure correct types before updating form
      const processedEnhancedData = processDataForSave({ ...character, ...enhancedData });
      
      // Update form data with processed data
      setFormData({ ...character, ...processedEnhancedData } as Character);
      
      console.log('Form data updated with enhanced character');
    } catch (error) {
      console.error('Failed to enhance character:', error);
      alert('AI enhancement failed. This may be due to API rate limits. Please try again in a moment.');
    } finally {
      setIsEnhancing(false);
    }
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
                  onClick={handleAIEnhance}
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
                  <h1 className="text-4xl font-bold bg-gradient-to-r from-foreground via-accent to-foreground/80 bg-clip-text text-transparent">
                    {formData.name || 'Unnamed Character'}
                  </h1>
                  <Badge className="bg-accent/90 text-accent-foreground font-medium text-sm px-3 py-1">
                    {formData.role || 'Character'}
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
              <p className="text-muted-foreground mt-1">Basic character information and core identity</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {[
                { key: 'name', label: 'Name', type: 'text', placeholder: 'Character name' },
                { key: 'title', label: 'Title', type: 'text', placeholder: 'Character title or nickname' },
                { key: 'role', label: 'Role in Story', type: 'text', placeholder: 'Protagonist, antagonist, etc.' },
                { key: 'race', label: 'Race/Species', type: 'text', placeholder: 'Human, elf, etc.' },
                { key: 'class', label: 'Class/Profession', type: 'text', placeholder: 'Warrior, mage, etc.' },
                { key: 'age', label: 'Age', type: 'text', placeholder: 'Character age' }
              ].map((field) => (
                <Card key={field.key} className="border border-border/30 bg-gradient-to-br from-background to-accent/5 hover:shadow-lg transition-all duration-200">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base font-semibold text-foreground">{field.label}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {isEditing ? (
                      <Input
                        value={(formData as any)[field.key] || ''}
                        onChange={(e) => setFormData({...formData, [field.key]: e.target.value})}
                        placeholder={field.placeholder}
                        className="border-accent/20 focus:border-accent focus:ring-accent/20"
                      />
                    ) : (
                      <div className="space-y-2">
                        {(formData as any)[field.key] ? (
                          <p className="text-sm text-foreground leading-relaxed">
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
                              className="mt-2 text-accent hover:bg-accent/10"
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

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {[
                { key: 'description', label: 'Physical Description', type: 'textarea', placeholder: 'Describe the character\'s appearance...' },
                { key: 'height', label: 'Height', type: 'text', placeholder: 'Character height' },
                { key: 'build', label: 'Build', type: 'text', placeholder: 'Slim, muscular, etc.' },
                { key: 'hairColor', label: 'Hair Color', type: 'text', placeholder: 'Hair color and style' },
                { key: 'eyeColor', label: 'Eye Color', type: 'text', placeholder: 'Eye color' },
                { key: 'distinguishingFeatures', label: 'Distinguishing Features', type: 'textarea', placeholder: 'Scars, tattoos, unique features...' }
              ].map((field) => (
                <Card key={field.key} className="border border-border/30 bg-gradient-to-br from-background to-accent/5 hover:shadow-lg transition-all duration-200">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base font-semibold text-foreground">{field.label}</CardTitle>
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
                              className="mt-2 text-accent hover:bg-accent/10"
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

          <TabsContent value="personality" className="space-y-6">
            <div className="border-b border-border/30 pb-4">
              <h2 className="text-2xl font-bold text-foreground">Personality</h2>
              <p className="text-muted-foreground mt-1">Character traits, motivations, and psychology</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {[
                { key: 'personalityTraits', label: 'Personality Traits', type: 'array', placeholder: 'brave, loyal, curious (comma-separated)' },
                { key: 'goals', label: 'Goals', type: 'textarea', placeholder: 'What does this character want to achieve?' },
                { key: 'motivations', label: 'Motivations', type: 'textarea', placeholder: 'What drives this character?' },
                { key: 'fears', label: 'Fears', type: 'textarea', placeholder: 'What is this character afraid of?' },
                { key: 'values', label: 'Values', type: 'textarea', placeholder: 'What does this character value most?' },
                { key: 'flaws', label: 'Flaws', type: 'textarea', placeholder: 'Character weaknesses and flaws' }
              ].map((field) => (
                <Card key={field.key} className="border border-border/30 bg-gradient-to-br from-background to-accent/5 hover:shadow-lg transition-all duration-200">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base font-semibold text-foreground">{field.label}</CardTitle>
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
                        {(formData as any)[field.key] ? (
                          field.type === 'array' && Array.isArray((formData as any)[field.key]) ? (
                            <div className="flex flex-wrap gap-1">
                              {((formData as any)[field.key] as string[]).map((item: string, index: number) => (
                                <Badge key={index} className="text-xs bg-accent/15 text-accent border border-accent/20">
                                  {item}
                                </Badge>
                              ))}
                            </div>
                          ) : (
                            <p className="text-sm text-foreground leading-relaxed whitespace-pre-wrap">
                              {(formData as any)[field.key]}
                            </p>
                          )
                        ) : (
                          <div className="text-center py-4">
                            <p className="text-sm text-muted-foreground italic">
                              No {field.label.toLowerCase()} added yet
                            </p>
                            <Button 
                              onClick={() => setIsEditing(true)}
                              variant="ghost" 
                              size="sm" 
                              className="mt-2 text-accent hover:bg-accent/10"
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
              <p className="text-muted-foreground mt-1">Character history, relationships, and story context</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {[
                { key: 'background', label: 'Background', type: 'textarea', placeholder: 'Character\'s history and backstory...' },
                { key: 'family', label: 'Family', type: 'textarea', placeholder: 'Family members and relationships' },
                { key: 'relationships', label: 'Key Relationships', type: 'textarea', placeholder: 'Important relationships and connections' },
                { key: 'occupation', label: 'Occupation', type: 'text', placeholder: 'Character\'s job or role in society' },
                { key: 'education', label: 'Education', type: 'text', placeholder: 'Educational background' },
                { key: 'secrets', label: 'Secrets', type: 'textarea', placeholder: 'Hidden information about the character' }
              ].map((field) => (
                <Card key={field.key} className="border border-border/30 bg-gradient-to-br from-background to-accent/5 hover:shadow-lg transition-all duration-200">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base font-semibold text-foreground">{field.label}</CardTitle>
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
                              className="mt-2 text-accent hover:bg-accent/10"
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
                { key: 'abilities', label: 'Abilities', type: 'array', placeholder: 'Combat, Magic, etc.' },
                { key: 'skills', label: 'Skills', type: 'array', placeholder: 'Swordsmanship, Diplomacy, etc.' },
                { key: 'talents', label: 'Talents', type: 'array', placeholder: 'Natural gifts and aptitudes' },
                { key: 'specialAbilities', label: 'Special Abilities', type: 'textarea', placeholder: 'Unique powers or magical abilities...' },
                { key: 'strengths', label: 'Strengths', type: 'textarea', placeholder: 'Character strengths and competencies...' },
                { key: 'training', label: 'Training', type: 'textarea', placeholder: 'Formal training and education...' }
              ].map((field) => (
                <Card key={field.key} className="border border-border/30 bg-gradient-to-br from-background to-accent/5 hover:shadow-lg transition-all duration-200">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base font-semibold text-foreground">{field.label}</CardTitle>
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
                        {(field.type === 'array' && Array.isArray((formData as any)[field.key]) && (formData as any)[field.key].length > 0) ? (
                          <div className="flex flex-wrap gap-2">
                            {(formData as any)[field.key].map((item: string, index: number) => (
                              <Badge key={index} variant="secondary" className="bg-accent/10 text-accent border-accent/20">
                                {item}
                              </Badge>
                            ))}
                          </div>
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
                              className="mt-2 text-accent hover:bg-accent/10"
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
                  { key: 'family', label: 'Family', type: 'textarea', placeholder: 'Family members and relationships...' },
                  { key: 'friends', label: 'Friends', type: 'textarea', placeholder: 'Close friends and companions...' },
                  { key: 'allies', label: 'Allies', type: 'textarea', placeholder: 'Political or strategic allies...' },
                  { key: 'enemies', label: 'Enemies', type: 'textarea', placeholder: 'Opponents and adversaries...' },
                  { key: 'mentors', label: 'Mentors', type: 'textarea', placeholder: 'Teachers and guides...' },
                  { key: 'relationships', label: 'Other Relationships', type: 'textarea', placeholder: 'Additional important connections...' }
                ].map((field) => (
                <Card key={field.key} className="border border-border/30 bg-gradient-to-br from-background to-accent/5 hover:shadow-lg transition-all duration-200">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base font-semibold text-foreground">{field.label}</CardTitle>
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
                              className="mt-2 text-accent hover:bg-accent/10"
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
                { key: 'goals', label: 'Goals & Motivations', type: 'textarea', placeholder: 'Character goals and driving motivations...' },
                { key: 'arc', label: 'Character Arc', type: 'textarea', placeholder: 'Character development and transformation...' },
                { key: 'storyFunction', label: 'Story Function', type: 'text', placeholder: 'Role in the narrative' },
                { key: 'archetypes', label: 'Archetypes', type: 'array', placeholder: 'Hero, Mentor, Trickster, etc.' },
                { key: 'themes', label: 'Themes', type: 'array', placeholder: 'Associated themes and symbolism' },
                { key: 'notes', label: 'Writer\'s Notes', type: 'textarea', placeholder: 'Development notes and ideas...' }
              ].map((field) => (
                <Card key={field.key} className="border border-border/30 bg-gradient-to-br from-background to-accent/5 hover:shadow-lg transition-all duration-200">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base font-semibold text-foreground">{field.label}</CardTitle>
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
                        {(field.type === 'array' && Array.isArray((formData as any)[field.key]) && (formData as any)[field.key].length > 0) ? (
                          <div className="flex flex-wrap gap-2">
                            {(formData as any)[field.key].map((item: string, index: number) => (
                              <Badge key={index} variant="secondary" className="bg-accent/10 text-accent border-accent/20">
                                {item}
                              </Badge>
                            ))}
                          </div>
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
                              className="mt-2 text-accent hover:bg-accent/10"
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
                            className="mt-2 text-accent hover:bg-accent/10"
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


    </div>
  );
}