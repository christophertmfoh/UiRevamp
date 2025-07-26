import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { UniversalEntityAPI } from '../api/UniversalEntityAPI';
import { showErrorToast, showSuccessToast } from '../../../client/src/lib/utils/errorHandling';
import type { EntityType } from '../../../shared/schema';
import type { UniversalEntityConfig } from '../config/EntityConfig';
import type { GenerationContext } from '../../ai/UniversalAIGeneration';

// Hook for managing individual entities
export function useUniversalEntity(
  projectId: string,
  entityType: EntityType,
  entityId: string | null,
  config: UniversalEntityConfig
) {
  const queryClient = useQueryClient();
  
  // Fetch single entity
  const entityQuery = useQuery({
    queryKey: ['/api/projects', projectId, entityType, entityId],
    queryFn: () => entityId ? UniversalEntityAPI.getEntity(projectId, entityType, entityId) : null,
    enabled: !!entityId
  });

  // Create entity mutation
  const createMutation = useMutation({
    mutationFn: (entityData: any) => UniversalEntityAPI.createEntity(projectId, entityType, entityData),
    onSuccess: (newEntity) => {
      queryClient.invalidateQueries({ queryKey: ['/api/projects', projectId, entityType] });
      showSuccessToast(`${config.name} created successfully`);
      return newEntity;
    },
    onError: (error) => {
      console.error(`Error creating ${entityType}:`, error);
      showErrorToast(`Failed to create ${config.name.toLowerCase()}`);
    }
  });

  // Update entity mutation
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => 
      UniversalEntityAPI.updateEntity(projectId, entityType, id, data),
    onSuccess: (updatedEntity) => {
      queryClient.invalidateQueries({ queryKey: ['/api/projects', projectId, entityType] });
      queryClient.invalidateQueries({ queryKey: ['/api/projects', projectId, entityType, updatedEntity.id] });
      showSuccessToast(`${config.name} updated successfully`);
      return updatedEntity;
    },
    onError: (error) => {
      console.error(`Error updating ${entityType}:`, error);
      showErrorToast(`Failed to update ${config.name.toLowerCase()}`);
    }
  });

  // Delete entity mutation
  const deleteMutation = useMutation({
    mutationFn: (id: string) => UniversalEntityAPI.deleteEntity(projectId, entityType, id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/projects', projectId, entityType] });
      showSuccessToast(`${config.name} deleted successfully`);
    },
    onError: (error) => {
      console.error(`Error deleting ${entityType}:`, error);
      showErrorToast(`Failed to delete ${config.name.toLowerCase()}`);
    }
  });

  // AI Generate entity mutation
  const generateMutation = useMutation({
    mutationFn: ({ context, customPrompt }: { context: GenerationContext; customPrompt?: string }) => 
      UniversalEntityAPI.generateEntity(projectId, config, context, customPrompt),
    onSuccess: (newEntity) => {
      queryClient.invalidateQueries({ queryKey: ['/api/projects', projectId, entityType] });
      showSuccessToast(`${config.name} generated successfully`);
      return newEntity;
    },
    onError: (error) => {
      console.error(`Error generating ${entityType}:`, error);
      showErrorToast(`Failed to generate ${config.name.toLowerCase()}`);
    }
  });

  // AI Enhance field mutation
  const enhanceFieldMutation = useMutation({
    mutationFn: ({ id, fieldKey, context }: { id: string; fieldKey: string; context: GenerationContext }) => 
      UniversalEntityAPI.enhanceEntityField(projectId, entityType, id, fieldKey, config, context),
    onSuccess: (updatedEntity, variables) => {
      queryClient.invalidateQueries({ queryKey: ['/api/projects', projectId, entityType] });
      queryClient.invalidateQueries({ queryKey: ['/api/projects', projectId, entityType, variables.id] });
      
      const fieldName = config.fields.find(f => f.key === variables.fieldKey)?.label || variables.fieldKey;
      showSuccessToast(`${fieldName} enhanced successfully`);
      return updatedEntity;
    },
    onError: (error, variables) => {
      console.error(`Error enhancing field ${variables.fieldKey}:`, error);
      const fieldName = config.fields.find(f => f.key === variables.fieldKey)?.label || variables.fieldKey;
      showErrorToast(`Failed to enhance ${fieldName.toLowerCase()}`);
    }
  });

  return {
    // Data
    entity: entityQuery.data,
    isLoading: entityQuery.isLoading,
    isError: entityQuery.isError,
    error: entityQuery.error,
    
    // Mutations
    create: createMutation.mutateAsync,
    update: updateMutation.mutateAsync,
    delete: deleteMutation.mutateAsync,
    generate: generateMutation.mutateAsync,
    enhanceField: enhanceFieldMutation.mutateAsync,
    
    // Mutation states
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
    isGenerating: generateMutation.isPending,
    isEnhancing: enhanceFieldMutation.isPending,
    
    // Refetch
    refetch: entityQuery.refetch
  };
}