import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Sword } from 'lucide-react';

interface ThemeManagerProps {
  projectId: string;
  selectedThemeId?: string | null;
  onClearSelection?: () => void;
}

export function ThemeManager({ projectId }: ThemeManagerProps) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Themes</h1>
        <p className="text-muted-foreground">Theme management coming soon</p>
      </div>
      <Card className="creative-card">
        <CardContent className="text-center py-12">
          <Sword className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-2xl font-bold mb-2">Theme Manager</h3>
          <p className="text-muted-foreground">Coming soon - full theme management with AI generation</p>
        </CardContent>
      </Card>
    </div>
  );
}