import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Search, Sparkles, Shield } from 'lucide-react';
import type { Project } from '../../lib/types';

interface Faction {
  id: string;
  projectId: string;
  name: string;
  description: string;
  goals: string;
  methods: string;
  history: string;
  leadership: string;
  resources: string;
  relationships: string;
  tags: string[];
}

interface FactionManagerProps {
  project: Project;
}

export function FactionManager({ project }: FactionManagerProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const { data: factions = [], isLoading } = useQuery({
    queryKey: ['/api/projects', project.id, 'factions'],
    enabled: !!project?.id,
  });

  const filteredFactions = factions.filter((faction: Faction) =>
    faction.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    faction.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    faction.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  if (isLoading) {
    return <div className="flex items-center justify-center h-64">Loading factions...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-title text-2xl">Factions</h2>
          <p className="text-muted-foreground">
            {factions.length} {factions.length === 1 ? 'faction' : 'factions'} in your world
          </p>
        </div>
        <div className="flex gap-2">
          <Button className="interactive-warm">
            <Plus className="h-4 w-4 mr-2" />
            Add Faction
          </Button>
          <Button variant="outline" className="border-accent/20 hover:bg-accent/10">
            <Sparkles className="h-4 w-4 mr-2" />
            Generate Faction
          </Button>
        </div>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search factions..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 creative-input"
        />
      </div>

      {filteredFactions.length === 0 ? (
        <div className="text-center py-12">
          <Shield className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
          <h3 className="text-lg font-semibold mb-2">No factions found</h3>
          <p className="text-muted-foreground mb-4">
            {searchQuery ? 'Try adjusting your search terms' : 'Create your first faction to get started'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredFactions.map((faction: Faction) => (
            <div key={faction.id} className="p-4 border rounded-lg creative-card">
              <h3 className="font-semibold">{faction.name}</h3>
              <p className="text-sm text-muted-foreground mt-2">{faction.description}</p>
              {faction.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-3">
                  {faction.tags.slice(0, 3).map((tag, index) => (
                    <span key={index} className="text-xs bg-accent/20 text-accent px-2 py-1 rounded">
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}