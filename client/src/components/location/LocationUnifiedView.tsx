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
import { ArrowLeft, Edit, Save, X, MapPin, Compass, TreePine, Building, Crown, Scroll, Camera, Settings, Trash2 } from 'lucide-react';
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
  // Start in editing mode if this is a newly generated location (very specific patterns)
  const isNewlyGenerated = location.name && (
    location.name === 'Generated Location' || 
    location.name.startsWith('Generated Location -') ||
    // Only trigger for very generic AI-generated names, not user-saved ones
    (location.name.startsWith('mountain of ') && location.description?.includes('generated')) ||
    (location.name.startsWith('village of ') && location.description?.includes('generated')) ||
    (location.name.startsWith('city of ') && location.description?.includes('generated')) ||
    (location.name.startsWith('dungeon of ') && location.description?.includes('generated'))
  );
  const [isEditing, setIsEditing] = useState(Boolean(isNewlyGenerated));
  const [formData, setFormData] = useState(location);

  // Update formData when location changes (important for newly created locations)
  React.useEffect(() => {
    setFormData(location);
  }, [location]);
  const [activeTab, setActiveTab] = useState('identity');
  const [isPortraitModalOpen, setIsPortraitModalOpen] = useState(false);
  const queryClient = useQueryClient();

  // Save mutation
  const saveMutation = useMutation({
    mutationFn: async (data: Location) => {
      return await apiRequest('PUT', `/api/locations/${location.id}`, data);
    },
    onSuccess: (response) => {
      console.log('Location saved successfully:', response);
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
    const { createdAt, updatedAt, id, projectId, ...dataToSave } = processedData;
    
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

  const handleInputChange = (field: string, value: string | string[]) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Helper function to render field based on type - matching organization/character modules
  const renderField = (field: any, value: any) => {
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
            <div className="h-5"></div> // Empty space to maintain layout
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



  // Render tab content with grid layout matching organization/character modules
  const renderTabContent = (sectionId: string) => {
    const section = LOCATION_SECTIONS.find(s => s.id === sectionId);
    if (!section) return null;

    return section.fields.map((field) => 
      renderField(field, formData[field.key as keyof Location])
    );
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
          {!isEditing ? (
            <>
              <Button 
                variant="outline" 
                onClick={() => setIsEditing(true)}
              >
                <Edit className="h-4 w-4 mr-2" />
                Edit Location
              </Button>
              <Button 
                variant="destructive" 
                onClick={() => onDelete(location)}
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
                {saveMutation.isPending ? 'Saving...' : 'Save Location'}
              </Button>
              <Button onClick={handleCancel} variant="outline">
                <X className="h-4 w-4 mr-2" />
                Cancel
              </Button>
            </>
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
            
            {(formData as any).nicknames && (
              <p className="text-lg text-muted-foreground mb-2">"{(formData as any).nicknames}"</p>
            )}
            
            {formData.description && (
              <p className="text-muted-foreground mb-4 text-lg leading-relaxed">{formData.description}</p>
            )}
            


            {/* Location Type and Status Badges */}
            <div className="flex flex-wrap gap-2 mb-4">
              {(formData as any).locationType && (
                <Badge variant="secondary" className="text-sm px-3 py-1">
                  {(formData as any).locationType}
                </Badge>
              )}
              {(formData as any).classification && (
                <Badge variant="outline" className="text-sm px-3 py-1">
                  {(formData as any).classification}
                </Badge>
              )}
              {(formData as any).status && (
                <Badge variant="outline" className="text-sm px-3 py-1">
                  Status: {(formData as any).status}
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

              {(formData as any).population && (
                <div>
                  <p className="text-muted-foreground text-xs uppercase tracking-wider mb-2 font-medium">Population</p>
                  <p className="text-base">{(formData as any).population}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </Card>

      {/* Sidebar + Content Layout */}
      <Card className="creative-card">
        <CardContent className="p-0">
          <div className="flex min-h-[600px]">
            {/* Left Sidebar Navigation */}
            <div className="w-64 border-r bg-muted/20 p-4">
              <nav className="space-y-1">
                {LOCATION_SECTIONS.map(section => {
                  const IconComponent = (ICON_COMPONENTS as any)[section.icon] || MapPin;
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
                      <IconComponent className="h-4 w-4 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-sm">{section.label}</div>
                      </div>
                    </button>
                  );
                })}
              </nav>
            </div>
            
            {/* Right Content Area */}
            <div className="flex-1 p-6">
              {LOCATION_SECTIONS.map(section => {
                if (activeTab !== section.id) return null;
                
                return (
                  <div key={section.id} className="space-y-8">
                    <div>
                      <h3 className="text-lg font-semibold mb-1">{section.label}</h3>
                      <p className="text-sm text-muted-foreground mb-6">{section.description}</p>
                      <div className="grid gap-6 md:grid-cols-2">
                        {renderTabContent(section.id)}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </CardContent>
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