import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import type { EnhancedUniversalEntityConfig } from '../config/EntityConfig';

interface UniversalAICreationProps {
  config: EnhancedUniversalEntityConfig;
  onComplete: (entity: any) => void;
  projectId: string;
}

export function UniversalAICreation({
  config,
  onComplete,
  projectId
}: UniversalAICreationProps) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">
            AI Creation
          </h3>
          <p className="text-muted-foreground">
            AI creation for {config.displayName} - Implementation pending
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

export default UniversalAICreation;