/**
 * Universal Portrait/Image Modal
 * Replicates CharacterPortraitModal for all world bible entities
 * Handles image generation and management for locations, items, creatures, etc.
 */

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
import type { WorldBibleEntity, WorldBibleCategory } from '@/lib/worldBibleTypes';

// Art style configurations for each entity type
const ART_STYLE_CONFIGS = {
  locations: {
    styles: [
      'Fantasy landscape painting',
      'Detailed architectural drawing', 
      'Isometric map view',
      'Atmospheric concept art',
      'Medieval illuminated manuscript',
      'Digital matte painting',
      'Watercolor sketch',
      'Technical blueprint'
    ],
    defaultPrompt: 'Create a detailed visual representation of this location'
  },
  timeline: {
    styles: [
      'Historical painting',
      'Documentary illustration',
      'Epic battle scene',
      'Political cartoon',
      'Stained glass window',
      'Ancient tapestry',
      'Newspaper illustration',
      'Monument sculpture'
    ],
    defaultPrompt: 'Create a visual representation of this historical event'
  },
  factions: {
    styles: [
      'Heraldic coat of arms',
      'Group portrait',
      'Military formation',
      'Organization chart',
      'Banner design',
      'Ceremonial gathering',
      'Propaganda poster',
      'Guild symbol'
    ],
    defaultPrompt: 'Create a visual representation of this organization'
  },
  items: {
    styles: [
      'Museum display',
      'Technical diagram',
      'Fantasy artifact',
      'Vintage illustration',
      'Product photography',
      'Archaeological sketch',
      'Magical glow effect',
      'Detailed close-up'
    ],
    defaultPrompt: 'Create a detailed image of this item or artifact'
  },
  magic: {
    styles: [
      'Magical energy visualization',
      'Arcane circle diagram',
      'Spell effect illustration',
      'Mystical symbols',
      'Elemental manifestation',
      'Ritual scene',
      'Magical aura',
      'Ancient grimoire page'
    ],
    defaultPrompt: 'Create a visual representation of this magical system'
  },
  bestiary: {
    styles: [
      'Natural history illustration',
      'Creature portrait',
      'Action pose',
      'Anatomical diagram',
      'Field guide sketch',
      'Fantasy art',
      'Scientific illustration',
      'Habitat scene'
    ],
    defaultPrompt: 'Create a detailed illustration of this creature'
  },
  languages: {
    styles: [
      'Ancient manuscript',
      'Calligraphy sample',
      'Linguistic diagram',
      'Cultural document',
      'Script comparison',
      'Stone inscription',
      'Scroll design',
      'Typography showcase'
    ],
    defaultPrompt: 'Create a visual representation of this language'
  },
  cultures: {
    styles: [
      'Cultural scene',
      'Traditional artwork',
      'Social gathering',
      'Architectural style',
      'Ceremonial event',
      'Daily life scene',
      'Cultural artifacts',
      'Traditional costume'
    ],
    defaultPrompt: 'Create a visual representation of this culture'
  },
  prophecies: {
    styles: [
      'Mystical vision',
      'Oracle scene',
      'Symbolic imagery',
      'Ancient prophecy scroll',
      'Divination artwork',
      'Ethereal manifestation',
      'Prophetic dream',
      'Sacred text'
    ],
    defaultPrompt: 'Create a visual representation of this prophecy'
  },
  themes: {
    styles: [
      'Abstract symbolism',
      'Metaphorical imagery',
      'Conceptual art',
      'Symbolic composition',
      'Thematic illustration',
      'Allegorical scene',
      'Visual metaphor',
      'Artistic interpretation'
    ],
    defaultPrompt: 'Create a visual representation of this theme'
  }
};

interface UniversalPortraitModalProps {
  entity: WorldBibleEntity;
  category: WorldBibleCategory;
  isOpen: boolean;
  onClose: () => void;
  onImageGenerated?: (imageUrl: string) => void;
  onImageUploaded?: (imageUrl: string) => void;
}

export function UniversalPortraitModal({
  entity,
  category,
  isOpen,
  onClose,
  onImageGenerated,
  onImageUploaded
}: UniversalPortraitModalProps) {
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
  const [imageGallery, setImageGallery] = useState<Array<{id: string, url: string, isMain: boolean}>>(() => {
    const existingImages = entity.portraits || [];
    return Array.isArray(existingImages) ? existingImages : [];
  });

  const styleConfig = ART_STYLE_CONFIGS[category];

  // Generate optimized prompt for the entity
  const generateEntityPrompt = () => {
    const promptSections = [];
    
    // Basic entity information
    if (entity.name) promptSections.push(`${entity.name}`);
    if (entity.description) promptSections.push(entity.description);
    
    // Category-specific prompt enhancement
    switch (category) {
      case 'locations':
        const location = entity as any;
        if (location.locationType) promptSections.push(`${location.locationType} type`);
        if (location.geography) promptSections.push(location.geography);
        if (location.architecture) promptSections.push(`Architecture: ${location.architecture}`);
        break;
        
      case 'items':
        const item = entity as any;
        if (item.itemType) promptSections.push(`${item.itemType} type`);
        if (item.material) promptSections.push(`Made of: ${item.material}`);
        if (item.magical) promptSections.push('Magical properties');
        break;
        
      case 'bestiary':
        const creature = entity as any;
        if (creature.species) promptSections.push(`${creature.species} species`);
        if (creature.size) promptSections.push(`${creature.size} sized`);
        if (creature.appearance) promptSections.push(creature.appearance);
        break;
        
      // Add more category-specific enhancements as needed
    }
    
    return promptSections.join('. ');
  };

  // Handle image generation
  const handleGenerateImage = async () => {
    if (isGenerating) return;
    
    setIsGenerating(true);
    try {
      const prompt = generateEntityPrompt();
      const fullPrompt = `${prompt}${artStyle ? `, in ${artStyle} style` : ''}${additionalDetails ? `, ${additionalDetails}` : ''}`;
      
      const response = await fetch('/api/generate-entity-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: fullPrompt,
          entityId: entity.id,
          category: category
        })
      });
      
      if (response.ok) {
        const result = await response.json();
        setNewGeneratedImage(result.imageUrl);
        onImageGenerated?.(result.imageUrl);
        
        // Add to gallery
        const newImage = {
          id: `generated_${Date.now()}`,
          url: result.imageUrl,
          isMain: imageGallery.length === 0
        };
        setImageGallery(prev => [...prev, newImage]);
      }
    } catch (error) {
      console.error('Image generation failed:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  // Handle file upload
  const handleFileUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    
    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append('image', files[0]);
      formData.append('entityId', entity.id);
      formData.append('category', category);
      
      const response = await fetch('/api/upload-entity-image', {
        method: 'POST',
        body: formData
      });
      
      if (response.ok) {
        const result = await response.json();
        onImageUploaded?.(result.imageUrl);
        
        // Add to gallery
        const newImage = {
          id: `uploaded_${Date.now()}`,
          url: result.imageUrl,
          isMain: imageGallery.length === 0
        };
        setImageGallery(prev => [...prev, newImage]);
      }
    } catch (error) {
      console.error('Image upload failed:', error);
    } finally {
      setIsUploading(false);
    }
  };

  const categoryDisplayNames = {
    locations: 'Location',
    timeline: 'Event',
    factions: 'Faction', 
    items: 'Item',
    magic: 'Magic System',
    bestiary: 'Creature',
    languages: 'Language',
    cultures: 'Culture',
    prophecies: 'Prophecy',
    themes: 'Theme'
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <Image className="w-5 h-5" />
            Manage Images - {entity.name} ({categoryDisplayNames[category]})
          </DialogTitle>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 overflow-hidden">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="generate">
              <Sparkles className="w-4 h-4 mr-2" />
              Generate
            </TabsTrigger>
            <TabsTrigger value="upload">
              <Upload className="w-4 h-4 mr-2" />
              Upload
            </TabsTrigger>
            <TabsTrigger value="gallery">
              <Eye className="w-4 h-4 mr-2" />
              Gallery ({imageGallery.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="generate" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="artStyle">Art Style</Label>
                  <Select value={artStyle} onValueChange={setArtStyle}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose an art style..." />
                    </SelectTrigger>
                    <SelectContent>
                      {styleConfig.styles.map((style) => (
                        <SelectItem key={style} value={style}>
                          {style}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="additionalDetails">Additional Details</Label>
                  <Textarea
                    id="additionalDetails"
                    placeholder="Add specific visual details..."
                    value={additionalDetails}
                    onChange={(e) => setAdditionalDetails(e.target.value)}
                    rows={3}
                  />
                </div>

                <Button 
                  onClick={handleGenerateImage}
                  disabled={isGenerating}
                  className="w-full"
                >
                  {isGenerating ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 mr-2" />
                      Generate Image
                    </>
                  )}
                </Button>
              </div>

              <div className="space-y-4">
                <div>
                  <Label>Preview Prompt</Label>
                  <div className="p-3 bg-muted rounded-lg text-sm">
                    {generateEntityPrompt()}
                    {artStyle && `, in ${artStyle} style`}
                    {additionalDetails && `, ${additionalDetails}`}
                  </div>
                </div>

                {newGeneratedImage && (
                  <div className="space-y-2">
                    <Label>Generated Image</Label>
                    <img
                      src={newGeneratedImage}
                      alt="Generated"
                      className="w-full rounded-lg border"
                    />
                  </div>
                )}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="upload" className="space-y-4">
            <div
              className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                dragActive ? 'border-primary bg-primary/10' : 'border-muted-foreground/25'
              }`}
              onDragOver={(e) => {
                e.preventDefault();
                setDragActive(true);
              }}
              onDragLeave={() => setDragActive(false)}
              onDrop={(e) => {
                e.preventDefault();
                setDragActive(false);
                handleFileUpload(e.dataTransfer.files);
              }}
            >
              <Upload className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-semibold mb-2">Upload an Image</h3>
              <p className="text-muted-foreground mb-4">
                Drag and drop an image here, or click to browse
              </p>
              <Input
                type="file"
                accept="image/*"
                onChange={(e) => handleFileUpload(e.target.files)}
                className="hidden"
                id="image-upload"
                disabled={isUploading}
              />
              <Button asChild disabled={isUploading}>
                <label htmlFor="image-upload" className="cursor-pointer">
                  {isUploading ? 'Uploading...' : 'Choose File'}
                </label>
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="gallery" className="space-y-4">
            {imageGallery.length === 0 ? (
              <div className="text-center py-8">
                <Image className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground">No images yet</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {imageGallery.map((image) => (
                  <div key={image.id} className="relative group">
                    <img
                      src={image.url}
                      alt=""
                      className="w-full aspect-square object-cover rounded-lg border cursor-pointer"
                      onClick={() => setSelectedImagePreview(image.url)}
                    />
                    <div className="absolute top-2 right-2 flex gap-1">
                      {image.isMain && (
                        <Badge className="bg-primary text-primary-foreground">
                          <Star className="w-3 h-3 mr-1" />
                          Main
                        </Badge>
                      )}
                    </div>
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center gap-2">
                      <Button size="sm" variant="secondary">
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="secondary">
                        <Download className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="destructive">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}