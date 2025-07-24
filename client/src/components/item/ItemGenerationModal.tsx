import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Sparkles, Loader2 } from 'lucide-react';

interface ItemGenerationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onGenerate: (generationOptions: ItemGenerationOptions) => Promise<void>;
  isGenerating: boolean;
}

export interface ItemGenerationOptions {
  itemType: string;
  role: string;
  customPrompt: string;
  personality: string;
  archetype: string;
}

export function ItemGenerationModal({ 
  isOpen, 
  onClose, 
  onGenerate, 
  isGenerating 
}: ItemGenerationModalProps) {
  const [itemType, setItemType] = useState('');
  const [role, setRole] = useState('');
  const [customPrompt, setCustomPrompt] = useState('');
  const [personality, setPersonality] = useState('');
  const [archetype, setArchetype] = useState('');

  const handleGenerate = async () => {
    await onGenerate({
      itemType,
      role,
      customPrompt,
      personality,
      archetype
    });
  };

  const handleReset = () => {
    setItemType('');
    setRole('');
    setCustomPrompt('');
    setPersonality('');
    setArchetype('');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-accent" />
            Generate Item
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div>
            <Label htmlFor="item-type">Item Type</Label>
            <Select value={itemType} onValueChange={setItemType}>
              <SelectTrigger>
                <SelectValue placeholder="What kind of item?" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="protagonist">Protagonist</SelectItem>
                <SelectItem value="antagonist">Antagonist</SelectItem>
                <SelectItem value="supporting">Supporting Item</SelectItem>
                <SelectItem value="mentor">Mentor</SelectItem>
                <SelectItem value="love-interest">Love Interest</SelectItem>
                <SelectItem value="comic-relief">Comic Relief</SelectItem>
                <SelectItem value="mysterious">Mysterious Figure</SelectItem>
                <SelectItem value="villain">Villain</SelectItem>
                <SelectItem value="ally">Ally</SelectItem>
                <SelectItem value="rival">Rival</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="role">Role in Story</Label>
            <Input
              id="role"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              placeholder="e.g., detective, wizard, shopkeeper, noble..."
            />
          </div>

          <div>
            <Label htmlFor="archetype">Item Archetype</Label>
            <Select value={archetype} onValueChange={setArchetype}>
              <SelectTrigger>
                <SelectValue placeholder="Choose an archetype" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="hero">The Hero</SelectItem>
                <SelectItem value="innocent">The Innocent</SelectItem>
                <SelectItem value="explorer">The Explorer</SelectItem>
                <SelectItem value="sage">The Sage</SelectItem>
                <SelectItem value="outlaw">The Outlaw</SelectItem>
                <SelectItem value="magician">The Magician</SelectItem>
                <SelectItem value="everyman">The Everyman</SelectItem>
                <SelectItem value="lover">The Lover</SelectItem>
                <SelectItem value="jester">The Jester</SelectItem>
                <SelectItem value="caregiver">The Caregiver</SelectItem>
                <SelectItem value="creator">The Creator</SelectItem>
                <SelectItem value="ruler">The Ruler</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="personality">Personality Traits</Label>
            <Input
              id="personality"
              value={personality}
              onChange={(e) => setPersonality(e.target.value)}
              placeholder="e.g., brave, cautious, witty, brooding..."
            />
          </div>

          <div>
            <Label htmlFor="custom-prompt">Additional Details</Label>
            <Textarea
              id="custom-prompt"
              value={customPrompt}
              onChange={(e) => setCustomPrompt(e.target.value)}
              placeholder="Any specific traits, background, or details you want this item to have..."
              rows={3}
            />
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
                disabled={isGenerating || !itemType}
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
                    Generate Item
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}