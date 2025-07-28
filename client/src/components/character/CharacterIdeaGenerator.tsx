import React, { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Sparkles, 
  RefreshCw, 
  Copy, 
  Save, 
  Users, 
  Lightbulb,
  Shuffle,
  Wand2
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface CharacterIdea {
  id: string;
  name: string;
  archetype: string;
  personality: string;
  background: string;
  motivation: string;
  conflict: string;
  quirk: string;
  visualDescription: string;
  tags: string[];
  createdAt: Date;
  collaborator?: string;
}

interface CharacterIdeaGeneratorProps {
  projectId: string;
  onCreateCharacter: (idea: CharacterIdea) => void;
  onClose: () => void;
}

const CHARACTER_ARCHETYPES = [
  'The Hero', 'The Mentor', 'The Trickster', 'The Rebel', 'The Explorer',
  'The Innocent', 'The Creator', 'The Ruler', 'The Caregiver', 'The Magician',
  'The Lover', 'The Jester', 'The Sage', 'The Outlaw', 'The Everyman'
];

const PERSONALITY_TRAITS = [
  'Ambitious', 'Compassionate', 'Cunning', 'Loyal', 'Mysterious',
  'Optimistic', 'Pessimistic', 'Reckless', 'Cautious', 'Charismatic',
  'Introverted', 'Eccentric', 'Pragmatic', 'Idealistic', 'Stoic'
];

const BACKGROUND_ELEMENTS = [
  'Royal bloodline', 'Street orphan', 'Academy scholar', 'War veteran',
  'Merchant family', 'Religious order', 'Criminal past', 'Noble exile',
  'Traveling performer', 'Apprentice artisan', 'Wilderness survivor',
  'Court spy', 'Healing temple', 'Magical accident', 'Foreign diplomat'
];

const MOTIVATIONS = [
  'Seeking revenge', 'Protecting family', 'Finding identity', 'Gaining power',
  'Discovering truth', 'Seeking redemption', 'Breaking a curse', 'Finding love',
  'Proving worth', 'Escaping fate', 'Saving homeland', 'Mastering craft',
  'Uncovering secrets', 'Building legacy', 'Finding belonging'
];

const CONFLICTS = [
  'Torn between duty and desire', 'Haunted by past mistakes', 'Struggling with inner darkness',
  'Caught between two worlds', 'Fighting against destiny', 'Betrayed by trusted ally',
  'Powers beyond control', 'Forbidden love', 'Family honor vs personal dreams',
  'Secret identity burden', 'Moral code vs survival', 'Lost memories return',
  'Ancient prophecy weight', 'Competing loyalties', 'Fear of own potential'
];

const QUIRKS = [
  'Talks to inanimate objects', 'Collects unusual items', 'Never removes gloves',
  'Speaks in riddles', 'Afraid of specific color', 'Always carries lucky charm',
  'Hums when nervous', 'Can\'t lie convincingly', 'Sleepwalks', 'Remembers everything',
  'Makes terrible puns', 'Draws on everything', 'Counts steps', 'Never sits down',
  'Whispers to animals'
];

export const CharacterIdeaGenerator: React.FC<CharacterIdeaGeneratorProps> = ({
  projectId,
  onCreateCharacter,
  onClose
}) => {
  const { toast } = useToast();
  const [currentIdea, setCurrentIdea] = useState<CharacterIdea | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [collaborativeMode, setCollaborativeMode] = useState(false);
  const [userInput, setUserInput] = useState('');
  const [savedIdeas, setSavedIdeas] = useState<CharacterIdea[]>([]);

  const getRandomElement = (array: string[]) => {
    return array[Math.floor(Math.random() * array.length)];
  };

  const generateRandomIdea = useCallback(async () => {
    setIsGenerating(true);
    
    // Simulate AI generation delay for authentic feel
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1500));
    
    const archetype = getRandomElement(CHARACTER_ARCHETYPES);
    const personality = getRandomElement(PERSONALITY_TRAITS);
    const background = getRandomElement(BACKGROUND_ELEMENTS);
    const motivation = getRandomElement(MOTIVATIONS);
    const conflict = getRandomElement(CONFLICTS);
    const quirk = getRandomElement(QUIRKS);
    
    // Generate a name based on archetype
    const names = {
      'The Hero': ['Aurora', 'Magnus', 'Celestine', 'Thane', 'Lyra'],
      'The Mentor': ['Eldara', 'Sage', 'Mirin', 'Corvus', 'Athena'],
      'The Trickster': ['Jinx', 'Raven', 'Sly', 'Whisper', 'Fox'],
      'The Rebel': ['Storm', 'Blaze', 'Rogue', 'Ash', 'Nova'],
      'The Explorer': ['Quest', 'Journey', 'Compass', 'Horizon', 'Scout']
    };
    
    const archetypeNames = names[archetype as keyof typeof names] || ['Alex', 'Morgan', 'Casey', 'River', 'Sage'];
    const name = getRandomElement(archetypeNames);
    
    // Create visual description
    const visualDescription = `A ${personality.toLowerCase()} individual with ${background.toLowerCase()} origins, embodying the essence of ${archetype.toLowerCase()}. ${quirk}`;
    
    const newIdea: CharacterIdea = {
      id: `idea_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      name,
      archetype,
      personality,
      background,
      motivation,
      conflict,
      quirk,
      visualDescription,
      tags: [archetype, personality, 'generated'],
      createdAt: new Date(),
      collaborator: collaborativeMode ? 'AI Assistant' : undefined
    };
    
    setCurrentIdea(newIdea);
    setIsGenerating(false);
    
    toast({
      title: "✨ New Character Idea Generated!",
      description: `Meet ${name}, ${archetype.toLowerCase()}`,
    });
  }, [collaborativeMode, toast]);

  const generateFromUserInput = useCallback(async () => {
    if (!userInput.trim()) {
      toast({
        title: "Input Required",
        description: "Please provide some inspiration text first",
        variant: "destructive"
      });
      return;
    }

    setIsGenerating(true);
    
    // Simulate AI processing user input
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Parse user input for keywords and generate contextual idea
    const keywords = userInput.toLowerCase().split(/\s+/);
    let selectedArchetype = getRandomElement(CHARACTER_ARCHETYPES);
    let selectedPersonality = getRandomElement(PERSONALITY_TRAITS);
    
    // Simple keyword matching for better contextual generation
    if (keywords.some(word => ['hero', 'brave', 'courage'].includes(word))) {
      selectedArchetype = 'The Hero';
      selectedPersonality = 'Courageous';
    } else if (keywords.some(word => ['wise', 'teacher', 'guide'].includes(word))) {
      selectedArchetype = 'The Mentor';
      selectedPersonality = 'Wise';
    } else if (keywords.some(word => ['magic', 'wizard', 'spell'].includes(word))) {
      selectedArchetype = 'The Magician';
      selectedPersonality = 'Mysterious';
    }
    
    const newIdea: CharacterIdea = {
      id: `idea_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      name: `Inspired by "${userInput.slice(0, 20)}${userInput.length > 20 ? '...' : ''}"`,
      archetype: selectedArchetype,
      personality: selectedPersonality,
      background: getRandomElement(BACKGROUND_ELEMENTS),
      motivation: getRandomElement(MOTIVATIONS),
      conflict: getRandomElement(CONFLICTS),
      quirk: getRandomElement(QUIRKS),
      visualDescription: `Inspired by user input: "${userInput}". A ${selectedPersonality.toLowerCase()} character embodying ${selectedArchetype.toLowerCase()} qualities.`,
      tags: [selectedArchetype, selectedPersonality, 'user-inspired', 'collaborative'],
      createdAt: new Date(),
      collaborator: 'User Input'
    };
    
    setCurrentIdea(newIdea);
    setIsGenerating(false);
    
    toast({
      title: "🎨 Collaborative Idea Created!",
      description: `Generated from your inspiration`,
    });
  }, [userInput, toast]);

  const saveIdea = useCallback(() => {
    if (currentIdea) {
      setSavedIdeas(prev => [currentIdea, ...prev]);
      toast({
        title: "💾 Idea Saved!",
        description: `${currentIdea.name} added to saved ideas`,
      });
    }
  }, [currentIdea, toast]);

  const copyIdea = useCallback(() => {
    if (currentIdea) {
      const ideaText = `
Character Idea: ${currentIdea.name}
Archetype: ${currentIdea.archetype}
Personality: ${currentIdea.personality}
Background: ${currentIdea.background}
Motivation: ${currentIdea.motivation}
Conflict: ${currentIdea.conflict}
Quirk: ${currentIdea.quirk}
Description: ${currentIdea.visualDescription}
      `.trim();
      
      navigator.clipboard.writeText(ideaText);
      toast({
        title: "📋 Copied to Clipboard!",
        description: "Character idea copied successfully",
      });
    }
  }, [currentIdea, toast]);

  const createCharacterFromIdea = useCallback(() => {
    if (currentIdea) {
      onCreateCharacter(currentIdea);
      toast({
        title: "🎭 Character Created!",
        description: `${currentIdea.name} added to your project`,
      });
    }
  }, [currentIdea, onCreateCharacter, toast]);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="text-center">
          <CardTitle className="flex items-center gap-2 justify-center">
            <Sparkles className="h-6 w-6 text-purple-500" />
            Collaborative Character Idea Generator
            <Wand2 className="h-6 w-6 text-blue-500" />
          </CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <Tabs defaultValue="generate" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="generate">Generate Ideas</TabsTrigger>
              <TabsTrigger value="current">Current Idea</TabsTrigger>
              <TabsTrigger value="saved">Saved Ideas ({savedIdeas.length})</TabsTrigger>
            </TabsList>
            
            <TabsContent value="generate" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Shuffle className="h-5 w-5" />
                      Random Spark
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm text-muted-foreground">
                      Generate completely random character ideas with unexpected combinations
                    </p>
                    <Button 
                      onClick={generateRandomIdea}
                      disabled={isGenerating}
                      className="w-full"
                      size="lg"
                    >
                      {isGenerating ? (
                        <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      ) : (
                        <Sparkles className="h-4 w-4 mr-2" />
                      )}
                      {isGenerating ? 'Generating Magic...' : 'Random Spark!'}
                    </Button>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Users className="h-5 w-5" />
                      Collaborative Creation
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Label htmlFor="user-input">Your Inspiration</Label>
                    <Textarea
                      id="user-input"
                      placeholder="Describe a character concept, mood, or scene... (e.g., 'A brave knight afraid of butterflies' or 'Someone who talks to shadows')"
                      value={userInput}
                      onChange={(e) => setUserInput(e.target.value)}
                      rows={3}
                    />
                    <Button 
                      onClick={generateFromUserInput}
                      disabled={isGenerating || !userInput.trim()}
                      className="w-full"
                      variant="secondary"
                    >
                      {isGenerating ? (
                        <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      ) : (
                        <Lightbulb className="h-4 w-4 mr-2" />
                      )}
                      {isGenerating ? 'Creating Together...' : 'Collaborate & Generate'}
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            <TabsContent value="current" className="space-y-4">
              {currentIdea ? (
                <Card>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          {currentIdea.name}
                          {currentIdea.collaborator && (
                            <Badge variant="secondary" className="text-xs">
                              {currentIdea.collaborator}
                            </Badge>
                          )}
                        </CardTitle>
                        <div className="flex gap-2 mt-2 flex-wrap">
                          {currentIdea.tags.map(tag => (
                            <Badge key={tag} variant="outline" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button onClick={copyIdea} size="sm" variant="outline">
                          <Copy className="h-4 w-4" />
                        </Button>
                        <Button onClick={saveIdea} size="sm" variant="outline">
                          <Save className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label className="font-semibold">Archetype</Label>
                        <p className="text-sm text-muted-foreground">{currentIdea.archetype}</p>
                      </div>
                      <div>
                        <Label className="font-semibold">Personality</Label>
                        <p className="text-sm text-muted-foreground">{currentIdea.personality}</p>
                      </div>
                      <div>
                        <Label className="font-semibold">Background</Label>
                        <p className="text-sm text-muted-foreground">{currentIdea.background}</p>
                      </div>
                      <div>
                        <Label className="font-semibold">Quirk</Label>
                        <p className="text-sm text-muted-foreground">{currentIdea.quirk}</p>
                      </div>
                    </div>
                    
                    <Separator />
                    
                    <div>
                      <Label className="font-semibold">Motivation</Label>
                      <p className="text-sm text-muted-foreground mt-1">{currentIdea.motivation}</p>
                    </div>
                    
                    <div>
                      <Label className="font-semibold">Central Conflict</Label>
                      <p className="text-sm text-muted-foreground mt-1">{currentIdea.conflict}</p>
                    </div>
                    
                    <div>
                      <Label className="font-semibold">Visual Description</Label>
                      <p className="text-sm text-muted-foreground mt-1">{currentIdea.visualDescription}</p>
                    </div>
                    
                    <div className="flex gap-2 pt-4">
                      <Button onClick={createCharacterFromIdea} className="flex-1">
                        <Users className="h-4 w-4 mr-2" />
                        Create Character
                      </Button>
                      <Button onClick={generateRandomIdea} variant="outline">
                        <RefreshCw className="h-4 w-4 mr-2" />
                        New Idea
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <Card>
                  <CardContent className="text-center py-8">
                    <Sparkles className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                    <p className="text-muted-foreground">No idea generated yet</p>
                    <p className="text-sm text-muted-foreground mt-2">
                      Use the Random Spark or Collaborative Creation to generate your first idea!
                    </p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
            
            <TabsContent value="saved" className="space-y-4">
              {savedIdeas.length > 0 ? (
                <div className="space-y-4">
                  {savedIdeas.map((idea) => (
                    <Card key={idea.id} className="cursor-pointer hover:shadow-md transition-shadow">
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <h4 className="font-semibold flex items-center gap-2">
                              {idea.name}
                              <Badge variant="outline" className="text-xs">
                                {idea.archetype}
                              </Badge>
                            </h4>
                            <p className="text-sm text-muted-foreground mt-1">
                              {idea.motivation} | {idea.quirk}
                            </p>
                            <div className="flex gap-1 mt-2">
                              {idea.tags.slice(0, 3).map(tag => (
                                <Badge key={tag} variant="secondary" className="text-xs">
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                          </div>
                          <Button 
                            size="sm" 
                            onClick={() => onCreateCharacter(idea)}
                            className="ml-4"
                          >
                            Create
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <Card>
                  <CardContent className="text-center py-8">
                    <Save className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                    <p className="text-muted-foreground">No saved ideas yet</p>
                    <p className="text-sm text-muted-foreground mt-2">
                      Generate and save character ideas to build your collection!
                    </p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          </Tabs>
          
          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};