import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Search, Sparkles, MessageSquare } from 'lucide-react';
import type { Project } from '../../lib/types';

interface Language {
  id: string;
  projectId: string;
  name: string;
  family: string;
  speakers: string[];
  description: string;
  script: string;
  culturalSignificance: string;
  tags: string[];
}

interface LanguageManagerProps {
  project: Project;
}

export function LanguageManager({ project }: LanguageManagerProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const { data: languages = [], isLoading } = useQuery({
    queryKey: ['/api/projects', project.id, 'languages'],
    enabled: !!project?.id,
  });

  if (isLoading) {
    return <div className="flex items-center justify-center h-64">Loading languages...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-title text-2xl">Languages</h2>
          <p className="text-muted-foreground">
            {languages.length} {languages.length === 1 ? 'language' : 'languages'} in your world
          </p>
        </div>
        <div className="flex gap-2">
          <Button className="interactive-warm">
            <Plus className="h-4 w-4 mr-2" />
            Add Language
          </Button>
          <Button variant="outline">
            <Sparkles className="h-4 w-4 mr-2" />
            Generate Language
          </Button>
        </div>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search languages..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {languages.length === 0 ? (
        <div className="text-center py-12">
          <MessageSquare className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
          <h3 className="text-lg font-semibold mb-2">No languages found</h3>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {languages.map((language: Language) => (
            <div key={language.id} className="p-4 border rounded-lg">
              <h3 className="font-semibold">{language.name}</h3>
              <p className="text-sm text-muted-foreground">{language.family}</p>
              <p className="text-sm mt-2">{language.description}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}