import React, { useState } from 'react';
import type { Character } from '../../lib/types';
import { CharacterFormExpanded } from './CharacterFormExpanded';
import { CharacterUnifiedViewPremium } from './CharacterUnifiedViewPremium';

interface CharacterDetailViewProps {
  projectId: string;
  character: Character | null;
  isCreating?: boolean;
  onBack: () => void;
  onEdit: (character: Character) => void;
  onDelete: (character: Character) => void;
}

export function CharacterDetailView({ 
  projectId, 
  character, 
  isCreating = false, 
  onBack, 
  onEdit, 
  onDelete 
}: CharacterDetailViewProps) {
  const [isEditing, setIsEditing] = useState(isCreating);
  
  // If we're creating or there's no character, show the form
  if (isCreating || !character) {
    return (
      <CharacterFormExpanded
        projectId={projectId}
        character={character || undefined}
        onCancel={onBack}
      />
    );
  }

  // If we're editing an existing character, show the form
  if (isEditing) {
    return (
      <CharacterFormExpanded
        projectId={projectId}
        character={character}
        onCancel={() => setIsEditing(false)}
      />
    );
  }

  // Use the premium unified view that combines editor and viewer
  return (
    <CharacterUnifiedViewPremium
      projectId={projectId}
      character={character}
      onBack={onBack}
      onDelete={onDelete}
    />
  );
}