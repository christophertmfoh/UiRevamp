import React, { useState } from 'react';
import type { Faction } from '../lib/types';
import { FactionFormExpanded } from './FactionFormExpanded';
import { FactionUnifiedView } from './FactionUnifiedView';

interface FactionDetailViewProps {
  projectId: string;
  faction: Faction | null;
  isCreating?: boolean;
  onBack: () => void;
  onEdit: (faction: Faction) => void;
  onDelete: (faction: Faction) => void;
}

export function FactionDetailView({ 
  projectId, 
  faction, 
  isCreating = false, 
  onBack, 
  onEdit, 
  onDelete 
}: FactionDetailViewProps) {
  const [isEditing, setIsEditing] = useState(isCreating);
  
  // If we're creating or there's no faction, show the form
  if (isCreating || !faction) {
    return (
      <FactionFormExpanded
        projectId={projectId}
        faction={faction || undefined}
        onCancel={onBack}
      />
    );
  }

  // If we're editing an existing faction, show the form
  if (isEditing) {
    return (
      <FactionFormExpanded
        projectId={projectId}
        faction={faction}
        onCancel={() => setIsEditing(false)}
      />
    );
  }

  // Use the new unified view that combines editor and viewer
  return (
    <FactionUnifiedView
      projectId={projectId}
      faction={faction}
      onBack={onBack}
      onDelete={onDelete}
    />
  );
}