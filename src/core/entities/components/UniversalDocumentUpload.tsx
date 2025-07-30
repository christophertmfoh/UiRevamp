import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import type { EnhancedUniversalEntityConfig } from '../config/EntityConfig';

interface UniversalDocumentUploadProps {
  config: EnhancedUniversalEntityConfig;
  onComplete: (entity: any) => void;
  projectId: string;
}

export function UniversalDocumentUpload({
  config,
  onComplete,
  projectId
}: UniversalDocumentUploadProps) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">
            Document Upload
          </h3>
          <p className="text-muted-foreground">
            Document upload for {config.displayName} - Implementation pending
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

export default UniversalDocumentUpload;