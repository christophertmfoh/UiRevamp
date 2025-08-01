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
import { Upload, Sparkles, Image, Check, Star, Trash2, Download, Eye, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';
import type { Character } from '@/lib/types';

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
  const [artStyle, setArtStyle] = useState('');
  const [additionalDetails, setAdditionalDetails] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedImagePreview, setSelectedImagePreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [newGeneratedImage, setNewGeneratedImage] = useState<string | null>(null);
  const [showFullScreenGallery, setShowFullScreenGallery] = useState(false);
  const [portraitGallery, setPortraitGallery] = useState<Array<{id: string, url: string, isMain: boolean}>>(() => {
    const existingPortraits = character.portraits || [];
    return Array.isArray(existingPortraits) ? existingPortraits : [];
  });

  // Get project context for enhanced prompting
  const getProjectContext = async () => {
    try {
      const response = await fetch(`/api/projects/${character.projectId}`);
      if (response.ok) {
        return await response.json();
      }
    } catch (error) {
      console.error('Failed to fetch project context:', error);
    }
    return null;
  };

  // Generate optimized character portrait prompt prioritizing visual elements  
  const generateCharacterPrompt = () => {
    const promptSections = [];
    
    // CORE IDENTITY (Essential character foundation)
    const identityElements = [];
    if (character.name) identityElements.push(character.name);
    if (character.age) identityElements.push(`${character.age} years old`);
    if (character.race) identityElements.push(character.race);
    if (character.class) identityElements.push(character.class);
    if (character.profession || character.occupation) identityElements.push(character.profession || character.occupation);
    if (identityElements.length > 0) {
      promptSections.push(identityElements.join(', '));
    }
    
    // PHYSICAL APPEARANCE (Highest priority for portraits) 
    const visualElements = [];
    if (character.physicalDescription) visualElements.push(character.physicalDescription);
    if (character.build) visualElements.push(`${character.build} build`);
    if (character.height) visualElements.push(`${character.height} height`);
    
    // Facial features (critical for portraits)
    const facialFeatures = [];
    if (character.eyeColor) facialFeatures.push(`${character.eyeColor} eyes`);
    if (character.hairColor && character.hairStyle) {
      facialFeatures.push(`${character.hairColor} ${character.hairStyle} hair`);
    } else if (character.hairColor) {
      facialFeatures.push(`${character.hairColor} hair`);
    } else if (character.hairStyle) {
      facialFeatures.push(`${character.hairStyle} hair`);
    }
    if (character.facialHair) facialFeatures.push(`${character.facialHair} facial hair`);
    if (character.skinTone) facialFeatures.push(`${character.skinTone} skin`);
    if (character.distinguishingMarks) facialFeatures.push(character.distinguishingMarks);
    if (character.scars) facialFeatures.push(`scars: ${character.scars}`);
    if (character.tattoos) facialFeatures.push(`tattoos: ${character.tattoos}`);
    
    if (facialFeatures.length > 0) {
      visualElements.push(facialFeatures.join(', '));
    }
    
    // Clothing and presentation (important for character context)
    const styleElements = [];
    if (character.clothingStyle) styleElements.push(`wearing ${character.clothingStyle}`);
    if (character.accessories) styleElements.push(character.accessories);
    if (styleElements.length > 0) {
      visualElements.push(styleElements.join(', '));
    }
    
    // Body language and expression (shows in portraits)
    const expressionElements = [];
    if (character.posture) expressionElements.push(`${character.posture} posture`);
    if (character.mannerisms) expressionElements.push(character.mannerisms);
    if (expressionElements.length > 0) {
      visualElements.push(expressionElements.join(', '));
    }
    
    if (visualElements.length > 0) {
      promptSections.push(visualElements.join('. '));
    }
    
    // PERSONALITY EXPRESSION (How personality shows visually)
    const personalityVisuals = [];
    if (character.temperament) personalityVisuals.push(`${character.temperament} demeanor`);
    if (character.personality) personalityVisuals.push(`${character.personality} personality`);
    if (character.personalityTraits && Array.isArray(character.personalityTraits) && character.personalityTraits.length > 0) {
      // Limit to top 3 traits to avoid overwhelming the prompt
      personalityVisuals.push(`${character.personalityTraits.slice(0, 3).join(', ')} traits`);
    }
    if (personalityVisuals.length > 0) {
      promptSections.push(personalityVisuals.join(', '));
    }
    
    // BACKGROUND CONTEXT (Subtle influence on appearance)
    const contextElements = [];
    if (character.socialClass) contextElements.push(`${character.socialClass} background`);
    if (character.backstory) {
      // Extract key visual elements from backstory (limit to avoid prompt bloat)
      const backstorySnippet = character.backstory.length > 80 
        ? character.backstory.substring(0, 80) + '...'
        : character.backstory;
      contextElements.push(backstorySnippet);
    }
    if (contextElements.length > 0) {
      promptSections.push(contextElements.join(', '));
    }
    
    return promptSections.join('. ');
  }

  // Build comprehensive character description for AI systems
  const buildCharacterInfo = (character: Character): string => {
    const allCharacterInfo: string[] = [];
    
    // ABILITIES CATEGORY - All ability fields
    if (character.abilities && Array.isArray(character.abilities) && character.abilities.length > 0) {
      allCharacterInfo.push(`abilities: ${character.abilities.join(', ')}`);
    }
    if (character.skills && Array.isArray(character.skills) && character.skills.length > 0) {
      allCharacterInfo.push(`skills: ${character.skills.join(', ')}`);
    }
    if (character.talents && Array.isArray(character.talents) && character.talents.length > 0) {
      allCharacterInfo.push(`talents: ${character.talents.join(', ')}`);
    }
    if (character.strengths) allCharacterInfo.push(`strengths: ${character.strengths}`);
    if (character.weaknesses) allCharacterInfo.push(`weaknesses: ${character.weaknesses}`);
    if (character.training) allCharacterInfo.push(`training: ${character.training}`);
    
    // BACKGROUND CATEGORY - All background fields
    if (character.backstory) allCharacterInfo.push(`backstory: ${character.backstory}`);
    if (character.childhood) allCharacterInfo.push(`childhood: ${character.childhood}`);
    if (character.familyHistory) allCharacterInfo.push(`family history: ${character.familyHistory}`);
    if (character.education) allCharacterInfo.push(`education: ${character.education}`);
    if (character.formativeEvents) allCharacterInfo.push(`formative events: ${character.formativeEvents}`);
    if (character.socialClass) allCharacterInfo.push(`social class: ${character.socialClass}`);
    if (character.occupation) allCharacterInfo.push(`occupation: ${character.occupation}`);
    if (character.spokenLanguages && typeof character.spokenLanguages === 'string') {
      allCharacterInfo.push(`languages: ${character.spokenLanguages}`);
    } else if (character.spokenLanguages && Array.isArray(character.spokenLanguages) && character.spokenLanguages.length > 0) {
      allCharacterInfo.push(`languages: ${character.spokenLanguages.join(', ')}`);
    }
    
    // RELATIONSHIPS CATEGORY - All relationship fields
    if (character.family) allCharacterInfo.push(`family: ${character.family}`);
    if (character.friends) allCharacterInfo.push(`friends: ${character.friends}`);
    if (character.allies) allCharacterInfo.push(`allies: ${character.allies}`);
    if (character.enemies) allCharacterInfo.push(`enemies: ${character.enemies}`);
    if (character.rivals) allCharacterInfo.push(`rivals: ${character.rivals}`);
    if (character.mentors) allCharacterInfo.push(`mentors: ${character.mentors}`);
    if (character.relationships) allCharacterInfo.push(`relationships: ${character.relationships}`);
    if (character.socialCircle) allCharacterInfo.push(`social circle: ${character.socialCircle}`);
    
    // META CATEGORY - All meta fields
    if (character.storyFunction) allCharacterInfo.push(`story function: ${character.storyFunction}`);
    if (character.personalTheme) allCharacterInfo.push(`personal theme: ${character.personalTheme}`);
    if (character.symbolism) allCharacterInfo.push(`symbolism: ${character.symbolism}`);
    if (character.inspiration) allCharacterInfo.push(`inspiration: ${character.inspiration}`);
    if (character.archetypes && Array.isArray(character.archetypes) && character.archetypes.length > 0) {
      allCharacterInfo.push(`archetypes: ${character.archetypes.join(', ')}`);
    }
    if (character.notes) allCharacterInfo.push(`notes: ${character.notes}`);
    
    return allCharacterInfo.join(', ');
  }

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
      } else {
        // Invalidate caches to refresh character views
        queryClient.invalidateQueries({ queryKey: ['/api/projects', character.projectId, 'characters'] });
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
        // Invalidate multiple caches to refresh all character views immediately
        queryClient.invalidateQueries({ queryKey: ['/api/projects', character.projectId, 'characters'] });
        queryClient.invalidateQueries({ queryKey: ['/api/projects', character.projectId] });
        queryClient.invalidateQueries({ queryKey: ['/api/characters', character.id] });
      }
    } catch (error) {
      console.error('Error updating character imageUrl:', error);
    }
  };



  const handleGenerateImage = async () => {
    // AI image generation functionality removed
    console.log('🤖 AI Image Generation - UI placeholder (no functionality)');
    
    // Show a temporary notification
    alert('AI Portrait Generation coming soon! Please upload an image instead.');
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
      updateCharacterImageUrl(finalUpdated[0]?.url || '', finalUpdated);
      if (onImageGenerated) {
        onImageGenerated(finalUpdated[0]?.url || '');
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

  const getCurrentImageIndex = () => {
    if (!selectedImagePreview) return -1;
    return portraitGallery.findIndex(img => img.url === selectedImagePreview);
  };

  const navigateToImage = (direction: 'prev' | 'next') => {
    const currentIndex = getCurrentImageIndex();
    if (currentIndex === -1) return;

    let nextIndex;
    if (direction === 'prev') {
      nextIndex = currentIndex === 0 ? portraitGallery.length - 1 : currentIndex - 1;
    } else {
      nextIndex = currentIndex === portraitGallery.length - 1 ? 0 : currentIndex + 1;
    }

    setSelectedImagePreview(portraitGallery[nextIndex]?.url || '');
  };

  const handleFileUpload = async (files: FileList | File[]) => {
    if (!files || files.length === 0) return;
    
    setIsUploading(true);
    const fileArray = Array.from(files);
    
    // Support all common image formats including WebP, AVIF, HEIC, etc.
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.avif', '.bmp', '.svg', '.tiff', '.heic', '.heif'];
    const validFiles = fileArray.filter(file => {
      const isImageMimeType = file.type.startsWith('image/');
      const hasImageExtension = imageExtensions.some(ext => file.name.toLowerCase().endsWith(ext));
      return isImageMimeType || hasImageExtension;
    });
    
    if (validFiles.length === 0) {
      console.error('No valid image files selected');
      setIsUploading(false);
      return;
    }

    try {
      const uploadPromises = validFiles.map(async (file) => {
        return new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = (e) => {
            const result = e.target?.result as string;
            resolve(result);
          };
          reader.onerror = () => reject(new Error('Failed to read file'));
          reader.readAsDataURL(file);
        });
      });

      const uploadedImages = await Promise.all(uploadPromises);
      
      // Add uploaded images to gallery
      const newPortraits = uploadedImages.map((imageUrl, index) => ({
        id: `${Date.now()}-${index}`,
        url: imageUrl,
        isMain: portraitGallery.length === 0 && index === 0 // First uploaded image becomes main if no images exist
      }));

      const updatedGallery = [...portraitGallery, ...newPortraits];
      setPortraitGallery(updatedGallery);

      // Save to database
      const mainImage = newPortraits.find(img => img.isMain);
      if (mainImage) {
        updateCharacterImageUrl(mainImage.url, updatedGallery);
        if (onImageUploaded) {
          onImageUploaded(mainImage.url);
        }
      } else {
        savePortraitsToCharacter(updatedGallery);
      }

      // Switch to gallery tab to show uploaded images
      setActiveTab('gallery');
      
    } catch (error) {
      console.error('Upload failed:', error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    const files = e.dataTransfer.files;
    handleFileUpload(files);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      handleFileUpload(files);
    }
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
                            <Label htmlFor="art-style" className="text-sm font-medium">
                              Art Style
                            </Label>
                            <Input
                              id="art-style"
                              value={artStyle}
                              onChange={(e) => setArtStyle(e.target.value)}
                              placeholder="e.g., digital art, oil painting, anime style, photorealistic, watercolor..."
                              className="mt-2 bg-background/50 text-black dark:text-accent-foreground"
                            />
                          </div>

                          <div>
                            <Label htmlFor="additional-details" className="text-sm font-medium">
                              Additional Details (Optional)
                            </Label>
                            <Textarea
                              id="additional-details"
                              value={additionalDetails}
                              onChange={(e) => setAdditionalDetails(e.target.value)}
                              placeholder="e.g., medieval clothing, dramatic lighting, specific pose, background details..."
                              rows={3}
                              className="mt-2 bg-background/50 text-black dark:text-accent-foreground"
                            />
                          </div>

                          <div className="p-4 bg-muted/30 rounded-lg border border-border/30">
                            <Label className="text-xs font-medium text-muted-foreground mb-2 block">
                              Generated Prompt Preview:
                            </Label>
                            <div className="text-sm font-mono bg-background/60 p-3 rounded border text-muted-foreground leading-relaxed max-h-32 overflow-y-auto scrollbar-thin scrollbar-track-muted/20 scrollbar-thumb-accent/60">
                              {generateCharacterPrompt()}
                            </div>
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
                        <div className="aspect-square w-full max-w-sm mx-auto bg-gradient-to-br from-muted/50 to-muted/30 rounded-xl flex items-center justify-center border border-border/30 group cursor-pointer">
                          {character.imageUrl ? (
                            <div className="relative w-full h-full rounded-xl overflow-hidden" onClick={() => setSelectedImagePreview(character.imageUrl || null)}>
                              <img 
                                src={character.imageUrl} 
                                alt={character.name}
                                className="w-full h-full object-cover transition-transform group-hover:scale-105"
                              />
                              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                                <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-white/90 rounded-full p-2">
                                  <Eye className="h-5 w-5 text-black" />
                                </div>
                              </div>
                            </div>
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
                        <Card key={portrait.id} className="group overflow-hidden cursor-pointer">
                          <div className="relative">
                            <img 
                              src={portrait.url} 
                              alt={`Portrait of ${character.name}`}
                              className="w-full aspect-square object-cover transition-transform group-hover:scale-105"
                              onClick={() => setSelectedImagePreview(portrait.url)}
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
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSelectedImagePreview(portrait.url);
                                }}
                                className="bg-white/90 hover:bg-white text-black"
                              >
                                <Eye className="h-3 w-3" />
                              </Button>
                              <Button
                                size="sm"
                                variant="secondary"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleSetMainImage(portrait.id);
                                }}
                                disabled={portrait.isMain}
                                className="bg-accent/90 hover:bg-accent text-accent-foreground"
                              >
                                <Star className="h-3 w-3" />
                              </Button>
                              <Button
                                size="sm"
                                variant="secondary"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDeleteImage(portrait.id);
                                }}
                                className="bg-red-500/90 hover:bg-red-500 text-accent-foreground"
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
                <div className="space-y-6">
                  {/* Drag & Drop Upload Area */}
                  <Card 
                    className={`p-8 text-center border-2 border-dashed transition-all duration-200 ${
                      dragActive 
                        ? 'border-accent bg-accent/5 scale-105' 
                        : 'border-border/50 hover:border-accent/50 hover:bg-accent/5'
                    }`}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                  >
                    <div className="space-y-4">
                      <div className="relative">
                        <Upload className={`h-16 w-16 mx-auto transition-all duration-200 ${
                          dragActive ? 'text-accent scale-110' : 'text-muted-foreground/40'
                        }`} />
                        {isUploading && (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-8 h-8 border-2 border-accent/30 border-t-accent rounded-full animate-spin" />
                          </div>
                        )}
                      </div>
                      
                      <div>
                        <h4 className="font-semibold mb-2 text-lg">
                          {dragActive ? 'Drop images here!' : 'Upload Character Portraits'}
                        </h4>
                        <p className="text-muted-foreground text-sm mb-4">
                          {dragActive 
                            ? 'Release to upload your images' 
                            : 'Drag & drop images here, or click to browse'
                          }
                        </p>
                        <p className="text-xs text-muted-foreground/80 mb-4">
                          Supports all image formats: JPG, PNG, GIF, WebP, AVIF, BMP, SVG, TIFF, HEIC • Multiple files allowed
                        </p>
                      </div>

                      <div className="flex justify-center">
                        <Button 
                          variant="outline"
                          onClick={() => document.getElementById('file-upload')?.click()}
                          disabled={isUploading}
                          className="bg-gradient-to-r from-accent/10 to-accent/15 border-accent/30 hover:bg-accent/20 hover:border-accent/50 px-8"
                          size="lg"
                        >
                          {isUploading ? (
                            <>
                              <div className="w-4 h-4 border-2 border-accent/30 border-t-accent rounded-full animate-spin mr-2" />
                              Uploading...
                            </>
                          ) : (
                            <>
                              <Upload className="h-4 w-4 mr-2" />
                              Choose Images
                            </>
                          )}
                        </Button>
                      </div>

                      {/* Hidden file input */}
                      <input
                        id="file-upload"
                        type="file"
                        multiple
                        accept="image/*,.heic,.heif,.avif,.webp,.bmp,.tiff"
                        onChange={handleFileInputChange}
                        className="hidden"
                      />
                    </div>
                  </Card>

                  {/* Upload Tips */}
                  <Card className="p-6 bg-gradient-to-br from-background to-muted/20">
                    <h4 className="font-semibold mb-3 flex items-center gap-2">
                      <Eye className="h-4 w-4 text-accent" />
                      Upload Tips
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-muted-foreground">
                      <div className="space-y-2">
                        <p>• <strong>Best Quality:</strong> Use high-resolution images (1024x1024+)</p>
                        <p>• <strong>All Formats:</strong> Supports JPG, PNG, WebP, HEIC, AVIF, and more</p>
                        <p>• <strong>Aspect Ratio:</strong> Square images work best for portraits</p>
                      </div>
                      <div className="space-y-2">
                        <p>• <strong>Multiple Selection:</strong> Hold Ctrl/Cmd to select multiple files</p>
                        <p>• <strong>Auto Main:</strong> First uploaded image becomes main portrait</p>
                        <p>• <strong>Gallery Integration:</strong> All uploads saved automatically</p>
                      </div>
                    </div>
                  </Card>
                </div>
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </DialogContent>

      {/* Image Preview Modal */}
      {selectedImagePreview && (
        <Dialog open={!!selectedImagePreview} onOpenChange={() => setSelectedImagePreview(null)}>
          <DialogContent className="max-w-4xl p-0 bg-transparent border-0 shadow-none [&>button]:hidden">
            <div className="relative bg-black/90 rounded-lg overflow-hidden">
              <img 
                src={selectedImagePreview} 
                alt={`Full size portrait of ${character.name}`}
                className="w-full h-auto max-h-[80vh] object-contain"
              />
              
              {/* Navigation arrows - only show if more than 1 image */}
              {portraitGallery.length > 1 && (
                <>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => navigateToImage('prev')}
                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-accent-foreground border-0 h-12 w-12 rounded-full"
                  >
                    <ChevronLeft className="h-6 w-6" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => navigateToImage('next')}
                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-accent-foreground border-0 h-12 w-12 rounded-full"
                  >
                    <ChevronRight className="h-6 w-6" />
                  </Button>
                </>
              )}
              
              {/* Custom close button */}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedImagePreview(null)}
                className="absolute top-4 right-4 bg-black/50 hover:bg-black/70 text-accent-foreground border-0 z-50"
              >
                <X className="h-4 w-4" />
              </Button>
              
              {/* Image counter and info */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-accent-foreground font-semibold text-lg">{character.name}</h3>
                    <p className="text-accent-foreground/80 text-sm">Character Portrait</p>
                  </div>
                  {portraitGallery.length > 1 && (
                    <div className="text-accent-foreground/80 text-sm">
                      {getCurrentImageIndex() + 1} of {portraitGallery.length}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Portrait Generation Loading Screen - Same as AI Template Generator */}
      {isGenerating && (
        <Dialog open={true} onOpenChange={() => {}}>
          <DialogContent className="max-w-md [&>button]:hidden">
            <div className="flex flex-col items-center text-center space-y-6 py-8">
              <div className="relative">
                <div className="w-16 h-16 border-4 border-accent/30 border-t-accent rounded-full animate-spin"></div>
                <Sparkles className="w-6 h-6 text-accent absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
              </div>
              
              <div className="space-y-2">
                <h3 className="text-xl font-bold text-accent">Generating Portrait</h3>
                <p className="text-muted-foreground">
                  Creating a high-quality portrait of {character.name} with AI...
                </p>
              </div>

              <div className="w-full space-y-2">
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-accent to-accent/80 rounded-full animate-pulse"></div>
                </div>
                <p className="text-xs text-muted-foreground">
                  Using comprehensive character data{artStyle ? `, ${artStyle} style` : ''}{additionalDetails ? `, ${additionalDetails}` : ''} and professional quality enhancement
                </p>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Image Preview Modal */}
      {selectedImagePreview && (
        <Dialog open={!!selectedImagePreview} onOpenChange={() => setSelectedImagePreview(null)}>
          <DialogContent className="max-w-4xl p-0 bg-transparent border-0 shadow-none [&>button]:hidden">
            <div className="relative bg-black/90 rounded-lg overflow-hidden">
              <img 
                src={selectedImagePreview} 
                alt={`Full size portrait of ${character.name}`}
                className="w-full h-auto max-h-[80vh] object-contain"
              />
              
              {/* Navigation arrows - only show if more than 1 image */}
              {portraitGallery.length > 1 && (
                <>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => navigateToImage('prev')}
                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-accent-foreground border-0 h-12 w-12 rounded-full"
                  >
                    <ChevronLeft className="h-6 w-6" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => navigateToImage('next')}
                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-accent-foreground border-0 h-12 w-12 rounded-full"
                  >
                    <ChevronRight className="h-6 w-6" />
                  </Button>
                </>
              )}
              
              {/* Custom close button */}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedImagePreview(null)}
                className="absolute top-4 right-4 bg-black/50 hover:bg-black/70 text-accent-foreground border-0 z-50"
              >
                <X className="h-4 w-4" />
              </Button>
              
              {/* Image counter and info */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-accent-foreground font-semibold text-lg">{character.name}</h3>
                    <p className="text-accent-foreground/80 text-sm">Character Portrait</p>
                  </div>
                  {portraitGallery.length > 1 && (
                    <div className="text-accent-foreground/80 text-sm">
                      {getCurrentImageIndex() + 1} of {portraitGallery.length}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </Dialog>
  );
}