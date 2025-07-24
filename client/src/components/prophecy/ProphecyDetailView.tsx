import React, { useState } from 'react';
import type { Prophecy } from '../lib/types';
import { ProphecyFormExpanded } from './ProphecyFormExpanded';
import { ProphecyUnifiedView } from './ProphecyUnifiedView';

interface ProphecyDetailViewProps {
  projectId: string;
  prophecy: Prophecy | null;
  isCreating?: boolean;
  onBack: () => void;
  onEdit: (prophecy: Prophecy) => void;
  onDelete: (prophecy: Prophecy) => void;
}

export function ProphecyDetailView({ 
  projectId, 
  prophecy, 
  isCreating = false, 
  onBack, 
  onEdit, 
  onDelete 
}: ProphecyDetailViewProps) {
  const [isEditing, setIsEditing] = useState(isCreating);
  
  // If we're creating or there's no prophecy, show the form
  if (isCreating || !prophecy) {
    return (
      <ProphecyFormExpanded
        projectId={projectId}
        prophecy={prophecy || undefined}
        onCancel={onBack}
      />
    );
  }

  // If we're editing an existing prophecy, show the form
  if (isEditing) {
    return (
      <ProphecyFormExpanded
        projectId={projectId}
        prophecy={prophecy}
        onCancel={() => setIsEditing(false)}
      />
    );
  }

  // Use the new unified view that combines editor and viewer
  return (
    <ProphecyUnifiedView
      projectId={projectId}
      prophecy={prophecy}
      onBack={onBack}
      onDelete={onDelete}
    />
  );
}