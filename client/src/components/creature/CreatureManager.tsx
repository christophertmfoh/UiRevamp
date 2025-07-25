import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Eye } from 'lucide-react';

interface CreatureManagerProps {
  projectId: string;
  selectedCreatureId?: string | null;
  onClearSelection?: () => void;
}

export function CreatureManager({ projectId }: CreatureManagerProps) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Bestiary</h1>
        <p className="text-muted-foreground">Creature management coming soon</p>
      </div>
      <Card className="creative-card">
        <CardContent className="text-center py-12">
          <Eye className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-2xl font-bold mb-2">Creature Manager</h3>
          <p className="text-muted-foreground">Coming soon - full creature management with AI generation</p>
        </CardContent>
      </Card>
    </div>
  );
}