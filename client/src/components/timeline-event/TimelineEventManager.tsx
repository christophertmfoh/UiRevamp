import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Plus, Users, Search, Edit, Trash2, MoreVertical, Edit2, Camera, Sparkles } from 'lucide-react';
import { apiRequest } from '@/lib/queryClient';
import type { TimelineEvent, Project } from '../../lib/types';
import { TimelineEventDetailView } from './TimelineEventDetailView';
import { TimelineEventPortraitModal } from './TimelineEventPortraitModal';
import { TimelineEventGenerationModal, type TimelineEventGenerationOptions } from './TimelineEventGenerationModal';
import { generateContextualTimelineEvent } from '../../lib/services/timelineeventGeneration';

interface TimelineEventManagerProps {
  projectId: string;
  selectedTimelineEventId?: string | null;
  onClearSelection?: () => void;
}

export function TimelineEventManager({ projectId, selectedTimelineEventId, onClearSelection }: TimelineEventManagerProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTimelineEvent, setSelectedTimelineEvent] = useState<TimelineEvent | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [portraitTimelineEvent, setPortraitTimelineEvent] = useState<TimelineEvent | null>(null);
  const [isPortraitModalOpen, setIsPortraitModalOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isGenerationModalOpen, setIsGenerationModalOpen] = useState(false);
  const queryClient = useQueryClient();

  const { data: timelineevents = [], isLoading } = useQuery<TimelineEvent[]>({
    queryKey: ['/api/projects', projectId, 'timelineevents'],
  });

  const { data: project } = useQuery<Project>({
    queryKey: ['/api/projects', projectId],
  });

  const { data: locations = [] } = useQuery<any[]>({
    queryKey: ['/api/projects', projectId, 'locations'],
  });

  // Auto-select timelineevent if selectedTimelineEventId is provided
  useEffect(() => {
    if (selectedTimelineEventId && timelineevents.length > 0) {
      const timelineevent = timelineevents.find(c => c.id === selectedTimelineEventId);
      if (timelineevent) {
        setSelectedTimelineEvent(timelineevent);
        setIsCreating(false);
        // Clear the selection from the parent component
        onClearSelection?.();
      }
    }
  }, [selectedTimelineEventId, timelineevents, onClearSelection]);

  const deleteMutation = useMutation({
    mutationFn: (timelineeventId: string) => 
      apiRequest('DELETE', `/api/timelineevents/${timelineeventId}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/projects', projectId, 'timelineevents'] });
    },
  });

  const updateTimelineEventMutation = useMutation({
    mutationFn: (timelineevent: TimelineEvent) => 
      apiRequest('PUT', `/api/timelineevents/${timelineevent.id}`, timelineevent),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/projects', projectId, 'timelineevents'] });
    },
  });

  const createTimelineEventMutation = useMutation({
    mutationFn: async (timelineevent: Partial<TimelineEvent>) => {
      console.log('Mutation: Creating timelineevent with data:', timelineevent);
      const response = await apiRequest('POST', `/api/projects/${projectId}/timelineevents`, timelineevent);
      console.log('Mutation: Received response:', response);
      const result = await response.json();
      console.log('Mutation: Parsed JSON:', result);
      return result;
    },
    onSuccess: (newTimelineEvent: TimelineEvent) => {
      console.log('TimelineEvent created successfully, setting as selected:', newTimelineEvent);
      queryClient.invalidateQueries({ queryKey: ['/api/projects', projectId, 'timelineevents'] });
      // Open the newly created timelineevent in the editor
      setSelectedTimelineEvent(newTimelineEvent);
      setIsCreating(false);
    },
    onError: (error) => {
      console.error('Failed to create timelineevent:', error);
    }
  });

  const filteredTimelineEvents = timelineevents.filter((timelineevent: TimelineEvent) =>
    (timelineevent.name && timelineevent.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (timelineevent.role && timelineevent.role.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (timelineevent.race && timelineevent.race.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (timelineevent.occupation && timelineevent.occupation.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleEdit = (timelineevent: TimelineEvent) => {
    setSelectedTimelineEvent(timelineevent);
  };

  const handleDelete = (timelineevent: TimelineEvent) => {
    if (confirm(`Are you sure you want to delete ${timelineevent.name}?`)) {
      deleteMutation.mutate(timelineevent.id, {
        onSuccess: () => {
          // Navigate back to the timelineevent list after successful deletion
          setSelectedTimelineEvent(null);
          setIsCreating(false);
        }
      });
    }
  };

  const handleCreateNew = () => {
    setIsCreating(true);
    setSelectedTimelineEvent(null);
  };

  const handleOpenGenerationModal = () => {
    setIsGenerationModalOpen(true);
  };

  const handleGenerateTimelineEvent = async (options: TimelineEventGenerationOptions) => {
    if (!project) return;
    
    setIsGenerating(true);
    try {
      console.log('Starting server-side timelineevent generation with options:', options);
      
      // Call the server-side generation endpoint
      const response = await fetch(`/api/projects/${projectId}/timelineevents/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(options)
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.details || errorData.error || 'Failed to generate timelineevent');
      }
      
      const generatedTimelineEvent = await response.json();
      console.log('Generated timelineevent data:', generatedTimelineEvent);
      
      // Create the timelineevent with generated data and ensure it has the projectId
      const timelineeventToCreate = {
        ...generatedTimelineEvent,
        projectId,
        // Ensure we have at least a basic name if generation didn't provide one
        name: generatedTimelineEvent.name || `Generated ${options.timelineeventType || 'TimelineEvent'}`
      };
      
      console.log('Creating timelineevent with data:', timelineeventToCreate);
      
      // Create the timelineevent - this will automatically open it in the editor on success
      const createdTimelineEvent = await createTimelineEventMutation.mutateAsync(timelineeventToCreate);
      console.log('TimelineEvent creation completed, created timelineevent:', createdTimelineEvent);
      
      // Explicitly set the timelineevent and ensure we're not in creating mode
      setSelectedTimelineEvent(createdTimelineEvent);
      setIsCreating(false);
      
      // Close the generation modal
      setIsGenerationModalOpen(false);
    } catch (error) {
      console.error('Error generating timelineevent:', error);
      alert(`Failed to generate timelineevent: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleBackToList = () => {
    // Invalidate the timelineevent list query to fetch fresh data
    queryClient.invalidateQueries({ queryKey: ['/api/projects', projectId, 'timelineevents'] });
    setSelectedTimelineEvent(null);
    setIsCreating(false);
  };

  const handlePortraitClick = (timelineevent: TimelineEvent, event: React.MouseEvent) => {
    event.stopPropagation(); // Prevent card click
    setPortraitTimelineEvent(timelineevent);
    setIsPortraitModalOpen(true);
  };

  const handleImageGenerated = (imageUrl: string) => {
    if (portraitTimelineEvent) {
      updateTimelineEventMutation.mutate({ 
        ...portraitTimelineEvent, 
        imageUrl,
        // Make sure to preserve any existing portraits array
        portraits: portraitTimelineEvent.portraits || []
      });
    }
  };

  const handleImageUploaded = (imageUrl: string) => {
    if (portraitTimelineEvent) {
      updateTimelineEventMutation.mutate({ 
        ...portraitTimelineEvent, 
        imageUrl,
        // Make sure to preserve any existing portraits array
        portraits: portraitTimelineEvent.portraits || []
      });
    }
  };

  // Show timelineevent detail view (which handles both viewing and editing)
  if (selectedTimelineEvent || isCreating) {
    return (
      <TimelineEventDetailView
        projectId={projectId}
        timelineevent={selectedTimelineEvent}
        isCreating={isCreating}
        onBack={handleBackToList}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-title text-2xl">TimelineEvents</h2>
          <p className="text-muted-foreground">
            {timelineevents.length} {timelineevents.length === 1 ? 'timelineevent' : 'timelineevents'} in your world
          </p>
        </div>
        <div className="flex gap-2">
          <Button 
            onClick={handleCreateNew} 
            className="interactive-warm"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add TimelineEvent
          </Button>
          <Button 
            onClick={handleOpenGenerationModal} 
            disabled={!project}
            variant="outline"
            className="border-accent/20 hover:bg-accent/10"
          >
            <Sparkles className="h-4 w-4 mr-2" />
            Generate TimelineEvent
          </Button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search timelineevents by name, role, or race..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 creative-input"
        />
      </div>

      {/* TimelineEvent List */}
      {isLoading ? (
        <div className="text-center py-12 text-muted-foreground">
          <div className="animate-spin h-8 w-8 border-b-2 border-accent mx-auto mb-4"></div>
          <p>Loading timelineevents...</p>
        </div>
      ) : filteredTimelineEvents.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          <Users className="h-24 w-24 mx-auto mb-6 opacity-30" />
          <h3 className="text-xl font-semibold mb-3">
            {timelineevents.length === 0 ? 'No TimelineEvents Created' : 'No TimelineEvents Found'}
          </h3>
          <p className="mb-6">
            {timelineevents.length === 0 
              ? 'Start building your cast of timelineevents to bring your world to life.'
              : 'Try adjusting your search terms to find the timelineevent you\'re looking for.'
            }
          </p>
          {timelineevents.length === 0 && (
            <Button 
              onClick={handleCreateNew} 
              className="interactive-warm"
            >
              <Plus className="h-4 w-4 mr-2" />
              Create First TimelineEvent
            </Button>
          )}
        </div>
      ) : (
        <div className="grid gap-4">
          {filteredTimelineEvents.map((timelineevent: TimelineEvent) => (
            <Card 
              key={timelineevent.id} 
              className="creative-card cursor-pointer hover:shadow-lg transition-all duration-200 border-yellow-500/30 hover:border-yellow-500/50"
              onClick={() => handleEdit(timelineevent)}
            >
              <CardContent className="p-4">
                <div className="flex items-start gap-4">
                  {/* TimelineEvent Image - Clickable */}
                  <div 
                    className="w-16 h-16 rounded-lg bg-gradient-to-br from-amber-100 to-orange-200 dark:from-amber-900/30 dark:to-orange-900/30 flex items-center justify-center flex-shrink-0 cursor-pointer hover:opacity-80 transition-opacity relative group"
                    onClick={(e) => handlePortraitClick(timelineevent, e)}
                  >
                    {timelineevent.imageUrl ? (
                      <img 
                        src={timelineevent.imageUrl} 
                        alt={timelineevent.name}
                        className="w-full h-full object-cover rounded-lg"
                      />
                    ) : (
                      <Edit className="h-8 w-8 text-amber-600 dark:text-amber-400" />
                    )}
                    
                    {/* Hover overlay */}
                    <div className="absolute inset-0 bg-black/50 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <Camera className="h-4 w-4 text-white" />
                    </div>
                  </div>

                  {/* TimelineEvent Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-lg mb-1 truncate">{timelineevent.name || 'Unnamed TimelineEvent'}</h3>
                        {timelineevent.title && (
                          <p className="text-sm text-muted-foreground mb-2 italic">"{timelineevent.title}"</p>
                        )}
                      </div>
                      
                      <DropdownMenu>
                        <DropdownMenuTrigger 
                          className="opacity-70 hover:opacity-100 transition-opacity flex-shrink-0"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <MoreVertical className="h-4 w-4" />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem 
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEdit(timelineevent);
                            }}
                          >
                            <Edit2 className="h-4 w-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDelete(timelineevent);
                            }}
                            className="text-destructive"
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>

                    {/* Badges - same as header */}
                    <div className="flex flex-wrap gap-2 mb-3">
                      {timelineevent.role && (
                        <Badge variant="default" className="text-xs px-2 py-1">
                          {timelineevent.role}
                        </Badge>
                      )}
                      {timelineevent.class && (
                        <Badge variant="outline" className="text-xs">
                          {timelineevent.class}
                        </Badge>
                      )}
                      {timelineevent.age && (
                        <Badge variant="outline" className="text-xs">
                          Age {timelineevent.age}
                        </Badge>
                      )}
                    </div>

                    {/* One-line or description */}
                    {timelineevent.oneLine && (
                      <p className="text-sm italic text-muted-foreground mb-2">
                        "{timelineevent.oneLine}"
                      </p>
                    )}
                    
                    {timelineevent.description && !timelineevent.oneLine && (
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {timelineevent.description}
                      </p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* TimelineEvent Portrait Modal */}
      {portraitTimelineEvent && (
        <TimelineEventPortraitModal
          timelineevent={portraitTimelineEvent}
          isOpen={isPortraitModalOpen}
          onClose={() => {
            setIsPortraitModalOpen(false);
            setPortraitTimelineEvent(null);
          }}
          onImageGenerated={handleImageGenerated}
          onImageUploaded={handleImageUploaded}
        />
      )}

      {/* TimelineEvent Generation Modal */}
      <TimelineEventGenerationModal
        isOpen={isGenerationModalOpen}
        onClose={() => setIsGenerationModalOpen(false)}
        onGenerate={handleGenerateTimelineEvent}
        isGenerating={isGenerating}
      />
    </div>
  );
}
