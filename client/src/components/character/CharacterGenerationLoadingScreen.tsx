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
    <div className="h-full flex items-center justify-center bg-gradient-to-br from-background to-muted/20">
      <div className="max-w-md w-full space-y-8 p-8">
        
        {/* Main Animation */}
        <div className="text-center space-y-6">
          <div className="relative">
            {/* Outer ring */}
            <div className="w-32 h-32 rounded-full border-4 border-border/30 relative mx-auto">
              {/* Progress ring */}
              <div 
                className="absolute inset-0 rounded-full border-4 border-transparent border-t-primary transition-all duration-500 ease-out"
                style={{
                  transform: `rotate(${(progress / 100) * 360}deg)`,
                  transition: 'transform 0.8s ease-out'
                }}
              />
              
              {/* Inner content */}
              <div className="absolute inset-4 rounded-full bg-primary/10 flex items-center justify-center">
                <div className="relative">
                  <Sparkles className="h-12 w-12 text-primary animate-pulse" />
                  {/* Floating particles */}
                  <div className="absolute -top-2 -right-2">
                    <div className="w-2 h-2 rounded-full bg-primary animate-bounce delay-100" />
                  </div>
                  <div className="absolute -bottom-1 -left-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary/60 animate-bounce delay-300" />
                  </div>
                  <div className="absolute top-1 -right-3">
                    <div className="w-1 h-1 rounded-full bg-primary/40 animate-bounce delay-500" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Progress Info */}
          <div className="space-y-3">
            <h2 className="text-2xl font-bold text-foreground">Creating Your Character</h2>
            <p className="text-muted-foreground">
              {currentStep}
            </p>
            
            {/* Progress Bar */}
            <div className="space-y-2">
              <Progress value={progress} className="h-2" />
              <p className="text-sm text-muted-foreground">
                {progress}% Complete
              </p>
            </div>
          </div>
        </div>

        {/* Generation Steps */}
        <div className="space-y-4">
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
                <CardContent className="p-4">
                  <div className="flex items-center gap-4">
                    <div className={`p-2 rounded-full flex-shrink-0 transition-all duration-300 ${
                      isCompleted 
                        ? 'bg-green-500/20 text-green-500' 
                        : isCurrent 
                          ? 'bg-primary/20 text-primary' 
                          : 'bg-muted text-muted-foreground'
                    }`}>
                      {isCompleted ? (
                        <Check className="h-5 w-5" />
                      ) : isCurrent ? (
                        <Loader2 className="h-5 w-5 animate-spin" />
                      ) : (
                        <Icon className="h-5 w-5" />
                      )}
                    </div>
                    
                    <div className="flex-1 space-y-1">
                      <h3 className={`font-semibold transition-colors ${
                        isCurrent ? 'text-primary' : isCompleted ? 'text-green-500' : 'text-foreground'
                      }`}>
                        {step.title}
                      </h3>
                      <p className={`text-sm transition-colors ${
                        isCurrent ? 'text-primary/70' : 'text-muted-foreground'
                      }`}>
                        {isCurrent && currentStep !== step.description ? currentStep : step.description}
                      </p>
                    </div>
                    
                    {isCurrent && (
                      <div className="text-sm font-medium text-primary">
                        {progress}%
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Character Preview (if available) */}
        {character?.name && (
          <Card className="border-primary/20 bg-primary/5">
            <CardContent className="p-4">
              <div className="text-center space-y-2">
                <h3 className="font-semibold text-primary">Character Preview</h3>
                <div className="space-y-1 text-sm text-primary/80">
                  <p><strong>Name:</strong> {character.name}</p>
                  {character.species && <p><strong>Species:</strong> {character.species}</p>}
                  {character.occupation && <p><strong>Occupation:</strong> {character.occupation}</p>}
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Footer */}
        <div className="text-center text-sm text-muted-foreground">
          <p>This usually takes 30-60 seconds</p>
          <p className="mt-1">Creating a complete, detailed character...</p>
        </div>
      </div>
    </div>
  );
}