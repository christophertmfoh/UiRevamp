import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Search, Sparkles, Zap } from 'lucide-react';
import type { Project } from '../../lib/types';

interface MagicSystem {
  id: string;
  projectId: string;
  name: string;
  type: string;
  description: string;
  source: string;
  practitioners: string[];
  effects: string[];
  limitations: string;
  tags: string[];
}

interface MagicSystemManagerProps {
  project: Project;
}

export function MagicSystemManager({ project }: MagicSystemManagerProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const { data: magicSystems = [], isLoading } = useQuery({
    queryKey: ['/api/projects', project.id, 'magic-systems'],
    enabled: !!project?.id,
  });

  if (isLoading) {
    return <div className="flex items-center justify-center h-64">Loading magic systems...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-title text-2xl">Magic Systems</h2>
          <p className="text-muted-foreground">
            {magicSystems.length} {magicSystems.length === 1 ? 'magic system' : 'magic systems'} in your world
          </p>
        </div>
        <div className="flex gap-2">
          <Button className="interactive-warm">
            <Plus className="h-4 w-4 mr-2" />
            Add Magic System
          </Button>
          <Button variant="outline">
            <Sparkles className="h-4 w-4 mr-2" />
            Generate Magic System
          </Button>
        </div>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search magic systems..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {magicSystems.length === 0 ? (
        <div className="text-center py-12">
          <Zap className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
          <h3 className="text-lg font-semibold mb-2">No magic systems found</h3>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {magicSystems.map((system: MagicSystem) => (
            <div key={system.id} className="p-4 border rounded-lg">
              <h3 className="font-semibold">{system.name}</h3>
              <p className="text-sm text-muted-foreground">{system.description}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}