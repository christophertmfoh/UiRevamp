import React from 'react';
import { Sparkles, Brain, User, Camera, Check, Loader2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

interface GenerationStep {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  progress: number;
}

interface CharacterGenerationLoadingScreenProps {
  currentStep: string;
  progress: number;
  character?: {
    name?: string;
    species?: string;
    occupation?: string;
  };
}

const GENERATION_STEPS: GenerationStep[] = [
  {
    id: 'analyzing',
    title: 'Analyzing Prompt',
    description: 'Understanding your character vision...',
    icon: Brain,
    progress: 10
  },
  {
    id: 'generating',
    title: 'Creating Character',
    description: 'Generating personality, background, and traits...',
    icon: User,
    progress: 40
  },
  {
    id: 'portrait',
    title: 'Generating Portrait',
    description: 'Creating visual representation...',
    icon: Camera,
    progress: 70
  },
  {
    id: 'complete',
    title: 'Finalizing',
    description: 'Preparing your character...',
    icon: Sparkles,
    progress: 100
  }
];

export function CharacterGenerationLoadingScreen({
  currentStep,
  progress,
  character
}: CharacterGenerationLoadingScreenProps) {
  const getCurrentStepIndex = () => {
    if (currentStep.includes('Analyzing') || currentStep.includes('prompt')) return 0;
    if (currentStep.includes('Generating') || currentStep.includes('details')) return 1;
    if (currentStep.includes('portrait') || currentStep.includes('Creating')) return 2;
    if (currentStep.includes('Complete') || progress >= 100) return 3;
    return Math.floor(progress / 25);
  };

  const currentStepIndex = getCurrentStepIndex();

  return (
    <div className="h-full flex items-center justify-center bg-gradient-to-br from-background to-muted/20 p-4">
      <div className="max-w-sm w-full space-y-6">
        
        {/* Main Animation */}
        <div className="text-center space-y-4">
          <div className="relative">
            {/* Outer ring */}
            <div className="w-24 h-24 rounded-full border-4 border-border/30 relative mx-auto">
              {/* Progress ring */}
              <div 
                className="absolute inset-0 rounded-full border-4 border-transparent border-t-primary transition-all duration-500 ease-out"
                style={{
                  transform: `rotate(${(progress / 100) * 360}deg)`,
                  transition: 'transform 0.8s ease-out'
                }}
              />
              
              {/* Inner content */}
              <div className="absolute inset-3 rounded-full bg-primary/10 flex items-center justify-center">
                <div className="relative">
                  <Sparkles className="h-8 w-8 text-primary animate-pulse" />
                  {/* Floating particles */}
                  <div className="absolute -top-1 -right-1">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce delay-100" />
                  </div>
                  <div className="absolute -bottom-1 -left-1">
                    <div className="w-1 h-1 rounded-full bg-primary/60 animate-bounce delay-300" />
                  </div>
                  <div className="absolute top-0 -right-2">
                    <div className="w-0.5 h-0.5 rounded-full bg-primary/40 animate-bounce delay-500" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Progress Info */}
          <div className="space-y-2">
            <h2 className="text-xl font-bold text-foreground">Creating Your Character</h2>
            <p className="text-sm text-muted-foreground">
              {currentStep}
            </p>
            
            {/* Progress Bar */}
            <div className="space-y-1">
              <Progress value={progress} className="h-2" />
              <p className="text-xs text-muted-foreground">
                {progress}% Complete
              </p>
            </div>
          </div>
        </div>

        {/* Generation Steps */}
        <div className="space-y-2">
          {GENERATION_STEPS.map((step, index) => {
            const isCompleted = index < currentStepIndex || (index === currentStepIndex && progress >= step.progress);
            const isCurrent = index === currentStepIndex;
            const isUpcoming = index > currentStepIndex;
            
            const Icon = step.icon;
            
            return (
              <Card 
                key={step.id}
                className={`transition-all duration-500 ${
                  isCurrent 
                    ? 'border-primary bg-primary/5 shadow-lg scale-105' 
                    : isCompleted 
                      ? 'border-green-500/30 bg-green-500/5' 
                      : 'border-border bg-muted/20'
                }`}
              >
                <CardContent className="p-3">
                  <div className="flex items-center gap-3">
                    <div className={`p-1.5 rounded-full flex-shrink-0 transition-all duration-300 ${
                      isCompleted 
                        ? 'bg-green-500/20 text-green-500' 
                        : isCurrent 
                          ? 'bg-primary/20 text-primary' 
                          : 'bg-muted/50 text-muted-foreground'
                    }`}>
                      {isCompleted ? (
                        <Check className="h-4 w-4" />
                      ) : isCurrent ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Icon className="h-4 w-4" />
                      )}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <h3 className={`font-medium text-sm ${
                        isCurrent ? 'text-primary' : isCompleted ? 'text-green-600' : 'text-muted-foreground'
                      }`}>
                        {step.title}
                      </h3>
                      <p className="text-xs text-muted-foreground truncate">
                        {step.description}
                      </p>
                    </div>
                    
                    <div className="text-xs text-muted-foreground font-medium">
                      {step.progress}%
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Character Preview (if available) */}
        {character?.name && (
          <Card className="border-primary/20 bg-primary/5">
            <CardContent className="p-3">
              <div className="text-center space-y-1">
                <h3 className="font-medium text-primary text-sm">Character Preview</h3>
                <div className="space-y-0.5 text-xs text-primary/80">
                  <p><strong>Name:</strong> {character.name}</p>
                  {character.species && <p><strong>Species:</strong> {character.species}</p>}
                  {character.occupation && <p><strong>Occupation:</strong> {character.occupation}</p>}
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Footer */}
        <div className="text-center text-xs text-muted-foreground">
          <p>Test mode: ~10 seconds</p>
          <p className="mt-1">Creating complete character with 86 fields...</p>
        </div>
      </div>
    </div>
  );
}