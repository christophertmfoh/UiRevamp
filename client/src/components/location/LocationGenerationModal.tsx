import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Sparkles, Loader2 } from 'lucide-react';

interface LocationGenerationModalProps {
  project: any;
  existingLocations: any[];
  onGenerate: (generationOptions: LocationGenerationOptions) => Promise<void>;
  onClose: () => void;
  isGenerating: boolean;
}

export interface LocationGenerationOptions {
  locationType?: string;
  atmosphere?: string;
  scale?: string;
  setting?: string;
  customPrompt?: string;
}

export function LocationGenerationModal({ 
  project,
  existingLocations,
  onGenerate, 
  onClose,
  isGenerating 
}: LocationGenerationModalProps) {
  const [locationType, setLocationType] = useState('');
  const [atmosphere, setAtmosphere] = useState('');
  const [scale, setScale] = useState('');
  const [setting, setSetting] = useState('');
  const [customPrompt, setCustomPrompt] = useState('');

  const handleGenerate = async () => {
    await onGenerate({
      locationType,
      atmosphere,
      scale,
      setting,
      customPrompt
    });
  };

  const handleReset = () => {
    setLocationType('');
    setAtmosphere('');
    setScale('');
    setSetting('');
    setCustomPrompt('');
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-accent" />
            Generate Location
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div>
            <Label htmlFor="location-type">Location Type</Label>
            <Select value={locationType} onValueChange={setLocationType}>
              <SelectTrigger>
                <SelectValue placeholder="What kind of location?" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="city">City</SelectItem>
                <SelectItem value="village">Village</SelectItem>
                <SelectItem value="castle">Castle</SelectItem>
                <SelectItem value="forest">Forest</SelectItem>
                <SelectItem value="mountain">Mountain</SelectItem>
                <SelectItem value="dungeon">Dungeon</SelectItem>
                <SelectItem value="temple">Temple</SelectItem>
                <SelectItem value="tavern">Tavern</SelectItem>
                <SelectItem value="market">Market</SelectItem>
                <SelectItem value="ruin">Ancient Ruin</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="atmosphere">Atmosphere</Label>
            <Input
              id="atmosphere"
              value={atmosphere}
              onChange={(e) => setAtmosphere(e.target.value)}
              placeholder="e.g., mysterious, bustling, peaceful, dangerous..."
            />
          </div>

          <div>
            <Label htmlFor="scale">Scale</Label>
            <Select value={scale} onValueChange={setScale}>
              <SelectTrigger>
                <SelectValue placeholder="How large is it?" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="tiny">Tiny</SelectItem>
                <SelectItem value="small">Small</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="large">Large</SelectItem>
                <SelectItem value="massive">Massive</SelectItem>
                <SelectItem value="regional">Regional</SelectItem>
                <SelectItem value="continental">Continental</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="setting">Setting Style</Label>
            <Input
              id="setting"
              value={setting}
              onChange={(e) => setSetting(e.target.value)}
              placeholder="e.g., medieval, futuristic, steampunk, modern..."
            />
          </div>

          <div>
            <Label htmlFor="custom-prompt">Custom Description</Label>
            <Textarea
              id="custom-prompt"
              value={customPrompt}
              onChange={(e) => setCustomPrompt(e.target.value)}
              placeholder="Any specific details you want included..."
              rows={3}
            />
          </div>
        </div>

        <div className="flex justify-between pt-4">
          <Button variant="outline" onClick={handleReset}>
            Reset
          </Button>
          <div className="flex gap-2">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button 
              onClick={handleGenerate} 
              disabled={isGenerating}
              className="interactive-warm"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4 mr-2" />
                  Generate Location
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}