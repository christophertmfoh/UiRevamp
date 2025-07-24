import React, { useState } from 'react';
import type { Theme } from '../lib/types';
import { ThemeFormExpanded } from './ThemeFormExpanded';
import { ThemeUnifiedView } from './ThemeUnifiedView';

interface ThemeDetailViewProps {
  projectId: string;
  theme: Theme | null;
  isCreating?: boolean;
  onBack: () => void;
  onEdit: (theme: Theme) => void;
  onDelete: (theme: Theme) => void;
}

export function ThemeDetailView({ 
  projectId, 
  theme, 
  isCreating = false, 
  onBack, 
  onEdit, 
  onDelete 
}: ThemeDetailViewProps) {
  const [isEditing, setIsEditing] = useState(isCreating);
  
  // If we're creating or there's no theme, show the form
  if (isCreating || !theme) {
    return (
      <ThemeFormExpanded
        projectId={projectId}
        theme={theme || undefined}
        onCancel={onBack}
      />
    );
  }

  // If we're editing an existing theme, show the form
  if (isEditing) {
    return (
      <ThemeFormExpanded
        projectId={projectId}
        theme={theme}
        onCancel={() => setIsEditing(false)}
      />
    );
  }

  // Use the new unified view that combines editor and viewer
  return (
    <ThemeUnifiedView
      projectId={projectId}
      theme={theme}
      onBack={onBack}
      onDelete={onDelete}
    />
  );
}