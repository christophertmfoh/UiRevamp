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
import { ArrowLeft, Edit, Save, X, User, Eye, Brain, Zap, BookOpen, Users, PenTool, Camera, Trash2, Sparkles } from 'lucide-react';
import { apiRequest } from '@/lib/queryClient';
import type { Character } from '../../lib/types';
import { CHARACTER_SECTIONS, getCharacterFieldsBySection } from '../../lib/config/fieldConfig';
import { CharacterPortraitModal } from './CharacterPortraitModalImproved';
import { CharacterRelationships } from './CharacterRelationships';
import { CharacterArcTracker } from './CharacterArcTracker';
import { CharacterInsights } from './CharacterInsights';
import { LoadingModal } from '../ui/loading-modal';

interface CharacterUnifiedViewProps {
  projectId: string;
  character: Character;
  onBack: () => void;
  onDelete: (character: Character) => void;
}

// Icon mapping for dynamic icon rendering
const ICON_COMPONENTS = {
  User,
  Eye,
  Brain,
  Zap,
  BookOpen,
  Users,
  PenTool,
};

export function CharacterUnifiedView({ 
  projectId,
  character, 
  onBack, 
  onDelete 
}: CharacterUnifiedViewProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(character);
  const [activeTab, setActiveTab] = useState('identity');
  const [isPortraitModalOpen, setIsPortraitModalOpen] = useState(false);
  const [isEnhancing, setIsEnhancing] = useState(false);
  const queryClient = useQueryClient();

  // Save mutation
  const saveMutation = useMutation({
    mutationFn: async (data: Character) => {
      return await apiRequest('PUT', `/api/characters/${character.id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/projects', projectId, 'characters'] });
      setIsEditing(false);
    },
    onError: (error) => {
      console.error('Failed to save character:', error);
    }
  });

  const handleSave = () => {
    const processedData = processDataForSave(formData);
    // Remove problematic fields that should be handled by server
    const cleanData = {
      ...processedData,
      updatedAt: undefined, // Let server handle timestamp
      createdAt: undefined  // Let server handle timestamp
    };
    saveMutation.mutate(cleanData as any);
  };

  const handleCancel = () => {
    setFormData(character); // Reset form data
    setIsEditing(false);
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

  const processDataForSave = (data: Character) => {
    const processedData = { ...data };
    
    // Define all fields that should be arrays according to schema
    const arrayFields = [
      'personalityTraits', 'abilities', 'skills', 'talents', 'expertise', 
      'archetypes', 'tropes', 'tags'
    ];
    
    // Define all fields that should be strings according to schema  
    const stringFields = [
      'beliefs', 'values', 'principles', 'virtues', 'vices', 'habits', 'quirks',
      'idiosyncrasies', 'petPeeves', 'likes', 'dislikes', 'hobbies', 'interests', 
      'passions', 'formativeEvents', 'failures', 'allies', 'enemies', 'mentors', 
      'rivals', 'friends', 'family'
    ];
    
    // Process array fields - convert strings to arrays, keep arrays as arrays
    arrayFields.forEach(field => {
      const value = (data as any)[field];
      if (typeof value === 'string') {
        (processedData as any)[field] = value.split(',').map((v: string) => v.trim()).filter((v: string) => v);
      } else if (Array.isArray(value)) {
        (processedData as any)[field] = value; // Keep arrays as is
      } else {
        (processedData as any)[field] = [];
      }
    });
    
    // Process string fields - convert arrays/objects to strings
    stringFields.forEach(field => {
      const value = (data as any)[field];
      if (Array.isArray(value)) {
        (processedData as any)[field] = value.join(', ');
      } else if (typeof value === 'object' && value !== null) {
        (processedData as any)[field] = JSON.stringify(value);
      } else if (value === undefined || value === null) {
        (processedData as any)[field] = '';
      } else {
        (processedData as any)[field] = String(value);
      }
    });
    
    // Convert comma-separated strings back to arrays for array fields from all sections
    CHARACTER_SECTIONS.forEach(section => {
      const sectionFields = getCharacterFieldsBySection(section.id);
      sectionFields.forEach(field => {
        if (field.type === 'array') {
          const value = (data as any)[field.key];
          if (typeof value === 'string') {
            (processedData as any)[field.key] = value.split(',').map((v: string) => v.trim()).filter((v: string) => v);
          } else if (!Array.isArray(value)) {
            (processedData as any)[field.key] = [];
          }
        }
      });
    });
    
    // Ensure age is a string
    if (typeof processedData.age === 'number') {
      processedData.age = String(processedData.age);
    }
    
    // Remove any remaining undefined/null values
    Object.keys(processedData).forEach(key => {
      if ((processedData as any)[key] === undefined || (processedData as any)[key] === null) {
        (processedData as any)[key] = '';
      }
    });
    
    // Remove system fields that shouldn't be updated, but preserve portraits
    const { createdAt, id, projectId, ...dataToSave } = processedData;
    
    // Ensure portraits array is preserved
    if (character.portraits) {
      dataToSave.portraits = character.portraits;
    }
    
    return dataToSave;
  };

  const handleImageGenerated = (imageUrl: string) => {
    // Update character with new image, preserving portraits
    const updatedData = { 
      ...formData, 
      imageUrl,
      portraits: character.portraits || [] // Preserve existing portraits
    };
    setFormData(updatedData);
    
    // Process and save the data properly - exclude createdAt and other system fields
    const processedData = processDataForSave(updatedData);
    saveMutation.mutate(processedData as Character);
  };

  const handleImageUploaded = (imageUrl: string) => {
    // Update character with uploaded image, preserving portraits
    const updatedData = { 
      ...formData, 
      imageUrl,
      portraits: character.portraits || [] // Preserve existing portraits
    };
    setFormData(updatedData);
    
    // Process and save the data properly - exclude createdAt and other system fields
    const processedData = processDataForSave(updatedData);
    saveMutation.mutate(processedData as Character);
  };

  const handleInputChange = (field: string, value: string | string[]) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Helper function to render field based on type - matching organization module
  const renderField = (field: any, value: any) => {
    // Debug personalityTraits specifically
    if (field.key === 'personalityTraits') {
      console.log('=== RENDERFIELD PERSONALITY TRAITS DEBUG ===');
      console.log('field:', field);
      console.log('value:', value);
      console.log('typeof value:', typeof value);
      console.log('Array.isArray(value):', Array.isArray(value));
      console.log('value length:', Array.isArray(value) ? value.length : 'not array');
      console.log('isEditing:', isEditing);
      console.log('=== END RENDERFIELD DEBUG ===');
    }
    if (isEditing) {
      switch (field.type) {
        case 'text':
          return (
            <div key={field.key} className="space-y-2">
              <Label htmlFor={field.key}>{field.label}</Label>
              <Input
                id={field.key}
                value={value || ''}
                onChange={(e) => handleInputChange(field.key, e.target.value)}
                placeholder={`Enter ${field.label.toLowerCase()}...`}
                className="creative-input"
              />
            </div>
          );
        
        case 'textarea':
          return (
            <div key={field.key} className="space-y-2">
              <Label htmlFor={field.key}>{field.label}</Label>
              <Textarea
                id={field.key}
                value={value || ''}
                onChange={(e) => handleInputChange(field.key, e.target.value)}
                placeholder={`Enter ${field.label.toLowerCase()}...`}
                className="creative-input min-h-[100px] resize-y"
              />
            </div>
          );
        
        case 'select':
          return (
            <div key={field.key} className="space-y-2">
              <Label htmlFor={field.key}>{field.label}</Label>
              <Select 
                value={value || ''} 
                onValueChange={(newValue) => handleInputChange(field.key, newValue)}
              >
                <SelectTrigger className="creative-input">
                  <SelectValue placeholder={`Select ${field.label.toLowerCase()}...`} />
                </SelectTrigger>
                <SelectContent>
                  {field.options?.map((option: string) => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          );
        
        case 'array':
          return (
            <div key={field.key} className="space-y-2">
              <Label htmlFor={field.key}>{field.label}</Label>
              <Input
                id={field.key}
                value={Array.isArray(value) ? value.join(', ') : ''}
                onChange={(e) => handleInputChange(field.key, e.target.value.split(',').map(s => s.trim()).filter(Boolean))}
                placeholder={`Enter ${field.label.toLowerCase()}, separated by commas...`}
                className="creative-input"
              />
            </div>
          );
        
        default:
          return (
            <div key={field.key} className="space-y-2">
              <Label htmlFor={field.key}>{field.label}</Label>
              <Input
                id={field.key}
                value={value || ''}
                onChange={(e) => handleInputChange(field.key, e.target.value)}
                placeholder={`Enter ${field.label.toLowerCase()}...`}
                className="creative-input"
              />
            </div>
          );
      }
    } else {
      // View mode - show all fields, but only display content if present
      return (
        <div key={field.key} className="space-y-2">
          <Label className="text-muted-foreground">{field.label}</Label>
          {(!value || (Array.isArray(value) && value.length === 0) || (typeof value === 'string' && value.trim() === '')) ? (
            <div className="text-sm text-muted-foreground italic">
              No {field.label.toLowerCase()} added yet
            </div>
          ) : Array.isArray(value) ? (
            <div className="flex flex-wrap gap-1">
              {value.map((item: string, index: number) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  {item}
                </Badge>
              ))}
            </div>
          ) : (
            <p className="text-sm">{value}</p>
          )}
        </div>
      );
    }
  };



  // Render tab content with grid layout matching organization module
  const renderTabContent = (sectionId: string) => {
    const section = CHARACTER_SECTIONS.find(s => s.id === sectionId);
    if (!section) return null;

    // Get fields for this section
    const sectionFields = getCharacterFieldsBySection(sectionId);
    
    // Debug personality section specifically
    if (sectionId === 'personality') {
      console.log('=== PERSONALITY SECTION DEBUG ===');
      console.log('sectionFields:', sectionFields.map(f => f.key));
      console.log('formData.personalityTraits:', formData.personalityTraits);
      console.log('type of personalityTraits:', typeof formData.personalityTraits);
      console.log('Array.isArray(personalityTraits):', Array.isArray(formData.personalityTraits));
      console.log('=== END DEBUG ===');
    }
    
    return sectionFields.map((field) => 
      renderField(field, formData[field.key as keyof Character])
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={onBack} className="gap-2">
          <ArrowLeft className="h-4 w-4" />
          Back to Characters
        </Button>
        <div className="flex gap-2">
          {!isEditing ? (
            <>
              <Button 
                variant="outline" 
                onClick={() => setIsEditing(true)}
              >
                <Edit className="h-4 w-4 mr-2" />
                Edit Character
              </Button>
              <Button 
                variant="destructive" 
                onClick={() => onDelete(character)}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </Button>
            </>
          ) : (
            <>
              <Button 
                onClick={handleAIEnhance}
                disabled={isEnhancing}
                variant="outline"
                className="bg-gradient-to-r from-orange-500/10 to-yellow-500/10 border-orange-300 hover:from-orange-500/20 hover:to-yellow-500/20"
              >
                <Sparkles className="h-4 w-4 mr-2" />
                {isEnhancing ? 'Enhancing...' : 'AI Genie'}
              </Button>
              <Button 
                onClick={handleSave} 
                disabled={saveMutation.isPending}
                variant="outline"
              >
                <Save className="h-4 w-4 mr-2" />
                {saveMutation.isPending ? 'Saving...' : 'Save Character'}
              </Button>
              <Button onClick={handleCancel} variant="outline" className="gap-2">
                <X className="h-4 w-4" />
                Cancel
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Character Header Card */}
      <Card className="creative-card">
        <CardContent className="p-6">
          <div className="flex items-start gap-6">
            {/* Character Image - Clickable */}
            <div 
              className="w-32 h-32 rounded-xl bg-gradient-to-br from-amber-100 to-orange-200 dark:from-amber-900/30 dark:to-orange-900/30 flex items-center justify-center flex-shrink-0 cursor-pointer hover:opacity-80 transition-opacity relative group"
              onClick={() => setIsPortraitModalOpen(true)}
            >
              {formData.imageUrl ? (
                <img 
                  src={formData.imageUrl} 
                  alt={formData.name}
                  className="w-full h-full object-cover rounded-xl"
                />
              ) : (
                <User className="h-16 w-16 text-amber-600 dark:text-amber-400" />
              )}
              
              {/* Hover overlay */}
              <div className="absolute inset-0 bg-black/50 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <Camera className="h-8 w-8 text-white" />
              </div>
            </div>

            {/* Character Basic Info */}
            <div className="flex-1">
              <h1 className="font-title text-3xl mb-2">
                {formData.name || 'Unnamed Character'}
              </h1>
              
              {formData.title && (
                <p className="text-lg text-muted-foreground mb-3 italic">"{formData.title}"</p>
              )}
              
              <div className="flex flex-wrap gap-2 mb-4">
                {formData.nicknames && (
                  <Badge variant="secondary" className="text-sm px-3 py-1">
                    "{formData.nicknames}"
                  </Badge>
                )}
                {formData.role && (
                  <Badge variant="default" className="text-sm px-3 py-1">
                    {formData.role}
                  </Badge>
                )}
                {formData.class && (
                  <Badge variant="outline" className="text-sm">
                    {formData.class}
                  </Badge>
                )}
                {formData.age && (
                  <Badge variant="outline" className="text-sm">
                    Age {formData.age}
                  </Badge>
                )}
              </div>



              {formData.oneLine && (
                <p className="text-lg italic text-muted-foreground mb-3">
                  "{formData.oneLine}"
                </p>
              )}
              
              {formData.description && (
                <p className="text-lg text-muted-foreground leading-relaxed">
                  {formData.description}
                </p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Content - Improved Sidebar Layout like Organizations */}
      <div className="flex gap-6">
        {/* Left Sidebar Navigation */}
        <div className="w-64 space-y-2">
          {CHARACTER_SECTIONS.map((section) => {
            const IconComponent = ICON_COMPONENTS[section.icon as keyof typeof ICON_COMPONENTS] || User;
            const isActive = activeTab === section.id;
            return (
              <button
                key={section.id}
                onClick={() => setActiveTab(section.id)}
                className={`w-full text-left p-3 rounded-lg transition-colors flex items-start space-x-3 ${
                  isActive 
                    ? 'bg-yellow-500/10 text-yellow-600 border border-yellow-500/30' 
                    : 'hover:bg-muted/50 text-muted-foreground hover:text-foreground'
                }`}
              >
                <IconComponent className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <div>
                  <div className="font-medium text-sm">{section.title}</div>
                </div>
              </button>
            );
          })}
          
          {/* New Competitive Features */}
          <button
            onClick={() => setActiveTab('relationships')}
            className={`w-full text-left p-3 rounded-lg transition-colors flex items-start space-x-3 ${
              activeTab === 'relationships'
                ? 'bg-yellow-500/10 text-yellow-600 border border-yellow-500/30' 
                : 'hover:bg-muted/50 text-muted-foreground hover:text-foreground'
            }`}
          >
            <Users className="h-4 w-4 mt-0.5 flex-shrink-0" />
            <div>
              <div className="font-medium text-sm">Relationships</div>
            </div>
          </button>
          
          <button
            onClick={() => setActiveTab('arcs')}
            className={`w-full text-left p-3 rounded-lg transition-colors flex items-start space-x-3 ${
              activeTab === 'arcs'
                ? 'bg-yellow-500/10 text-yellow-600 border border-yellow-500/30' 
                : 'hover:bg-muted/50 text-muted-foreground hover:text-foreground'
            }`}
          >
            <BookOpen className="h-4 w-4 mt-0.5 flex-shrink-0" />
            <div>
              <div className="font-medium text-sm">Character Arcs</div>
            </div>
          </button>
          
          <button
            onClick={() => setActiveTab('insights')}
            className={`w-full text-left p-3 rounded-lg transition-colors flex items-start space-x-3 ${
              activeTab === 'insights'
                ? 'bg-yellow-500/10 text-yellow-600 border border-yellow-500/30' 
                : 'hover:bg-muted/50 text-muted-foreground hover:text-foreground'
            }`}
          >
            <Brain className="h-4 w-4 mt-0.5 flex-shrink-0" />
            <div>
              <div className="font-medium text-sm">AI Insights</div>
            </div>
          </button>
        </div>

        {/* Right Content Area */}
        <div className="flex-1">
          <Card className="creative-card">
            <div className="p-6">
              {CHARACTER_SECTIONS.map((section) => {
                if (activeTab !== section.id) return null;
                
                return (
                  <div key={section.id} className="space-y-8">
                    <div>
                      <h3 className="text-lg font-semibold mb-1">{section.title}</h3>
                      <p className="text-sm text-muted-foreground mb-6">{section.description}</p>
                      <div className="grid gap-6 md:grid-cols-2">
                        {renderTabContent(section.id)}
                      </div>
                    </div>
                  </div>
                );
              })}
              
              {/* New Competitive Features Content */}
              {activeTab === 'relationships' && (
                <div className="space-y-8">
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Character Relationships</h3>
                    <p className="text-sm text-muted-foreground mb-6">
                      Map {character.name}'s connections with other characters in your story
                    </p>
                    <div className="text-center py-8 text-muted-foreground">
                      <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p className="font-medium">Dynamic Relationship Mapping</p>
                      <p className="text-sm mt-2">This feature will intelligently update based on your outline and manuscript</p>
                      <p className="text-xs mt-1 opacity-75">New events between characters will automatically update relationship status</p>
                    </div>
                  </div>
                </div>
              )}
              
              {activeTab === 'arcs' && (
                <div className="space-y-8">
                  <CharacterArcTracker
                    characterName={character.name || 'Character'}
                    onUpdateArcs={(arcs) => {
                      setFormData(prev => ({ ...prev, arc: JSON.stringify(arcs) }));
                    }}
                  />
                </div>
              )}
              
              {activeTab === 'insights' && (
                <div className="space-y-8">
                  <CharacterInsights character={character} />
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>

      {/* Character Portrait Modal */}
      <CharacterPortraitModal
        character={formData}
        isOpen={isPortraitModalOpen}
        onClose={() => setIsPortraitModalOpen(false)}
        onImageGenerated={handleImageGenerated}
        onImageUploaded={handleImageUploaded}
      />

      {/* AI Enhancement Loading Modal */}
      <LoadingModal
        isOpen={isEnhancing}
        title="AI Genie is working..."
        message="Scanning your character data across all categories and generating contextual details for each field."
      />
    </div>
  );
}