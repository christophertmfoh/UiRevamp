import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Languages } from 'lucide-react';

interface LanguageManagerProps {
  projectId: string;
  selectedLanguageId?: string | null;
  onClearSelection?: () => void;
}

export function LanguageManager({ projectId }: LanguageManagerProps) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Languages</h1>
        <p className="text-muted-foreground">Language management coming soon</p>
      </div>
      <Card className="creative-card">
        <CardContent className="text-center py-12">
          <Languages className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-2xl font-bold mb-2">Language Manager</h3>
          <p className="text-muted-foreground">Coming soon - full language management with AI generation</p>
        </CardContent>
      </Card>
    </div>
  );
}