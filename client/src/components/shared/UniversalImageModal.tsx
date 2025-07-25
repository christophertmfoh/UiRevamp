import { useState, useCallback } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Camera, Upload, Sparkles, Trash2, Eye, Star, X } from 'lucide-react';
import { apiRequest } from '@/lib/queryClient';
import { showErrorToast, showSuccessToast } from '@/lib/utils/errorHandling';

interface UniversalImageModalProps {
  entity: any;
  entityType: 'character' | 'creature' | 'location' | 'faction' | 'item' | 'organization' | 'magic-system' | 'timeline-event' | 'language' | 'culture' | 'prophecy' | 'theme';
  isOpen: boolean;
  onClose: () => void;
  onImageGenerated: (imageUrl: string) => void;
  onImageUploaded: (imageUrl: string) => void;
}

const ENTITY_IMAGE_TYPES = {
  character: { type: 'portrait', name: 'Portrait', icon: Camera },
  creature: { type: 'portrait', name: 'Portrait', icon: Camera },
  location: { type: 'map', name: 'Map', icon: Camera },
  faction: { type: 'emblem', name: 'Emblem', icon: Camera },
  item: { type: 'illustration', name: 'Illustration', icon: Camera },
  organization: { type: 'logo', name: 'Logo', icon: Camera },
  'magic-system': { type: 'symbol', name: 'Symbol', icon: Camera },
  'timeline-event': { type: 'illustration', name: 'Illustration', icon: Camera },
  language: { type: 'script', name: 'Script Sample', icon: Camera },
  culture: { type: 'artwork', name: 'Cultural Art', icon: Camera },
  prophecy: { type: 'artwork', name: 'Prophetic Art', icon: Camera },
  theme: { type: 'artwork', name: 'Thematic Art', icon: Camera }
};

export function UniversalImageModal({
  entity,
  entityType,
  isOpen,
  onClose,
  onImageGenerated,
  onImageUploaded
}: UniversalImageModalProps) {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState('generate');
  const [aiEngine, setAiEngine] = useState('gemini');
  const [stylePrompt, setStylePrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const [imageGallery, setImageGallery] = useState<Array<{id: string, url: string, isMain: boolean}>>(() => {
    const existingImages = entity.images || entity.portraits || [];
    return Array.isArray(existingImages) ? existingImages : [];
  });
  const [selectedMainImage, setSelectedMainImage] = useState<string>('');

  const imageConfig = ENTITY_IMAGE_TYPES[entityType];

  // Generate comprehensive AI prompt based on entity type and data
  const generateEntityPrompt = () => {
    const parts = [];
    
    // Basic info
    if (entity.name) parts.push(`${entityType} named ${entity.name}`);
    
    // Entity-specific prompt generation
    switch (entityType) {
      case 'character':
      case 'creature':
        // Physical characteristics for characters/creatures
        if (entity.age) parts.push(`${entity.age} years old`);
        if (entity.race) parts.push(entity.race);
        if (entity.ethnicity) parts.push(entity.ethnicity);
        if (entity.build) parts.push(`${entity.build} build`);
        if (entity.height) parts.push(`${entity.height} tall`);
        if (entity.eyeColor) parts.push(`${entity.eyeColor} eyes`);
        if (entity.hairColor) parts.push(`${entity.hairColor} hair`);
        if (entity.complexion) parts.push(`${entity.complexion} complexion`);
        if (entity.attire) parts.push(`wearing ${entity.attire}`);
        if (entity.physicalDescription) parts.push(entity.physicalDescription);
        break;
        
      case 'location':
        if (entity.terrain) parts.push(`${entity.terrain} terrain`);
        if (entity.climate) parts.push(`${entity.climate} climate`);
        if (entity.architecture) parts.push(`${entity.architecture} architecture`);
        if (entity.landmarks) parts.push(`landmarks: ${entity.landmarks}`);
        if (entity.atmosphere) parts.push(`atmosphere: ${entity.atmosphere}`);
        if (entity.description) parts.push(entity.description);
        break;
        
      case 'faction':
      case 'organization':
        if (entity.type) parts.push(`${entity.type} organization`);
        if (entity.ideology) parts.push(`ideology: ${entity.ideology}`);
        if (entity.symbol) parts.push(`symbol: ${entity.symbol}`);
        if (entity.colors) parts.push(`colors: ${entity.colors}`);
        if (entity.description) parts.push(entity.description);
        break;
        
      case 'item':
        if (entity.category) parts.push(`${entity.category} item`);
        if (entity.rarity) parts.push(`${entity.rarity} rarity`);
        if (entity.material) parts.push(`made of ${entity.material}`);
        if (entity.appearance) parts.push(entity.appearance);
        if (entity.description) parts.push(entity.description);
        break;
        
      default:
        if (entity.description) parts.push(entity.description);
        if (entity.appearance) parts.push(entity.appearance);
        break;
    }
    
    return parts.filter(Boolean).join(', ');
  };

  const generateImageMutation = useMutation({
    mutationFn: async () => {
      const entityPrompt = generateEntityPrompt();
      const fullPrompt = stylePrompt 
        ? `${entityPrompt}, ${stylePrompt}` 
        : entityPrompt;

      const response = await apiRequest('POST', `/api/${entityType}s/${entity.id}/generate-image`, {
        prompt: fullPrompt,
        engine: aiEngine,
        imageType: imageConfig.type
      });
      return response;
    },
    onSuccess: (data) => {
      if (data.imageUrl) {
        const newImage = {
          id: Date.now().toString(),
          url: data.imageUrl,
          isMain: imageGallery.length === 0
        };
        
        setImageGallery(prev => [...prev, newImage]);
        
        if (imageGallery.length === 0) {
          onImageGenerated(data.imageUrl);
        }
        
        showSuccessToast(`${imageConfig.name} generated successfully!`);
      }
    },
    onError: (error) => {
      showErrorToast(`Failed to generate ${imageConfig.name.toLowerCase()}: ${error.message}`);
    }
  });

  const saveImagesMutation = useMutation({
    mutationFn: async () => {
      const imageField = entityType === 'character' ? 'portraits' : 'images';
      const mainImageUrl = imageGallery.find(img => img.isMain)?.url || imageGallery[0]?.url;
      
      return await apiRequest('PUT', `/api/${entityType}s/${entity.id}`, {
        ...entity,
        imageUrl: mainImageUrl,
        [imageField]: imageGallery
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/${entityType}s`] });
      showSuccessToast(`${imageConfig.name}s saved successfully!`);
      onClose();
    },
    onError: (error) => {
      showErrorToast(`Failed to save ${imageConfig.name.toLowerCase()}s: ${error.message}`);
    }
  });

  const handleGenerate = () => {
    setIsGenerating(true);
    generateImageMutation.mutate();
    setIsGenerating(false);
  };

  const handleFileUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    Array.from(files).forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageUrl = e.target?.result as string;
        const newImage = {
          id: Date.now().toString() + Math.random(),
          url: imageUrl,
          isMain: imageGallery.length === 0
        };
        
        setImageGallery(prev => [...prev, newImage]);
        
        if (imageGallery.length === 0) {
          onImageUploaded(imageUrl);
        }
      };
      reader.readAsDataURL(file);
    });
  }, [imageGallery.length, onImageUploaded]);

  const setMainImage = (imageId: string) => {
    setImageGallery(prev => 
      prev.map(img => ({ ...img, isMain: img.id === imageId }))
    );
  };

  const removeImage = (imageId: string) => {
    setImageGallery(prev => prev.filter(img => img.id !== imageId));
  };

  const handleSave = () => {
    saveImagesMutation.mutate();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl max-h-[95vh] overflow-hidden flex flex-col">
        <DialogHeader className="shrink-0">
          <DialogTitle className="flex items-center gap-3">
            <imageConfig.icon className="h-6 w-6 text-accent" />
            {imageConfig.name} Studio - {entity.name || `New ${entityType}`}
          </DialogTitle>
        </DialogHeader>
        
        <div className="flex-1 overflow-hidden">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
            <TabsList className="grid w-full grid-cols-3 shrink-0">
              <TabsTrigger value="generate" className="flex items-center gap-2">
                <Sparkles className="h-4 w-4" />
                Generate
              </TabsTrigger>
              <TabsTrigger value="upload" className="flex items-center gap-2">
                <Upload className="h-4 w-4" />
                Upload
              </TabsTrigger>
              <TabsTrigger value="gallery" className="flex items-center gap-2">
                <Eye className="h-4 w-4" />
                Gallery ({imageGallery.length})
              </TabsTrigger>
            </TabsList>

            <div className="flex-1 overflow-auto custom-scrollbar">
              <TabsContent value="generate" className="space-y-6 p-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Sparkles className="h-5 w-5 text-accent" />
                      AI {imageConfig.name} Generation
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label>AI Engine</Label>
                      <Select value={aiEngine} onValueChange={setAiEngine}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="gemini">Google Gemini 2.0 ✨</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>Entity Description Preview</Label>
                      <div className="p-3 bg-muted/50 rounded border text-sm">
                        {generateEntityPrompt() || `Basic ${entityType} description`}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Additional Style Prompt</Label>
                      <Textarea
                        placeholder={`Add specific visual style, artistic medium, lighting, etc. for the ${imageConfig.name.toLowerCase()}...`}
                        value={stylePrompt}
                        onChange={(e) => setStylePrompt(e.target.value)}
                        className="min-h-[80px]"
                      />
                    </div>

                    <Button
                      onClick={handleGenerate}
                      disabled={isGenerating || generateImageMutation.isPending}
                      className="w-full"
                      size="lg"
                    >
                      {isGenerating || generateImageMutation.isPending ? (
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 border-2 border-accent/30 border-t-accent rounded-full animate-spin" />
                          Generating {imageConfig.name}...
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <Sparkles className="h-4 w-4" />
                          Generate {imageConfig.name}
                        </div>
                      )}
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="upload" className="space-y-6 p-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Upload className="h-5 w-5 text-accent" />
                      Upload {imageConfig.name}s
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="border-2 border-dashed border-border rounded-lg p-8 text-center space-y-4">
                      <Upload className="h-12 w-12 text-muted-foreground mx-auto" />
                      <div>
                        <p className="text-lg font-medium">Drop {imageConfig.name.toLowerCase()}s here or click to browse</p>
                        <p className="text-sm text-muted-foreground">PNG, JPG, GIF up to 10MB</p>
                      </div>
                      <Input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleFileUpload}
                        className="max-w-xs mx-auto"
                      />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="gallery" className="space-y-6 p-4">
                {imageGallery.length > 0 ? (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {imageGallery.map((image) => (
                      <Card key={image.id} className="relative group">
                        <CardContent className="p-2">
                          <div className="aspect-square rounded overflow-hidden relative">
                            <img 
                              src={image.url} 
                              alt={`${imageConfig.name} ${image.id}`}
                              className="w-full h-full object-cover"
                            />
                            {image.isMain && (
                              <Badge className="absolute top-2 left-2 bg-accent">
                                <Star className="h-3 w-3 mr-1" />
                                Main
                              </Badge>
                            )}
                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                              {!image.isMain && (
                                <Button
                                  size="sm"
                                  onClick={() => setMainImage(image.id)}
                                  variant="outline"
                                >
                                  <Star className="h-3 w-3" />
                                </Button>
                              )}
                              <Button
                                size="sm"
                                onClick={() => removeImage(image.id)}
                                variant="destructive"
                              >
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Camera className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-lg font-medium mb-2">No {imageConfig.name.toLowerCase()}s yet</p>
                    <p className="text-muted-foreground">Generate or upload some {imageConfig.name.toLowerCase()}s to get started</p>
                  </div>
                )}
              </TabsContent>
            </div>

            {imageGallery.length > 0 && (
              <div className="shrink-0 p-4 border-t bg-muted/30">
                <Button onClick={handleSave} className="w-full" size="lg">
                  Save {imageConfig.name}s ({imageGallery.length})
                </Button>
              </div>
            )}
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
}