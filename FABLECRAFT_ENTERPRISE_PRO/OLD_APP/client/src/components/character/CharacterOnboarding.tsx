import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { 
  User, 
  Sparkles, 
  ArrowRight, 
  ArrowLeft, 
  Star,
  Zap,
  FileText,
  Eye,
  CheckCircle
} from 'lucide-react';

interface CharacterOnboardingProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: (mode: 'beginner' | 'intermediate' | 'expert') => void;
}

const onboardingSteps = [
  {
    title: "Welcome to Character Creation",
    description: "Let's help you create amazing characters for your stories",
    content: (
      <div className="space-y-4 text-center">
        <div className="w-24 h-24 mx-auto bg-gradient-to-br from-accent/20 to-accent/10 rounded-3xl flex items-center justify-center">
          <User className="h-12 w-12 text-accent" />
        </div>
        <p className="text-muted-foreground">
          Story Weaver offers powerful AI-assisted character development tools to bring your characters to life.
        </p>
        <div className="grid grid-cols-3 gap-4 mt-6">
          <div className="text-center">
            <div className="w-12 h-12 mx-auto bg-blue-500/10 rounded-2xl flex items-center justify-center mb-2">
              <Sparkles className="h-6 w-6 text-blue-500" />
            </div>
            <p className="text-sm font-medium">AI Enhancement</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 mx-auto bg-green-500/10 rounded-2xl flex items-center justify-center mb-2">
              <FileText className="h-6 w-6 text-green-500" />
            </div>
            <p className="text-sm font-medium">Smart Templates</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 mx-auto bg-purple-500/10 rounded-2xl flex items-center justify-center mb-2">
              <Eye className="h-6 w-6 text-purple-500" />
            </div>
            <p className="text-sm font-medium">Portrait Studio</p>
          </div>
        </div>
      </div>
    )
  },
  {
    title: "AI Genies: Your Creative Assistant",
    description: "Click any magic wand icon to enhance fields with AI",
    content: (
      <div className="space-y-4">
        <div className="bg-gradient-to-r from-accent/10 to-accent/5 rounded-2xl p-6 border border-accent/20">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-accent/20 rounded-full flex items-center justify-center">
              <Zap className="h-5 w-5 text-accent" />
            </div>
            <div>
              <h4 className="font-semibold">Magic Wand Icons</h4>
              <p className="text-sm text-muted-foreground">Click to generate contextual content</p>
            </div>
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span>Generates content based on your existing character details</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span>Adapts to character species (cats get feline traits, humans get human traits)</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span>Each click generates unique content - try multiple times for variety</span>
            </div>
          </div>
        </div>
        <div className="text-center text-sm text-muted-foreground">
          💡 Pro tip: Fill in name, race, and background first for more contextual AI suggestions
        </div>
      </div>
    )
  },
  {
    title: "Choose Your Experience Level",
    description: "Select the complexity level that matches your needs",
    content: (
      <div className="space-y-4">
        <div className="grid gap-4">
          <Card className="cursor-pointer hover:border-accent/50 transition-colors" data-mode="beginner">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Star className="h-5 w-5 text-yellow-500" />
                  <h4 className="font-semibold">Beginner Mode</h4>
                </div>
                <Badge variant="secondary">~15 fields</Badge>
              </div>
              <p className="text-sm text-muted-foreground mb-3">
                Focus on essential character elements. Perfect for quick character creation.
              </p>
              <div className="text-xs text-muted-foreground">
                Includes: Name, appearance, personality, goals, basic background
              </div>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:border-accent/50 transition-colors" data-mode="intermediate">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Star className="h-5 w-5 text-yellow-500" />
                  <Star className="h-5 w-5 text-yellow-500" />
                  <h4 className="font-semibold">Intermediate Mode</h4>
                </div>
                <Badge variant="secondary">~50 fields</Badge>
              </div>
              <p className="text-sm text-muted-foreground mb-3">
                Comprehensive character development with detailed attributes.
              </p>
              <div className="text-xs text-muted-foreground">
                Adds: Skills, relationships, detailed background, physical traits, motivations
              </div>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:border-accent/50 transition-colors" data-mode="expert">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Star className="h-5 w-5 text-yellow-500" />
                  <Star className="h-5 w-5 text-yellow-500" />
                  <Star className="h-5 w-5 text-yellow-500" />
                  <h4 className="font-semibold">Expert Mode</h4>
                </div>
                <Badge variant="secondary">164+ fields</Badge>
              </div>
              <p className="text-sm text-muted-foreground mb-3">
                Complete character development toolkit with all advanced features.
              </p>
              <div className="text-xs text-muted-foreground">
                Full access: Arc tracking, relationship mapping, insights, all field categories
              </div>
            </CardContent>
          </Card>
        </div>
        <div className="text-center text-sm text-muted-foreground">
          You can always switch between modes later in settings
        </div>
      </div>
    )
  }
];

export function CharacterOnboarding({ isOpen, onClose, onComplete }: CharacterOnboardingProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedMode, setSelectedMode] = useState<'beginner' | 'intermediate' | 'expert'>('intermediate');

  const handleNext = () => {
    if (currentStep < onboardingSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleModeSelect = (mode: 'beginner' | 'intermediate' | 'expert') => {
    setSelectedMode(mode);
  };

  const handleComplete = () => {
    onComplete(selectedMode);
    onClose();
  };

  const currentStepData = onboardingSteps[currentStep];
  const isLastStep = currentStep === onboardingSteps.length - 1;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-hidden">
        <DialogHeader className="pb-4">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl font-bold">
              {currentStepData?.title || 'Loading...'}
            </DialogTitle>
            <div className="flex gap-1">
              {onboardingSteps.map((_, index) => (
                <div
                  key={index}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    index === currentStep ? 'bg-accent' : 
                    index < currentStep ? 'bg-accent/50' : 'bg-muted'
                  }`}
                />
              ))}
            </div>
          </div>
          <p className="text-sm text-muted-foreground">
            {currentStepData?.description || ''}
          </p>
        </DialogHeader>

        <div 
          className="py-6 min-h-[300px]"
          onClick={(e) => {
            if (isLastStep) {
              const target = e.target as HTMLElement;
              const card = target.closest('[data-mode]') as HTMLElement;
              if (card) {
                const mode = card.getAttribute('data-mode') as 'beginner' | 'intermediate' | 'expert';
                handleModeSelect(mode);
                
                // Visual feedback
                document.querySelectorAll('[data-mode]').forEach(el => {
                  el.classList.remove('border-accent', 'bg-accent/5');
                });
                card.classList.add('border-accent', 'bg-accent/5');
              }
            }
          }}
        >
          {currentStepData?.content || null}
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-border/30">
          <Button
            variant="outline"
            onClick={handleBack}
            disabled={currentStep === 0}
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>

          <div className="flex gap-2">
            <Button
              variant="ghost"
              onClick={onClose}
              className="text-muted-foreground"
            >
              Skip Tutorial
            </Button>
            
            {isLastStep ? (
              <Button
                onClick={handleComplete}
                className="gap-2 bg-gradient-to-r from-accent to-accent/90"
              >
                Get Started
                <ArrowRight className="h-4 w-4" />
              </Button>
            ) : (
              <Button
                onClick={handleNext}
                className="gap-2"
              >
                Next
                <ArrowRight className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}