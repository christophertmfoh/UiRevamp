import React, { useState } from 'react';
import type { Character } from '../../lib/types';
import { CharacterFormExpanded } from '../character/CharacterFormExpanded';
import { CharacterUnifiedViewPremium } from '../character/CharacterUnifiedViewPremium';
import { CharacterGuidedCreation } from '../character/CharacterGuidedCreation';

interface EntityDetailViewProps {
  projectId: string;
  entity: Character | null;
  entityType?: 'character' | 'creature' | 'location' | 'faction' | 'item';
  isCreating?: boolean;
  isGuidedCreation?: boolean;
  onBack: () => void;
  onEdit: (entity: Character) => void;
  onDelete: (entity: Character) => void;
}

export function EntityDetailView({ 
  projectId, 
  entity, 
  entityType = 'character',
  isCreating = false,
  isGuidedCreation = false,
  onBack, 
  onEdit, 
  onDelete 
}: EntityDetailViewProps) {
  const [isEditing, setIsEditing] = useState(isCreating && !isGuidedCreation);
  
  // For now, we only support character entities - later this will be extended for other entity types
  const character = entity as Character;
  
  // If we're doing guided creation, show the guided flow
  if (isGuidedCreation || (isCreating && !character)) {
    return (
      <CharacterGuidedCreation
        projectId={projectId}
        character={character || undefined}
        onCancel={onBack}
        onComplete={(savedCharacter) => {
          // After completion, switch to viewing the created character
          setIsEditing(false);
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