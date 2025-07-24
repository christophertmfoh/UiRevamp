import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Search, Sparkles, Clock } from 'lucide-react';
import type { Project } from '../../lib/types';

interface TimelineEvent {
  id: string;
  projectId: string;
  era: string;
  period: string;
  title: string;
  description: string;
  significance: string;
  participants: string[];
  locations: string[];
  order: number;
  tags: string[];
}

interface TimelineEventManagerProps {
  project: Project;
}

export function TimelineEventManager({ project }: TimelineEventManagerProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const { data: events = [], isLoading } = useQuery({
    queryKey: ['/api/projects', project.id, 'timeline-events'],
    enabled: !!project?.id,
  });

  if (isLoading) {
    return <div className="flex items-center justify-center h-64">Loading timeline events...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-title text-2xl">Timeline Events</h2>
          <p className="text-muted-foreground">
            {events.length} {events.length === 1 ? 'event' : 'events'} in your timeline
          </p>
        </div>
        <div className="flex gap-2">
          <Button className="interactive-warm">
            <Plus className="h-4 w-4 mr-2" />
            Add Event
          </Button>
          <Button variant="outline">
            <Sparkles className="h-4 w-4 mr-2" />
            Generate Event
          </Button>
        </div>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search timeline events..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {events.length === 0 ? (
        <div className="text-center py-12">
          <Clock className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
          <h3 className="text-lg font-semibold mb-2">No timeline events found</h3>
        </div>
      ) : (
        <div className="space-y-4">
          {events.sort((a: TimelineEvent, b: TimelineEvent) => a.order - b.order).map((event: TimelineEvent) => (
            <div key={event.id} className="p-4 border rounded-lg">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold">{event.title}</h3>
                  <p className="text-sm text-muted-foreground">{event.era} - {event.period}</p>
                  <p className="text-sm mt-2">{event.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}