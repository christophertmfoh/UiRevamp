import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Heart } from 'lucide-react';

interface CultureManagerProps {
  projectId: string;
  selectedCultureId?: string | null;
  onClearSelection?: () => void;
}

export function CultureManager({ projectId }: CultureManagerProps) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Culture</h1>
        <p className="text-muted-foreground">Culture management coming soon</p>
      </div>
      <Card className="creative-card">
        <CardContent className="text-center py-12">
          <Heart className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-2xl font-bold mb-2">Culture Manager</h3>
          <p className="text-muted-foreground">Coming soon - full culture management with AI generation</p>
        </CardContent>
      </Card>
    </div>
  );
}