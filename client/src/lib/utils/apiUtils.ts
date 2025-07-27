/**
 * Universal API Utilities
 * Generic API patterns and query helpers for all entity types
 */

import { useQuery, useMutation, useQueryClient, type UseQueryOptions, type UseMutationOptions } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import type { BaseEntity } from './entityUtils';

// Generic entity queries
export function useEntityList<T extends BaseEntity>(
  projectId: string,
  entityType: string,
  options?: Partial<UseQueryOptions<T[]>>
) {
  return useQuery<T[]>({
    queryKey: ['/api/projects', projectId, entityType],
    ...options,
  });
}

export function useEntity<T extends BaseEntity>(
  entityType: string,
  entityId: string,
  options?: Partial<UseQueryOptions<T>>
) {
  return useQuery<T>({
    queryKey: ['/api', entityType, entityId],
    enabled: !!entityId,
    ...options,
  });
}

// Generic entity mutations
export function useCreateEntity<T extends BaseEntity>(
  projectId: string,
  entityType: string,
  options?: Partial<UseMutationOptions<T, Error, Partial<T>>>
) {
  const queryClient = useQueryClient();
  
  return useMutation<T, Error, Partial<T>>({
    mutationFn: async (data: Partial<T>) => {
      return await apiRequest('POST', `/api/projects/${projectId}/${entityType}`, {
        ...data,
        projectId,
      });
    },
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ 
        queryKey: ['/api/projects', projectId, entityType] 
      });
      options?.onSuccess?.(data, variables, context);
    },
    ...options,
  });
}

export function useUpdateEntity<T extends BaseEntity>(
  entityType: string,
  options?: Partial<UseMutationOptions<T, Error, { id: string; data: Partial<T> }>>
) {
  const queryClient = useQueryClient();
  
  return useMutation<T, Error, { id: string; data: Partial<T> }>({
    mutationFn: async ({ id, data }) => {
      return await apiRequest('PUT', `/api/${entityType}/${id}`, data);
    },
    onSuccess: (data, variables, context) => {
      // Invalidate both the list and individual entity queries
      queryClient.invalidateQueries({ 
        queryKey: ['/api', entityType, variables.id] 
      });
      queryClient.invalidateQueries({ 
        queryKey: ['/api/projects', data.projectId, entityType] 
      });
      options?.onSuccess?.(data, variables, context);
    },
    ...options,
  });
}

// Helper function to invalidate entity queries
function createInvalidateQueries(queryClient: any, entityType: string) {
  return (projectId: string) => {
    queryClient.invalidateQueries({ 
      queryKey: ['/api/projects', projectId, entityType] 
    });
  };
}

export function useDeleteEntity(
  entityType: string,
  options?: Partial<UseMutationOptions<void, Error, { id: string; projectId: string }>>
) {
  const queryClient = useQueryClient();
  const invalidateQueries = createInvalidateQueries(queryClient, entityType);
  
  return useMutation<void, Error, { id: string; projectId: string }>({
    mutationFn: async ({ id }) => {
      return await apiRequest('DELETE', `/api/${entityType}/${id}`);
    },
    onSuccess: (data, variables, context) => {
      invalidateQueries(variables.projectId);
      options?.onSuccess?.(data, variables, context);
    },
    ...options,
  });
}

// Generic bulk operations
export function useBulkDeleteEntities(
  entityType: string,
  options?: Partial<UseMutationOptions<void, Error, { ids: string[]; projectId: string }>>
) {
  const queryClient = useQueryClient();
  const invalidateQueries = createInvalidateQueries(queryClient, entityType);
  
  return useMutation<void, Error, { ids: string[]; projectId: string }>({
    mutationFn: async ({ ids }) => {
      return await apiRequest('DELETE', `/api/${entityType}/bulk`, { ids });
    },
    onSuccess: (data, variables, context) => {
      invalidateQueries(variables.projectId);
      options?.onSuccess?.(data, variables, context);
    },
    ...options,
  });
}

export function useBulkUpdateEntities<T extends BaseEntity>(
  entityType: string,
  options?: Partial<UseMutationOptions<T[], Error, { ids: string[]; data: Partial<T>; projectId: string }>>
) {
  const queryClient = useQueryClient();
  const invalidateQueries = createInvalidateQueries(queryClient, entityType);
  
  return useMutation<T[], Error, { ids: string[]; data: Partial<T>; projectId: string }>({
    mutationFn: async ({ ids, data }) => {
      return await apiRequest('PATCH', `/api/${entityType}/bulk`, { ids, data });
    },
    onSuccess: (data, variables, context) => {
      invalidateQueries(variables.projectId);
      options?.onSuccess?.(data, variables, context);
    },
    ...options,
  });
}

// Generic AI enhancement
export function useEntityAIEnhancement<T extends BaseEntity>(
  entityType: string,
  options?: Partial<UseMutationOptions<any, Error, {
    entityId: string;
    fieldKey: string;
    fieldLabel: string;
    currentValue: any;
    entity: T;
    fieldOptions?: string[];
  }>>
) {
  return useMutation<any, Error, {
    entityId: string;
    fieldKey: string;
    fieldLabel: string;
    currentValue: any;
    entity: T;
    fieldOptions?: string[];
  }>({
    mutationFn: async ({ entityId, fieldKey, fieldLabel, currentValue, entity, fieldOptions }) => {
      const response = await apiRequest('POST', `/api/${entityType}/${entityId}/enhance-field`, {
        entity,
        fieldKey,
        fieldLabel,
        currentValue,
        fieldOptions
      });
      return await response.json();
    },
    ...options,
  });
}

// Generic image operations
export function useEntityImageUpload(
  entityType: string,
  options?: Partial<UseMutationOptions<string, Error, { entityId: string; file: File }>>
) {
  const queryClient = useQueryClient();
  
  return useMutation<string, Error, { entityId: string; file: File }>({
    mutationFn: async ({ entityId, file }) => {
      const formData = new FormData();
      formData.append('image', file);
      
      const response = await fetch(`/api/${entityType}/${entityId}/upload-image`, {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        throw new Error('Failed to upload image');
      }
      
      const result = await response.json();
      return result.imageUrl;
    },
    onSuccess: (imageUrl, variables, context) => {
      // Invalidate entity queries to refresh with new image
      queryClient.invalidateQueries({ 
        queryKey: ['/api', entityType, variables.entityId] 
      });
      options?.onSuccess?.(imageUrl, variables, context);
    },
    ...options,
  });
}

export function useEntityImageGeneration(
  entityType: string,
  options?: Partial<UseMutationOptions<string, Error, {
    entityId: string;
    prompt: string;
    style?: string;
  }>>
) {
  const queryClient = useQueryClient();
  
  return useMutation<string, Error, {
    entityId: string;
    prompt: string;
    style?: string;
  }>({
    mutationFn: async ({ entityId, prompt, style }) => {
      const response = await apiRequest('POST', `/api/${entityType}/${entityId}/generate-image`, {
        prompt,
        style,
      });
      return response.imageUrl;
    },
    onSuccess: (imageUrl, variables, context) => {
      queryClient.invalidateQueries({ 
        queryKey: ['/api', entityType, variables.entityId] 
      });
      options?.onSuccess?.(imageUrl, variables, context);
    },
    ...options,
  });
}

// Generic search and filtering
export function useEntitySearch<T extends BaseEntity>(
  projectId: string,
  entityType: string,
  searchParams: {
    query?: string;
    filters?: Record<string, any>;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
    page?: number;
    limit?: number;
  },
  options?: Partial<UseQueryOptions<{
    entities: T[];
    total: number;
    page: number;
    totalPages: number;
  }>>
) {
  return useQuery({
    queryKey: ['/api/projects', projectId, entityType, 'search', searchParams],
    queryFn: async () => {
      const searchParamsString = new URLSearchParams(
        Object.entries(searchParams).reduce((acc, [key, value]) => {
          if (value !== undefined && value !== null && value !== '') {
            acc[key] = typeof value === 'object' ? JSON.stringify(value) : String(value);
          }
          return acc;
        }, {} as Record<string, string>)
      ).toString();
      
      return await apiRequest('GET', `/api/projects/${projectId}/${entityType}/search?${searchParamsString}`);
    },
    enabled: !!projectId,
    ...options,
  });
}

// Generic export functionality
export function useEntityExport(
  entityType: string,
  options?: Partial<UseMutationOptions<Blob, Error, {
    projectId: string;
    entityIds?: string[];
    format: 'csv' | 'json' | 'xlsx';
    includeImages?: boolean;
  }>>
) {
  return useMutation<Blob, Error, {
    projectId: string;
    entityIds?: string[];
    format: 'csv' | 'json' | 'xlsx';
    includeImages?: boolean;
  }>({
    mutationFn: async ({ projectId, entityIds, format, includeImages }) => {
      const response = await fetch(`/api/projects/${projectId}/${entityType}/export`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          entityIds,
          format,
          includeImages,
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to export entities');
      }
      
      return await response.blob();
    },
    ...options,
  });
}

// Generic cache utilities
export function invalidateEntityQueries(
  queryClient: ReturnType<typeof useQueryClient>,
  entityType: string,
  projectId?: string,
  entityId?: string
) {
  if (entityId) {
    queryClient.invalidateQueries({ 
      queryKey: ['/api', entityType, entityId] 
    });
  }
  
  if (projectId) {
    queryClient.invalidateQueries({ 
      queryKey: ['/api/projects', projectId, entityType] 
    });
  }
  
  // Invalidate search queries
  queryClient.invalidateQueries({ 
    queryKey: ['/api/projects', projectId, entityType, 'search'] 
  });
}

export function prefetchEntity<T extends BaseEntity>(
  queryClient: ReturnType<typeof useQueryClient>,
  entityType: string,
  entityId: string
) {
  return queryClient.prefetchQuery<T>({
    queryKey: ['/api', entityType, entityId],
    queryFn: () => apiRequest('GET', `/api/${entityType}/${entityId}`),
  });
}