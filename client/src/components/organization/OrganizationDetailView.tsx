import React, { useState } from 'react';
import type { Organization } from '../lib/types';
import { OrganizationFormExpanded } from './OrganizationFormExpanded';
import { OrganizationUnifiedView } from './OrganizationUnifiedView';

interface OrganizationDetailViewProps {
  projectId: string;
  organization: Organization | null;
  isCreating?: boolean;
  onBack: () => void;
  onEdit: (organization: Organization) => void;
  onDelete: (organization: Organization) => void;
}

export function OrganizationDetailView({ 
  projectId, 
  organization, 
  isCreating = false, 
  onBack, 
  onEdit, 
  onDelete 
}: OrganizationDetailViewProps) {
  const [isEditing, setIsEditing] = useState(isCreating);
  
  // If we're creating or there's no organization, show the form
  if (isCreating || !organization) {
    return (
      <OrganizationFormExpanded
        projectId={projectId}
        organization={organization || undefined}
        onCancel={onBack}
      />
    );
  }

  // If we're editing an existing organization, show the form
  if (isEditing) {
    return (
      <OrganizationFormExpanded
        projectId={projectId}
        organization={organization}
        onCancel={() => setIsEditing(false)}
      />
    );
  }

  // Use the new unified view that combines editor and viewer
  return (
    <OrganizationUnifiedView
      projectId={projectId}
      organization={organization}
      onBack={onBack}
      onDelete={onDelete}
    />
  );
}