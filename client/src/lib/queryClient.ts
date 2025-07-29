import { QueryClient, QueryFunction } from "@tanstack/react-query";

async function throwIfResNotOk(res: Response) {
  if (!res.ok) {
    const text = (await res.text()) || res.statusText;
    const error = new Error(`${res.status}: ${text}`);
    // Add more context to help identify the source
    error.name = `HTTPError_${res.status}`;
    throw error;
  }
}

export async function apiRequest(
  method: string,
  url: string,
  data?: unknown | undefined,
): Promise<Response> {
  // Get token from localStorage (where auth store persists it)
  const authState = localStorage.getItem('fablecraft-auth');
  const token = authState ? JSON.parse(authState).state.token : null;
  
  const headers: HeadersInit = {};
  if (data) {
    headers["Content-Type"] = "application/json";
  }
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  
  const res = await fetch(url, {
    method,
    headers,
    body: data ? JSON.stringify(data) : undefined,
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
    // Get token from localStorage (where auth store persists it)
    const authState = localStorage.getItem('fablecraft-auth');
    const token = authState ? JSON.parse(authState).state.token : null;
    
    const headers: HeadersInit = {};
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }
    
    try {
      const res = await fetch(queryKey.join("/") as string, {
        headers,
      });

      if (unauthorizedBehavior === "returnNull" && res.status === 401) {
        return null;
      }

      await throwIfResNotOk(res);
      return await res.json();
    } catch (error) {
      // Add URL context to help debug which endpoint is failing
      error.url = queryKey.join("/");
      // Only log non-development errors
      if (!error.message?.includes('Failed to fetch')) {
        console.error('🔍 Query failed for URL:', queryKey.join("/"), error.message);
      }
      throw error;
    }
  };

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: getQueryFn({ on401: "throw" }),
      refetchInterval: false,
      refetchOnWindowFocus: false, // Keep disabled to prevent excessive API calls
      staleTime: 30000, // 30 seconds - shorter for better data freshness
      gcTime: 300000, // 5 minutes cache (renamed from cacheTime in v5)
      retry: 1, // Allow one retry for network issues
      refetchOnMount: true, // ✅ FIXED: Enable refetch on mount for fresh data
      refetchOnReconnect: true, // ✅ FIXED: Enable refetch on reconnect
    },
    mutations: {
      retry: 1, // Allow one retry for mutations
    },
  },
});
