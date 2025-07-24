import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, Save } from 'lucide-react';
import { apiRequest } from '@/lib/queryClient';
import type { TimelineEvent } from '@/lib/types';

interface TimelineEventFormProps {
  projectId: string;
  onCancel: () => void;
  timelineEvent?: TimelineEvent;
}

export function TimelineEventForm({ projectId, onCancel, timelineEvent }: TimelineEventFormProps) {
  const [formData, setFormData] = useState({
    era: timelineEvent?.era || '',
    period: timelineEvent?.period || '',
    title: timelineEvent?.title || '',
    description: timelineEvent?.description || '',
    significance: timelineEvent?.significance || '',
    participants: timelineEvent?.participants?.join(', ') || '',
    locations: timelineEvent?.locations?.join(', ') || '',
    consequences: timelineEvent?.consequences || '',
    order: timelineEvent?.order?.toString() || '1',
    tags: timelineEvent?.tags?.join(', ') || '',
  });

  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: (timelineEventData: any) => 
      apiRequest('POST', `/api/projects/${projectId}/timeline-events`, timelineEventData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/projects', projectId, 'timeline-events'] });
      onCancel();
    },
  });

  const updateMutation = useMutation({
    mutationFn: (timelineEventData: any) => 
      apiRequest('PUT', `/api/timeline-events/${timelineEvent?.id}`, timelineEventData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/projects', projectId, 'timeline-events'] });
      onCancel();
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const processedData = {
      era: formData.era,
      period: formData.period,
      title: formData.title,
      description: formData.description,
      significance: formData.significance,
      participants: formData.participants.split(',').map(s => s.trim()).filter(Boolean),
      locations: formData.locations.split(',').map(s => s.trim()).filter(Boolean),
      consequences: formData.consequences,
      order: parseInt(formData.order) || 1,
      tags: formData.tags.split(',').map(s => s.trim()).filter(Boolean),
    };

    if (timelineEvent) {
      updateMutation.mutate(processedData);
    } else {
      createMutation.mutate(processedData);
    }
  };

  const updateField = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const isLoading = createMutation.isPending || updateMutation.isPending;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={onCancel} className="gap-2">
          <ArrowLeft className="h-4 w-4" />
          Back to Timeline Events
        </Button>
        <div className="flex gap-2">
          <Button 
            type="submit" 
            onClick={handleSubmit}
            disabled={isLoading}
            className="gap-2"
          >
            <Save className="h-4 w-4" />
            {isLoading ? 'Saving...' : 'Save Timeline Event'}
          </Button>
        </div>
      </div>

      <Card className="p-6">
        <h1 className="font-title text-3xl mb-6">
          {timelineEvent ? 'Edit Timeline Event' : 'Create New Timeline Event'}
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="era">Era *</Label>
              <Input
                id="era"
                value={formData.era}
                onChange={(e) => updateField('era', e.target.value)}
                required
                placeholder="e.g., Ancient Times, Modern Era..."
              />
            </div>

            <div>
              <Label htmlFor="period">Period</Label>
              <Input
                id="period"
                value={formData.period}
                onChange={(e) => updateField('period', e.target.value)}
                placeholder="e.g., Early, Middle, Late..."
              />
            </div>

            <div>
              <Label htmlFor="order">Order</Label>
              <Input
                id="order"
                type="number"
                value={formData.order}
                onChange={(e) => updateField('order', e.target.value)}
                placeholder="Timeline order..."
              />
            </div>
          </div>

          <div>
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => updateField('title', e.target.value)}
              required
              placeholder="Enter event title..."
            />
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => updateField('description', e.target.value)}
              placeholder="Describe what happened..."
              rows={4}
            />
          </div>

          <div>
            <Label htmlFor="significance">Significance</Label>
            <Textarea
              id="significance"
              value={formData.significance}
              onChange={(e) => updateField('significance', e.target.value)}
              placeholder="Why is this event important..."
              rows={3}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="participants">Participants</Label>
              <Input
                id="participants"
                value={formData.participants}
                onChange={(e) => updateField('participants', e.target.value)}
                placeholder="Who was involved (comma-separated)..."
              />
            </div>

            <div>
              <Label htmlFor="locations">Locations</Label>
              <Input
                id="locations"
                value={formData.locations}
                onChange={(e) => updateField('locations', e.target.value)}
                placeholder="Where did it happen (comma-separated)..."
              />
            </div>
          </div>

          <div>
            <Label htmlFor="consequences">Consequences</Label>
            <Textarea
              id="consequences"
              value={formData.consequences}
              onChange={(e) => updateField('consequences', e.target.value)}
              placeholder="What were the results and impacts..."
              rows={3}
            />
          </div>

          <div>
            <Label htmlFor="tags">Tags</Label>
            <Input
              id="tags"
              value={formData.tags}
              onChange={(e) => updateField('tags', e.target.value)}
              placeholder="Enter tags separated by commas..."
            />
          </div>
        </form>
      </Card>
    </div>
  );
}