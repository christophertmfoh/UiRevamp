/**
 * Enhanced fetch handler to prevent unhandled rejections
 */

interface FetchOptions extends RequestInit {
  timeout?: number;
  retries?: number;
  retryDelay?: number;
}

export const safeFetch = async (url: string, options: FetchOptions = {}): Promise<Response> => {
  const {
    timeout = 8000,
    retries = 2,
    retryDelay = 1000,
    ...fetchOptions
  } = options;

  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeout);

      const response = await fetch(url, {
        ...fetchOptions,
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      return response;
    } catch (error) {
      const isLastAttempt = attempt === retries;
      
      if (isLastAttempt) {
        console.error(`Fetch failed after ${retries + 1} attempts:`, error);
        throw error;
      }

      // Wait before retry
      await new Promise(resolve => setTimeout(resolve, retryDelay * (attempt + 1)));
    }
  }

  throw new Error('Fetch failed: Maximum retries exceeded');
};

// Wrapper for common API calls
export const apiRequest = async (endpoint: string, options: FetchOptions = {}) => {
  try {
    const response = await safeFetch(`/api${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      },
      ...options
    });

    return await response.json();
  } catch (error) {
    console.error(`API request failed for ${endpoint}:`, error);
    throw error;
  }
};