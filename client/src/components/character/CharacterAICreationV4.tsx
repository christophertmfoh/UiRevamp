import React, { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { 
  ArrowLeft, X, Sparkles, Wand2, Info, Loader2
} from 'lucide-react';
import { CharacterCreationService } from '@/lib/services/characterCreationService';
import type { Character } from '@/lib/types';

interface CharacterAICreationV4Props {
  projectId: string;
  onBack: () => void;
  onComplete: (character: Character) => void;
  onClose: () => void;
}

const EXAMPLE_PROMPTS = [
  "A mysterious detective with a dark past who solves crimes using unconventional methods",
  "An ancient dragon who has taken human form to understand mortal emotions",
  "A cyberpunk hacker with a heart of gold fighting against corporate oppression",
  "A time-traveling historian trying to preserve important moments in history"
];

export function CharacterAICreationV4({
  projectId,
  onBack,
  onComplete,
  onClose
}: CharacterAICreationV4Props) {
  const [prompt, setPrompt] = useState('');
  const [selectedExample, setSelectedExample] = useState<string | null>(null);

  const generateMutation = useMutation({
    mutationFn: async (description: string) => {
      const options = {
        characterType: 'custom',
        role: 'supporting',
        customPrompt: description,
        personality: '',
        archetype: ''
      };
      return await CharacterCreationService.generateCustomCharacter(projectId, options);
    },
    onSuccess: (character) => {
      onComplete(character as Character);
    }
  });

  const handleGenerate = () => {
    if (prompt.trim()) {
      generateMutation.mutate(prompt.trim());
    }
  };

  const handleExampleClick = (example: string) => {
    setPrompt(example);
    setSelectedExample(example);
  };

  if (generateMutation.isPending) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="relative">
            <div className="w-20 h-20 rounded-full border-4 border-purple-500/20 border-t-purple-500 animate-spin" />
            <Sparkles className="h-8 w-8 text-purple-500 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
          </div>
          <div className="space-y-2">
            <h3 className="text-lg font-semibold">Creating Your Character</h3>
            <p className="text-sm text-muted-foreground">
              AI is bringing your character to life...
            </p>
          </div>
          <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
            <Loader2 className="h-3 w-3 animate-spin" />
            This usually takes 10-20 seconds
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={onBack}
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
          <div className="h-6 w-px bg-border" />
          <div>
            <h2 className="text-xl font-semibold">Custom AI Character</h2>
            <p className="text-sm text-muted-foreground">
              Describe your character and AI will create it
            </p>
          </div>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          className="rounded-full hover:bg-muted"
        >
          <X className="h-5 w-5" />
        </Button>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6 overflow-y-auto">
        <div className="max-w-3xl mx-auto space-y-6">
          {/* Description Input */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-lg bg-purple-500/10">
                <Sparkles className="h-6 w-6 text-purple-500" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">Describe Your Character</h3>
                <p className="text-sm text-muted-foreground">
                  Be as detailed or as brief as you like
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="prompt">Character Description</Label>
              <Textarea
                id="prompt"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Describe your character's appearance, personality, background, abilities, or any other details you'd like..."
                rows={6}
                className="resize-none"
              />
              <div className="flex items-center justify-between">
                <p className="text-xs text-muted-foreground">
                  {prompt.length} characters
                </p>
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  <Info className="h-3 w-3" />
                  AI will expand your description into a complete character
                </p>
              </div>
            </div>
          </div>

          {/* Example Prompts */}
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-muted-foreground">
              Need inspiration? Try one of these:
            </h4>
            <div className="grid gap-3">
              {EXAMPLE_PROMPTS.map((example, index) => (
                <button
                  key={index}
                  onClick={() => handleExampleClick(example)}
                  className={cn(
                    "p-4 rounded-lg border text-left text-sm transition-all",
                    "hover:bg-muted hover:border-purple-500/50",
                    selectedExample === example && "border-purple-500 bg-purple-500/5"
                  )}
                >
                  <div className="flex items-start gap-3">
                    <Wand2 className="h-4 w-4 text-purple-500 mt-0.5 flex-shrink-0" />
                    <span>{example}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Tips */}
          <div className="bg-muted/50 rounded-lg p-4 space-y-2">
            <h4 className="font-medium text-sm flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-purple-500" />
              Tips for Great Results
            </h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Include personality traits and motivations</li>
              <li>• Mention their role in your story</li>
              <li>• Add unique quirks or abilities</li>
              <li>• Describe their appearance if it matters</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="p-6 border-t bg-muted/10">
        <div className="flex items-center justify-end gap-2">
          <Button
            variant="outline"
            onClick={onBack}
          >
            Cancel
          </Button>
          <Button
            onClick={handleGenerate}
            disabled={!prompt.trim() || generateMutation.isPending}
            className="gap-2 bg-purple-600 hover:bg-purple-700"
          >
            <Sparkles className="h-4 w-4" />
            Generate Character
          </Button>
        </div>
      </div>
    </div>
  );
}