import React, { useState } from 'react';
import type { Language } from '../lib/types';
import { LanguageFormExpanded } from './LanguageFormExpanded';
import { LanguageUnifiedView } from './LanguageUnifiedView';

interface LanguageDetailViewProps {
  projectId: string;
  language: Language | null;
  isCreating?: boolean;
  onBack: () => void;
  onEdit: (language: Language) => void;
  onDelete: (language: Language) => void;
}

export function LanguageDetailView({ 
  projectId, 
  language, 
  isCreating = false, 
  onBack, 
  onEdit, 
  onDelete 
}: LanguageDetailViewProps) {
  const [isEditing, setIsEditing] = useState(isCreating);
  
  // If we're creating or there's no language, show the form
  if (isCreating || !language) {
    return (
      <LanguageFormExpanded
        projectId={projectId}
        language={language || undefined}
        onCancel={onBack}
      />
    );
  }

  // If we're editing an existing language, show the form
  if (isEditing) {
    return (
      <LanguageFormExpanded
        projectId={projectId}
        language={language}
        onCancel={() => setIsEditing(false)}
      />
    );
  }

  // Use the new unified view that combines editor and viewer
  return (
    <LanguageUnifiedView
      projectId={projectId}
      language={language}
      onBack={onBack}
      onDelete={onDelete}
    />
  );
}