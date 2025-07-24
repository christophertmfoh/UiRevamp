import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Search, Sparkles, Building } from 'lucide-react';
import type { Project } from '../../lib/types';

interface Organization {
  id: string;
  projectId: string;
  name: string;
  type: string;
  description: string;
  goals: string;
  leadership: string;
  tags: string[];
}

interface OrganizationManagerProps {
  project: Project;
}

export function OrganizationManager({ project }: OrganizationManagerProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const { data: organizations = [], isLoading } = useQuery({
    queryKey: ['/api/projects', project.id, 'organizations'],
    enabled: !!project?.id,
  });

  if (isLoading) {
    return <div className="flex items-center justify-center h-64">Loading organizations...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-title text-2xl">Organizations</h2>
          <p className="text-muted-foreground">
            {organizations.length} {organizations.length === 1 ? 'organization' : 'organizations'} in your world
          </p>
        </div>
        <div className="flex gap-2">
          <Button className="interactive-warm">
            <Plus className="h-4 w-4 mr-2" />
            Add Organization
          </Button>
          <Button variant="outline">
            <Sparkles className="h-4 w-4 mr-2" />
            Generate Organization
          </Button>
        </div>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search organizations..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {organizations.length === 0 ? (
        <div className="text-center py-12">
          <Building className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
          <h3 className="text-lg font-semibold mb-2">No organizations found</h3>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {organizations.map((org: Organization) => (
            <div key={org.id} className="p-4 border rounded-lg">
              <h3 className="font-semibold">{org.name}</h3>
              <p className="text-sm text-muted-foreground">{org.description}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}