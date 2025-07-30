import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { UniversalEntityAPI } from '../api/UniversalEntityAPI';
// Import error handling utilities
function showErrorToast(message: string) { console.error(message); }
function showSuccessToast(message: string) { console.log(message); }
import type { EntityType } from '../../../shared/schema';
import type { UniversalEntityConfig } from '../config/EntityConfig';
import type { GenerationContext } from '../../ai/UniversalAIGeneration';

// Hook for managing collections of entities
export function useUniversalEntities(
  projectId: string,
  entityType: EntityType,
  config: UniversalEntityConfig
) {
  const queryClient = useQueryClient();
  
  // Fetch all entities
  const entitiesQuery = useQuery({
    queryKey: ['/api/projects', projectId, entityType],
    queryFn: () => UniversalEntityAPI.getEntities(projectId, entityType)
  });

  // Search entities
  const searchMutation = useMutation({
    mutationFn: (searchParams: {
      query?: string;
      filters?: Record<string, any>;
      sortBy?: string;
      sortDirection?: 'asc' | 'desc';
      limit?: number;
      offset?: number;
    }) => UniversalEntityAPI.searchEntities(projectId, entityType, searchParams),
    onError: (error) => {
      console.error(`Error searching ${entityType}:`, error);
      showErrorToast(`Failed to search ${config.pluralName.toLowerCase()}`);
    }
  });

  // Bulk create entities
  const bulkCreateMutation = useMutation({
    mutationFn: (entitiesData: any[]) => UniversalEntityAPI.bulkCreateEntities(projectId, entityType, entitiesData),
    onSuccess: (newEntities) => {
      queryClient.invalidateQueries({ queryKey: ['/api/projects', projectId, entityType] });
      showSuccessToast(`${newEntities.length} ${config.pluralName.toLowerCase()} created successfully`);
      return newEntities;
    },
    onError: (error) => {
      console.error(`Error bulk creating ${entityType}:`, error);
      showErrorToast(`Failed to create ${config.pluralName.toLowerCase()}`);
    }
  });

  // Bulk update entities
  const bulkUpdateMutation = useMutation({
    mutationFn: (updates: Array<{ id: string; data: any }>) => 
      UniversalEntityAPI.bulkUpdateEntities(projectId, entityType, updates),
    onSuccess: (updatedEntities) => {
      queryClient.invalidateQueries({ queryKey: ['/api/projects', projectId, entityType] });
      showSuccessToast(`${updatedEntities.length} ${config.pluralName.toLowerCase()} updated successfully`);
      return updatedEntities;
    },
    onError: (error) => {
      console.error(`Error bulk updating ${entityType}:`, error);
      showErrorToast(`Failed to update ${config.pluralName.toLowerCase()}`);
    }
  });

  // Bulk delete entities
  const bulkDeleteMutation = useMutation({
    mutationFn: (ids: string[]) => UniversalEntityAPI.bulkDeleteEntities(projectId, entityType, ids),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['/api/projects', projectId, entityType] });
      showSuccessToast(`${variables.length} ${config.pluralName.toLowerCase()} deleted successfully`);
    },
    onError: (error) => {
      console.error(`Error bulk deleting ${entityType}:`, error);
      showErrorToast(`Failed to delete ${config.pluralName.toLowerCase()}`);
    }
  });

  // Export entities
  const exportMutation = useMutation({
    mutationFn: ({ format, entityIds }: { format: 'json' | 'csv' | 'pdf'; entityIds?: string[] }) => 
      UniversalEntityAPI.exportEntities(projectId, entityType, format, entityIds),
    onSuccess: (blob, variables) => {
      // Create download link
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${config.pluralName.toLowerCase()}.${variables.format}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      showSuccessToast(`${config.pluralName} exported successfully`);
    },
    onError: (error) => {
      console.error(`Error exporting ${entityType}:`, error);
      showErrorToast(`Failed to export ${config.pluralName.toLowerCase()}`);
    }
  });

  // Generate multiple entities
  const bulkGenerateMutation = useMutation({
    mutationFn: (requests: Array<{ context: GenerationContext; customPrompt?: string }>) => 
      Promise.all(requests.map(({ context, customPrompt }) => 
        UniversalEntityAPI.generateEntity(projectId, config, context, customPrompt)
      )),
    onSuccess: (newEntities) => {
      queryClient.invalidateQueries({ queryKey: ['/api/projects', projectId, entityType] });
      showSuccessToast(`${newEntities.length} ${config.pluralName.toLowerCase()} generated successfully`);
      return newEntities;
    },
    onError: (error) => {
      console.error(`Error bulk generating ${entityType}:`, error);
      showErrorToast(`Failed to generate ${config.pluralName.toLowerCase()}`);
    }
  });

  // Utility functions
  const filterEntities = (entities: any[], searchQuery: string) => {
    if (!searchQuery.trim()) return entities;
    
    const searchLower = searchQuery.toLowerCase();
    return entities.filter(entity => {
      return config.display.searchFields.some(field => {
        const value = entity[field];
        if (typeof value === 'string') {
          return value.toLowerCase().includes(searchLower);
        }
        if (Array.isArray(value)) {
          return value.some(item => 
            typeof item === 'string' && item.toLowerCase().includes(searchLower)
          );
        }
        return false;
      });
    });
  };

  const sortEntities = (entities: any[], sortBy: string, direction: 'asc' | 'desc' = 'asc') => {
    return [...entities].sort((a, b) => {
      const aValue = a[sortBy] || '';
      const bValue = b[sortBy] || '';
      
      if (direction === 'asc') {
        return aValue.localeCompare(bValue);
      } else {
        return bValue.localeCompare(aValue);
      }
    });
  };

  const getEntityCompletionStats = (entities: any[]) => {
    if (entities.length === 0) return { average: 0, complete: 0, incomplete: 0 };
    
    const completionScores = entities.map(entity => {
      const totalFields = config.fields.length;
      const completedFields = config.fields.filter(field => {
        const value = entity[field.key];
        if (Array.isArray(value)) return value.length > 0;
        return value && value.toString().trim() !== '';
      }).length;
      
      return (completedFields / totalFields) * 100;
    });
    
    const average = Math.round(completionScores.reduce((sum, score) => sum + score, 0) / completionScores.length);
    const complete = completionScores.filter(score => score >= 80).length;
    const incomplete = entities.length - complete;
    
    return { average, complete, incomplete };
  };

  return {
    // Data
    entities: entitiesQuery.data || [],
    isLoading: entitiesQuery.isLoading,
    isError: entitiesQuery.isError,
    error: entitiesQuery.error,
    
    // Search
    search: searchMutation.mutateAsync,
    searchResults: searchMutation.data,
    isSearching: searchMutation.isPending,
    
    // Bulk operations
    bulkCreate: bulkCreateMutation.mutateAsync,
    bulkUpdate: bulkUpdateMutation.mutateAsync,
    bulkDelete: bulkDeleteMutation.mutateAsync,
    bulkGenerate: bulkGenerateMutation.mutateAsync,
    
    // Export
    export: exportMutation.mutateAsync,
    isExporting: exportMutation.isPending,
    
    // Bulk operation states
    isBulkCreating: bulkCreateMutation.isPending,
    isBulkUpdating: bulkUpdateMutation.isPending,
    isBulkDeleting: bulkDeleteMutation.isPending,
    isBulkGenerating: bulkGenerateMutation.isPending,
    
    // Utility functions
    filterEntities,
    sortEntities,
    getEntityCompletionStats,
    
    // Refetch
    refetch: entitiesQuery.refetch
  };
}