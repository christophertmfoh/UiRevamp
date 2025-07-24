import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Upload, Sparkles, Image, Brain, X } from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';
import type { Location } from '../lib/types';

interface LocationPortraitModalProps {
  location: Location;
  isOpen: boolean;
  onClose: () => void;
  onImageGenerated?: (imageUrl: string) => void;
  onImageUploaded?: (imageUrl: string) => void;
}

export function LocationPortraitModal({
  location,
  isOpen,
  onClose,
  onImageGenerated,
  onImageUploaded
}: LocationPortraitModalProps) {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState('generate');
  const [aiEngine, setAiEngine] = useState('gemini');
  const [stylePrompt, setStylePrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const [portraitGallery, setPortraitGallery] = useState<Array<{id: string, url: string, isMain: boolean}>>(() => {
    // Initialize from location.portraits if available
    const existingPortraits = location.portraits || [];
    return Array.isArray(existingPortraits) ? existingPortraits : [];
  });
  const [selectedMainImage, setSelectedMainImage] = useState<string>('');

  // Generate comprehensive AI prompt from all physical location data
  const generateLocationPrompt = () => {
    const parts = [];
    
    // Basic info
    if (location.name) parts.push(`Location named ${location.name}`);
    if (location.age) parts.push(`${location.age} years old`);
    if (location.race) parts.push(location.race);
    if (location.ethnicity) parts.push(location.ethnicity);
    
    // Physical build and body
    if (location.build) parts.push(`${location.build} build`);
    if (location.bodyType) parts.push(`${location.bodyType} body type`);
    if (location.height) parts.push(`${location.height} tall`);
    if (location.posture) parts.push(`${location.posture} posture`);
    
    // Facial features
    if (location.facialFeatures) parts.push(location.facialFeatures);
    if (location.eyes || location.eyeColor) {
      const eyeDesc = [location.eyeColor, location.eyes].filter(Boolean).join(' ');
      parts.push(`${eyeDesc} eyes`);
    }
    if (location.complexion) parts.push(`${location.complexion} complexion`);
    if (location.skin || location.skinTone) {
      const skinDesc = [location.skinTone, location.skin].filter(Boolean).join(' ');
      parts.push(`${skinDesc} skin`);
    }
    
    // Hair
    if (location.hair || location.hairColor || location.hairStyle) {
      const hairDesc = [location.hairColor, location.hairStyle, location.hair].filter(Boolean).join(' ');
      parts.push(`${hairDesc} hair`);
    }
    if (location.facialHair) parts.push(location.facialHair);
    
    // Clothing and accessories
    if (location.attire) parts.push(`wearing ${location.attire}`);
    if (location.clothingStyle) parts.push(`${location.clothingStyle} clothing style`);
    if (location.accessories) parts.push(`accessories: ${location.accessories}`);
    
    // Distinguishing features
    if (location.scars) parts.push(`scars: ${location.scars}`);
    if (location.tattoos) parts.push(`tattoos: ${location.tattoos}`);
    if (location.piercings) parts.push(`piercings: ${location.piercings}`);
    if (location.birthmarks) parts.push(`birthmarks: ${location.birthmarks}`);
    if (location.distinguishingMarks) parts.push(`distinguishing marks: ${location.distinguishingMarks}`);
    
    // General physical description
    if (location.physicalDescription) parts.push(location.physicalDescription);
    
    return parts.filter(Boolean).join(', ');
  };

  const handleGenerateImage = async () => {
    setIsGenerating(true);
    try {
      const locationPrompt = generateLocationPrompt();
      
      console.log('Generating image with location prompt:', locationPrompt);
      console.log('Style prompt:', stylePrompt);
      console.log('Using AI engine:', aiEngine);

      const response = await fetch('/api/generate-location-image', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          locationId: location.id,
          locationName: location.name,
          description: locationPrompt
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.details || errorData.error || 'Failed to generate image');
      }

      const result = await response.json();
      handleImageGenerated(result.url);
      // Don't close modal, let user generate more images
    } catch (error: any) {
      console.error('Failed to generate image:', error);
      // Better error message for user
      const errorMessage = error.message.includes('API key') 
        ? 'AI service configuration issue. Please check your API settings.'
        : `Failed to generate image: ${error.message}`;
      alert(errorMessage);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageUrl = e.target?.result as string;
        handleImageUploaded(imageUrl);
        // Don't close modal, let user upload more images
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageGenerated = (imageUrl: string) => {
    // Add to portrait gallery
    const newPortrait = {
      id: Date.now().toString(),
      url: imageUrl,
      isMain: portraitGallery.length === 0 // First image becomes main
    };
    
    const updated = [...portraitGallery, newPortrait];
    setPortraitGallery(updated);
    
    // Update location with new image and save portraits array
    onImageGenerated?.(imageUrl);
    
    // If this is the main image, also update the location's imageUrl
    if (newPortrait.isMain) {
      updateLocationImageUrl(imageUrl, updated);
    } else {
      // Just save the portraits array
      savePortraitsToLocation(updated);
    }
  };

  const handleImageUploaded = (imageUrl: string) => {
    // Add to portrait gallery  
    const newPortrait = {
      id: Date.now().toString(),
      url: imageUrl,
      isMain: portraitGallery.length === 0 // First image becomes main
    };
    
    const updated = [...portraitGallery, newPortrait];
    setPortraitGallery(updated);
    
    // Update location with new image and save portraits array
    onImageUploaded?.(imageUrl);
    
    // If this is the main image, also update the location's imageUrl
    if (newPortrait.isMain) {
      updateLocationImageUrl(imageUrl, updated);
    } else {
      // Just save the portraits array
      savePortraitsToLocation(updated);
    }
  };

  const handleSetMainImage = (imageId: string) => {
    const updated = portraitGallery.map(img => ({
      ...img,
      isMain: img.id === imageId
    }));
    setPortraitGallery(updated);
    
    const mainImage = updated.find(img => img.isMain);
    if (mainImage) {
      // Update the location's main image in the parent components
      onImageGenerated?.(mainImage.url);
      // Also notify the parent that an image was uploaded to trigger display updates
      onImageUploaded?.(mainImage.url);
      
      // Also update the location's imageUrl field directly
      updateLocationImageUrl(mainImage.url, updated);
    } else {
      // Save the updated portraits array if no main image found
      savePortraitsToLocation(updated);
    }
  };

  const handleDeletePortrait = (imageId: string) => {
    const updated = portraitGallery.filter(img => img.id !== imageId);
    
    // If we deleted the main image, set a new main image if available
    const deletedImage = portraitGallery.find(img => img.id === imageId);
    let finalUpdated = updated;
    
    if (deletedImage?.isMain && updated.length > 0) {
      finalUpdated = updated.map((img, index) => ({
        ...img,
        isMain: index === 0 // Make first image the new main
      }));
      onImageGenerated?.(finalUpdated[0].url);
      // Update the location's imageUrl with the new main image
      updateLocationImageUrl(finalUpdated[0].url, finalUpdated);
    } else if (deletedImage?.isMain && updated.length === 0) {
      // No images left, clear the location image
      onImageGenerated?.('');
      updateLocationImageUrl('', finalUpdated);
    } else {
      // Save the updated portraits array
      savePortraitsToLocation(finalUpdated);
    }
    
    setPortraitGallery(finalUpdated);
  };

  // Helper function to save portraits to location
  const savePortraitsToLocation = async (updatedPortraits: Array<{id: string, url: string, isMain: boolean}>) => {
    try {
      const response = await fetch(`/api/locations/${location.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          portraits: updatedPortraits
        }),
      });
      
      if (!response.ok) {
        console.error('Failed to save portraits to location');
      }
    } catch (error) {
      console.error('Error saving portraits:', error);
    }
  };

  // Helper function to update location's main imageUrl
  const updateLocationImageUrl = async (imageUrl: string, updatedPortraits: Array<{id: string, url: string, isMain: boolean}>) => {
    try {
      const response = await fetch(`/api/locations/${location.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          imageUrl: imageUrl,
          portraits: updatedPortraits
        }),
      });
      
      if (!response.ok) {
        console.error('Failed to update location imageUrl');
      } else {
        // Invalidate cache to refresh the location list
        queryClient.invalidateQueries({ queryKey: ['/api/projects', location.projectId, 'locations'] });
      }
    } catch (error) {
      console.error('Error updating location imageUrl:', error);
    }
  };

  const handleModalClose = () => {
    // Save the current gallery state to the location
    savePortraitsToLocation(portraitGallery);
    
    // If there's a main image in the gallery, make sure it's saved to the location
    const mainImage = portraitGallery.find(img => img.isMain);
    if (mainImage && mainImage.url !== location.imageUrl) {
      onImageGenerated?.(mainImage.url);
    }
    onClose();
  };

  const handleTrainModel = () => {
    console.log('Training model with selected images:', selectedImages);
    // TODO: Implement model training
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleModalClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto creative-card" aria-describedby="portrait-description">
        <DialogHeader>
          <DialogTitle className="font-title text-2xl">
            Manage Portraits for {location.name || 'Location'}
          </DialogTitle>
          <div id="portrait-description" className="sr-only">
            Generate AI portraits or upload images for your location. You can create multiple portraits and set one as the main location image.
          </div>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="generate" className="flex items-center gap-2">
              <Sparkles className="h-4 w-4" />
              Generate or Upload
            </TabsTrigger>
            <TabsTrigger value="train" className="flex items-center gap-2">
              <Brain className="h-4 w-4" />
              Train Model
            </TabsTrigger>
          </TabsList>

          <TabsContent value="generate" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Left Column - Generation */}
              <div className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Sparkles className="h-5 w-5" />
                      1. Generate or Upload
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* AI Engine Selection */}
                    <div>
                      <Label>AI Engine</Label>
                      <Select value={aiEngine} onValueChange={setAiEngine}>
                        <SelectTrigger className="creative-input">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="gemini">Google Gemini 2.0 ✨</SelectItem>
                          <SelectItem value="openai">OpenAI DALL-E 3 (Limited)</SelectItem>
                          <SelectItem value="midjourney">Midjourney (Coming Soon)</SelectItem>
                        </SelectContent>
                      </Select>
                      <p className="text-xs text-muted-foreground mt-1">
                        Gemini 2.0 is recommended for best results and availability
                      </p>
                    </div>

                    {/* Style Prompt */}
                    <div>
                      <Label>Style Reference</Label>
                      <Textarea
                        value={stylePrompt}
                        onChange={(e) => setStylePrompt(e.target.value)}
                        placeholder="oil painting • digital art • anime style • realistic portrait • watercolor • pencil sketch • dark fantasy • cyberpunk • medieval art • concept art"
                        className="creative-input"
                        rows={2}
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        Leave blank for default style, or specify artistic direction
                      </p>
                    </div>

                    {/* Location Prompt Preview */}
                    <div>
                      <Label>Location Description (Auto-generated)</Label>
                      <Textarea
                        value={generateLocationPrompt() || 'Add location details in the Location Editor to auto-generate description...'}
                        readOnly
                        className="creative-input text-sm text-muted-foreground"
                        rows={3}
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        This description compiles all physical information from your location profile
                      </p>
                    </div>

                    {/* Generate Button */}
                    <Button 
                      onClick={handleGenerateImage}
                      disabled={isGenerating}
                      className="w-full interactive-warm"
                    >
                      <Sparkles className="h-4 w-4 mr-2" />
                      {isGenerating ? 'Generating...' : 'Generate with AI'}
                    </Button>

                    <div className="text-center text-sm text-muted-foreground">
                      OR
                    </div>

                    {/* Upload Button */}
                    <div>
                      <input
                        type="file"
                        id="image-upload"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                      <Button 
                        onClick={() => document.getElementById('image-upload')?.click()}
                        variant="outline"
                        className="w-full"
                      >
                        <Upload className="h-4 w-4 mr-2" />
                        Upload Image
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Right Column - Portrait Gallery */}
              <div className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Portrait Gallery</CardTitle>
                    <p className="text-sm text-muted-foreground">
                      Up to 20 portraits • Click star to set as main image
                    </p>
                  </CardHeader>
                  <CardContent>
                    {portraitGallery.length === 0 ? (
                      <div className="aspect-square bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center">
                        <div className="text-center text-muted-foreground">
                          <Image className="h-16 w-16 mx-auto mb-2" />
                          <p>No portraits yet.</p>
                          <p className="text-sm">Generate or upload one.</p>
                        </div>
                      </div>
                    ) : (
                      <div className="grid grid-cols-3 gap-3 max-h-96 overflow-y-auto">
                        {portraitGallery.slice(0, 20).map((portrait) => (
                          <div 
                            key={portrait.id} 
                            className={`relative aspect-square rounded-lg overflow-hidden border-2 group ${
                              portrait.isMain ? 'border-yellow-500 shadow-lg shadow-yellow-500/25' : 'border-gray-200 dark:border-gray-700'
                            }`}
                          >
                            <img 
                              src={portrait.url} 
                              alt="Location portrait"
                              className="w-full h-full object-cover cursor-pointer"
                              onClick={() => setSelectedMainImage(portrait.url)}
                            />
                            <div className="absolute inset-0 bg-black/80 opacity-0 group-hover:opacity-100 transition-all duration-200 flex flex-col items-center justify-center gap-1 p-1">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSelectedMainImage(portrait.url);
                                }}
                                className="text-xs w-full h-7 bg-white/95 hover:bg-white text-black font-medium border-0"
                              >
                                🔍 View
                              </Button>
                              <Button
                                size="sm"
                                variant={portrait.isMain ? "default" : "outline"}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleSetMainImage(portrait.id);
                                }}
                                className={`text-xs w-full h-7 font-medium border-0 ${
                                  portrait.isMain 
                                    ? 'bg-yellow-500 hover:bg-yellow-400 text-black' 
                                    : 'bg-yellow-400/90 hover:bg-yellow-400 text-black'
                                }`}
                              >
                                {portrait.isMain ? '★ Main' : '☆ Make Main'}
                              </Button>
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDeletePortrait(portrait.id);
                                }}
                                className="text-xs w-full h-7 bg-red-500 hover:bg-red-400 text-white font-medium border-0"
                              >
                                🗑️ Delete
                              </Button>
                            </div>
                            {portrait.isMain && (
                              <div className="absolute top-1 right-1 bg-yellow-500 text-white rounded-full p-1">
                                <span className="text-xs">★</span>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="train" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Brain className="h-5 w-5" />
                  2. Train Model
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Select 6-10 images from the gallery to create a consistent visual model for this location.
                </p>
                
                <div className="grid grid-cols-3 gap-4">
                  {/* Placeholder for training images */}
                  {[1, 2, 3, 4, 5, 6].map((i) => (
                    <div 
                      key={i}
                      className="aspect-square bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                    >
                      <Image className="h-8 w-8 text-muted-foreground" />
                    </div>
                  ))}
                </div>

                <div className="flex items-center justify-between">
                  <Badge variant="outline">
                    {selectedImages.length} / 10 images selected
                  </Badge>
                  <Button 
                    onClick={handleTrainModel}
                    disabled={selectedImages.length < 6}
                    className="interactive-warm"
                  >
                    Train Location Model
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end pt-4">
          <Button variant="outline" onClick={handleModalClose}>
            Done
          </Button>
        </div>
      </DialogContent>

      {/* Image Enlargement Modal */}
      {selectedMainImage && (
        <Dialog open={!!selectedMainImage} onOpenChange={() => setSelectedMainImage('')}>
          <DialogContent className="max-w-4xl max-h-[90vh] p-2" aria-describedby="portrait-preview-description">
            <DialogHeader>
              <DialogTitle>Portrait Preview</DialogTitle>
              <div id="portrait-preview-description" className="sr-only">
                View enlarged location portrait and set as main image if desired.
              </div>
            </DialogHeader>
            <div className="flex items-center justify-center max-h-[80vh]">
              <img 
                src={selectedMainImage} 
                alt="Location portrait enlarged"
                className="max-w-full max-h-full object-contain rounded-lg"
              />
            </div>
            <div className="flex justify-center gap-2 pt-4">
              <Button 
                variant="outline" 
                onClick={() => {
                  const portrait = portraitGallery.find(p => p.url === selectedMainImage);
                  if (portrait) handleSetMainImage(portrait.id);
                }}
              >
                Set as Main Image
              </Button>
              <Button onClick={() => setSelectedMainImage('')}>
                Close
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </Dialog>
  );
}