import React, { useState, useEffect, useCallback } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import { 
  X, ArrowLeft, ArrowRight, Check, Save, 
  Sparkles, FileText, Upload, Pencil 
} from 'lucide-react';
import type { 
  EnhancedUniversalEntityConfig, 
  WizardStepConfig,
  CreationMethod 
} from '../config/EntityConfig';

// Import configurable components
import { UniversalGuidedCreation } from './UniversalGuidedCreation';
import { UniversalTemplateCreation } from './UniversalTemplateCreation';
import { UniversalAICreation } from './UniversalAICreation';
import { UniversalDocumentUpload } from './UniversalDocumentUpload';

interface UniversalWizardProps {
  isOpen: boolean;
  onClose: () => void;
  config: EnhancedUniversalEntityConfig;
  projectId: string;
  onComplete?: (entity: any) => void;
}

export function UniversalWizard({
  isOpen,
  onClose,
  config,
  projectId,
  onComplete
}: UniversalWizardProps) {
  const [currentMethod, setCurrentMethod] = useState<CreationMethod>('selection');
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [isValid, setIsValid] = useState(false);

  const { wizardConfig } = config;
  const currentStep = wizardConfig.steps[currentStepIndex];
  const progress = ((currentStepIndex + 1) / wizardConfig.steps.length) * 100;
  const totalSteps = wizardConfig.steps.length;

  // Reset wizard state when opened
  useEffect(() => {
    if (isOpen) {
      setCurrentMethod('selection');
      setCurrentStepIndex(0);
      setCompletedSteps(new Set());
      setFormData({});
      setIsValid(false);
    }
  }, [isOpen]);

  // Validate current step
  const validateCurrentStep = useCallback(() => {
    if (!currentStep) return false;
    
    if (currentStep.validation?.required) {
      const requiredFields = currentStep.fields?.filter(field => 
        config.fields.find(f => f.key === field && f.required)
      ) || [];
      
      return requiredFields.every(field => {
        const value = formData[field];
        return value !== undefined && value !== null && value !== '';
      });
    }
    
    return true;
  }, [currentStep, formData, config.fields]);

  // Update validation when formData or step changes
  useEffect(() => {
    setIsValid(validateCurrentStep());
  }, [validateCurrentStep]);

  // Handle step navigation
  const goToStep = (stepIndex: number) => {
    if (stepIndex >= 0 && stepIndex < totalSteps) {
      setCurrentStepIndex(stepIndex);
    }
  };

  const nextStep = () => {
    if (isValid && currentStepIndex < totalSteps - 1) {
      setCompletedSteps(prev => new Set([...prev, currentStepIndex]));
      goToStep(currentStepIndex + 1);
    }
  };

  const previousStep = () => {
    if (currentStepIndex > 0) {
      goToStep(currentStepIndex - 1);
    }
  };

  // Handle creation method selection
  const handleMethodSelection = (method: CreationMethod) => {
    setCurrentMethod(method);
    if (method !== 'selection') {
      // Skip to first actual step when method is selected
      const firstStepIndex = wizardConfig.steps.findIndex(step => step.id !== 'method-selection');
      setCurrentStepIndex(firstStepIndex >= 0 ? firstStepIndex : 0);
    }
  };

  // Handle form data updates
  const handleFormDataUpdate = (updates: Record<string, any>) => {
    setFormData(prev => ({ ...prev, ...updates }));
  };

  // Handle completion
  const handleComplete = (entity: any) => {
    onComplete?.(entity);
    onClose();
  };

  // Render creation method selection
  const renderMethodSelection = () => {
    return (
      <div className="space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold text-foreground">
            Create New {config.displayName}
          </h2>
          <p className="text-muted-foreground">
            Choose how you'd like to create your {config.displayName.toLowerCase()}
          </p>
        </div>
        
        <div className="grid gap-4">
          {wizardConfig.methods.map((method) => {
            const IconComponent = getMethodIcon(method.id);
            return (
              <Button
                key={method.id}
                variant="outline"
                className="h-auto p-6 flex flex-col items-start space-y-3 hover:bg-accent/50 group"
                onClick={() => handleMethodSelection(method.id)}
              >
                <div className="flex items-center space-x-3 w-full">
                  <div className="p-2 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                    <IconComponent className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1 text-left">
                    <h3 className="font-semibold text-foreground">{method.title}</h3>
                    <p className="text-sm text-muted-foreground">{method.subtitle}</p>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {method.timeEstimate}
                  </div>
                </div>
                
                <p className="text-sm text-muted-foreground text-left">
                  {method.description}
                </p>
                
                <div className="flex flex-wrap gap-2">
                  {method.features.map((feature, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-accent/50 text-accent-foreground text-xs rounded-md"
                    >
                      {feature}
                    </span>
                  ))}
                </div>
              </Button>
            );
          })}
        </div>
      </div>
    );
  };

  // Render current step content
  const renderStepContent = () => {
    if (currentMethod === 'selection') {
      return renderMethodSelection();
    }

    // Render method-specific component
    switch (currentMethod) {
      case 'guided':
        return (
          <UniversalGuidedCreation
            config={config}
            currentStep={currentStep}
            formData={formData}
            onFormDataUpdate={handleFormDataUpdate}
            onComplete={handleComplete}
            projectId={projectId}
          />
        );
      case 'templates':
        return (
          <UniversalTemplateCreation
            config={config}
            onComplete={handleComplete}
            projectId={projectId}
          />
        );
      case 'ai':
        return (
          <UniversalAICreation
            config={config}
            onComplete={handleComplete}
            projectId={projectId}
          />
        );
      case 'upload':
        return (
          <UniversalDocumentUpload
            config={config}
            onComplete={handleComplete}
            projectId={projectId}
          />
        );
      default:
        return <div>Method not implemented</div>;
    }
  };

  // Render step navigation
  const renderStepNavigation = () => {
    if (currentMethod === 'selection') return null;

    return (
      <div className="flex items-center justify-between pt-6 border-t border-border">
        <Button
          variant="outline"
          onClick={previousStep}
          disabled={currentStepIndex === 0}
          className="flex items-center space-x-2"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Previous</span>
        </Button>

        <div className="flex items-center space-x-2">
          <span className="text-sm text-muted-foreground">
            Step {currentStepIndex + 1} of {totalSteps}
          </span>
        </div>

        <Button
          onClick={nextStep}
          disabled={!isValid}
          className="flex items-center space-x-2"
        >
          <span>{currentStepIndex === totalSteps - 1 ? 'Complete' : 'Next'}</span>
          {currentStepIndex === totalSteps - 1 ? (
            <Check className="h-4 w-4" />
          ) : (
            <ArrowRight className="h-4 w-4" />
          )}
        </Button>
      </div>
    );
  };

  // Render progress indicator
  const renderProgress = () => {
    if (currentMethod === 'selection') return null;

    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-foreground">
            {currentStep?.title || `Step ${currentStepIndex + 1}`}
          </h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="h-8 w-8 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>Progress</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
        
        {currentStep?.description && (
          <p className="text-sm text-muted-foreground">
            {currentStep.description}
          </p>
        )}
      </div>
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden p-0">
        <div className="flex flex-col h-full">
          {/* Header with progress */}
          <div className="p-6 border-b border-border bg-background/95 backdrop-blur-sm">
            {renderProgress()}
          </div>
          
          {/* Content */}
          <div className="flex-1 overflow-auto p-6">
            {renderStepContent()}
          </div>
          
          {/* Navigation */}
          <div className="p-6 bg-background/95 backdrop-blur-sm">
            {renderStepNavigation()}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// Helper function to get method icons
function getMethodIcon(methodId: CreationMethod) {
  switch (methodId) {
    case 'guided':
      return Pencil;
    case 'templates':
      return FileText;
    case 'ai':
      return Sparkles;
    case 'upload':
      return Upload;
    default:
      return Pencil;
  }
}

export default UniversalWizard;