import React, { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { 
  Wand2, Sparkles, Lightbulb, RefreshCw, Loader2, 
  BookOpen, Users, Crown, Zap, Copy, Check
} from 'lucide-react';
import { apiRequest } from '@/lib/queryClient';
import type { Character } from '@/lib/types';

interface CharacterAICreationUnifiedProps {
  projectId: string;
  onBack: () => void;
  onComplete: (character: Character) => void;
  theme: {
    primary: string;
    primaryHover: string;
    secondary: string;
    background: string;
    border: string;
  };
}

const EXAMPLE_PROMPTS = [
  {
    category: 'Fantasy',
    icon: Crown,
    prompts: [
      "A mysterious detective with a dark past who solves crimes using unconventional methods",
      "An ancient dragon who has taken human form to experience mortal life",
      "A fallen knight seeking redemption through protecting the innocent",
      "A young mage struggling to control dangerous magical abilities"
    ]
  },
  {
    category: 'Modern',
    icon: Users,
    prompts: [
      "A brilliant hacker who uses technology to fight corporate corruption",
      "A small-town teacher who discovers they have psychic abilities",
      "A retired spy trying to live a normal life but constantly pulled back into danger",
      "A social media influencer hiding a secret identity as a vigilante"
    ]
  },
  {
    category: 'Sci-Fi',
    icon: Zap,
    prompts: [
      "An AI android questioning what it means to be human",
      "A space explorer stranded on an alien planet with hostile creatures",
      "A time traveler trying to prevent a catastrophic future",
      "A cybernetic enhanced detective in a dystopian megacity"
    ]
  },
  {
    category: 'Literary',
    icon: BookOpen,
    prompts: [
      "A librarian who can enter the worlds of books they read",
      "An amnesiac struggling to piece together their forgotten life",
      "A single parent balancing career ambitions with family responsibilities",
      "An elderly person reflecting on life choices and missed opportunities"
    ]
  }
];

const TIPS = [
  "Be specific about personality traits, motivations, and backstory elements",
  "Include details about their appearance, mannerisms, and speech patterns",
  "Mention their goals, fears, and what drives them forward",
  "Add unique quirks or interesting contradictions to make them memorable",
  "Consider their relationships and how they interact with others"
];

export function CharacterAICreationUnified({
  projectId,
  onBack,
  onComplete,
  theme
}: CharacterAICreationUnifiedProps) {
  const [prompt, setPrompt] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [copiedTip, setCopiedTip] = useState<number | null>(null);

  const generateMutation = useMutation({
    mutationFn: async (prompt: string) => {
      const response = await apiRequest('POST', `/api/projects/${projectId}/characters/generate`, {
        prompt: prompt.trim(),
        enhanceDetails: true
      });
      return response.json();
    },
    onSuccess: (character) => {
      onComplete(character as Character);
    }
  });

  const handleGenerate = () => {
    if (prompt.trim()) {
      generateMutation.mutate(prompt);
    }
  };

  const handleUseExample = (examplePrompt: string) => {
    setPrompt(examplePrompt);
  };

  const handleCopyTip = (tipIndex: number, tip: string) => {
    navigator.clipboard.writeText(tip);
    setCopiedTip(tipIndex);
    setTimeout(() => setCopiedTip(null), 2000);
  };

  const isValidPrompt = prompt.trim().length >= 10;

  if (generateMutation.isPending) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center space-y-6">
          <div className="relative">
            <div 
              className="w-20 h-20 rounded-full border-4 animate-spin"
              style={{ 
                borderColor: theme.border,
                borderTopColor: theme.primary
              }}
            />
            <Wand2 
              className="h-8 w-8 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
              style={{ color: theme.primary }}
            />
          </div>
          <div className="space-y-2">
            <h3 className="text-xl font-semibold text-gray-900">Creating Your Character</h3>
            <p className="text-gray-600 max-w-md mx-auto">
              AI is crafting a unique character based on your description...
            </p>
          </div>
          <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
            <Loader2 className="h-4 w-4 animate-spin" />
            This usually takes 15-30 seconds
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex">
      {/* Left Panel - Main Input */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="flex-shrink-0 border-b border-gray-200 p-6">
          <div className="text-center">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Describe Your Character</h2>
            <p className="text-gray-600">Tell AI about the character you want to create</p>
          </div>
        </div>

        {/* Main Input Area */}
        <div className="flex-1 p-6 space-y-6">
          <div className="max-w-3xl mx-auto space-y-6">
            {/* Input Card */}
            <Card className="border-2" style={{ borderColor: theme.border }}>
              <CardHeader>
                <Label className="text-base font-medium flex items-center gap-2">
                  <Wand2 
                    className="h-5 w-5" 
                    style={{ color: theme.primary }}
                  />
                  Character Description
                </Label>
                <p className="text-sm text-gray-600">
                  Describe your character in detail. The more specific you are, the better the result.
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                <Textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="Example: A mysterious detective with a photographic memory who..."
                  className="min-h-[120px] resize-none border-gray-200 focus:border-purple-500 focus:ring-purple-500/20"
                  maxLength={1000}
                />
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">
                    {prompt.length}/1000 characters
                  </span>
                  <span className="text-gray-500">
                    Minimum 10 characters for generation
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="flex items-center justify-center gap-4">
              <Button
                onClick={handleGenerate}
                disabled={!isValidPrompt || generateMutation.isPending}
                size="lg"
                className="gap-3 px-8 text-white"
                style={{ backgroundColor: theme.primary }}
              >
                <Sparkles className="h-5 w-5" />
                {generateMutation.isPending ? 'Creating...' : 'Create Character'}
              </Button>
              {prompt && (
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => setPrompt('')}
                  className="gap-2"
                >
                  <RefreshCw className="h-4 w-4" />
                  Clear
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel - Examples and Tips */}
      <div 
        className="w-80 flex-shrink-0 border-l overflow-y-auto"
        style={{ 
          backgroundColor: theme.background,
          borderColor: theme.border
        }}
      >
        <div className="p-6 space-y-6">
          {/* Writing Tips */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Lightbulb className="h-5 w-5 text-amber-500" />
              Writing Tips
            </h3>
            <div className="space-y-3">
              {TIPS.map((tip, index) => (
                <Card key={index} className="p-3 border border-gray-200 hover:shadow-sm transition-shadow">
                  <div className="flex items-start gap-3">
                    <div className="flex-1">
                      <p className="text-sm text-gray-700 leading-relaxed">{tip}</p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleCopyTip(index, tip)}
                      className="p-1 h-auto"
                    >
                      {copiedTip === index ? (
                        <Check className="h-3 w-3 text-green-600" />
                      ) : (
                        <Copy className="h-3 w-3 text-gray-400" />
                      )}
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* Example Prompts */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-blue-600" />
              Example Prompts
            </h3>
            <div className="space-y-4">
              {EXAMPLE_PROMPTS.map((category) => {
                const Icon = category.icon;
                return (
                  <div key={category.category}>
                    <div className="flex items-center gap-2 mb-3">
                      <Icon className="h-4 w-4 text-gray-500" />
                      <span className="text-sm font-medium text-gray-700">{category.category}</span>
                    </div>
                    <div className="space-y-2 ml-6">
                      {category.prompts.map((examplePrompt, index) => (
                        <Card 
                          key={index}
                          className="p-3 cursor-pointer border border-gray-200 hover:shadow-sm transition-all group"
                          onClick={() => handleUseExample(examplePrompt)}
                        >
                          <p className="text-sm text-gray-600 leading-relaxed group-hover:text-gray-900 transition-colors">
                            {examplePrompt}
                          </p>
                          <div className="flex items-center justify-end mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <span 
                              className="text-xs font-medium"
                              style={{ color: theme.primary }}
                            >
                              Use this →
                            </span>
                          </div>
                        </Card>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}