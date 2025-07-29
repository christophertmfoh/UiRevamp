import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, FileText, Sparkles, Upload, ArrowRight, ChevronLeft } from 'lucide-react';
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
      <DialogHeader className="border-b border-border/10 pb-4 mb-6">
        <DialogTitle className="text-xl font-semibold text-foreground">
          Create New Character
        </DialogTitle>
        <p className="text-sm text-muted-foreground mt-1">
          Choose how you'd like to bring your character to life
        </p>
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
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-base text-foreground group-hover:text-accent transition-colors">
                            {method.title}
                          </h3>
                          {method.recommended && (
                            <Badge variant="secondary" className="text-xs bg-accent/15 text-accent border-accent/20">
                              Recommended
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground font-medium">
                          {method.subtitle}
                        </p>
                      </div>
                      
                      <div className="text-right flex-shrink-0">
                        <div className="text-xs text-muted-foreground mb-1">
                          {method.complexity}
                        </div>
                        <div className="text-xs text-accent font-medium">
                          {method.timeEstimate}
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
          <CharacterGuidedCreation
            isOpen={true}
            onClose={handleClose}
            projectId={projectId}
            onBack={handleBack}
          />
        );
      case 'templates':
        return (
          <CharacterTemplates
            isOpen={true}
            onClose={handleClose}
            projectId={projectId}
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