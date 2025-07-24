import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Sparkles, Loader2, Users, Crown, Sword, Heart, BookOpen, Zap, Shield, Laugh, Eye, Star, Wand2 } from 'lucide-react';

interface CharacterGenerationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onGenerate: (generationOptions: CharacterGenerationOptions) => Promise<void>;
  isGenerating: boolean;
}

export interface CharacterGenerationOptions {
  characterType: string;
  role: string;
  customPrompt: string;
  personality: string;
  archetype: string;
}

const CHARACTER_TYPES = [
  { value: 'protagonist', label: 'Protagonist', icon: Crown, description: 'The main hero of your story' },
  { value: 'antagonist', label: 'Antagonist', icon: Sword, description: 'The primary opposition force' },
  { value: 'supporting', label: 'Supporting Character', icon: Users, description: 'Important secondary character' },
  { value: 'love-interest', label: 'Love Interest', icon: Heart, description: 'Romantic connection' },
  { value: 'mentor', label: 'Mentor', icon: BookOpen, description: 'Wise guide and teacher' },
  { value: 'sidekick', label: 'Sidekick', icon: Star, description: 'Loyal companion' },
  { value: 'villain', label: 'Villain', icon: Zap, description: 'Evil or corrupt character' },
  { value: 'anti-hero', label: 'Anti-Hero', icon: Shield, description: 'Flawed protagonist' },
  { value: 'comic-relief', label: 'Comic Relief', icon: Laugh, description: 'Humorous character' },
  { value: 'mysterious-figure', label: 'Mysterious Figure', icon: Eye, description: 'Enigmatic presence' },
  { value: 'wise-elder', label: 'Wise Elder', icon: BookOpen, description: 'Ancient wisdom keeper' },
  { value: 'innocent', label: 'Innocent', icon: Heart, description: 'Pure and naive character' },
  { value: 'rebel', label: 'Rebel', icon: Sword, description: 'Defiant and revolutionary' },
  { value: 'guardian', label: 'Guardian', icon: Shield, description: 'Protector and defender' },
  { value: 'trickster', label: 'Trickster', icon: Wand2, description: 'Cunning and mischievous' },
];

const ARCHETYPES = [
  { value: 'hero', label: 'The Hero', description: 'Brave, determined, seeks to prove worth' },
  { value: 'innocent', label: 'The Innocent', description: 'Pure, optimistic, trusting' },
  { value: 'explorer', label: 'The Explorer', description: 'Freedom-loving, adventurous, pioneering' },
  { value: 'sage', label: 'The Sage', description: 'Wise, knowledgeable, truth-seeking' },
  { value: 'outlaw', label: 'The Outlaw', description: 'Revolutionary, wild, disruptive' },
  { value: 'magician', label: 'The Magician', description: 'Visionary, inventive, transformative' },
  { value: 'everyman', label: 'The Everyman', description: 'Relatable, down-to-earth, belongs' },
  { value: 'lover', label: 'The Lover', description: 'Passionate, devoted, romantic' },
  { value: 'jester', label: 'The Jester', description: 'Fun-loving, humorous, lives in the moment' },
  { value: 'caregiver', label: 'The Caregiver', description: 'Caring, generous, nurturing' },
  { value: 'creator', label: 'The Creator', description: 'Creative, artistic, imaginative' },
  { value: 'ruler', label: 'The Ruler', description: 'Responsible, authoritative, leader' },
];

const PERSONALITY_SUGGESTIONS = [
  'Brave and determined', 'Witty and sarcastic', 'Kind and compassionate', 'Mysterious and aloof',
  'Ambitious and driven', 'Gentle and nurturing', 'Rebellious and defiant', 'Wise and thoughtful',
  'Cheerful and optimistic', 'Brooding and introspective', 'Loyal and steadfast', 'Cunning and strategic',
  'Impulsive and passionate', 'Calm and collected', 'Charismatic and persuasive', 'Shy and reserved'
];

export function CharacterGenerationModal({ 
  isOpen, 
  onClose, 
  onGenerate, 
  isGenerating 
}: CharacterGenerationModalProps) {
  const [characterType, setCharacterType] = useState('');
  const [role, setRole] = useState('');
  const [customPrompt, setCustomPrompt] = useState('');
  const [personality, setPersonality] = useState('');
  const [archetype, setArchetype] = useState('');
  const [selectedTab, setSelectedTab] = useState('type');

  const handleGenerate = async () => {
    await onGenerate({
      characterType,
      role,
      customPrompt,
      personality,
      archetype
    });
  };

  const handleReset = () => {
    setCharacterType('');
    setRole('');
    setCustomPrompt('');
    setPersonality('');
    setArchetype('');
    setSelectedTab('type');
  };

  const selectedCharacterType = CHARACTER_TYPES.find(t => t.value === characterType);
  const selectedArchetypeData = ARCHETYPES.find(a => a.value === archetype);

  const isComplete = characterType && (role || archetype || personality || customPrompt);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
        <DialogHeader className="pb-4 border-b border-border/50">
          <DialogTitle className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-accent/20 to-accent/10 rounded-lg">
              <Sparkles className="h-6 w-6 text-accent" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">AI Character Generator</h2>
              <p className="text-muted-foreground font-normal">Create a detailed character with artificial intelligence</p>
            </div>
          </DialogTitle>
        </DialogHeader>
        
        <div className="flex-1 overflow-auto">
          <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
            <TabsList className="grid w-full grid-cols-4 mb-6">
              <TabsTrigger value="type" className="gap-2">
                <Crown className="h-4 w-4" />
                Character Type
              </TabsTrigger>
              <TabsTrigger value="archetype" className="gap-2">
                <Users className="h-4 w-4" />
                Archetype
              </TabsTrigger>
              <TabsTrigger value="details" className="gap-2">
                <BookOpen className="h-4 w-4" />
                Details
              </TabsTrigger>
              <TabsTrigger value="review" className="gap-2">
                <Eye className="h-4 w-4" />
                Review
              </TabsTrigger>
            </TabsList>

            {/* Character Type Selection */}
            <TabsContent value="type" className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-3">What type of character do you want to create?</h3>
                <div className="grid grid-cols-3 gap-3">
                  {CHARACTER_TYPES.map((type) => {
                    const Icon = type.icon;
                    return (
                      <Card 
                        key={type.value}
                        className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
                          characterType === type.value 
                            ? 'ring-2 ring-accent bg-accent/5' 
                            : 'hover:border-accent/30'
                        }`}
                        onClick={() => setCharacterType(type.value)}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-start gap-3">
                            <div className={`p-2 rounded-lg ${
                              characterType === type.value 
                                ? 'bg-accent text-accent-foreground' 
                                : 'bg-muted'
                            }`}>
                              <Icon className="h-4 w-4" />
                            </div>
                            <div className="flex-1">
                              <h4 className="font-semibold text-sm">{type.label}</h4>
                              <p className="text-xs text-muted-foreground mt-1">{type.description}</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </div>
              
              {characterType && (
                <div className="flex justify-end">
                  <Button onClick={() => setSelectedTab('archetype')} className="interactive-warm">
                    Next: Choose Archetype
                  </Button>
                </div>
              )}
            </TabsContent>

            {/* Archetype Selection */}
            <TabsContent value="archetype" className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-3">Select a character archetype (optional)</h3>
                <div className="max-h-[400px] overflow-y-auto pr-2">
                  <div className="grid grid-cols-3 gap-3">
                    {ARCHETYPES.map((arch) => (
                      <Card 
                        key={arch.value}
                        className={`cursor-pointer transition-all duration-200 hover:shadow-md min-h-[90px] ${
                          archetype === arch.value 
                            ? 'ring-2 ring-accent bg-accent/5' 
                            : 'hover:border-accent/30'
                        }`}
                        onClick={() => setArchetype(archetype === arch.value ? '' : arch.value)}
                      >
                        <CardContent className="p-3 h-full flex flex-col justify-center">
                          <div className="space-y-1.5">
                            <h4 className="font-semibold text-xs leading-tight">{arch.label}</h4>
                            <p className="text-xs text-muted-foreground leading-snug">{arch.description}</p>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="flex justify-between">
                <Button variant="outline" onClick={() => setSelectedTab('type')}>
                  Back
                </Button>
                <Button onClick={() => setSelectedTab('details')} className="interactive-warm">
                  Next: Add Details
                </Button>
              </div>
            </TabsContent>

            {/* Details */}
            <TabsContent value="details" className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-4">
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
                    <Label htmlFor="personality">Personality Traits</Label>
                    <Input
                      id="personality"
                      value={personality}
                      onChange={(e) => setPersonality(e.target.value)}
                      placeholder="e.g., brave, cautious, witty, brooding..."
                    />
                    <div className="flex flex-wrap gap-1 mt-2">
                      {PERSONALITY_SUGGESTIONS.slice(0, 8).map((suggestion) => (
                        <Badge 
                          key={suggestion}
                          variant="outline" 
                          className="text-xs cursor-pointer hover:bg-accent/10"
                          onClick={() => setPersonality(suggestion)}
                        >
                          {suggestion}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>

                <div>
                  <Label htmlFor="custom-prompt">Additional Details</Label>
                  <Textarea
                    id="custom-prompt"
                    value={customPrompt}
                    onChange={(e) => setCustomPrompt(e.target.value)}
                    placeholder="Any specific traits, background, or details you want this character to have..."
                    rows={8}
                    className="resize-none"
                  />
                </div>
              </div>
              
              <div className="flex justify-between">
                <Button variant="outline" onClick={() => setSelectedTab('archetype')}>
                  Back
                </Button>
                <Button onClick={() => setSelectedTab('review')} className="interactive-warm">
                  Review & Generate
                </Button>
              </div>
            </TabsContent>

            {/* Review & Generate */}
            <TabsContent value="review" className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-4">Review Your Character</h3>
                <Card className="bg-gradient-to-br from-muted/50 to-muted/20">
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      {selectedCharacterType && (
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-accent/20 rounded-lg">
                            <selectedCharacterType.icon className="h-4 w-4 text-accent" />
                          </div>
                          <div>
                            <p className="font-semibold">{selectedCharacterType.label}</p>
                            <p className="text-sm text-muted-foreground">{selectedCharacterType.description}</p>
                          </div>
                        </div>
                      )}

                      {selectedArchetypeData && (
                        <div className="p-3 bg-background/50 rounded-lg">
                          <p className="font-semibold text-sm">{selectedArchetypeData.label}</p>
                          <p className="text-xs text-muted-foreground">{selectedArchetypeData.description}</p>
                        </div>
                      )}

                      {role && (
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">Role</p>
                          <p className="font-semibold">{role}</p>
                        </div>
                      )}

                      {personality && (
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">Personality</p>
                          <p className="font-semibold">{personality}</p>
                        </div>
                      )}

                      {customPrompt && (
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">Additional Details</p>
                          <p className="text-sm">{customPrompt}</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="flex justify-between">
                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => setSelectedTab('details')}>
                    Back to Edit
                  </Button>
                  <Button variant="outline" onClick={handleReset}>
                    Start Over
                  </Button>
                </div>
                <Button 
                  onClick={handleGenerate} 
                  disabled={isGenerating || !isComplete}
                  size="lg"
                  className="bg-gradient-to-r from-accent to-accent/80 hover:from-accent/90 hover:to-accent/70 text-accent-foreground"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Generating Character...
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-4 w-4 mr-2" />
                      Generate Character
                    </>
                  )}
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
}