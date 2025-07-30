import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import type { EnhancedUniversalEntityConfig } from '../config/EntityConfig';

interface UniversalTemplateCreationProps {
  config: EnhancedUniversalEntityConfig;
  onComplete: (entity: any) => void;
  projectId: string;
}

export function UniversalTemplateCreation({
  config,
  onComplete,
  projectId
}: UniversalTemplateCreationProps) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">
            Template Creation
          </h3>
          <p className="text-muted-foreground">
            Template creation for {config.displayName} - Implementation pending
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

export default UniversalTemplateCreation;