import React, { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { 
  Sparkles, Crown, Sword, Heart, Brain, Lightbulb, 
  FileText, Zap, Users, Loader2
} from 'lucide-react';
import { CharacterCreationService } from '@/lib/services/characterCreationService';
import { CharacterGenerationLoadingScreen } from './CharacterGenerationLoadingScreen';
import type { Character } from '@/lib/types';

interface CharacterAICreationUnifiedProps {
  projectId: string;
  onBack: () => void;
  onComplete: (character: Character) => void;
}

const EXAMPLE_PROMPTS = [
  {
    category: 'Fantasy',
    icon: Crown,
    prompts: [
      'A young elven mage who lost their magical abilities in a tragic accident and must find a new purpose in life',
      'An ancient dragon who has taken human form to better understand the mortals they once considered beneath them',
      'A dwarven blacksmith whose enchanted weapons have started gaining sentience and rebelling against their creators'
    ]
  },
  {
    category: 'Sci-Fi',
    icon: Zap,
    prompts: [
      'A cybernetic detective investigating crimes in a world where human consciousness can be downloaded and transferred',
      'An alien ambassador trying to prevent an intergalactic war while hiding their own species\' dark secret',
      'A time traveler who discovers that their attempts to fix the past have created worse futures'
    ]
  },
  {
    category: 'Modern',
    icon: Users,
    prompts: [
      'A small-town librarian who discovers that the rare books in their collection contain real magical spells',
      'A therapist who can literally see and interact with their patients\' inner demons and traumas',
      'A street musician whose melodies have the power to heal emotional wounds but drain their own life force'
    ]
  },
  {
    category: 'Romance',
    icon: Heart,
    prompts: [
      'Two rival food truck owners who are forced to work together during a city-wide festival',
      'A wedding planner who has sworn off love after a painful breakup, until they meet their most challenging client',
      'A time loop where someone must relive the same first date until they learn to be truly vulnerable'
    ]
  }
];

const WRITING_TIPS = [
  {
    icon: Lightbulb,
    title: 'Be Specific',
    tip: 'Include specific details about personality, background, and motivations rather than generic traits.'
  },
  {
    icon: Brain,
    title: 'Add Conflict',
    tip: 'Give your character internal struggles or external challenges that create interesting story potential.'
  },
  {
    icon: Heart,
    title: 'Include Flaws',
    tip: 'Perfect characters are boring. Add meaningful flaws that can drive character development.'
  },
  {
    icon: FileText,
    title: 'Consider Relationships',
    tip: 'Mention important relationships, enemies, or connections that shape who they are.'
  },
  {
    icon: Sword,
    title: 'Define Their Goal',
    tip: 'What does your character want most? What are they willing to sacrifice to get it?'
  }
];

export function CharacterAICreationUnified({
  projectId,
  onBack,
  onComplete
}: CharacterAICreationUnifiedProps) {
  const [prompt, setPrompt] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [currentStep, setCurrentStep] = useState('');
  const [progress, setProgress] = useState(0);
  const [generatedCharacter, setGeneratedCharacter] = useState<Partial<Character> | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [hasError, setHasError] = useState(false);

  const generateMutation = useMutation({
    mutationFn: async (promptText: string) => {
      console.log('🎭 Starting AI character generation with prompt:', promptText.substring(0, 100) + '...');
      setIsGenerating(true);
      setHasError(false);
      
      try {
        const result = await CharacterCreationService.generateFromPrompt(
          projectId, 
          promptText,
          (step: string, progress: number) => {
            console.log('🔄 Progress update:', step, progress + '%');
            setCurrentStep(step);
            setProgress(progress);
            
            // Update character preview when we get basic info
            if (progress >= 40 && step.includes('details')) {
              // This would normally come from a streaming response
              // For now, we'll update it at the end
            }
          }
        );
        console.log('✅ AI generation completed successfully:', result);
        return result;
      } catch (error) {
        console.error('❌ AI generation failed in mutationFn:', error);
        setHasError(true);
        throw error;
      }
    },
    onSuccess: (character) => {
      console.log('🎯 onSuccess called with character:', character.name);
      setGeneratedCharacter(character);
      setCurrentStep('Complete!');
      setProgress(100);
      setIsGenerating(false);
      
      console.log('🎭 Character generation complete:', {
        name: character.name,
        hasImage: !!character.imageUrl,
        fieldCount: Object.keys(character).length
      });
      
      // Brief delay to show completion, then navigate to full character view
      setTimeout(() => {
        console.log('🚀 Calling onComplete to navigate to character view');
        onComplete(character);
      }, 1500);
    },
    onError: (error) => {
      console.error('❌ Character generation failed in onError:', error);
      setCurrentStep('Generation failed: ' + (error.message || 'Unknown error'));
      setIsGenerating(false);
      setHasError(true);
      // Don't reset progress to 0 immediately so user can see the error
    }
  });

  const handleGenerate = () => {
    console.log('🎬 handleGenerate called with prompt length:', prompt.trim().length);
    if (prompt.trim()) {
      console.log('🚀 Starting character generation process...');
      setCurrentStep('Starting generation...');
      setProgress(5);
      setIsGenerating(true);
      setHasError(false);
      generateMutation.mutate(prompt.trim());
    } else {
      console.log('❌ Empty prompt, cannot generate');
    }
  };

  const useExamplePrompt = (examplePrompt: string) => {
    setPrompt(examplePrompt);
  };

  // Show loading screen if generating or if we have progress/error state
  if (generateMutation.isPending || isGenerating || progress > 0) {
    console.log('🔄 Showing loading screen - isPending:', generateMutation.isPending, 'isGenerating:', isGenerating, 'progress:', progress);
    return (
      <CharacterGenerationLoadingScreen
        currentStep={currentStep}
        progress={progress}
        character={generatedCharacter ? {
          name: generatedCharacter.name,
          species: generatedCharacter.species,
          occupation: generatedCharacter.occupation
        } : undefined}
      />
    );
  }

  // Show error state if there was an error
  if (hasError) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center space-y-6 max-w-md">
          <div className="text-red-500">
            <h3 className="text-xl font-semibold">Generation Failed</h3>
            <p className="text-sm mt-2">{currentStep}</p>
          </div>
          <button 
            onClick={() => {
              setHasError(false);
              setProgress(0);
              setCurrentStep('');
            }}
            className="px-4 py-2 bg-primary text-white rounded-lg"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex">
      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="flex-shrink-0 border-b border-border p-6">
          <div className="text-center">
            <h2 className="text-xl font-semibold text-foreground mb-2">Describe Your Character</h2>
            <p className="text-muted-foreground">Tell AI about your character concept and watch it come to life</p>
          </div>
        </div>

        {/* Main Input Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          <div className="max-w-3xl mx-auto space-y-6">
            {/* Input Card */}
            <Card className="border-2 focus-within:border-primary/50 focus-within:ring-2 focus-within:ring-primary/20">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <Sparkles className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">Character Description</h3>
                    <p className="text-sm text-muted-foreground">Be as detailed as you like</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Textarea
                  placeholder="Describe your character... For example: 'A former detective turned private investigator who has the ability to see the last 24 hours of a person's life by touching objects they've handled. She's haunted by a case she couldn't solve and drinks too much coffee. She has trust issues but a deep sense of justice...'"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  className="min-h-[150px] resize-none border-0 focus-visible:ring-0 text-base leading-relaxed"
                />
                <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
                  <span className="text-sm text-muted-foreground">
                    {prompt.length} characters
                  </span>
                  <Button
                    onClick={handleGenerate}
                    disabled={!prompt.trim() || generateMutation.isPending}
                    className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90"
                  >
                    <Sparkles className="h-5 w-5" />
                    {generateMutation.isPending ? 'Creating...' : 'Create Character'}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Example Prompts by Category */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-foreground">Need Inspiration?</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {EXAMPLE_PROMPTS.map((category) => {
                  const Icon = category.icon;
                  return (
                    <Card key={category.category} className="border border-border">
                      <CardHeader className="pb-3">
                        <div className="flex items-center gap-2">
                          <Icon className="h-5 w-5 text-primary" />
                          <h4 className="font-medium text-foreground">{category.category}</h4>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        {category.prompts.map((prompt, index) => (
                          <button
                            key={index}
                            onClick={() => useExamplePrompt(prompt)}
                            className="w-full text-left p-3 rounded-lg border border-border hover:border-primary/50 hover:bg-primary/5 transition-all group"
                          >
                            <p className="text-sm text-muted-foreground group-hover:text-foreground leading-relaxed">
                              {prompt}
                            </p>
                          </button>
                        ))}
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel - Tips */}
      <div className="w-80 flex-shrink-0 border-l border-border overflow-y-auto bg-muted/30">
        <div className="p-6 space-y-6">
          <div>
            <h3 className="font-semibold text-foreground mb-2">Writing Tips</h3>
            <p className="text-sm text-muted-foreground">Make your characters more compelling</p>
          </div>

          <div className="space-y-4">
            {WRITING_TIPS.map((tip, index) => {
              const Icon = tip.icon;
              return (
                <Card key={index} className="border border-border">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div className="p-2 rounded-lg bg-primary/10 flex-shrink-0">
                        <Icon className="h-4 w-4 text-primary" />
                      </div>
                      <div className="space-y-1">
                        <h4 className="font-medium text-sm text-foreground">{tip.title}</h4>
                        <p className="text-xs text-muted-foreground leading-relaxed">{tip.tip}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          <Card className="border border-primary/20 bg-primary/5">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <Lightbulb className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                <div className="space-y-2">
                  <h4 className="font-medium text-primary">Pro Tip</h4>
                  <p className="text-sm text-primary/80 leading-relaxed">
                    The more specific and detailed your description, the more interesting and unique your character will be. 
                    Don't be afraid to include contradictions and complexities!
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}