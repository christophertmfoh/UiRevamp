/**
 * Error Handling Utilities - Senior Dev Pattern
 * Centralized error handling with proper TypeScript support
 */

import { useToast } from '@/components/ui/Toast';

// ===== ERROR INTERFACES =====
export interface EntityError {
  message: string;
  context?: Record<string, any>;
}

export interface APIError {
  message: string;
  status: number;
  code?: string;
}

export interface ValidationError {
  field: string;
  message: string;
  code: string;
}

// ===== ERROR HANDLER FUNCTIONS =====

/**
 * Standard error handler for entity operations
 */
export function handleEntityError(error: unknown, operation: string, entityType: string = 'entity'): EntityError {
  const entityError: EntityError = {
    message: `Failed to ${operation} ${entityType}`,
    context: { operation, entityType }
  };

  if (error instanceof Error) {
    entityError.message = error.message;
    entityError.context = { 
      ...entityError.context, 
      originalError: error.message,
      stack: error.stack?.substring(0, 200)
    };
  } else if (typeof error === 'string') {
    entityError.message = error;
  } else if (error && typeof error === 'object') {
    const errorObj = error as any;
    entityError.message = errorObj.message || errorObj.toString();
    entityError.context = { ...entityError.context, ...errorObj };
  }

  // Log error in development
  if (process.env.NODE_ENV === 'development') {
    console.error('🚨 Entity Error:', entityError);
  }

  return entityError;
}

/**
 * Convert unknown error to API error format
 */
export function toAPIError(error: unknown, defaultMessage: string = 'An error occurred'): APIError {
  if (error && typeof error === 'object' && 'status' in error) {
    const apiError = error as any;
    return {
      message: apiError.message || defaultMessage,
      status: apiError.status || 500,
      code: apiError.code
    };
  }

  if (error instanceof Error) {
    return {
      message: error.message,
      status: 500,
      code: 'INTERNAL_ERROR'
    };
  }

  return {
    message: typeof error === 'string' ? error : defaultMessage,
    status: 500,
    code: 'UNKNOWN_ERROR'
  };
}

/**
 * Create toast notification function (for use in components)
 */
export function createToastNotification() {
  // This returns a function that can be used with the toast context
  return {
    error: (title: string, description?: string) => ({
      type: 'error' as const,
      title,
      description
    }),
    success: (title: string, description?: string) => ({
      type: 'success' as const,
      title,
      description
    }),
    warning: (title: string, description?: string) => ({
      type: 'warning' as const,
      title,
      description
    }),
    info: (title: string, description?: string) => ({
      type: 'info' as const,
      title,
      description
    })
  };
}

/**
 * Display error toast with consistent styling
 * NOTE: This must be called from within a component that has access to useToast
 */
export function displayErrorToast(error: EntityError | APIError | ValidationError | string, title?: string) {
  const message = typeof error === 'string' ? error : error.message;
  const toastTitle = title || 'Error';
  
  // Return toast data that can be used with addToast
  return createToastNotification().error(toastTitle, message);
}

/**
 * Display success toast with consistent styling
 */
export function displaySuccessToast(message: string, title: string = 'Success') {
  return createToastNotification().success(title, message);
}

// ===== SPECIALIZED ERROR HANDLERS =====

/**
 * Enhanced error handler for AI operations
 */
export function handleAIError(error: unknown, operation: string, fieldKey?: string): EntityError {
  const aiError = handleEntityError(error, operation, 'AI enhancement');
  
  // Add specific AI error context
  if (fieldKey) {
    aiError.context = { ...aiError.context, fieldKey };
  }
  
  return aiError;
}

/**
 * Enhanced error handler for image operations
 */
export function handleImageError(error: unknown, operation: string): EntityError {
  const imageError = handleEntityError(error, operation, 'image');
  
  // Add specific image error context
  if (imageError.message.includes('format')) {
    imageError.context = { 
      ...imageError.context, 
      suggestion: 'Please check that the image format is supported (JPG, PNG, GIF)' 
    };
  }
  
  return imageError;
}

// ===== ERROR BOUNDARY HELPERS =====

/**
 * Create error boundary configuration
 */
export function createErrorBoundary(componentName: string) {
  return {
    componentDidCatch(error: Error, errorInfo: any) {
      const boundaryError = handleEntityError(error, 'render', componentName);
      console.error(`Error boundary caught error in ${componentName}:`, boundaryError);
      
      // Return error data for toast notification
      return displayErrorToast(boundaryError, `${componentName} Error`);
    }
  };
}

// ===== ASYNC OPERATION HELPERS =====

/**
 * Safe async operation wrapper
 */
export async function safeAsyncOperation<T>(
  operation: () => Promise<T>,
  entityType: string = 'operation',
  errorHandler?: (error: EntityError) => void
): Promise<{ data: T | null; error: EntityError | null }> {
  try {
    const data = await operation();
    return { data, error: null };
  } catch (error) {
    const entityError = handleEntityError(error, 'execute', entityType);
    
    if (errorHandler) {
      errorHandler(entityError);
    }
    
    return { data: null, error: entityError };
  }
}

/**
 * Form submission error handler
 */
export function handleFormSubmissionError(error: unknown, entityType: string): { 
  generalError: EntityError; 
  fieldErrors: Record<string, string>;
  toastData: ReturnType<typeof displayErrorToast>;
} {
  const submissionError = handleEntityError(error, 'save', entityType);
  const fieldErrors: Record<string, string> = {};

  // Extract field-specific errors if available
  if (error && typeof error === 'object') {
    const errorObj = error as any;
    if (errorObj.validationErrors) {
      errorObj.validationErrors.forEach((validationError: ValidationError) => {
        fieldErrors[validationError.field] = validationError.message;
      });
    }
  }

  // Create toast data
  const toastData = displayErrorToast(submissionError, `Failed to Save ${entityType}`);
  
  return { generalError: submissionError, fieldErrors, toastData };
}

// ===== TYPE GUARDS =====

export function isEntityError(error: any): error is EntityError {
  return error && typeof error === 'object' && 'message' in error && !('status' in error);
}

export function isAPIError(error: any): error is APIError {
  return error && typeof error === 'object' && 'message' in error && 'status' in error;
}

export function isValidationError(error: any): error is ValidationError {
  return error && typeof error === 'object' && 'field' in error && 'message' in error && 'code' in error;
}