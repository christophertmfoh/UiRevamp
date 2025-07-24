import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Sparkles, Loader2 } from 'lucide-react';

interface FactionGenerationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onGenerate: (generationOptions: FactionGenerationOptions) => Promise<void>;
  isGenerating: boolean;
}

export interface FactionGenerationOptions {
  factionType: string;
  role: string;
  customPrompt: string;
  personality: string;
  archetype: string;
}

export function FactionGenerationModal({ 
  isOpen, 
  onClose, 
  onGenerate, 
  isGenerating 
}: FactionGenerationModalProps) {
  const [factionType, setFactionType] = useState('');
  const [role, setRole] = useState('');
  const [customPrompt, setCustomPrompt] = useState('');
  const [personality, setPersonality] = useState('');
  const [archetype, setArchetype] = useState('');

  const handleGenerate = async () => {
    await onGenerate({
      factionType,
      role,
      customPrompt,
      personality,
      archetype
    });
  };

  const handleReset = () => {
    setFactionType('');
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
            Generate Faction
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div>
            <Label htmlFor="faction-type">Faction Type</Label>
            <Select value={factionType} onValueChange={setFactionType}>
              <SelectTrigger>
                <SelectValue placeholder="What kind of faction?" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Cultist Group">Cultist Group</SelectItem>
                <SelectItem value="Stone Lords">Stone Lords</SelectItem>
                <SelectItem value="Regional Peoples">Regional Peoples</SelectItem>
                <SelectItem value="Underground Movement">Underground Movement</SelectItem>
                <SelectItem value="Ancient Order">Ancient Order</SelectItem>
                <SelectItem value="Trading Guild">Trading Guild</SelectItem>
                <SelectItem value="Military Force">Military Force</SelectItem>
                <SelectItem value="Religious Order">Religious Order</SelectItem>
                <SelectItem value="Political Party">Political Party</SelectItem>
                <SelectItem value="Criminal Organization">Criminal Organization</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="role">Role in Story</Label>
            <Input
              id="role"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              placeholder="e.g., antagonistic force, ally group, neutral power, protective order..."
            />
          </div>

          <div>
            <Label htmlFor="archetype">Faction Archetype</Label>
            <Select value={archetype} onValueChange={setArchetype}>
              <SelectTrigger>
                <SelectValue placeholder="Choose an archetype" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="corrupting-force">The Corrupting Force</SelectItem>
                <SelectItem value="ancient-guardians">The Ancient Guardians</SelectItem>
                <SelectItem value="survivors">The Survivors</SelectItem>
                <SelectItem value="zealots">The Zealots</SelectItem>
                <SelectItem value="rebels">The Rebels</SelectItem>
                <SelectItem value="merchants">The Merchants</SelectItem>
                <SelectItem value="protectors">The Protectors</SelectItem>
                <SelectItem value="scholars">The Scholars</SelectItem>
                <SelectItem value="outcasts">The Outcasts</SelectItem>
                <SelectItem value="caregiver">The Caregiver</SelectItem>
                <SelectItem value="creator">The Creator</SelectItem>
                <SelectItem value="ruler">The Ruler</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="personality">Faction Traits</Label>
            <Input
              id="personality"
              value={personality}
              onChange={(e) => setPersonality(e.target.value)}
              placeholder="e.g., ruthless, secretive, honorable, desperate, fanatical..."
            />
          </div>

          <div>
            <Label htmlFor="custom-prompt">Additional Details</Label>
            <Textarea
              id="custom-prompt"
              value={customPrompt}
              onChange={(e) => setCustomPrompt(e.target.value)}
              placeholder="Any specific goals, methods, history, or organizational details you want this faction to have..."
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
                disabled={isGenerating || !factionType}
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
                    Generate Faction
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