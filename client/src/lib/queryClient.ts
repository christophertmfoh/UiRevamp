import { QueryClient, QueryFunction } from "@tanstack/react-query";

async function throwIfResNotOk(res: Response) {
  if (!res.ok) {
    const text = (await res.text()) || res.statusText;
    throw new Error(`${res.status}: ${text}`);
  }
}

export async function apiRequest(
  method: string,
  url: string,
  data?: unknown | undefined,
): Promise<Response> {
  const res = await fetch(url, {
    method,
    headers: data ? { "Content-Type": "application/json" } : {},
    body: data ? JSON.stringify(data) : undefined,
    credentials: "include",
  });

  await throwIfResNotOk(res);
  return res;
}

type UnauthorizedBehavior = "returnNull" | "throw";
export const getQueryFn: <T>(options: {
  on401: UnauthorizedBehavior;
}) => QueryFunction<T> =
  ({ on401: unauthorizedBehavior }) =>
  async ({ queryKey }) => {
    const res = await fetch(queryKey.join("/") as string, {
      credentials: "include",
    });

    if (unauthorizedBehavior === "returnNull" && res.status === 401) {
      return null;
    }

    await throwIfResNotOk(res);
    return await res.json();
  };

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: getQueryFn({ on401: "throw" }),
      // Enhanced caching strategy for scalability
      staleTime: 5 * 60 * 1000, // 5 minutes - data is fresh for 5 minutes
      gcTime: 30 * 60 * 1000, // 30 minutes - keep in cache for 30 minutes
      
      // Background updates for better UX
      refetchOnWindowFocus: true,
      refetchOnReconnect: true,
      refetchInterval: false, // Disable automatic polling by default
      
      // Retry configuration
      retry: (failureCount, error: any) => {
        // Don't retry on 4xx errors (client errors)
        if (error?.message?.includes('4')) {
          return false;
        }
        // Retry up to 3 times on 5xx errors with exponential backoff
        return failureCount < 3;
      },
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
      
      // Network mode for better offline handling
      networkMode: 'online',
    },
    mutations: {
      // Enhanced retry for mutations
      retry: (failureCount, error: any) => {
        // Don't retry validation errors (usually 400)
        if (error?.message?.includes('400')) {
          return false;
        }
        // Retry network failures up to 2 times
        return failureCount < 2;
      },
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 10000),
      networkMode: 'online',
    },
  },
});

// Enhanced query helpers for better performance
export const createOptimisticUpdate = <T>(
  queryKey: string[],
  updater: (old: T | undefined) => T
) => {
  return {
    onMutate: async () => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey });
      
      // Snapshot previous value
      const previousData = queryClient.getQueryData<T>(queryKey);
      
      // Optimistically update
      queryClient.setQueryData<T>(queryKey, updater);
      
      return { previousData };
    },
    onError: (err: any, variables: any, context: any) => {
      // Rollback on error
      if (context?.previousData) {
        queryClient.setQueryData(queryKey, context.previousData);
      }
    },
    onSettled: () => {
      // Refetch to sync with server
      queryClient.invalidateQueries({ queryKey });
    },
  };
};

// Batch invalidation helper
export const batchInvalidateQueries = (patterns: string[][]) => {
  return Promise.all(
    patterns.map(pattern => 
      queryClient.invalidateQueries({ queryKey: pattern })
    )
  );
};

// Prefetch helper for performance
export const prefetchEntityData = async (entityType: string, entityId: string) => {
  return queryClient.prefetchQuery({
    queryKey: ['/api', entityType, entityId],
    queryFn: () => apiRequest('GET', `/api/${entityType}/${entityId}`).then(res => res.json()),
    staleTime: 10 * 60 * 1000, // 10 minutes for prefetched data
  });
};

// Performance monitoring
let queryCount = 0;
let cacheHits = 0;
let cacheMisses = 0;

// Override setQueryData to track cache performance
const originalSetQueryData = queryClient.setQueryData.bind(queryClient);
queryClient.setQueryData = function(queryKey, updater, options) {
  queryCount++;
  return originalSetQueryData(queryKey, updater, options);
};

// Override getQueryData to track cache hits/misses
const originalGetQueryData = queryClient.getQueryData.bind(queryClient);
queryClient.getQueryData = function(queryKey) {
  const result = originalGetQueryData(queryKey);
  if (result !== undefined) {
    cacheHits++;
  } else {
    cacheMisses++;
  }
  return result;
};

// Performance stats
export const getQueryPerformanceStats = () => ({
  totalQueries: queryCount,
  cacheHits,
  cacheMisses,
  hitRatio: cacheHits / (cacheHits + cacheMisses) || 0,
  cacheSize: queryClient.getQueryCache().getAll().length,
  timestamp: new Date().toISOString()
});

// Memory management
export const cleanupQueries = () => {
  // Remove unused queries to prevent memory leaks
  queryClient.getQueryCache().clear();
  
  // Reset performance counters
  queryCount = 0;
  cacheHits = 0;
  cacheMisses = 0;
};

// Background sync for offline support
let isOnline = navigator.onLine;
let pendingMutations: Array<() => Promise<any>> = [];

window.addEventListener('online', () => {
  isOnline = true;
  // Retry pending mutations when back online
  const mutations = [...pendingMutations];
  pendingMutations = [];
  
  mutations.forEach(mutation => {
    mutation().catch(err => {
      console.error('Failed to sync pending mutation:', err);
    });
  });
  
  // Refetch all queries to sync with server
  queryClient.refetchQueries();
});

window.addEventListener('offline', () => {
  isOnline = false;
});

export const addPendingMutation = (mutation: () => Promise<any>) => {
  if (!isOnline) {
    pendingMutations.push(mutation);
    return false; // Indicate that mutation was queued
  }
  return true; // Indicate that mutation can proceed
};
