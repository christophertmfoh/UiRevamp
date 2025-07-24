import React, { useState } from 'react';
import type { MagicSystem } from '../lib/types';
import { MagicSystemFormExpanded } from './MagicSystemFormExpanded';
import { MagicSystemUnifiedView } from './MagicSystemUnifiedView';

interface MagicSystemDetailViewProps {
  projectId: string;
  magicsystem: MagicSystem | null;
  isCreating?: boolean;
  onBack: () => void;
  onEdit: (magicsystem: MagicSystem) => void;
  onDelete: (magicsystem: MagicSystem) => void;
}

export function MagicSystemDetailView({ 
  projectId, 
  magicsystem, 
  isCreating = false, 
  onBack, 
  onEdit, 
  onDelete 
}: MagicSystemDetailViewProps) {
  const [isEditing, setIsEditing] = useState(isCreating);
  
  // If we're creating or there's no magicsystem, show the form
  if (isCreating || !magicsystem) {
    return (
      <MagicSystemFormExpanded
        projectId={projectId}
        magicsystem={magicsystem || undefined}
        onCancel={onBack}
      />
    );
  }

  // If we're editing an existing magicsystem, show the form
  if (isEditing) {
    return (
      <MagicSystemFormExpanded
        projectId={projectId}
        magicsystem={magicsystem}
        onCancel={() => setIsEditing(false)}
      />
    );
  }

  // Use the new unified view that combines editor and viewer
  return (
    <MagicSystemUnifiedView
      projectId={projectId}
      magicsystem={magicsystem}
      onBack={onBack}
      onDelete={onDelete}
    />
  );
}