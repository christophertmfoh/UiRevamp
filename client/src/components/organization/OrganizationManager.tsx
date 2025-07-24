import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Plus, Users, Search, Edit, Trash2, MoreVertical, Edit2, Camera, Sparkles, ArrowUpDown } from 'lucide-react';
import { apiRequest } from '@/lib/queryClient';
import type { Organization, Project } from '../../lib/types';
import { OrganizationDetailView } from './OrganizationDetailView';
import { OrganizationPortraitModal } from './OrganizationPortraitModal';
import { OrganizationGenerationModal, type OrganizationGenerationOptions } from './OrganizationGenerationModal';
import { generateContextualOrganization } from '../../lib/services/organizationGeneration';

interface OrganizationManagerProps {
  projectId: string;
  selectedOrganizationId?: string | null;
  onClearSelection?: () => void;
}

type SortOption = 'alphabetical' | 'recently-added' | 'recently-edited';

export function OrganizationManager({ projectId, selectedOrganizationId, onClearSelection }: OrganizationManagerProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('alphabetical');
  const [selectedOrganization, setSelectedOrganization] = useState<Organization | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [portraitOrganization, setPortraitOrganization] = useState<Organization | null>(null);
  const [isPortraitModalOpen, setIsPortraitModalOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isGenerationModalOpen, setIsGenerationModalOpen] = useState(false);
  const queryClient = useQueryClient();

  const { data: organizations = [], isLoading } = useQuery<Organization[]>({
    queryKey: ['/api/projects', projectId, 'organizations'],
  });

  const { data: project } = useQuery<Project>({
    queryKey: ['/api/projects', projectId],
  });

  const { data: locations = [] } = useQuery<any[]>({
    queryKey: ['/api/projects', projectId, 'locations'],
  });

  // Auto-select organization if selectedOrganizationId is provided
  useEffect(() => {
    if (selectedOrganizationId && organizations.length > 0) {
      const organization = organizations.find(item => item.id === selectedOrganizationId);
      if (organization) {
        setSelectedOrganization(organization);
        setIsCreating(false);
        // Clear the selection from the parent component
        onClearSelection?.();
      }
    }
  }, [selectedOrganizationId, organizations, onClearSelection]);

  const deleteMutation = useMutation({
    mutationFn: (organizationId: string) => 
      apiRequest('DELETE', `/api/organizations/${organizationId}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/projects', projectId, 'organizations'] });
    },
  });

  const updateOrganizationMutation = useMutation({
    mutationFn: (organization: Organization) => 
      apiRequest('PUT', `/api/organizations/${organization.id}`, organization),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/projects', projectId, 'organizations'] });
    },
  });

  const createOrganizationMutation = useMutation({
    mutationFn: async (organization: Partial<Organization>) => {
      console.log('Mutation: Creating organization with data:', organization);
      const response = await apiRequest('POST', `/api/projects/${projectId}/organizations`, organization);
      console.log('Mutation: Received response:', response);
      const result = await response.json();
      console.log('Mutation: Parsed JSON:', result);
      return result;
    },
    onSuccess: (newOrganization: Organization) => {
      console.log('Organization created successfully, setting as selected:', newOrganization);
      queryClient.invalidateQueries({ queryKey: ['/api/projects', projectId, 'organizations'] });
      // Open the newly created organization in the editor
      setSelectedOrganization(newOrganization);
      setIsCreating(false);
    },
    onError: (error) => {
      console.error('Failed to create organization:', error);
    }
  });

  const filteredOrganizations = organizations.filter((organization: Organization) =>
    (organization.name && organization.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (organization.role && organization.role.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (organization.race && organization.race.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (organization.occupation && organization.occupation.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleEdit = (organization: Organization) => {
    setSelectedOrganization(organization);
  };

  const handleDelete = (organization: Organization) => {
    if (confirm(`Are you sure you want to delete ${organization.name}?`)) {
      deleteMutation.mutate(organization.id, {
        onSuccess: () => {
          // Navigate back to the organization list after successful deletion
          setSelectedOrganization(null);
          setIsCreating(false);
        }
      });
    }
  };

  const handleCreateNew = () => {
    setIsCreating(true);
    setSelectedOrganization(null);
  };

  const handleOpenGenerationModal = () => {
    setIsGenerationModalOpen(true);
  };

  const handleGenerateOrganization = async (options: OrganizationGenerationOptions) => {
    if (!project) return;
    
    setIsGenerating(true);
    try {
      console.log('Starting server-side organization generation with options:', options);
      
      // Call the server-side generation endpoint
      const response = await fetch(`/api/projects/${projectId}/organizations/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(options)
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.details || errorData.error || 'Failed to generate organization');
      }
      
      const generatedOrganization = await response.json();
      console.log('Generated organization data:', generatedOrganization);
      
      // Create the organization with generated data and ensure it has the projectId
      const organizationToCreate = {
        ...generatedOrganization,
        projectId,
        // Ensure we have at least a basic name if generation didn't provide one
        name: generatedOrganization.name || `Generated ${options.organizationType || 'Organization'}`
      };
      
      console.log('Creating organization with data:', organizationToCreate);
      
      // Create the organization - this will automatically open it in the editor on success
      const createdOrganization = await createOrganizationMutation.mutateAsync(organizationToCreate);
      console.log('Organization creation completed, created organization:', createdOrganization);
      
      // Explicitly set the organization and ensure we're not in creating mode
      setSelectedOrganization(createdOrganization);
      setIsCreating(false);
      
      // Close the generation modal
      setIsGenerationModalOpen(false);
    } catch (error) {
      console.error('Error generating organization:', error);
      alert(`Failed to generate organization: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleBackToList = () => {
    // Invalidate the organization list query to fetch fresh data
    queryClient.invalidateQueries({ queryKey: ['/api/projects', projectId, 'organizations'] });
    setSelectedOrganization(null);
    setIsCreating(false);
  };

  const handlePortraitClick = (organization: Organization, event: React.MouseEvent) => {
    event.stopPropagation(); // Prevent card click
    setPortraitOrganization(organization);
    setIsPortraitModalOpen(true);
  };

  const handleImageGenerated = (imageUrl: string) => {
    if (portraitOrganization) {
      updateOrganizationMutation.mutate({ 
        ...portraitOrganization, 
        imageUrl,
        // Make sure to preserve any existing portraits array
        portraits: portraitOrganization.portraits || []
      });
    }
  };

  const handleImageUploaded = (imageUrl: string) => {
    if (portraitOrganization) {
      updateOrganizationMutation.mutate({ 
        ...portraitOrganization, 
        imageUrl,
        // Make sure to preserve any existing portraits array
        portraits: portraitOrganization.portraits || []
      });
    }
  };

  // Sort and filter organizations
  const sortOrganizations = (orgs: Organization[]): Organization[] => {
    switch (sortBy) {
      case 'alphabetical':
        return [...orgs].sort((a, b) => (a.name || '').localeCompare(b.name || ''));
      case 'recently-added':
        return [...orgs].sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
      case 'recently-edited':
        return [...orgs].sort((a, b) => new Date(b.updatedAt || b.createdAt || 0).getTime() - new Date(a.updatedAt || a.createdAt || 0).getTime());
      default:
        return orgs;
    }
  };

  const filteredAndSortedOrganizations = sortOrganizations(
    organizations.filter(org => 
      (org.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (org.type || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (org.description || '').toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  // Show organization detail view (which handles both viewing and editing)
  if (selectedOrganization || isCreating) {
    return (
      <OrganizationDetailView
        projectId={projectId}
        organization={selectedOrganization}
        isCreating={isCreating}
        onBack={handleBackToList}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-title text-2xl">Organizations</h2>
          <p className="text-muted-foreground">
            {organizations.length} {organizations.length === 1 ? 'organization' : 'organizations'} in your world
          </p>
        </div>
        <div className="flex gap-2">
          <Button 
            onClick={handleCreateNew} 
            className="interactive-warm"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Organization
          </Button>
          <Button 
            onClick={handleOpenGenerationModal} 
            disabled={!project}
            variant="outline"
            className="border-accent/20 hover:bg-accent/10"
          >
            <Sparkles className="h-4 w-4 mr-2" />
            Generate Organization
          </Button>
        </div>
      </div>

      {/* Search and Sort Bar */}
      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search organizations by name, type, or description..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 creative-input"
          />
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="min-w-[140px]">
              <ArrowUpDown className="h-4 w-4 mr-2" />
              {sortBy === 'alphabetical' && 'A-Z'}
              {sortBy === 'recently-added' && 'Recently Added'}
              {sortBy === 'recently-edited' && 'Recently Edited'}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => setSortBy('alphabetical')}>
              Alphabetical (A-Z)
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setSortBy('recently-added')}>
              Recently Added
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setSortBy('recently-edited')}>
              Recently Edited
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Organization List */}
      {isLoading ? (
        <div className="text-center py-12 text-muted-foreground">
          <div className="animate-spin h-8 w-8 border-b-2 border-accent mx-auto mb-4"></div>
          <p>Loading organizations...</p>
        </div>
      ) : filteredAndSortedOrganizations.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          <Users className="h-24 w-24 mx-auto mb-6 opacity-30" />
          <h3 className="text-xl font-semibold mb-3">
            {organizations.length === 0 ? 'No Organizations Created' : 'No Organizations Found'}
          </h3>
          <p className="mb-6">
            {organizations.length === 0 
              ? 'Start building your cast of organizations to bring your world to life.'
              : 'Try adjusting your search terms to find the organization you\'re looking for.'
            }
          </p>
          {organizations.length === 0 && (
            <Button 
              onClick={handleCreateNew} 
              className="interactive-warm"
            >
              <Plus className="h-4 w-4 mr-2" />
              Create First Organization
            </Button>
          )}
        </div>
      ) : (
        <div className="grid gap-4">
          {filteredAndSortedOrganizations.map((organization: Organization) => (
            <Card 
              key={organization.id} 
              className="creative-card cursor-pointer hover:shadow-lg transition-all duration-200 border-yellow-500/30 hover:border-yellow-500/50"
              onClick={() => handleEdit(organization)}
            >
              <CardContent className="p-4">
                <div className="flex items-start gap-4">
                  {/* Organization Image - Clickable */}
                  <div 
                    className="w-16 h-16 rounded-lg bg-gradient-to-br from-amber-100 to-orange-200 dark:from-amber-900/30 dark:to-orange-900/30 flex items-center justify-center flex-shrink-0 cursor-pointer hover:opacity-80 transition-opacity relative group"
                    onClick={(e) => handlePortraitClick(organization, e)}
                  >
                    {organization.imageUrl ? (
                      <img 
                        src={organization.imageUrl} 
                        alt={organization.name}
                        className="w-full h-full object-cover rounded-lg"
                      />
                    ) : (
                      <Edit className="h-8 w-8 text-amber-600 dark:text-amber-400" />
                    )}
                    
                    {/* Hover overlay */}
                    <div className="absolute inset-0 bg-black/50 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <Camera className="h-4 w-4 text-white" />
                    </div>
                  </div>

                  {/* Organization Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-lg mb-1 truncate">{organization.name || 'Unnamed Organization'}</h3>
                        {organization.title && (
                          <p className="text-sm text-muted-foreground mb-2 italic">"{organization.title}"</p>
                        )}
                      </div>
                      
                      <DropdownMenu>
                        <DropdownMenuTrigger 
                          className="opacity-70 hover:opacity-100 transition-opacity flex-shrink-0"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <MoreVertical className="h-4 w-4" />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem 
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEdit(organization);
                            }}
                          >
                            <Edit2 className="h-4 w-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDelete(organization);
                            }}
                            className="text-destructive"
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>

                    {/* Badges - same as header */}
                    <div className="flex flex-wrap gap-2 mb-3">
                      {organization.role && (
                        <Badge variant="default" className="text-xs px-2 py-1">
                          {organization.role}
                        </Badge>
                      )}
                      {organization.class && (
                        <Badge variant="outline" className="text-xs">
                          {organization.class}
                        </Badge>
                      )}
                      {organization.age && (
                        <Badge variant="outline" className="text-xs">
                          Age {organization.age}
                        </Badge>
                      )}
                    </div>

                    {/* One-line or description */}
                    {organization.oneLine && (
                      <p className="text-sm italic text-muted-foreground mb-2">
                        "{organization.oneLine}"
                      </p>
                    )}
                    
                    {organization.description && !organization.oneLine && (
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {organization.description}
                      </p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Organization Portrait Modal */}
      {portraitOrganization && (
        <OrganizationPortraitModal
          organization={portraitOrganization}
          isOpen={isPortraitModalOpen}
          onClose={() => {
            setIsPortraitModalOpen(false);
            setPortraitOrganization(null);
          }}
          onImageGenerated={handleImageGenerated}
          onImageUploaded={handleImageUploaded}
        />
      )}

      {/* Organization Generation Modal */}
      <OrganizationGenerationModal
        isOpen={isGenerationModalOpen}
        onClose={() => setIsGenerationModalOpen(false)}
        onGenerate={handleGenerateOrganization}
        isGenerating={isGenerating}
      />
    </div>
  );
}
