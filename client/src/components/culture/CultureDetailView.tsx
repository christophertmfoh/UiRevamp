import React, { useState } from 'react';
import type { Culture } from '../lib/types';
import { CultureFormExpanded } from './CultureFormExpanded';
import { CultureUnifiedView } from './CultureUnifiedView';

interface CultureDetailViewProps {
  projectId: string;
  culture: Culture | null;
  isCreating?: boolean;
  onBack: () => void;
  onEdit: (culture: Culture) => void;
  onDelete: (culture: Culture) => void;
}

export function CultureDetailView({ 
  projectId, 
  culture, 
  isCreating = false, 
  onBack, 
  onEdit, 
  onDelete 
}: CultureDetailViewProps) {
  const [isEditing, setIsEditing] = useState(isCreating);
  
  // If we're creating or there's no culture, show the form
  if (isCreating || !culture) {
    return (
      <CultureFormExpanded
        projectId={projectId}
        culture={culture || undefined}
        onCancel={onBack}
      />
    );
  }

  // If we're editing an existing culture, show the form
  if (isEditing) {
    return (
      <CultureFormExpanded
        projectId={projectId}
        culture={culture}
        onCancel={() => setIsEditing(false)}
      />
    );
  }

  // Use the new unified view that combines editor and viewer
  return (
    <CultureUnifiedView
      projectId={projectId}
      culture={culture}
      onBack={onBack}
      onDelete={onDelete}
    />
  );
}