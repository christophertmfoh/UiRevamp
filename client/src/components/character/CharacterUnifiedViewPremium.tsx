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
import { LoadingModal } from '@/components/ui/loading-modal';
import { AIAssistModal } from './AIAssistModal';

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

  const processDataForSave = (data: Character) => {
    const processedData = { ...data };
    
    // Convert arrays to strings for database storage
    Object.keys(processedData).forEach(key => {
      const value = (processedData as any)[key];
      if (Array.isArray(value)) {
        (processedData as any)[key] = value.join(', ');
      }
    });
    
    return processedData;
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

  const deleteMutation = useMutation({
    mutationFn: async () => {
      return await apiRequest('DELETE', `/api/characters/${character.id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/projects', projectId, 'characters'] });
      onDelete(character);
    },
  });

  const handleSave = () => {
    saveMutation.mutate(formData);
  };

  const handleImageGenerated = (imageUrl: string) => {
    setFormData({ ...formData, imageUrl });
  };

  const handleAIEnhance = async (selectedCategories: string[]) => {
    try {
      setIsEnhancing(true);
      setSelectedCategories(selectedCategories);
      
      const controller = new AbortController();
      setAbortController(controller);

      console.log('Starting AI enhancement for character:', character.id, 'Categories:', selectedCategories);

      const response = await fetch('/api/characters/enhance', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          characterData: formData,
          categories: selectedCategories
        }),
        signal: controller.signal
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const enhancedData = await response.json();
      
      // Merge enhanced data with existing data
      setFormData(prev => ({
        ...prev,
        ...enhancedData
      }));
      
    } catch (error: any) {
      if (error.name === 'AbortError') {
        console.log('AI enhancement was aborted');
      } else {
        console.error('AI enhancement failed:', error);
      }
    } finally {
      setIsEnhancing(false);
      setAbortController(null);
    }
  };

  const handleAbortAI = () => {
    if (abortController) {
      abortController.abort();
    }
  };

  const completeness = calculateCompleteness(formData);

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* Header Section */}
      <div className="border-b border-border/30 pb-6">
        <div className="flex items-start justify-between">
          {/* Left side - Character info and actions */}
          <div className="flex items-start gap-6">
            <Button variant="ghost" size="sm" onClick={onBack} className="p-2">
              <ArrowLeft className="h-4 w-4" />
            </Button>
            
            {/* Character Avatar */}
            <div className="relative group">
              <div className="w-24 h-24 rounded-xl bg-gradient-to-br from-accent/20 to-accent/40 flex items-center justify-center overflow-hidden border-2 border-accent/20">
                {formData.imageUrl ? (
                  <img 
                    src={formData.imageUrl} 
                    alt={formData.name} 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User className="h-10 w-10 text-accent/60" />
                )}
              </div>
              {isEditing && (
                <Button
                  size="sm"
                  variant="outline"
                  className="absolute -bottom-2 -right-2 h-8 w-8 p-0 border-2 bg-background shadow-lg"
                  onClick={() => setIsPortraitModalOpen(true)}
                >
                  <Camera className="h-3 w-3" />
                </Button>
              )}
            </div>
            
            {/* Character details */}
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">
                {formData.name || 'Unnamed Character'}
              </h1>
              <div className="flex flex-wrap gap-2 mb-3">
                {formData.race && (
                  <Badge variant="outline" className="border-accent/30 text-accent">
                    {formData.race}
                  </Badge>
                )}
                {formData.class && (
                  <Badge variant="outline" className="border-accent/30 text-accent">
                    {formData.class}
                  </Badge>
                )}
                {formData.age && (
                  <Badge variant="outline" className="border-accent/30 text-accent">
                    Age {formData.age}
                  </Badge>
                )}
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <div className="text-sm font-medium text-foreground">
                    {completeness}% Complete
                  </div>
                  <div className="w-24 h-2 bg-border rounded-full">
                    <div 
                      className="h-full bg-gradient-to-r from-accent to-accent/80 rounded-full transition-all duration-300"
                      style={{ width: `${completeness}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right side - Action buttons */}
          <div className="flex items-center gap-3">
            {!isEditing ? (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsAIAssistModalOpen(true)}
                  className="gap-2"
                  disabled={isEnhancing}
                >
                  <Sparkles className="h-4 w-4" />
                  AI Enhance
                </Button>
                <Button onClick={() => setIsEditing(true)} className="gap-2">
                  <Edit className="h-4 w-4" />
                  Edit
                </Button>
              </>
            ) : (
              <>
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsEditing(false);
                    setFormData(character);
                  }}
                  className="gap-2"
                >
                  <X className="h-4 w-4" />
                  Cancel
                </Button>
                <Button
                  onClick={handleSave}
                  disabled={saveMutation.isPending}
                  className="gap-2"
                >
                  <Save className="h-4 w-4" />
                  Save Changes
                </Button>
              </>
            )}
            <Button
              variant="destructive"
              size="sm"
              onClick={() => deleteMutation.mutate()}
              disabled={deleteMutation.isPending}
              className="gap-2"
            >
              <Trash2 className="h-4 w-4" />
              Delete
            </Button>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-border/30">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-6 bg-accent/5 p-1 rounded-lg">
            {[
              { id: 'identity', label: 'Identity', icon: User },
              { id: 'physical', label: 'Physical', icon: Eye },
              { id: 'personality', label: 'Personality', icon: Brain },
              { id: 'skills', label: 'Skills', icon: Zap },
              { id: 'background', label: 'Background', icon: BookOpen },
              { id: 'story', label: 'Story', icon: Users }
            ].map((tab) => {
              const IconComponent = tab.icon;
              return (
                <TabsTrigger 
                  key={tab.id} 
                  value={tab.id} 
                  className="flex items-center gap-2 data-[state=active]:bg-background data-[state=active]:shadow-sm"
                >
                  <IconComponent className="h-4 w-4" />
                  <span className="hidden sm:inline">{tab.label}</span>
                </TabsTrigger>
              );
            })}
          </TabsList>

          <TabsContent value="identity" className="space-y-6">
            <div className="border-b border-border/30 pb-4">
              <h2 className="text-2xl font-bold text-foreground">Identity</h2>
              <p className="text-muted-foreground mt-1">Full name, nicknames, title, aliases, age, race/species, class/profession, story role</p>
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
                  'Protagonist', 'Antagonist', 'Supporting Character', 'Mentor', 'Love Interest', 
                  'Comic Relief', 'Anti-hero', 'Deuteragonist', 'Tritagonist', 'Foil', 'Other'
                ]}
              ].map((field) => (
                <Card key={field.key} className="border border-border/30 bg-gradient-to-br from-background to-accent/5 hover:shadow-lg transition-all duration-200">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base font-semibold text-foreground">{field.label}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {isEditing ? (
                      field.type === 'select' ? (
                        <Select
                          value={(formData as any)[field.key] || ''}
                          onValueChange={(value) => setFormData({...formData, [field.key]: value})}
                        >
                          <SelectTrigger className="border-accent/20 focus:border-accent focus:ring-accent/20">
                            <SelectValue placeholder={field.placeholder} />
                          </SelectTrigger>
                          <SelectContent>
                            {field.options?.map((option) => (
                              <SelectItem key={option} value={option}>
                                {option}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      ) : (
                        <Input
                          value={(formData as any)[field.key] || ''}
                          onChange={(e) => setFormData({...formData, [field.key]: e.target.value})}
                          placeholder={field.placeholder}
                          className="border-accent/20 focus:border-accent focus:ring-accent/20"
                        />
                      )
                    ) : (
                      <p className="text-muted-foreground min-h-[2rem] flex items-center">
                        {(formData as any)[field.key] || 'Not specified'}
                      </p>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Add similar TabsContent for other sections... */}

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

      {/* AI Assist Modal */}
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