import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Sparkles, Loader2 } from 'lucide-react';

interface FactionGenerationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onGenerate: (options: any) => void;
  isGenerating: boolean;
}

export function FactionGenerationModal({ isOpen, onClose, onGenerate, isGenerating }: FactionGenerationModalProps) {
  const [factionType, setFactionType] = useState('');
  const [role, setRole] = useState('');
  const [scale, setScale] = useState('');
  const [goals, setGoals] = useState('');
  const [customPrompt, setCustomPrompt] = useState('');

  const handleGenerate = () => {
    onGenerate({
      factionType,
      role,
      scale,
      goals,
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
            Generate Faction
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="factionType">Faction Type</Label>
            <Select value={factionType} onValueChange={setFactionType}>
              <SelectTrigger>
                <SelectValue placeholder="Select faction type..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="guild">Guild</SelectItem>
                <SelectItem value="military">Military Order</SelectItem>
                <SelectItem value="cult">Cult</SelectItem>
                <SelectItem value="criminal">Criminal Organization</SelectItem>
                <SelectItem value="political">Political Party</SelectItem>
                <SelectItem value="religious">Religious Order</SelectItem>
                <SelectItem value="merchant">Merchant Company</SelectItem>
                <SelectItem value="noble">Noble House</SelectItem>
                <SelectItem value="rebel">Rebel Group</SelectItem>
                <SelectItem value="academic">Academic Institution</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="role">Role in Story</Label>
            <Select value={role} onValueChange={setRole}>
              <SelectTrigger>
                <SelectValue placeholder="Select role..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ally">Allied Faction</SelectItem>
                <SelectItem value="enemy">Enemy Faction</SelectItem>
                <SelectItem value="neutral">Neutral Faction</SelectItem>
                <SelectItem value="rival">Rival Faction</SelectItem>
                <SelectItem value="mentor">Mentor Organization</SelectItem>
                <SelectItem value="patron">Patron/Employer</SelectItem>
                <SelectItem value="target">Mission Target</SelectItem>
                <SelectItem value="background">Background Faction</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="scale">Scale & Influence</Label>
            <Select value={scale} onValueChange={setScale}>
              <SelectTrigger>
                <SelectValue placeholder="Select scale..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="local">Local (City/Town)</SelectItem>
                <SelectItem value="regional">Regional (Province/State)</SelectItem>
                <SelectItem value="national">National (Country)</SelectItem>
                <SelectItem value="international">International</SelectItem>
                <SelectItem value="global">Global</SelectItem>
                <SelectItem value="planar">Planar/Cosmic</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="goals">Primary Goals</Label>
            <Input
              id="goals"
              placeholder="e.g., Seek ancient artifacts, Control trade routes..."
              value={goals}
              onChange={(e) => setGoals(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="customPrompt">Additional Details (Optional)</Label>
            <Textarea
              id="customPrompt"
              placeholder="Any specific requirements or details for this faction..."
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