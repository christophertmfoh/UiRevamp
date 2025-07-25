import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Upload, Sparkles, Image, Check, Star, Trash2, Download, Eye } from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';
import type { Character } from '../../lib/types';

interface CharacterPortraitModalProps {
  character: Character;
  isOpen: boolean;
  onClose: () => void;
  onImageGenerated?: (imageUrl: string) => void;
  onImageUploaded?: (imageUrl: string) => void;
}

export function CharacterPortraitModal({
  character,
  isOpen,
  onClose,
  onImageGenerated,
  onImageUploaded
}: CharacterPortraitModalProps) {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState('generate');
  const [stylePrompt, setStylePrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [portraitGallery, setPortraitGallery] = useState<Array<{id: string, url: string, isMain: boolean}>>(() => {
    const existingPortraits = character.portraits || [];
    return Array.isArray(existingPortraits) ? existingPortraits : [];
  });

  // Generate comprehensive AI prompt from character data
  // Helper function to save portraits to character
  const savePortraitsToCharacter = async (updatedPortraits: Array<{id: string, url: string, isMain: boolean}>) => {
    try {
      const response = await fetch(`/api/characters/${character.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          portraits: updatedPortraits
        }),
      });
      
      if (!response.ok) {
        console.error('Failed to save portraits to character');
      }
    } catch (error) {
      console.error('Error saving portraits:', error);
    }
  };

  // Helper function to update character's main imageUrl
  const updateCharacterImageUrl = async (imageUrl: string, updatedPortraits: Array<{id: string, url: string, isMain: boolean}>) => {
    try {
      const response = await fetch(`/api/characters/${character.id}`, {
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
        console.error('Failed to update character imageUrl');
      } else {
        // Invalidate cache to refresh the character list
        queryClient.invalidateQueries({ queryKey: ['/api/projects', character.projectId, 'characters'] });
      }
    } catch (error) {
      console.error('Error updating character imageUrl:', error);
    }
  };

  const generateCharacterPrompt = () => {
    const parts = [];
    
    if (character.name) parts.push(`Character named ${character.name}`);
    if (character.age) parts.push(`${character.age} years old`);
    if (character.race) parts.push(character.race);
    if (character.ethnicity) parts.push(character.ethnicity);
    if (character.build) parts.push(`${character.build} build`);
    if (character.bodyType) parts.push(`${character.bodyType} body type`);
    if (character.height) parts.push(`${character.height} tall`);
    if (character.facialFeatures) parts.push(character.facialFeatures);
    if (character.eyeColor) parts.push(`${character.eyeColor} eyes`);
    if (character.hairColor || character.hairStyle) {
      const hairDesc = [character.hairColor, character.hairStyle].filter(Boolean).join(' ');
      parts.push(`${hairDesc} hair`);
    }
    if (character.skinTone) parts.push(`${character.skinTone} skin`);
    if (character.attire) parts.push(`wearing ${character.attire}`);
    if (character.physicalDescription) parts.push(character.physicalDescription);

    const basePrompt = parts.length > 0 ? parts.join(', ') : `Character named ${character.name || 'Character'}`;
    const styleAddition = stylePrompt ? `, ${stylePrompt}` : '';
    
    return `${basePrompt}${styleAddition}, high quality portrait, detailed, professional artwork`;
  };

  const handleGenerateImage = async () => {
    setIsGenerating(true);
    try {
      const prompt = generateCharacterPrompt();
      
      const response = await fetch('/api/generate-character-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt,
          characterId: character.id,
          engineType: 'gemini'
        })
      });

      if (!response.ok) throw new Error('Failed to generate image');
      
      const data = await response.json();
      
      if (data.imageUrl) {
        const newPortrait = {
          id: Date.now().toString(),
          url: data.imageUrl,
          isMain: portraitGallery.length === 0 // First image is automatically main
        };
        
        const updatedGallery = [...portraitGallery, newPortrait];
        setPortraitGallery(updatedGallery);
        
        // Save to database
        if (newPortrait.isMain) {
          updateCharacterImageUrl(data.imageUrl, updatedGallery);
          if (onImageGenerated) {
            onImageGenerated(data.imageUrl);
          }
        } else {
          savePortraitsToCharacter(updatedGallery);
        }
        
        setActiveTab('gallery');
      }
    } catch (error) {
      console.error('Image generation failed:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSetMainImage = (imageId: string) => {
    const updatedGallery = portraitGallery.map(img => ({
      ...img,
      isMain: img.id === imageId
    }));
    setPortraitGallery(updatedGallery);
    
    const mainImage = updatedGallery.find(img => img.isMain);
    if (mainImage) {
      updateCharacterImageUrl(mainImage.url, updatedGallery);
      if (onImageGenerated) {
        onImageGenerated(mainImage.url);
      }
    }
  };

  const handleDeleteImage = (imageId: string) => {
    const deletedImage = portraitGallery.find(img => img.id === imageId);
    const updatedGallery = portraitGallery.filter(img => img.id !== imageId);
    
    // If we deleted the main image, set the first remaining as main
    let finalUpdated = updatedGallery;
    if (deletedImage?.isMain && updatedGallery.length > 0) {
      finalUpdated = updatedGallery.map((img, index) => ({
        ...img,
        isMain: index === 0 // Make first image the new main
      }));
      updateCharacterImageUrl(finalUpdated[0].url, finalUpdated);
      if (onImageGenerated) {
        onImageGenerated(finalUpdated[0].url);
      }
    } else if (deletedImage?.isMain && updatedGallery.length === 0) {
      // No images left, clear the character image
      updateCharacterImageUrl('', finalUpdated);
      if (onImageGenerated) {
        onImageGenerated('');
      }
    } else {
      // Save the updated portraits array
      savePortraitsToCharacter(finalUpdated);
    }
    
    setPortraitGallery(finalUpdated);
  };

  const handleModalClose = () => {
    // Save the current gallery state to the character
    savePortraitsToCharacter(portraitGallery);
    
    // If there's a main image in the gallery, make sure it's saved to the character
    const mainImage = portraitGallery.find(img => img.isMain);
    if (mainImage && mainImage.url !== character.imageUrl) {
      if (onImageGenerated) {
        onImageGenerated(mainImage.url);
      }
    }
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleModalClose}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-hidden">
        <DialogHeader className="pb-6 border-b border-border/30 flex-shrink-0">
          <DialogTitle className="flex items-center gap-3 text-xl">
            <div className="p-2.5 bg-gradient-to-br from-accent/15 to-accent/25 rounded-xl">
              <Image className="h-5 w-5 text-accent" />
            </div>
            <div>
              <div className="font-semibold">Portrait Studio</div>
              <div className="text-sm font-normal text-muted-foreground mt-0.5">{character.name}</div>
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-col h-[calc(90vh-140px)] overflow-hidden">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col overflow-hidden">
            <TabsList className="grid w-full grid-cols-3 mb-6 bg-muted/20 p-1 rounded-xl flex-shrink-0">
              <TabsTrigger value="generate" className="flex items-center gap-2 text-sm py-3 data-[state=active]:bg-accent data-[state=active]:text-accent-foreground rounded-lg transition-all duration-200">
                <Sparkles className="h-4 w-4" />
                AI Generate
              </TabsTrigger>
              <TabsTrigger value="gallery" className="flex items-center gap-2 text-sm py-3 data-[state=active]:bg-accent data-[state=active]:text-accent-foreground rounded-lg transition-all duration-200">
                <Image className="h-4 w-4" />
                Gallery ({portraitGallery.length})
              </TabsTrigger>
              <TabsTrigger value="upload" className="flex items-center gap-2 text-sm py-3 data-[state=active]:bg-accent data-[state=active]:text-accent-foreground rounded-lg transition-all duration-200">
                <Upload className="h-4 w-4" />
                Upload
              </TabsTrigger>
            </TabsList>

            <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-track-muted/20 scrollbar-thumb-accent/60 hover:scrollbar-thumb-accent/80 pr-2">
              <TabsContent value="generate" className="mt-0 space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Generation Panel */}
                  <div className="space-y-6">
                    <Card className="border border-border/50 bg-gradient-to-br from-background to-muted/20">
                      <CardContent className="p-6 space-y-4">
                        <div>
                          <h3 className="font-semibold mb-3 flex items-center gap-2">
                            <Sparkles className="h-4 w-4 text-accent" />
                            AI Image Generation
                          </h3>
                          <p className="text-sm text-muted-foreground mb-4">
                            Generate a portrait based on your character's physical description
                          </p>
                        </div>

                        <div className="space-y-4">
                          <div>
                            <Label htmlFor="style-prompt" className="text-sm font-medium">
                              Style & Additional Details (Optional)
                            </Label>
                            <Textarea
                              id="style-prompt"
                              value={stylePrompt}
                              onChange={(e) => setStylePrompt(e.target.value)}
                              placeholder="e.g., fantasy art style, medieval clothing, dramatic lighting, portrait painting..."
                              rows={3}
                              className="mt-2 bg-background/50"
                            />
                          </div>

                          <div className="p-4 bg-muted/30 rounded-lg border border-border/30">
                            <Label className="text-xs font-medium text-muted-foreground mb-2 block">
                              Generated Prompt Preview:
                            </Label>
                            <p className="text-sm font-mono bg-background/60 p-3 rounded border text-muted-foreground leading-relaxed">
                              {generateCharacterPrompt()}
                            </p>
                          </div>

                          <Button 
                            onClick={handleGenerateImage}
                            disabled={isGenerating}
                            className="w-full bg-gradient-to-r from-accent to-accent/80 hover:from-accent/90 hover:to-accent text-accent-foreground font-medium py-2.5 shadow-lg hover:shadow-xl transition-all duration-200"
                            size="lg"
                          >
                            {isGenerating ? (
                              <>
                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                                Generating Portrait...
                              </>
                            ) : (
                              <>
                                <Sparkles className="h-4 w-4 mr-2" />
                                Generate Portrait
                              </>
                            )}
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Preview Panel */}
                  <div className="space-y-6">
                    <Card className="border border-border/50">
                      <CardContent className="p-6">
                        <h3 className="font-semibold mb-4 flex items-center gap-2">
                          <Eye className="h-4 w-4 text-accent" />
                          Current Portrait
                        </h3>
                        <div className="aspect-square w-full max-w-sm mx-auto bg-gradient-to-br from-muted/50 to-muted/30 rounded-xl flex items-center justify-center border border-border/30">
                          {character.imageUrl ? (
                            <img 
                              src={character.imageUrl} 
                              alt={character.name}
                              className="w-full h-full object-cover rounded-xl"
                            />
                          ) : (
                            <div className="text-center text-muted-foreground">
                              <Image className="h-12 w-12 mx-auto mb-3 opacity-40" />
                              <p className="text-sm">No portrait yet</p>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="gallery" className="mt-0">
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold">Portrait Gallery</h3>
                    <Badge variant="secondary" className="bg-accent/10 text-accent">
                      {portraitGallery.filter(img => img.isMain).length > 0 ? '1 main portrait' : 'No main portrait'}
                    </Badge>
                  </div>

                  {portraitGallery.length === 0 ? (
                    <Card className="p-12 text-center border-2 border-dashed border-border/50">
                      <Image className="h-16 w-16 mx-auto mb-4 text-muted-foreground/40" />
                      <h4 className="font-medium mb-2">No portraits yet</h4>
                      <p className="text-muted-foreground text-sm mb-4">
                        Generate AI portraits or upload your own images
                      </p>
                      <Button 
                        onClick={() => setActiveTab('generate')}
                        variant="outline"
                        className="bg-gradient-to-r from-accent/10 to-accent/15 border-accent/30 hover:bg-accent/20 hover:border-accent/50"
                      >
                        <Sparkles className="h-4 w-4 mr-2" />
                        Generate First Portrait
                      </Button>
                    </Card>
                  ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                      {portraitGallery.map((portrait) => (
                        <Card key={portrait.id} className="group overflow-hidden">
                          <div className="relative">
                            <img 
                              src={portrait.url} 
                              alt={`Portrait of ${character.name}`}
                              className="w-full aspect-square object-cover"
                            />
                            
                            {/* Main badge */}
                            {portrait.isMain && (
                              <div className="absolute top-2 left-2">
                                <Badge className="bg-accent/90 text-accent-foreground shadow-lg">
                                  <Star className="h-3 w-3 mr-1" />
                                  Main
                                </Badge>
                              </div>
                            )}

                            {/* Action overlay */}
                            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                              <Button
                                size="sm"
                                variant="secondary"
                                onClick={() => handleSetMainImage(portrait.id)}
                                disabled={portrait.isMain}
                                className="bg-accent/90 hover:bg-accent text-accent-foreground"
                              >
                                <Star className="h-3 w-3" />
                              </Button>
                              <Button
                                size="sm"
                                variant="secondary"
                                onClick={() => handleDeleteImage(portrait.id)}
                                className="bg-red-500/90 hover:bg-red-500 text-white"
                              >
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                        </Card>
                      ))}
                    </div>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="upload" className="mt-0">
                <Card className="p-8 text-center border-2 border-dashed border-border/50">
                  <Upload className="h-16 w-16 mx-auto mb-4 text-muted-foreground/40" />
                  <h4 className="font-medium mb-2">Upload Portrait</h4>
                  <p className="text-muted-foreground text-sm mb-4">
                    Upload your own character portrait images
                  </p>
                  <Button variant="outline" disabled>
                    <Upload className="h-4 w-4 mr-2" />
                    Upload Image (Coming Soon)
                  </Button>
                </Card>
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
}