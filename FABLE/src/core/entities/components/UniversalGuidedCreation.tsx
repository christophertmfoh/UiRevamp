import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import type { 
  EnhancedUniversalEntityConfig, 
  WizardStepConfig 
} from '../config/EntityConfig';

interface UniversalGuidedCreationProps {
  config: EnhancedUniversalEntityConfig;
  currentStep: WizardStepConfig;
  formData: Record<string, any>;
  onFormDataUpdate: (updates: Record<string, any>) => void;
  onComplete: (entity: any) => void;
  projectId: string;
}

export function UniversalGuidedCreation({
  config,
  currentStep,
  formData,
  onFormDataUpdate,
  onComplete,
  projectId
}: UniversalGuidedCreationProps) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">
            {currentStep.title}
          </h3>
          <p className="text-muted-foreground">
            Guided creation for {config.displayName} - Step implementation pending
          </p>
          <div className="text-sm text-muted-foreground">
            Step ID: {currentStep.id}<br />
            Fields: {currentStep.fields?.join(', ') || 'None defined'}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default UniversalGuidedCreation;