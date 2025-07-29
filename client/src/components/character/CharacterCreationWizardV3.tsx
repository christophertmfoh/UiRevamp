import React, { useState, useRef, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Plus, FileText, Sparkles, Upload, ArrowRight, ChevronLeft, Save, Clock, Crown, Wand2 } from 'lucide-react';
import { CharacterGuidedCreation } from './CharacterGuidedCreation';
import { CharacterTemplates } from './CharacterTemplates';
import { CharacterGenerationModal } from './CharacterGenerationModal';
import { CharacterDocumentUpload } from './CharacterDocumentUpload';
import type { Character } from '@/lib/types';

interface CharacterCreationWizardV3Props {
  isOpen: boolean;
  onClose: () => void;
  projectId: string;
  onComplete?: (character: Character) => void;
}

type WizardStep = 'selection' | 'guided' | 'templates' | 'custom-ai' | 'upload';

// Character data interface for persistence
interface CharacterDraft {
  method: string;
  data: Record<string, any>;
  progress: number;
  lastSaved: Date;
}

const CREATION_METHODS = [
  {
    id: 'guided',
    title: 'Guided Creation',
    subtitle: 'Complete creative control',
    description: 'Build your character step-by-step with guided fields for maximum customization',
    icon: Plus,
    features: ['164+ character fields', 'Progressive disclosure', 'Complete creative control', 'Perfect for unique concepts'],
    complexity: 'Detailed',
    timeEstimate: '15-20 mins',
    recommended: false,
    gradient: 'from-blue-500/10 to-cyan-500/10',
    border: 'border-blue-500/20 hover:border-blue-500/40'
  },
  {
    id: 'templates',
    title: 'AI-Enhanced Templates',
    subtitle: 'Professional archetypes',
    description: 'Choose from 20+ professional character archetypes with AI expansion capabilities',
    icon: FileText,
    features: ['20+ comprehensive archetypes', 'AI-powered expansion', 'Pre-filled character data', 'Industry-standard templates'],
    complexity: 'Moderate',
    timeEstimate: '5-10 mins',
    recommended: true,
    gradient: 'from-emerald-500/10 to-teal-500/10',
    border: 'border-emerald-500/20 hover:border-emerald-500/40'
  },
  {
    id: 'custom-ai',
    title: 'Custom AI',
    subtitle: 'Describe your vision',
    description: 'Let AI create a complete character based on your custom description with automatic portrait generation',
    icon: Sparkles,
    features: ['Natural language input', 'Complete character generation', 'AI-generated portrait', 'Instant comprehensive results'],
    complexity: 'Quick',
    timeEstimate: '2-5 mins',
    recommended: false,
    gradient: 'from-purple-500/10 to-pink-500/10',
    border: 'border-purple-500/20 hover:border-purple-500/40'
  },
  {
    id: 'upload',
    title: 'Upload Document',
    subtitle: 'Import existing data',
    description: 'Import character data from documents, PDFs, or text files with AI-powered parsing',
    icon: Upload,
    features: ['Multiple file formats', 'AI data extraction', 'Preserves existing work', 'Smart parsing technology'],
    complexity: 'Quick',
    timeEstimate: '3-7 mins',
    recommended: false,
    gradient: 'from-orange-500/10 to-amber-500/10',
    border: 'border-orange-500/20 hover:border-orange-500/40'
  }
];

export function CharacterCreationWizardV3({ isOpen, onClose, projectId, onComplete }: CharacterCreationWizardV3Props) {
  const [currentStep, setCurrentStep] = useState<WizardStep>('selection');
  const [selectedMethod, setSelectedMethod] = useState<string>('');
  const [characterDraft, setCharacterDraft] = useState<CharacterDraft | null>(null);
  const [isAutoSaving, setIsAutoSaving] = useState(false);
  const autoSaveTimeoutRef = useRef<NodeJS.Timeout>();

  // Load draft from localStorage on mount
  useEffect(() => {
    if (isOpen && projectId) {
      const savedDraft = localStorage.getItem(`character-draft-${projectId}`);
      if (savedDraft) {
        try {
          const draft = JSON.parse(savedDraft);
          setCharacterDraft({
            ...draft,
            lastSaved: new Date(draft.lastSaved)
          });
        } catch (error) {
          console.error('Failed to load character draft:', error);
        }
      }
    }
  }, [isOpen, projectId]);

  // Auto-save draft
  const saveDraft = (method: string, data: Record<string, any>, progress: number) => {
    const draft: CharacterDraft = {
      method,
      data,
      progress,
      lastSaved: new Date()
    };
    
    localStorage.setItem(`character-draft-${projectId}`, JSON.stringify(draft));
    setCharacterDraft(draft);
  };

  const clearDraft = () => {
    localStorage.removeItem(`character-draft-${projectId}`);
    setCharacterDraft(null);
  };

  const handleMethodSelect = (methodId: string) => {
    setSelectedMethod(methodId);
    setCurrentStep(methodId as WizardStep);
  };

  const handleBack = () => {
    setCurrentStep('selection');
    setSelectedMethod('');
  };

  const handleClose = () => {
    setCurrentStep('selection');
    setSelectedMethod('');
    onClose();
  };

  const handleCharacterComplete = (character: Character) => {
    clearDraft();
    onComplete?.(character);
    handleClose();
  };

  const renderSelectionStep = () => (
    <div className="space-y-6">
      <DialogHeader>
        <DialogTitle className="text-2xl font-bold text-foreground flex items-center gap-3">
          <Crown className="h-6 w-6 text-accent" />
          Create New Character
        </DialogTitle>
        <DialogDescription className="text-muted-foreground">
          Choose your preferred creation method. All methods provide complete character profiles with 164+ fields.
        </DialogDescription>
      </DialogHeader>
      
      {/* Draft Recovery */}
      {characterDraft && (
        <div className="p-4 bg-accent/10 border border-accent/20 rounded-lg">
          <div className="flex items-center gap-3">
            <Save className="h-5 w-5 text-accent" />
            <div className="flex-1">
              <h4 className="font-semibold">Continue Previous Character</h4>
              <p className="text-sm text-muted-foreground">
                Found a saved character draft ({characterDraft.progress}% complete) from {characterDraft.lastSaved.toLocaleDateString()}
              </p>
            </div>
            <div className="flex gap-2">
              <Button size="sm" variant="outline" onClick={clearDraft}>
                Start Fresh
              </Button>
              <Button 
                size="sm"
                onClick={() => {
                  setSelectedMethod(characterDraft.method);
                  setCurrentStep(characterDraft.method as WizardStep);
                }}
              >
                Continue Draft
              </Button>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {CREATION_METHODS.map((method) => {
          const Icon = method.icon;
          
          return (
            <Card
              key={method.id}
              className={`group cursor-pointer transition-all duration-300 hover:shadow-lg bg-gradient-to-br ${method.gradient} ${method.border} hover:scale-[1.02]`}
              onClick={() => handleMethodSelect(method.id)}
            >
              <CardContent className="p-6">
                <div className="space-y-4">
                  {/* Header */}
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-background/80 rounded-lg border">
                      <Icon className="h-5 w-5 text-accent" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-foreground">{method.title}</h3>
                        {method.recommended && (
                          <Badge className="bg-accent/15 text-accent text-xs">Recommended</Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">{method.subtitle}</p>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {method.description}
                  </p>

                  {/* Features */}
                  <div className="grid grid-cols-2 gap-1">
                    {method.features.map((feature, index) => (
                      <div key={index} className="text-xs text-muted-foreground flex items-center gap-1">
                        <div className="w-1 h-1 bg-accent rounded-full" />
                        {feature}
                      </div>
                    ))}
                  </div>

                  {/* Footer */}
                  <div className="flex items-center justify-between pt-2 border-t border-border/20">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      {method.timeEstimate}
                    </div>
                    <Badge variant={method.complexity === 'Quick' ? 'default' : method.complexity === 'Moderate' ? 'secondary' : 'outline'} className="text-xs">
                      {method.complexity}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 'guided':
        return (
          <div className="space-y-4">
            <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 rounded-lg border border-blue-500/20">
              <Plus className="h-6 w-6 text-blue-500" />
              <div className="flex-1">
                <h3 className="font-semibold">Guided Character Creation</h3>
                <p className="text-sm text-muted-foreground">
                  Complete step-by-step character building with progressive field disclosure
                </p>
              </div>
            </div>
            <CharacterGuidedCreation
              isOpen={true}
              onClose={() => {
                // For guided creation, just close without a character
                // The character is saved through the guided creation process
                handleClose();
              }}
              projectId={projectId}
              onBack={handleBack}
            />
          </div>
        );
      
      case 'templates':
        return (
          <div className="space-y-4">
            <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-emerald-500/10 to-teal-500/10 rounded-lg border border-emerald-500/20">
              <FileText className="h-6 w-6 text-emerald-500" />
              <div className="flex-1">
                <h3 className="font-semibold">AI-Enhanced Templates</h3>
                <p className="text-sm text-muted-foreground">
                  Professional character archetypes with AI expansion capabilities
                </p>
              </div>
            </div>
            <CharacterTemplates
              isOpen={true}
              onClose={handleClose}
              projectId={projectId}
              onBack={handleBack}
              onSelectTemplate={handleCharacterComplete}
            />
          </div>
        );
      
      case 'custom-ai':
        return (
          <div className="space-y-4">
            <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-lg border border-purple-500/20">
              <Sparkles className="h-6 w-6 text-purple-500" />
              <div className="flex-1">
                <h3 className="font-semibold">Custom AI Character Generation</h3>
                <p className="text-sm text-muted-foreground">
                  Describe your character vision and let AI create a complete profile with portrait
                </p>
              </div>
            </div>
            <CharacterGenerationModal
              isOpen={true}
              onClose={handleClose}
              projectId={projectId}
              onBack={handleBack}
              onComplete={handleCharacterComplete}
            />
          </div>
        );
      
      case 'upload':
        return (
          <div className="space-y-4">
            <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-orange-500/10 to-amber-500/10 rounded-lg border border-orange-500/20">
              <Upload className="h-6 w-6 text-orange-500" />
              <div className="flex-1">
                <h3 className="font-semibold">Upload Document</h3>
                <p className="text-sm text-muted-foreground">
                  Import character data from documents with AI-powered parsing
                </p>
              </div>
            </div>
            <CharacterDocumentUpload
              isOpen={true}
              onClose={handleClose}
              projectId={projectId}
              onBack={handleBack}
              onComplete={handleCharacterComplete}
            />
          </div>
        );
      
      default:
        return renderSelectionStep();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-hidden p-0">
        <ScrollArea className="max-h-[90vh]">
          <div className="p-6">
            {/* Back Button - Show on all non-selection steps */}
            {currentStep !== 'selection' && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleBack}
                className="mb-4 text-muted-foreground hover:text-foreground"
              >
                <ChevronLeft className="h-4 w-4 mr-1" />
                Back to selection
              </Button>
            )}
            
            {renderCurrentStep()}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}