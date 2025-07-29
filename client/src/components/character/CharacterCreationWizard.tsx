import React, { useState, useRef, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Plus, FileText, Sparkles, Upload, ArrowRight, ChevronLeft, Save, Info, Star, Clock } from 'lucide-react';
import { CharacterGuidedCreation } from './CharacterGuidedCreation';
import { CharacterTemplates } from './CharacterTemplates';
import { CharacterGenerationModal } from './CharacterGenerationModal';
import { CharacterDocumentUpload } from './CharacterDocumentUpload';

interface CharacterCreationWizardProps {
  isOpen: boolean;
  onClose: () => void;
  projectId: string;
}

type WizardStep = 'selection' | 'guided' | 'templates' | 'ai-generation' | 'upload';

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
    title: 'Start from Scratch',
    subtitle: 'Complete creative control',
    description: 'Build your character step-by-step with guided fields for maximum customization',
    icon: Plus,
    features: ['164+ character fields', 'Guided step-by-step process', 'Complete creative control', 'Perfect for unique concepts'],
    complexity: 'Detailed',
    timeEstimate: '15-20 mins',
    recommended: false
  },
  {
    id: 'templates',
    title: 'AI-Enhanced Templates',
    subtitle: 'Professional archetypes',
    description: 'Choose from 20+ professional character archetypes with AI expansion',
    icon: FileText,
    features: ['20+ comprehensive archetypes', 'AI expands template foundations', 'Pre-filled character data', 'Full generation included'],
    complexity: 'Moderate',
    timeEstimate: '5-10 mins',
    recommended: true
  },
  {
    id: 'ai-generation',
    title: 'Custom AI Generation',
    subtitle: 'Describe your vision',
    description: 'Let AI create a complete character based on your custom description',
    icon: Sparkles,
    features: ['Natural language input', 'Complete character generation', 'AI-powered creativity', 'Instant results'],
    complexity: 'Quick',
    timeEstimate: '2-5 mins',
    recommended: false
  },
  {
    id: 'upload',
    title: 'Import Character Sheet',
    subtitle: 'Upload existing data',
    description: 'Import character data from documents, PDFs, or text files',
    icon: Upload,
    features: ['Multiple file formats', 'AI data extraction', 'Preserves existing work', 'Quick import process'],
    complexity: 'Quick',
    timeEstimate: '3-7 mins',
    recommended: false
  }
];

export function CharacterCreationWizard({ isOpen, onClose, projectId }: CharacterCreationWizardProps) {
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
          setCharacterDraft(draft);
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
    
    setCharacterDraft(draft);
    setIsAutoSaving(true);
    
    if (autoSaveTimeoutRef.current) {
      clearTimeout(autoSaveTimeoutRef.current);
    }
    
    autoSaveTimeoutRef.current = setTimeout(() => {
      localStorage.setItem(`character-draft-${projectId}`, JSON.stringify(draft));
      setIsAutoSaving(false);
    }, 1000);
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

  const renderSelectionStep = () => (
    <>
      <DialogHeader className="border-b border-border/10 pb-6 mb-6">
        <DialogTitle className="text-2xl font-bold text-foreground">
          Create New Character
        </DialogTitle>
        <p className="text-muted-foreground mt-2">
          Choose your preferred creation method to get started. All methods provide complete character profiles with 164+ fields.
        </p>
        
        {/* Draft Recovery */}
        {characterDraft && (
          <div className="mt-4 p-4 bg-accent/10 border border-accent/20 rounded-lg">
            <div className="flex items-center gap-3">
              <Save className="h-5 w-5 text-accent" />
              <div className="flex-1">
                <h4 className="font-semibold text-foreground">Continue Previous Character</h4>
                <p className="text-sm text-muted-foreground">
                  Found a saved character draft ({characterDraft.progress}% complete) from {characterDraft.lastSaved.toLocaleDateString()}
                </p>
              </div>
              <div className="flex gap-2">
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={clearDraft}
                >
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
      </DialogHeader>

      <div className="space-y-4">
        {CREATION_METHODS.map((method) => {
          const Icon = method.icon;
          
          return (
            <Card
              key={method.id}
              className="group cursor-pointer transition-all duration-200 hover:shadow-sm border border-border/20 hover:border-accent/30 bg-card/30"
              onClick={() => handleMethodSelect(method.id)}
            >
              <CardContent className="p-4">
                <div className="flex items-start gap-4">
                  {/* Icon */}
                  <div className="flex-shrink-0 p-2.5 bg-accent/10 rounded-lg border border-accent/20 group-hover:bg-accent/15 transition-colors">
                    <Icon className="h-5 w-5 text-accent" />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <div className="flex items-center gap-3 mb-1">
                          <h3 className="font-bold text-lg text-foreground group-hover:text-accent transition-colors">
                            {method.title}
                          </h3>
                          {method.recommended && (
                            <Badge variant="secondary" className="text-xs bg-accent/15 text-accent border-accent/20">
                              <Star className="h-3 w-3 mr-1" />
                              Recommended
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground font-medium">
                          {method.subtitle}
                        </p>
                      </div>
                      
                      <div className="text-right flex-shrink-0">
                        <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
                          <Clock className="h-3 w-3" />
                          <span className="font-medium">{method.timeEstimate}</span>
                        </div>
                        <div className="text-xs font-bold px-2 py-1 rounded-full bg-muted/50">
                          {method.complexity}
                        </div>
                      </div>
                    </div>

                    <p className="text-sm text-muted-foreground/80 leading-relaxed mb-3">
                      {method.description}
                    </p>

                    {/* Features Grid */}
                    <div className="grid grid-cols-2 gap-2">
                      {method.features.map((feature, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-xs text-muted-foreground">
                          <div className="w-1 h-1 bg-accent/60 rounded-full flex-shrink-0" />
                          <span className="truncate">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Arrow */}
                  <div className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                    <ArrowRight className="h-4 w-4 text-accent" />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Footer Tip */}
      <div className="mt-6 p-3 bg-muted/30 rounded-lg border border-border/20">
        <p className="text-xs text-muted-foreground text-center">
          <span className="font-medium">Pro Tip:</span> You can always enhance any character with AI assistance later through the character editor
        </p>
      </div>
    </>
  );

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 'guided':
        return (
          <div className="space-y-6">
            {/* Progress Indicator */}
            <div className="flex items-center gap-4 p-4 bg-muted/30 rounded-lg border border-border/20">
              <Plus className="h-6 w-6 text-accent" />
              <div className="flex-1">
                <h3 className="font-semibold text-foreground">Guided Character Creation</h3>
                <p className="text-sm text-muted-foreground">
                  Complete step-by-step character creation with 164+ customizable fields
                </p>
              </div>
              {isAutoSaving && (
                <div className="flex items-center gap-2 text-xs text-accent">
                  <div className="w-3 h-3 border-2 border-accent border-t-transparent rounded-full animate-spin" />
                  Auto-saving...
                </div>
              )}
            </div>
            
            <CharacterGuidedCreation
              isOpen={true}
              onClose={handleClose}
              projectId={projectId}
              onDataChange={(data, progress) => saveDraft('guided', data, progress)}
            onBack={handleBack}
          />
        );
      case 'templates':
        return (
          <div className="space-y-6">
            {/* Progress Indicator */}
            <div className="flex items-center gap-4 p-4 bg-muted/30 rounded-lg border border-border/20">
              <FileText className="h-6 w-6 text-accent" />
              <div className="flex-1">
                <h3 className="font-semibold text-foreground">AI-Enhanced Templates</h3>
                <p className="text-sm text-muted-foreground">
                  Choose from 20+ professional character archetypes with AI enhancement
                </p>
              </div>
              {isAutoSaving && (
                <div className="flex items-center gap-2 text-xs text-accent">
                  <div className="w-3 h-3 border-2 border-accent border-t-transparent rounded-full animate-spin" />
                  Auto-saving...
                </div>
              )}
            </div>
            
            <CharacterTemplates
              isOpen={true}
              onClose={handleClose}
              projectId={projectId}
              onDataChange={(data, progress) => saveDraft('templates', data, progress)}
            onBack={handleBack}
            onSelectTemplate={(template) => {
              console.log('Template selected:', template);
              handleClose();
            }}
          />
        );
      case 'ai-generation':
        return (
          <CharacterGenerationModal
            isOpen={true}
            onClose={handleClose}
            projectId={projectId}
            onBack={handleBack}
          />
        );
      case 'upload':
        return (
          <CharacterDocumentUpload
            isOpen={true}
            onClose={handleClose}
            projectId={projectId}
            onBack={handleBack}
          />
        );
      default:
        return renderSelectionStep();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-hidden p-0">
        <div className="p-6 overflow-y-auto max-h-[85vh]">
          {currentStep !== 'selection' && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleBack}
              className="mb-4 p-2 h-auto text-muted-foreground hover:text-foreground"
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Back to selection
            </Button>
          )}
          
          {renderCurrentStep()}
        </div>
      </DialogContent>
    </Dialog>
  );
}