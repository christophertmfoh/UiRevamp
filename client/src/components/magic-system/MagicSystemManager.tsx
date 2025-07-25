import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Sparkles } from 'lucide-react';

interface MagicSystemManagerProps {
  projectId: string;
  selectedMagicSystemId?: string | null;
  onClearSelection?: () => void;
}

export function MagicSystemManager({ projectId }: MagicSystemManagerProps) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Magic & Lore</h1>
        <p className="text-muted-foreground">Magic system management coming soon</p>
      </div>
      <Card className="creative-card">
        <CardContent className="text-center py-12">
          <Sparkles className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-2xl font-bold mb-2">Magic System Manager</h3>
          <p className="text-muted-foreground">Coming soon - full magic system management with AI generation</p>
        </CardContent>
      </Card>
    </div>
  );
}