import React, { useState } from 'react';
import type { Item } from '../lib/types';
import { ItemFormExpanded } from './ItemFormExpanded';
import { ItemUnifiedView } from './ItemUnifiedView';

interface ItemDetailViewProps {
  projectId: string;
  item: Item | null;
  isCreating?: boolean;
  onBack: () => void;
  onEdit: (item: Item) => void;
  onDelete: (item: Item) => void;
}

export function ItemDetailView({ 
  projectId, 
  item, 
  isCreating = false, 
  onBack, 
  onEdit, 
  onDelete 
}: ItemDetailViewProps) {
  const [isEditing, setIsEditing] = useState(isCreating);
  
  // If we're creating or there's no item, show the form
  if (isCreating || !item) {
    return (
      <ItemFormExpanded
        projectId={projectId}
        item={item || undefined}
        onCancel={onBack}
      />
    );
  }

  // If we're editing an existing item, show the form
  if (isEditing) {
    return (
      <ItemFormExpanded
        projectId={projectId}
        item={item}
        onCancel={() => setIsEditing(false)}
      />
    );
  }

  // Use the new unified view that combines editor and viewer
  return (
    <ItemUnifiedView
      projectId={projectId}
      item={item}
      onBack={onBack}
      onDelete={onDelete}
    />
  );
}