/**
 * Universal Entity Detail View
 * Replicates CharacterDetailView for all world bible entity types
 * Handles creation, editing, and viewing of entities
 */

import React, { useState } from 'react';
import type { WorldBibleEntity, WorldBibleCategory } from '@/lib/worldBibleTypes';
import { UniversalEntityForm } from './UniversalEntityForm';
import { UniversalEntityView } from './UniversalEntityView';

interface UniversalEntityDetailProps {
  projectId: string;
  category: WorldBibleCategory;
  entity: WorldBibleEntity | null;
  isCreating?: boolean;
  isGuidedCreation?: boolean;
  onBack: () => void;
  onEdit: (entity: WorldBibleEntity) => void;
  onDelete: (entity: WorldBibleEntity) => void;
}

export function UniversalEntityDetail({ 
  projectId,
  category,
  entity, 
  isCreating = false,
  isGuidedCreation = false,
  onBack, 
  onEdit, 
  onDelete 
}: UniversalEntityDetailProps) {
  const [isEditing, setIsEditing] = useState(isCreating && !isGuidedCreation);
  
  // If we're creating with existing data, show the form
  if (isCreating || !entity) {
    return (
      <UniversalEntityForm
        projectId={projectId}
        category={category}
        entity={entity || undefined}
        onCancel={onBack}
      />
    );
  }

  // If we're editing an existing entity, show the form
  if (isEditing) {
    return (
      <UniversalEntityForm
        projectId={projectId}
        category={category}
        entity={entity}
        onCancel={() => setIsEditing(false)}
        onSave={(savedEntity) => {
          setIsEditing(false);
          onEdit(savedEntity);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />
    );
  }

  // Use the unified view that combines editor and viewer
  return (
    <UniversalEntityView
      projectId={projectId}
      category={category}
      entity={entity}
      onBack={onBack}
      onEdit={() => setIsEditing(true)}
      onDelete={onDelete}
    />
  );
}