import React, { useState } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Sparkles, MapPin, Wand2, RefreshCw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
interface Project {
  id: string;
  title: string;
  description?: string;
  genre?: string;
  setting?: string;
}

interface LocationGenerationModalProps {
  projectId: string;
  onClose: () => void;
  onLocationGenerated: (location: any) => void;
}

export function LocationGenerationModal({ 
  projectId, 
  onClose, 
  onLocationGenerated 
}: LocationGenerationModalProps) {
  const [prompt, setPrompt] = useState('');
  const [locationName, setLocationName] = useState('');
  const [generatedLocation, setGeneratedLocation] = useState<any>(null);
  const { toast } = useToast();

  const { data: project } = useQuery<Project>({
    queryKey: ['/api/projects', projectId],
  });

  const generateMutation = useMutation({
    mutationFn: async ({ prompt, locationName }: { prompt: string; locationName?: string }) => {
      const response = await fetch('/api/generate-location', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projectId,
          prompt,
          locationName,
          projectContext: {
            title: project?.title || '',
            description: project?.description || '',
            genre: project?.genre || '',
            setting: project?.setting || '',
          },
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate location');
      }

      return response.json();
    },
    onSuccess: (data) => {
      setGeneratedLocation(data);
      toast({
        title: 'Location Generated',
        description: 'Your location has been created successfully!',
      });
    },
    onError: (error) => {
      toast({
        title: 'Generation Failed',
        description: 'Failed to generate location. Please try again.',
        variant: 'destructive',
      });
    },
  });

  const handleGenerate = () => {
    if (!prompt.trim()) {
      toast({
        title: 'Missing Information',
        description: 'Please provide a description or prompt for the location.',
        variant: 'destructive',
      });
      return;
    }

    generateMutation.mutate({ prompt, locationName });
  };

  const handleAccept = () => {
    if (generatedLocation) {
      onLocationGenerated(generatedLocation);
    }
  };

  const handleRegenerate = () => {
    if (prompt.trim()) {
      generateMutation.mutate({ prompt, locationName });
    }
  };

  const isGenerating = generateMutation.isPending;

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5" />
            Generate Location with AI
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Input Section */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="locationName">Location Name (Optional)</Label>
              <Input
                id="locationName"
                placeholder="Enter a specific name, or leave blank for AI to suggest..."
                value={locationName}
                onChange={(e) => setLocationName(e.target.value)}
                className="creative-input"
              />
            </div>

            <div>
              <Label htmlFor="prompt">
                Describe the location you want to create *
              </Label>
              <Textarea
                id="prompt"
                placeholder="Describe the type of location you want to create. For example: 'A mysterious ancient library hidden in a mountain', 'A bustling marketplace in a desert city', 'An abandoned mansion with dark secrets'..."
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                className="creative-input min-h-[120px]"
                rows={5}
              />
            </div>

            {project && (
              <div className="p-3 bg-muted/30 rounded-lg border">
                <h4 className="font-semibold text-sm mb-2 flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  Project Context
                </h4>
                <div className="text-sm text-muted-foreground space-y-1">
                  <p><strong>Title:</strong> {project.title}</p>
                  {project.genre && <p><strong>Genre:</strong> {project.genre}</p>}
                  {project.setting && <p><strong>Setting:</strong> {project.setting}</p>}
                </div>
              </div>
            )}
          </div>

          {/* Generated Location Preview */}
          {generatedLocation && (
            <div className="border rounded-lg p-4 bg-muted/20">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-title text-lg">{generatedLocation.name}</h3>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleRegenerate}
                  disabled={isGenerating}
                >
                  <RefreshCw className="h-3 w-3 mr-1" />
                  Regenerate
                </Button>
              </div>
              
              <div className="space-y-3 text-sm">
                <div>
                  <strong>Description:</strong>
                  <p className="text-muted-foreground mt-1">{generatedLocation.description}</p>
                </div>
                
                {generatedLocation.significance && (
                  <div>
                    <strong>Significance:</strong>
                    <p className="text-muted-foreground mt-1">{generatedLocation.significance}</p>
                  </div>
                )}
                
                {generatedLocation.history && (
                  <div>
                    <strong>History:</strong>
                    <p className="text-muted-foreground mt-1">{generatedLocation.history}</p>
                  </div>
                )}
                
                {generatedLocation.atmosphere && (
                  <div>
                    <strong>Atmosphere:</strong>
                    <p className="text-muted-foreground mt-1">{generatedLocation.atmosphere}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4 border-t">
            {!generatedLocation ? (
              <>
                <Button
                  onClick={handleGenerate}
                  disabled={isGenerating || !prompt.trim()}
                  className="interactive-warm flex-1"
                >
                  <Wand2 className="h-4 w-4 mr-2" />
                  {isGenerating ? 'Generating Location...' : 'Generate Location'}
                </Button>
                <Button variant="outline" onClick={onClose}>
                  Cancel
                </Button>
              </>
            ) : (
              <>
                <Button
                  onClick={handleAccept}
                  className="interactive-warm flex-1"
                >
                  <MapPin className="h-4 w-4 mr-2" />
                  Create This Location
                </Button>
                <Button variant="outline" onClick={onClose}>
                  Cancel
                </Button>
              </>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}