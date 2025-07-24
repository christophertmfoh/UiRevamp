import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Card, CardContent } from '@/components/ui/card';
import { MapPin, Sparkles, Image as ImageIcon, X, Star, Download } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Location {
  id: string;
  projectId: string;
  name: string;
  description: string;
  imageGallery: any[];
  displayImageId: number | null;
}

interface LocationPortraitModalProps {
  location: Location;
  onClose: () => void;
  onUpdate: () => void;
}

export function LocationPortraitModal({ location, onClose, onUpdate }: LocationPortraitModalProps) {
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const updateDisplayImageMutation = useMutation({
    mutationFn: async (imageId: number) => {
      const response = await fetch(`/api/locations/${location.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...location,
          displayImageId: imageId,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update display image');
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/projects', location.projectId, 'locations'] });
      onUpdate();
      toast({
        title: 'Display Image Updated',
        description: 'The location\'s main image has been updated.',
      });
    },
  });

  const generateImageMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch('/api/generate-location-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          locationId: location.id,
          locationName: location.name,
          description: location.description,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate location image');
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/projects', location.projectId, 'locations'] });
      onUpdate();
      setIsGenerating(false);
      toast({
        title: 'Image Generated',
        description: `New image generated for ${location.name}`,
      });
    },
    onError: (error) => {
      setIsGenerating(false);
      toast({
        title: 'Generation Failed',
        description: 'Failed to generate location image. Please try again.',
        variant: 'destructive',
      });
    },
  });

  const handleGenerateImage = () => {
    setIsGenerating(true);
    generateImageMutation.mutate();
  };

  const handleSetDisplayImage = (imageId: number) => {
    updateDisplayImageMutation.mutate(imageId);
  };

  const hasImages = location.imageGallery && location.imageGallery.length > 0;

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            {location.name} - Image Gallery
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
          {/* Image Gallery */}
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold">
                Gallery ({hasImages ? location.imageGallery.length : 0})
              </h3>
              <Button
                onClick={handleGenerateImage}
                disabled={isGenerating}
                className="interactive-warm gap-2"
                size="sm"
              >
                <Sparkles className="h-4 w-4" />
                {isGenerating ? 'Generating...' : 'Generate Image'}
              </Button>
            </div>

            <ScrollArea className="h-[400px]">
              {!hasImages ? (
                <div className="text-center py-12">
                  <ImageIcon className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                  <h3 className="font-title text-lg mb-2">No Images Yet</h3>
                  <p className="text-muted-foreground mb-4">
                    Generate your first location image
                  </p>
                  <Button onClick={handleGenerateImage} disabled={isGenerating} className="interactive-warm">
                    <Sparkles className="h-4 w-4 mr-2" />
                    {isGenerating ? 'Generating...' : 'Generate First Image'}
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-4">
                  {location.imageGallery.map((image, index) => (
                    <Card 
                      key={image.id} 
                      className={`cursor-pointer transition-all duration-200 hover:scale-105 ${
                        selectedImageIndex === index ? 'ring-2 ring-accent' : ''
                      }`}
                      onClick={() => setSelectedImageIndex(selectedImageIndex === index ? null : index)}
                    >
                      <CardContent className="p-0 relative">
                        <img
                          src={image.url}
                          alt={`${location.name} - Image ${index + 1}`}
                          className="w-full h-32 object-cover rounded-lg"
                        />
                        
                        {/* Display Image Badge */}
                        {location.displayImageId === image.id && (
                          <Badge className="absolute top-2 left-2 bg-accent">
                            <Star className="h-3 w-3 mr-1" />
                            Main
                          </Badge>
                        )}
                        
                        {/* Action Buttons */}
                        <div className="absolute top-2 right-2 flex gap-1">
                          {location.displayImageId !== image.id && (
                            <Button
                              size="sm"
                              variant="secondary"
                              className="h-6 w-6 p-0"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleSetDisplayImage(image.id);
                              }}
                            >
                              <Star className="h-3 w-3" />
                            </Button>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </ScrollArea>
          </div>

          {/* Location Info & Selected Image */}
          <div className="space-y-4">
            <Card className="creative-card">
              <CardContent className="p-4">
                <h4 className="font-semibold mb-2">{location.name}</h4>
                <p className="text-sm text-muted-foreground line-clamp-4">
                  {location.description}
                </p>
              </CardContent>
            </Card>

            {/* Selected Image Preview */}
            {selectedImageIndex !== null && hasImages && (
              <Card className="creative-card">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold">Image Preview</h4>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setSelectedImageIndex(null)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                  
                  <img
                    src={location.imageGallery[selectedImageIndex].url}
                    alt={`${location.name} - Preview`}
                    className="w-full h-48 object-cover rounded-lg mb-3"
                  />
                  
                  <div className="flex gap-2">
                    {location.displayImageId !== location.imageGallery[selectedImageIndex].id && (
                      <Button
                        size="sm"
                        onClick={() => handleSetDisplayImage(location.imageGallery[selectedImageIndex].id)}
                        className="flex-1"
                      >
                        <Star className="h-3 w-3 mr-1" />
                        Set as Main
                      </Button>
                    )}
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        const link = document.createElement('a');
                        link.href = location.imageGallery[selectedImageIndex].url;
                        link.download = `${location.name}-image-${selectedImageIndex + 1}.png`;
                        link.click();
                      }}
                    >
                      <Download className="h-3 w-3" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}