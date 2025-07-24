import React, { useState } from 'react';
import type { Location } from '../lib/types';
import { LocationFormExpanded } from './LocationFormExpanded';
import { LocationUnifiedView } from './LocationUnifiedView';

interface LocationDetailViewProps {
  projectId: string;
  location: Location | null;
  isCreating?: boolean;
  onBack: () => void;
  onDelete: (location: Location) => void;
  onImageRequest?: (location: Location) => void;
}

export function LocationDetailView({ 
  projectId, 
  location, 
  isCreating = false, 
  onBack, 
  onDelete,
  onImageRequest
}: LocationDetailViewProps) {
  const [isEditing, setIsEditing] = useState(isCreating);
  
  // If we're creating or there's no location, show the form
  if (isCreating || !location) {
    return (
      <LocationFormExpanded
        projectId={projectId}
        location={location || undefined}
        onCancel={onBack}
      />
    );
  }

  // If we're editing an existing location, show the form
  if (isEditing) {
    return (
      <LocationFormExpanded
        projectId={projectId}
        location={location}
        onCancel={() => setIsEditing(false)}
      />
    );
  }

  // Use the new unified view that combines editor and viewer
  return (
    <LocationUnifiedView
      projectId={projectId}
      location={location}
      onBack={onBack}
      onDelete={onDelete}
    />
  );
}