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
import type { Faction } from '../lib/types';

interface FactionPortraitModalProps {
  faction: Faction;
  isOpen: boolean;
  onClose: () => void;
  onImageGenerated?: (imageUrl: string) => void;
  onImageUploaded?: (imageUrl: string) => void;
}

export function FactionPortraitModal({
  faction,
  isOpen,
  onClose,
  onImageGenerated,
  onImageUploaded
}: FactionPortraitModalProps) {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState('generate');
  const [aiEngine, setAiEngine] = useState('gemini');
  const [stylePrompt, setStylePrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const [portraitGallery, setPortraitGallery] = useState<Array<{id: string, url: string, isMain: boolean}>>(() => {
    // Initialize from faction.portraits if available
    const existingPortraits = faction.portraits || [];
    return Array.isArray(existingPortraits) ? existingPortraits : [];
  });
  const [selectedMainImage, setSelectedMainImage] = useState<string>('');

  // Generate faction symbol/logo prompt based on faction characteristics
  const generateFactionPrompt = () => {
    const parts = [];
    
    // Start with base symbol description
    parts.push("Create a faction symbol, emblem, or logo");
    
    // Add faction name if available
    if (faction.name) {
      parts.push(`for the faction "${faction.name}"`);
    }
    
    // Add faction type context
    if (faction.type) {
      parts.push(`representing a ${faction.type.toLowerCase()}`);
    }
    
    // Add core ideology or values
    if (faction.core_ideology) {
      parts.push(`embodying the ideology of ${faction.core_ideology}`);
    }
    
    // Add goals or primary objectives
    if (faction.primary_goals) {
      parts.push(`focused on ${faction.primary_goals}`);
    }
    
    // Add methods or approach
    if (faction.methods) {
      parts.push(`using ${faction.methods} methods`);
    }
    
    // Add visual elements based on faction characteristics
    const visualElements = [];
    
    if (faction.status) {
      if (faction.status.toLowerCase().includes('active')) visualElements.push('strong, bold design');
      if (faction.status.toLowerCase().includes('defunct')) visualElements.push('weathered, ancient appearance');
      if (faction.status.toLowerCase().includes('secret')) visualElements.push('mysterious, cryptic symbols');
    }
    
    if (faction.threat_level) {
      if (faction.threat_level.toLowerCase().includes('high')) visualElements.push('intimidating, aggressive imagery');
      if (faction.threat_level.toLowerCase().includes('low')) visualElements.push('peaceful, diplomatic symbols');
    }
    
    if (faction.territory) {
      visualElements.push(`incorporating elements representing ${faction.territory}`);
    }
    
    if (visualElements.length > 0) {
      parts.push(`with ${visualElements.join(', ')}`);
    }
    
    // Add style specifications for emblems/logos
    parts.push("The design should be suitable for use as a banner, coat of arms, or insignia");
    parts.push("Clean, recognizable symbol that could be emblazoned on flags, armor, or buildings");
    
    return parts.filter(Boolean).join('. ') + '.';
  };

  const handleGenerateImage = async () => {
    setIsGenerating(true);
    try {
      const factionPrompt = generateFactionPrompt();
      
      console.log('Generating image with faction prompt:', factionPrompt);
      console.log('Style prompt:', stylePrompt);
      console.log('Using AI engine:', aiEngine);

      const response = await fetch('/api/factions/generate-image', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          factionPrompt,
          stylePrompt,
          aiEngine
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
    
    // Update faction with new image and save portraits array
    onImageGenerated?.(imageUrl);
    
    // If this is the main image, also update the faction's imageUrl
    if (newPortrait.isMain) {
      updateFactionImageUrl(imageUrl, updated);
    } else {
      // Just save the portraits array
      savePortraitsToFaction(updated);
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
    
    // Update faction with new image and save portraits array
    onImageUploaded?.(imageUrl);
    
    // If this is the main image, also update the faction's imageUrl
    if (newPortrait.isMain) {
      updateFactionImageUrl(imageUrl, updated);
    } else {
      // Just save the portraits array
      savePortraitsToFaction(updated);
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
      // Update the faction's main image in the parent components
      onImageGenerated?.(mainImage.url);
      // Also notify the parent that an image was uploaded to trigger display updates
      onImageUploaded?.(mainImage.url);
      
      // Also update the faction's imageUrl field directly
      updateFactionImageUrl(mainImage.url, updated);
    } else {
      // Save the updated portraits array if no main image found
      savePortraitsToFaction(updated);
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
      // Update the faction's imageUrl with the new main image
      updateFactionImageUrl(finalUpdated[0].url, finalUpdated);
    } else if (deletedImage?.isMain && updated.length === 0) {
      // No images left, clear the faction image
      onImageGenerated?.('');
      updateFactionImageUrl('', finalUpdated);
    } else {
      // Save the updated portraits array
      savePortraitsToFaction(finalUpdated);
    }
    
    setPortraitGallery(finalUpdated);
  };

  // Helper function to save portraits to faction
  const savePortraitsToFaction = async (updatedPortraits: Array<{id: string, url: string, isMain: boolean}>) => {
    try {
      const response = await fetch(`/api/factions/${faction.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          portraits: updatedPortraits
        }),
      });
      
      if (!response.ok) {
        console.error('Failed to save portraits to faction');
      }
    } catch (error) {
      console.error('Error saving portraits:', error);
    }
  };

  // Helper function to update faction's main imageUrl
  const updateFactionImageUrl = async (imageUrl: string, updatedPortraits: Array<{id: string, url: string, isMain: boolean}>) => {
    try {
      const response = await fetch(`/api/factions/${faction.id}`, {
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
        console.error('Failed to update faction imageUrl');
      } else {
        // Invalidate cache to refresh the faction list
        queryClient.invalidateQueries({ queryKey: ['/api/projects', faction.projectId, 'factions'] });
      }
    } catch (error) {
      console.error('Error updating faction imageUrl:', error);
    }
  };

  const handleModalClose = () => {
    // Save the current gallery state to the faction
    savePortraitsToFaction(portraitGallery);
    
    // If there's a main image in the gallery, make sure it's saved to the faction
    const mainImage = portraitGallery.find(img => img.isMain);
    if (mainImage && mainImage.url !== faction.imageUrl) {
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
            Manage Symbols for {faction.name || 'Faction'}
          </DialogTitle>
          <div id="portrait-description" className="sr-only">
            Generate AI faction symbols, emblems, or logos, or upload images for your faction. You can create multiple symbols and set one as the main faction emblem.
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
                        placeholder="heraldic design • minimalist logo • medieval coat of arms • geometric symbol • tribal emblem • corporate logo • fantasy banner • military insignia • ancient seal"
                        className="creative-input"
                        rows={2}
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        Leave blank for default style, or specify emblem/logo style
                      </p>
                    </div>

                    {/* Faction Prompt Preview */}
                    <div>
                      <Label>Symbol Description (Auto-generated)</Label>
                      <Textarea
                        value={generateFactionPrompt() || 'Add faction details in the Faction Editor to auto-generate symbol description...'}
                        readOnly
                        className="creative-input text-sm text-muted-foreground"
                        rows={3}
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        This description creates faction symbols based on your faction's characteristics
                      </p>
                    </div>

                    {/* Generate Button */}
                    <Button 
                      onClick={handleGenerateImage}
                      disabled={isGenerating}
                      className="w-full interactive-warm"
                    >
                      <Sparkles className="h-4 w-4 mr-2" />
{isGenerating ? 'Generating Symbol...' : 'Generate Faction Symbol'}
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
                    <CardTitle className="text-lg">Symbol Gallery</CardTitle>
                    <p className="text-sm text-muted-foreground">
                      Up to 20 symbols • Click star to set as main emblem
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
                              alt="Faction portrait"
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
                  Select 6-10 images from the gallery to create a consistent visual model for this faction.
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
                    Train Faction Model
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
                View enlarged faction portrait and set as main image if desired.
              </div>
            </DialogHeader>
            <div className="flex items-center justify-center max-h-[80vh]">
              <img 
                src={selectedMainImage} 
                alt="Faction portrait enlarged"
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