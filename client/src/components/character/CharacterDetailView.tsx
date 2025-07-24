import React, { useState } from 'react';
import type { Character } from '../../lib/types';
import { CharacterFormExpanded } from './CharacterFormExpanded';
import { CharacterUnifiedViewPremium } from './CharacterUnifiedViewPremium';
import { CharacterGuidedCreation } from './CharacterGuidedCreation';

interface CharacterDetailViewProps {
  projectId: string;
  character: Character | null;
  isCreating?: boolean;
  isGuidedCreation?: boolean;
  onBack: () => void;
  onEdit: (character: Character) => void;
  onDelete: (character: Character) => void;
}

export function CharacterDetailView({ 
  projectId, 
  character, 
  isCreating = false,
  isGuidedCreation = false,
  onBack, 
  onEdit, 
  onDelete 
}: CharacterDetailViewProps) {
  const [isEditing, setIsEditing] = useState(isCreating && !isGuidedCreation);
  
  // If we're doing guided creation, show the guided flow
  if (isGuidedCreation || (isCreating && !character)) {
    return (
      <CharacterGuidedCreation
        projectId={projectId}
        character={character || undefined}
        onCancel={onBack}
        onComplete={(savedCharacter) => {
          // After completion, switch to viewing the created character
          onEdit(savedCharacter);
        }}
      />
    );
  }

  // If we're creating with existing data, show the form
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