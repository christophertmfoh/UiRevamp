import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, Edit, Save, X, User, Eye, Brain, Zap, BookOpen, Users, PenTool, Camera, Trash2 } from 'lucide-react';
import { apiRequest } from '@/lib/queryClient';
import type { Character } from '../../lib/types';
import { CHARACTER_SECTIONS } from '../../lib/config';
import { CharacterPortraitModal } from './CharacterPortraitModal';

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
    saveMutation.mutate(processedData as Character);
  };

  const handleCancel = () => {
    setFormData(character); // Reset form data
    setIsEditing(false);
  };

  const processDataForSave = (data: Character) => {
    const processedData = { ...data };
    
    // Ensure all array fields are properly formatted
    const arrayFields = [
      'personalityTraits', 'abilities', 'skills', 'talents', 'expertise', 
      'languages', 'archetypes', 'tropes', 'tags'
    ];
    
    arrayFields.forEach(field => {
      const value = (data as any)[field];
      if (typeof value === 'string') {
        (processedData as any)[field] = value.split(',').map((v: string) => v.trim()).filter((v: string) => v);
      } else if (!Array.isArray(value) || value === undefined || value === null) {
        (processedData as any)[field] = [];
      }
    });
    
    // Convert comma-separated strings back to arrays for array fields from sections
    CHARACTER_SECTIONS.forEach(section => {
      section.fields.forEach(field => {
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
    
    // Remove any undefined values that might cause validation issues
    Object.keys(processedData).forEach(key => {
      if ((processedData as any)[key] === undefined || (processedData as any)[key] === null) {
        (processedData as any)[key] = '';
      }
    });
    
    // Remove system fields that shouldn't be updated, but preserve portraits
    const { createdAt, updatedAt, id, projectId, ...dataToSave } = processedData;
    
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

  // Helper function to render a field - always show inputs, toggle disabled state
  const renderField = (field: any, value: string | undefined) => {
    if (field.type === 'textarea') {
      return (
        <div>
          <Label htmlFor={field.key}>{field.label}</Label>
          <Textarea
            id={field.key}
            value={value || ''}
            onChange={(e) => handleInputChange(field.key, e.target.value)}
            placeholder={isEditing ? field.placeholder : ''}
            rows={field.rows || 3}
            className="creative-input"
            disabled={!isEditing}
          />
        </div>
      );
    } else {
      return (
        <div>
          <Label htmlFor={field.key}>{field.label}</Label>
          <Input
            id={field.key}
            value={value || ''}
            onChange={(e) => handleInputChange(field.key, e.target.value)}
            placeholder={isEditing ? field.placeholder : ''}
            className="creative-input"
            disabled={!isEditing}
          />
        </div>
      );
    }
  };

  // Helper function to render array fields - always show input, toggle disabled state
  const renderArrayField = (field: any, values: string[] | undefined) => {
    const stringValue = Array.isArray(values) ? values.join(', ') : values || '';
    return (
      <div>
        <Label htmlFor={field.key}>{field.label}</Label>
        <Input
          id={field.key}
          value={stringValue}
          onChange={(e) => {
            const arrayValue = e.target.value.split(',').map((v: string) => v.trim()).filter((v: string) => v);
            handleInputChange(field.key, arrayValue);
          }}
          placeholder={isEditing ? field.placeholder : ''}
          className="creative-input"
          disabled={!isEditing}
        />
        {/* Show badges below input when in view mode and has values */}
        {!isEditing && values && values.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2">
            {(Array.isArray(values) ? values : String(values).split(',').map((v: string) => v.trim()))
              .filter((v: string) => v?.trim())
              .map((value: string, index: number) => (
                <Badge key={index} variant="outline" className="text-sm">
                  {value.trim()}
                </Badge>
              ))}
          </div>
        )}
      </div>
    );
  };

  // Render tab content with grid layout like the original editor
  const renderTabContent = (sectionId: string) => {
    const section = CHARACTER_SECTIONS.find(s => s.id === sectionId);
    if (!section) return null;

    return (
      <div className="space-y-6">
        {section.fields.map((field, index) => {
          const value = (formData as any)[field.key];
          
          if (field.type === 'array') {
            return (
              <div key={field.key}>
                {renderArrayField(field, value)}
              </div>
            );
          } else {
            return (
              <div key={field.key}>
                {renderField(field, value)}
              </div>
            );
          }
        })}
      </div>
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
    </div>
  );
}