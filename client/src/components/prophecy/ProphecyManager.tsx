import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Search, Sparkles, Eye } from 'lucide-react';
import type { Project } from '../../lib/types';

interface Prophecy {
  id: string;
  projectId: string;
  name: string;
  text: string;
  origin: string;
  interpretation: string;
  fulfillment: string;
  significance: string;
  status: string;
  tags: string[];
}

interface ProphecyManagerProps {
  project: Project;
}

export function ProphecyManager({ project }: ProphecyManagerProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const { data: prophecies = [], isLoading } = useQuery({
    queryKey: ['/api/projects', project.id, 'prophecies'],
    enabled: !!project?.id,
  });

  if (isLoading) {
    return <div className="flex items-center justify-center h-64">Loading prophecies...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-title text-2xl">Prophecies</h2>
          <p className="text-muted-foreground">
            {prophecies.length} {prophecies.length === 1 ? 'prophecy' : 'prophecies'} in your world
          </p>
        </div>
        <div className="flex gap-2">
          <Button className="interactive-warm">
            <Plus className="h-4 w-4 mr-2" />
            Add Prophecy
          </Button>
          <Button variant="outline">
            <Sparkles className="h-4 w-4 mr-2" />
            Generate Prophecy
          </Button>
        </div>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search prophecies..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {prophecies.length === 0 ? (
        <div className="text-center py-12">
          <Eye className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
          <h3 className="text-lg font-semibold mb-2">No prophecies found</h3>
        </div>
      ) : (
        <div className="space-y-4">
          {prophecies.map((prophecy: Prophecy) => (
            <div key={prophecy.id} className="p-4 border rounded-lg">
              <h3 className="font-semibold">{prophecy.name}</h3>
              <p className="text-sm italic mt-2">"{prophecy.text}"</p>
              <p className="text-xs text-muted-foreground mt-2">Origin: {prophecy.origin}</p>
              <p className="text-xs text-muted-foreground">Status: {prophecy.status}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}