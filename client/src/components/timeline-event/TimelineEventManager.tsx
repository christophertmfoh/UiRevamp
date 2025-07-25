import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Clock } from 'lucide-react';

interface TimelineEventManagerProps {
  projectId: string;
  selectedTimelineEventId?: string | null;
  onClearSelection?: () => void;
}

export function TimelineEventManager({ projectId }: TimelineEventManagerProps) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Timeline</h1>
        <p className="text-muted-foreground">Timeline management coming soon</p>
      </div>
      <Card className="creative-card">
        <CardContent className="text-center py-12">
          <Clock className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-2xl font-bold mb-2">Timeline Manager</h3>
          <p className="text-muted-foreground">Coming soon - full timeline management with AI generation</p>
        </CardContent>
      </Card>
    </div>
  );
}