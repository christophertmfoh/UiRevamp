import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, Edit, Save, X, MapPin, Compass, TreePine, Building, Crown, Scroll, Camera, Settings } from 'lucide-react';
import { apiRequest } from '@/lib/queryClient';
import type { Location } from '@/lib/types';
import { LOCATION_SECTIONS } from '@/lib/locationConfig';
import { LocationPortraitModal } from './LocationPortraitModal';

interface LocationUnifiedViewProps {
  projectId: string;
  location: Location;
  onBack: () => void;
  onDelete: (location: Location) => void;
}

// Icon mapping for dynamic icon rendering
const ICON_COMPONENTS = {
  MapPin,
  Compass,
  TreePine,
  Building,
  Crown,
  Scroll,
  Camera,
  Settings,
};

export function LocationUnifiedView({ 
  projectId,
  location, 
  onBack, 
  onDelete 
}: LocationUnifiedViewProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(location);
  const [activeTab, setActiveTab] = useState('identity');
  const [isPortraitModalOpen, setIsPortraitModalOpen] = useState(false);
  const queryClient = useQueryClient();

  // Save mutation
  const saveMutation = useMutation({
    mutationFn: async (data: Location) => {
      return await apiRequest('PUT', `/api/locations/${location.id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/projects', projectId, 'locations'] });
      setIsEditing(false);
    },
    onError: (error) => {
      console.error('Failed to save location:', error);
    }
  });

  const handleSave = () => {
    const processedData = processDataForSave(formData);
    saveMutation.mutate(processedData as Location);
  };

  const handleCancel = () => {
    setFormData(location); // Reset form data
    setIsEditing(false);
  };

  const processDataForSave = (data: Location) => {
    const processedData = { ...data };
    
    // Ensure all array fields are properly formatted
    const arrayFields = ['languages', 'tags'];
    
    arrayFields.forEach(field => {
      const value = (data as any)[field];
      if (typeof value === 'string') {
        (processedData as any)[field] = value.split(',').map((v: string) => v.trim()).filter((v: string) => v);
      } else if (!Array.isArray(value) || value === undefined || value === null) {
        (processedData as any)[field] = [];
      }
    });
    
    // Convert comma-separated strings back to arrays for array fields from sections
    LOCATION_SECTIONS.forEach(section => {
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
    
    // Remove system fields that shouldn't be updated, but preserve imageGallery
    const { createdAt, id, projectId, ...dataToSave } = processedData;
    
    // Ensure imageGallery array is preserved
    if (location.imageGallery) {
      dataToSave.imageGallery = location.imageGallery;
    }
    
    return dataToSave;
  };

  const handleImageGenerated = (imageUrl: string) => {
    // Update location with new image, preserving imageGallery
    const updatedData = { 
      ...formData, 
      imageUrl,
      imageGallery: location.imageGallery || [] // Preserve existing gallery
    };
    setFormData(updatedData);
    
    // Auto-save the new image
    const processedData = processDataForSave(updatedData);
    saveMutation.mutate(processedData as Location);
  };

  const updateField = (key: string, value: any) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={onBack} className="gap-2">
          <ArrowLeft className="h-4 w-4" />
          Back to Locations
        </Button>
        <div className="flex gap-2">
          {isEditing ? (
            <>
              <Button 
                variant="outline" 
                onClick={handleCancel}
                disabled={saveMutation.isPending}
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
                {saveMutation.isPending ? 'Saving...' : 'Save'}
              </Button>
            </>
          ) : (
            <Button variant="outline" onClick={() => setIsEditing(true)} className="gap-2">
              <Edit className="h-4 w-4" />
              Edit Location
            </Button>
          )}
        </div>
      </div>

      {/* Location Header Card */}
      <Card className="p-6">
        <div className="flex items-start gap-6">
          {/* Location Image - Clickable */}
          <div 
            className="w-32 h-32 rounded-lg bg-gradient-to-br from-green-100 to-emerald-200 dark:from-green-900/30 dark:to-emerald-900/30 flex items-center justify-center flex-shrink-0 cursor-pointer hover:opacity-80 transition-opacity relative group"
            onClick={() => setIsPortraitModalOpen(true)}
          >
            {formData.imageUrl ? (
              <img 
                src={formData.imageUrl} 
                alt={formData.name}
                className="w-full h-full object-cover rounded-lg"
              />
            ) : (
              <MapPin className="h-16 w-16 text-green-600 dark:text-green-400" />
            )}
            
            {/* Hover overlay */}
            <div className="absolute inset-0 bg-black/50 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <Camera className="h-6 w-6 text-white" />
            </div>
          </div>

          {/* Location Basic Info */}
          <div className="flex-1">
            <h1 className="font-title text-4xl mb-2">{formData.name}</h1>
            
            {formData.nicknames && (
              <p className="text-lg text-muted-foreground mb-2">"{formData.nicknames}"</p>
            )}
            
            {formData.description && (
              <p className="text-muted-foreground mb-4 text-lg leading-relaxed">{formData.description}</p>
            )}

            {/* Location Type and Status Badges */}
            <div className="flex flex-wrap gap-2 mb-4">
              {formData.locationType && (
                <Badge variant="secondary" className="text-sm px-3 py-1">
                  {formData.locationType}
                </Badge>
              )}
              {formData.classification && (
                <Badge variant="outline" className="text-sm px-3 py-1">
                  {formData.classification}
                </Badge>
              )}
              {formData.status && (
                <Badge variant="outline" className="text-sm px-3 py-1">
                  Status: {formData.status}
                </Badge>
              )}
            </div>

            {/* Quick Info Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
              {formData.atmosphere && (
                <div>
                  <p className="text-muted-foreground text-xs uppercase tracking-wider mb-2 font-medium">Atmosphere</p>
                  <p className="text-base">{formData.atmosphere}</p>
                </div>
              )}
              
              {formData.significance && (
                <div>
                  <p className="text-muted-foreground text-xs uppercase tracking-wider mb-2 font-medium">Significance</p>
                  <p className="text-base">{formData.significance}</p>
                </div>
              )}

              {formData.population && (
                <div>
                  <p className="text-muted-foreground text-xs uppercase tracking-wider mb-2 font-medium">Population</p>
                  <p className="text-base">{formData.population}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </Card>

      {/* Detailed Location Information in Tabs */}
      <Card className="p-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-8">
            {LOCATION_SECTIONS.map((section) => {
              const IconComponent = (ICON_COMPONENTS as any)[section.icon];
              return (
                <TabsTrigger key={section.id} value={section.id} className="gap-2">
                  {IconComponent && <IconComponent className="h-4 w-4" />}
                  {section.label}
                </TabsTrigger>
              );
            })}
          </TabsList>

          {LOCATION_SECTIONS.map((section) => (
            <TabsContent key={section.id} value={section.id} className="space-y-6 mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {section.fields.map((field) => (
                  <div key={field.key} className={field.type === 'textarea' ? 'md:col-span-2' : ''}>
                    <Label htmlFor={field.key} className="text-sm font-medium mb-2 block">
                      {field.label}
                    </Label>
                    
                    {isEditing ? (
                      field.type === 'textarea' ? (
                        <Textarea
                          id={field.key}
                          value={(formData as any)[field.key] || ''}
                          onChange={(e) => updateField(field.key, e.target.value)}
                          placeholder={field.placeholder}
                          rows={4}
                          className="min-h-[100px]"
                        />
                      ) : field.type === 'array' ? (
                        <Input
                          id={field.key}
                          value={Array.isArray((formData as any)[field.key]) ? ((formData as any)[field.key] as string[]).join(', ') : (formData as any)[field.key] || ''}
                          onChange={(e) => updateField(field.key, e.target.value)}
                          placeholder={field.placeholder}
                        />
                      ) : (
                        <Input
                          id={field.key}
                          value={(formData as any)[field.key] || ''}
                          onChange={(e) => updateField(field.key, e.target.value)}
                          placeholder={field.placeholder}
                        />
                      )
                    ) : (
                      <div className="min-h-[40px] p-3 bg-muted/30 rounded-md border">
                        {field.type === 'array' ? (
                          Array.isArray((formData as any)[field.key]) && ((formData as any)[field.key] as string[]).length > 0 ? (
                            <div className="flex flex-wrap gap-1">
                              {((formData as any)[field.key] as string[]).map((item: string, index: number) => (
                                <Badge key={index} variant="secondary" className="text-xs">
                                  {item}
                                </Badge>
                              ))}
                            </div>
                          ) : (
                            <span className="text-muted-foreground text-sm">No {field.label.toLowerCase()} specified</span>
                          )
                        ) : (
                          (formData as any)[field.key] ? (
                            <p className="text-sm whitespace-pre-wrap">{(formData as any)[field.key]}</p>
                          ) : (
                            <span className="text-muted-foreground text-sm">No {field.label.toLowerCase()} specified</span>
                          )
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </Card>

      {/* Image Generation Modal */}
      {isPortraitModalOpen && (
        <LocationPortraitModal
          isOpen={isPortraitModalOpen}
          location={location}
          onClose={() => setIsPortraitModalOpen(false)}
          onImageGenerated={handleImageGenerated}
        />
      )}
    </div>
  );
}