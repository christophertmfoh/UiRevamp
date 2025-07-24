import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Search, Sparkles, Lightbulb } from 'lucide-react';
import type { Project } from '../../lib/types';

interface Theme {
  id: string;
  projectId: string;
  name: string;
  description: string;
  manifestation: string;
  symbolism: string[];
  examples: string[];
  significance: string;
  tags: string[];
}

interface ThemeManagerProps {
  project: Project;
}

export function ThemeManager({ project }: ThemeManagerProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const { data: themes = [], isLoading } = useQuery({
    queryKey: ['/api/projects', project.id, 'themes'],
    enabled: !!project?.id,
  });

  if (isLoading) {
    return <div className="flex items-center justify-center h-64">Loading themes...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-title text-2xl">Themes</h2>
          <p className="text-muted-foreground">
            {themes.length} {themes.length === 1 ? 'theme' : 'themes'} in your story
          </p>
        </div>
        <div className="flex gap-2">
          <Button className="interactive-warm">
            <Plus className="h-4 w-4 mr-2" />
            Add Theme
          </Button>
          <Button variant="outline">
            <Sparkles className="h-4 w-4 mr-2" />
            Generate Theme
          </Button>
        </div>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search themes..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {themes.length === 0 ? (
        <div className="text-center py-12">
          <Lightbulb className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
          <h3 className="text-lg font-semibold mb-2">No themes found</h3>
        </div>
      ) : (
        <div className="space-y-4">
          {themes.map((theme: Theme) => (
            <div key={theme.id} className="p-4 border rounded-lg">
              <h3 className="font-semibold">{theme.name}</h3>
              <p className="text-sm mt-2">{theme.description}</p>
              <p className="text-sm text-muted-foreground mt-2">Manifestation: {theme.manifestation}</p>
              {theme.symbolism.length > 0 && (
                <p className="text-sm text-muted-foreground mt-1">Symbolism: {theme.symbolism.join(', ')}</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}