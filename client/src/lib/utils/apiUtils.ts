/**
 * API Utility Functions - Senior Dev Pattern
 * Type-safe API interactions with proper error handling
 */

import { useQuery, useMutation, useQueryClient, UseMutationOptions, UseQueryOptions } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';

// ===== TYPES =====
export interface BaseEntity {
  id: string;
  projectId: string;
  createdAt: Date;
  updatedAt?: Date | null;
}

export interface PaginatedResponse<T> {
  entities: T[];
  total: number;
  page: number;
  totalPages: number;
}

// ===== HELPER FUNCTIONS =====

/**
 * Parse Response to JSON with proper error handling
 */
async function parseResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`HTTP ${response.status}: ${errorText || response.statusText}`);
  }
  
  const data = await response.json();
  return data as T;
}

/**
 * Make API request and parse JSON response
 */
async function makeAPIRequest<T>(
  method: string,
  url: string,
  data?: unknown
): Promise<T> {
  const response = await apiRequest(method, url, data);
  return parseResponse<T>(response);
}

// ===== ENTITY CRUD HOOKS =====

/**
 * Hook for creating entities with proper typing
 */
export function useCreateEntity<T extends BaseEntity>(
  entityType: string,
  projectId: string,
  options?: Partial<UseMutationOptions<T, Error, Partial<T>>>
) {
  const queryClient = useQueryClient();
  
  return useMutation<T, Error, Partial<T>>({
    mutationFn: async (data: Partial<T>) => {
      return makeAPIRequest<T>('POST', `/api/projects/${projectId}/${entityType}`, {
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

/**
 * Hook for updating entities with proper typing
 */
export function useUpdateEntity<T extends BaseEntity>(
  entityType: string,
  options?: Partial<UseMutationOptions<T, Error, { id: string; data: Partial<T> }>>
) {
  const queryClient = useQueryClient();
  
  return useMutation<T, Error, { id: string; data: Partial<T> }>({
    mutationFn: async ({ id, data }) => {
      return makeAPIRequest<T>('PUT', `/api/${entityType}/${id}`, data);
    },
    onSuccess: (data, variables, context) => {
      // Invalidate both the list and individual entity queries
      queryClient.invalidateQueries({ 
        queryKey: ['/api', entityType] 
      });
      queryClient.invalidateQueries({ 
        queryKey: ['/api', entityType, variables.id] 
      });
      options?.onSuccess?.(data, variables, context);
    },
    ...options,
  });
}

/**
 * Hook for deleting entities
 */
export function useDeleteEntity(
  entityType: string,
  options?: Partial<UseMutationOptions<void, Error, { id: string; projectId: string }>>
) {
  const queryClient = useQueryClient();
  
  return useMutation<void, Error, { id: string; projectId: string }>({
    mutationFn: async ({ id }) => {
      await makeAPIRequest<void>('DELETE', `/api/${entityType}/${id}`);
    },
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ 
        queryKey: ['/api/projects', variables.projectId, entityType] 
      });
      options?.onSuccess?.(data, variables, context);
    },
    ...options,
  });
}

/**
 * Hook for batch deleting entities
 */
export function useBatchDeleteEntities<T extends BaseEntity>(
  entityType: string,
  options?: Partial<UseMutationOptions<void, Error, { ids: string[]; projectId: string }>>
) {
  const queryClient = useQueryClient();
  
  return useMutation<void, Error, { ids: string[]; projectId: string }>({
    mutationFn: async ({ ids }) => {
      await makeAPIRequest<void>('POST', `/api/${entityType}/batch-delete`, { ids });
    },
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ 
        queryKey: ['/api/projects', variables.projectId, entityType] 
      });
      options?.onSuccess?.(data, variables, context);
    },
    ...options,
  });
}

/**
 * Hook for batch updating entities
 */
export function useBatchUpdateEntities<T extends BaseEntity>(
  entityType: string,
  options?: Partial<UseMutationOptions<T[], Error, { ids: string[]; data: Partial<T>; projectId: string }>>
) {
  const queryClient = useQueryClient();
  
  return useMutation<T[], Error, { ids: string[]; data: Partial<T>; projectId: string }>({
    mutationFn: async ({ ids, data }) => {
      return makeAPIRequest<T[]>('PUT', `/api/${entityType}/batch-update`, { ids, data });
    },
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ 
        queryKey: ['/api/projects', variables.projectId, entityType] 
      });
      options?.onSuccess?.(data, variables, context);
    },
    ...options,
  });
}

// ===== QUERY HOOKS =====

/**
 * Hook for fetching entity lists with pagination
 */
export function useEntityList<T extends BaseEntity>(
  entityType: string,
  projectId: string,
  {
    page = 1,
    limit = 50,
    search,
    filters,
    ...queryOptions
  }: {
    page?: number;
    limit?: number;
    search?: string;
    filters?: Record<string, any>;
  } & Partial<UseQueryOptions<PaginatedResponse<T>>> = {}
) {
  return useQuery<PaginatedResponse<T>>({
    queryKey: ['/api/projects', projectId, entityType, { page, limit, search, filters }],
    queryFn: async () => {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        ...(search && { search }),
        ...(filters && { filters: JSON.stringify(filters) })
      });
      
      return makeAPIRequest<PaginatedResponse<T>>(
        'GET', 
        `/api/projects/${projectId}/${entityType}?${params}`
      );
    },
    ...queryOptions,
  });
}

/**
 * Hook for fetching a single entity
 */
export function useEntity<T extends BaseEntity>(
  entityType: string,
  entityId: string,
  options?: Partial<UseQueryOptions<T>>
) {
  return useQuery<T>({
    queryKey: ['/api', entityType, entityId],
    queryFn: () => makeAPIRequest<T>('GET', `/api/${entityType}/${entityId}`),
    ...options,
  });
}

// ===== SPECIALIZED HOOKS =====

/**
 * Hook for uploading and generating images
 */
export function useImageUpload(
  entityType: string,
  entityId: string,
  options?: Partial<UseMutationOptions<{ imageUrl: string }, Error, File>>
) {
  const queryClient = useQueryClient();
  
  return useMutation<{ imageUrl: string }, Error, File>({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append('image', file);
      formData.append('entityType', entityType);
      formData.append('entityId', entityId);
      
      const response = await fetch('/api/upload-image', {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        throw new Error(`Upload failed: ${response.statusText}`);
      }
      
      return response.json();
    },
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ 
        queryKey: ['/api', entityType, entityId] 
      });
      options?.onSuccess?.(data, variables, context);
    },
    ...options,
  });
}

/**
 * Hook for AI-powered entity generation
 */
export function useAIGeneration<T>(
  prompt: string,
  entityType: string,
  options?: Partial<UseMutationOptions<T, Error, { prompt: string; context?: any }>>
) {
  return useMutation<T, Error, { prompt: string; context?: any }>({
    mutationFn: async ({ prompt, context }) => {
      return makeAPIRequest<T>('POST', '/api/ai/generate', {
        prompt,
        entityType,
        context,
      });
    },
    ...options,
  });
}

// ===== UTILITY FUNCTIONS =====

/**
 * Optimistic update helper
 */
export function createOptimisticUpdate<T extends BaseEntity>(
  queryClient: any,
  queryKey: any[],
  updater: (old: T[] | undefined) => T[]
) {
  return queryClient.setQueryData<T[]>(queryKey, updater);
}

/**
 * Invalidate related queries helper
 */
export function invalidateEntityQueries(
  queryClient: any,
  entityType: string,
  projectId?: string,
  entityId?: string
) {
  const invalidations = [
    queryClient.invalidateQueries({ queryKey: ['/api', entityType] }),
  ];
  
  if (projectId) {
    invalidations.push(
      queryClient.invalidateQueries({ 
        queryKey: ['/api/projects', projectId, entityType] 
      })
    );
  }
  
  if (entityId) {
    invalidations.push(
      queryClient.invalidateQueries({ 
        queryKey: ['/api', entityType, entityId] 
      })
    );
  }
  
  return Promise.all(invalidations);
}

// ===== ERROR HANDLING =====

/**
 * Extract error message from API response
 */
export function extractErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }
  
  if (typeof error === 'string') {
    return error;
  }
  
  if (error && typeof error === 'object' && 'message' in error) {
    return String((error as any).message);
  }
  
  return 'An unexpected error occurred';
}

/**
 * Check if error is a validation error
 */
export function isValidationError(error: unknown): boolean {
  return (
    error instanceof Error &&
    error.message.includes('validation') ||
    (error && typeof error === 'object' && 'status' in error && (error as any).status === 400)
  );
}