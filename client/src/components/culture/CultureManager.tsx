import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Search, Sparkles, Users2 } from 'lucide-react';
import type { Project } from '../../lib/types';

interface Culture {
  id: string;
  projectId: string;
  name: string;
  description: string;
  values: string[];
  traditions: string;
  religion: string;
  government: string;
  economy: string;
  tags: string[];
}

interface CultureManagerProps {
  project: Project;
}

export function CultureManager({ project }: CultureManagerProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const { data: cultures = [], isLoading } = useQuery({
    queryKey: ['/api/projects', project.id, 'cultures'],
    enabled: !!project?.id,
  });

  if (isLoading) {
    return <div className="flex items-center justify-center h-64">Loading cultures...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-title text-2xl">Cultures</h2>
          <p className="text-muted-foreground">
            {cultures.length} {cultures.length === 1 ? 'culture' : 'cultures'} in your world
          </p>
        </div>
        <div className="flex gap-2">
          <Button className="interactive-warm">
            <Plus className="h-4 w-4 mr-2" />
            Add Culture
          </Button>
          <Button variant="outline">
            <Sparkles className="h-4 w-4 mr-2" />
            Generate Culture
          </Button>
        </div>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search cultures..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {cultures.length === 0 ? (
        <div className="text-center py-12">
          <Users2 className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
          <h3 className="text-lg font-semibold mb-2">No cultures found</h3>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cultures.map((culture: Culture) => (
            <div key={culture.id} className="p-4 border rounded-lg">
              <h3 className="font-semibold">{culture.name}</h3>
              <p className="text-sm text-muted-foreground">{culture.description}</p>
              {culture.values.length > 0 && (
                <p className="text-sm mt-2">Values: {culture.values.join(', ')}</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}