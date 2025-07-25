import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield } from 'lucide-react';

interface FactionManagerProps {
  projectId: string;
  selectedFactionId?: string | null;
  onClearSelection?: () => void;
}

export function FactionManager({ projectId }: FactionManagerProps) {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Factions</h1>
          <p className="text-muted-foreground">
            Faction management coming soon
          </p>
        </div>
      </div>

      <Card className="creative-card">
        <CardContent className="text-center py-12">
          <Shield className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-2xl font-bold mb-2">Faction Manager</h3>
          <p className="text-muted-foreground mb-6 max-w-md mx-auto">
            Coming soon - full faction management with AI generation
          </p>
        </CardContent>
      </Card>
    </div>
  );
}