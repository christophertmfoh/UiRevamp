import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Sparkles, Loader2 } from 'lucide-react';

interface LocationGenerationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onGenerate: (options: any) => void;
  isGenerating: boolean;
}

export function LocationGenerationModal({ isOpen, onClose, onGenerate, isGenerating }: LocationGenerationModalProps) {
  const [locationType, setLocationType] = useState('');
  const [scale, setScale] = useState('');
  const [climate, setClimate] = useState('');
  const [significance, setSignificance] = useState('');
  const [customPrompt, setCustomPrompt] = useState('');

  const handleGenerate = () => {
    onGenerate({
      locationType,
      scale,
      climate,
      significance,
      customPrompt
    });
  };

  const handleClose = () => {
    if (!isGenerating) {
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Sparkles className="h-5 w-5 mr-2" />
            Generate Location
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="locationType">Location Type</Label>
            <Select value={locationType} onValueChange={setLocationType}>
              <SelectTrigger>
                <SelectValue placeholder="Select location type..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="city">City</SelectItem>
                <SelectItem value="town">Town</SelectItem>
                <SelectItem value="village">Village</SelectItem>
                <SelectItem value="dungeon">Dungeon</SelectItem>
                <SelectItem value="forest">Forest</SelectItem>
                <SelectItem value="mountain">Mountain</SelectItem>
                <SelectItem value="castle">Castle</SelectItem>
                <SelectItem value="temple">Temple</SelectItem>
                <SelectItem value="ruins">Ruins</SelectItem>
                <SelectItem value="tavern">Tavern</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="scale">Scale</Label>
            <Select value={scale} onValueChange={setScale}>
              <SelectTrigger>
                <SelectValue placeholder="Select scale..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="room">Single Room</SelectItem>
                <SelectItem value="building">Building</SelectItem>
                <SelectItem value="district">District</SelectItem>
                <SelectItem value="settlement">Settlement</SelectItem>
                <SelectItem value="region">Region</SelectItem>
                <SelectItem value="continent">Continent</SelectItem>
                <SelectItem value="plane">Plane/Dimension</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="significance">Story Significance</Label>
            <Input
              id="significance"
              placeholder="e.g., Ancient battleground, Hidden sanctuary..."
              value={significance}
              onChange={(e) => setSignificance(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="customPrompt">Additional Details (Optional)</Label>
            <Textarea
              id="customPrompt"
              placeholder="Any specific requirements or details for this location..."
              value={customPrompt}
              onChange={(e) => setCustomPrompt(e.target.value)}
              rows={3}
            />
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button variant="outline" onClick={handleClose} disabled={isGenerating}>
              Cancel
            </Button>
            <Button onClick={handleGenerate} disabled={isGenerating}>
              {isGenerating ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4 mr-2" />
                  Generate
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}