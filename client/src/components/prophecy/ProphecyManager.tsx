import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Scroll } from 'lucide-react';

interface ProphecyManagerProps {
  projectId: string;
  selectedProphecyId?: string | null;
  onClearSelection?: () => void;
}

export function ProphecyManager({ projectId }: ProphecyManagerProps) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Prophecies</h1>
        <p className="text-muted-foreground">Prophecy management coming soon</p>
      </div>
      <Card className="creative-card">
        <CardContent className="text-center py-12">
          <Scroll className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-2xl font-bold mb-2">Prophecy Manager</h3>
          <p className="text-muted-foreground">Coming soon - full prophecy management with AI generation</p>
        </CardContent>
      </Card>
    </div>
  );
}