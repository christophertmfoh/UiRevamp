import React, { useState } from 'react';
import type { Creature } from '../lib/types';
import { CreatureFormExpanded } from './CreatureFormExpanded';
import { CreatureUnifiedView } from './CreatureUnifiedView';

interface CreatureDetailViewProps {
  projectId: string;
  creature: Creature | null;
  isCreating?: boolean;
  onBack: () => void;
  onEdit: (creature: Creature) => void;
  onDelete: (creature: Creature) => void;
}

export function CreatureDetailView({ 
  projectId, 
  creature, 
  isCreating = false, 
  onBack, 
  onEdit, 
  onDelete 
}: CreatureDetailViewProps) {
  const [isEditing, setIsEditing] = useState(isCreating);
  
  // If we're creating or there's no creature, show the form
  if (isCreating || !creature) {
    return (
      <CreatureFormExpanded
        projectId={projectId}
        creature={creature || undefined}
        onCancel={onBack}
      />
    );
  }

  // If we're editing an existing creature, show the form
  if (isEditing) {
    return (
      <CreatureFormExpanded
        projectId={projectId}
        creature={creature}
        onCancel={() => setIsEditing(false)}
      />
    );
  }

  // Use the new unified view that combines editor and viewer
  return (
    <CreatureUnifiedView
      projectId={projectId}
      creature={creature}
      onBack={onBack}
      onDelete={onDelete}
    />
  );
}