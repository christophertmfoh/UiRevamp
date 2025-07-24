import React, { useState } from 'react';
import type { TimelineEvent } from '../lib/types';
import { TimelineEventFormExpanded } from './TimelineEventFormExpanded';
import { TimelineEventUnifiedView } from './TimelineEventUnifiedView';

interface TimelineEventDetailViewProps {
  projectId: string;
  timelineevent: TimelineEvent | null;
  isCreating?: boolean;
  onBack: () => void;
  onEdit: (timelineevent: TimelineEvent) => void;
  onDelete: (timelineevent: TimelineEvent) => void;
}

export function TimelineEventDetailView({ 
  projectId, 
  timelineevent, 
  isCreating = false, 
  onBack, 
  onEdit, 
  onDelete 
}: TimelineEventDetailViewProps) {
  const [isEditing, setIsEditing] = useState(isCreating);
  
  // If we're creating or there's no timelineevent, show the form
  if (isCreating || !timelineevent) {
    return (
      <TimelineEventFormExpanded
        projectId={projectId}
        timelineevent={timelineevent || undefined}
        onCancel={onBack}
      />
    );
  }

  // If we're editing an existing timelineevent, show the form
  if (isEditing) {
    return (
      <TimelineEventFormExpanded
        projectId={projectId}
        timelineevent={timelineevent}
        onCancel={() => setIsEditing(false)}
      />
    );
  }

  // Use the new unified view that combines editor and viewer
  return (
    <TimelineEventUnifiedView
      projectId={projectId}
      timelineevent={timelineevent}
      onBack={onBack}
      onDelete={onDelete}
    />
  );
}