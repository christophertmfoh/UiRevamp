/**
 * Standardized Error Handling Utilities
 * Consistent error handling patterns for all entity components
 */

import { toast } from '@/hooks/use-toast';

export interface EntityError {
  message: string;
  code?: string;
  field?: string;
  context?: Record<string, any>;
}

export interface ValidationError {
  field: string;
  message: string;
  value?: any;
}

export interface APIError {
  message: string;
  status?: number;
  endpoint?: string;
  method?: string;
}

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
    entityError.code = 'OPERATION_ERROR';
  } else if (typeof error === 'string') {
    entityError.message = error;
    entityError.code = 'STRING_ERROR';
  } else if (error && typeof error === 'object') {
    const errorObj = error as any;
    entityError.message = errorObj.message || errorObj.error || `Failed to ${operation} ${entityType}`;
    entityError.code = errorObj.code || 'UNKNOWN_ERROR';
    entityError.field = errorObj.field;
  }

  console.error(`Entity ${operation} error:`, error);
  return entityError;
}

/**
 * Handle API request errors with consistent formatting
 */
export function handleAPIError(error: unknown, endpoint: string, method: string = 'GET'): APIError {
  const apiError: APIError = {
    message: `Request failed: ${method} ${endpoint}`,
    endpoint,
    method
  };

  if (error instanceof Response) {
    apiError.status = error.status;
    apiError.message = `HTTP ${error.status}: ${error.statusText}`;
  } else if (error instanceof Error) {
    apiError.message = error.message;
  } else if (typeof error === 'string') {
    apiError.message = error;
  }

  console.error(`API ${method} ${endpoint} error:`, error);
  return apiError;
}

/**
 * Handle form validation errors
 */
export function handleValidationError(field: string, value: any, rule: string): ValidationError {
  const validationMessages: Record<string, (field: string, value: any) => string> = {
    required: (field) => `${field} is required`,
    minLength: (field, value) => `${field} must be at least ${value} characters`,
    maxLength: (field, value) => `${field} must be no more than ${value} characters`,
    email: (field) => `${field} must be a valid email address`,
    url: (field) => `${field} must be a valid URL`,
    number: (field) => `${field} must be a valid number`,
    array: (field) => `${field} must be a valid array`
  };

  const messageGenerator = validationMessages[rule] || ((field) => `${field} is invalid`);
  
  return {
    field,
    message: messageGenerator(field, value),
    value
  };
}

/**
 * Display error toast with consistent styling
 */
export function showErrorToast(error: EntityError | APIError | ValidationError | string, title?: string) {
  const message = typeof error === 'string' ? error : error.message;
  const toastTitle = title || 'Error';

  toast({
    variant: 'destructive',
    title: toastTitle,
    description: message,
  });
}

/**
 * Display success toast with consistent styling
 */
export function showSuccessToast(message: string, title: string = 'Success') {
  toast({
    variant: 'default',
    title,
    description: message,
  });
}

/**
 * Enhanced error handler for AI operations
 */
export function handleAIError(error: unknown, operation: string, fieldKey?: string): EntityError {
  const aiError = handleEntityError(error, operation, 'AI enhancement');
  
  // Add specific AI error context
  if (fieldKey) {
    aiError.field = fieldKey;
    aiError.context = { ...aiError.context, fieldKey, operation };
  }

  // Check for common AI service errors
  if (aiError.message.includes('rate limit')) {
    aiError.code = 'RATE_LIMIT';
    aiError.message = 'AI service is temporarily unavailable. Please try again in a moment.';
  } else if (aiError.message.includes('safety')) {
    aiError.code = 'SAFETY_FILTER';
    aiError.message = 'Content was blocked by safety filters. Please try a different approach.';
  } else if (aiError.message.includes('timeout')) {
    aiError.code = 'TIMEOUT';
    aiError.message = 'AI enhancement timed out. Please try again.';
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
    imageError.code = 'INVALID_FORMAT';
    imageError.message = 'Unsupported image format. Please use JPG, PNG, or WebP.';
  } else if (imageError.message.includes('size')) {
    imageError.code = 'FILE_TOO_LARGE';
    imageError.message = 'Image file is too large. Please choose a smaller image.';
  } else if (imageError.message.includes('upload')) {
    imageError.code = 'UPLOAD_FAILED';
    imageError.message = 'Failed to upload image. Please check your connection and try again.';
  }

  return imageError;
}

/**
 * Create error boundary for component error handling
 */
export function createErrorBoundary(componentName: string) {
  return {
    componentDidCatch(error: Error, errorInfo: any) {
      const boundaryError = handleEntityError(error, 'render', componentName);
      console.error(`Error boundary caught error in ${componentName}:`, boundaryError);
      showErrorToast(boundaryError, `${componentName} Error`);
    }
  };
}

/**
 * Utility to safely execute async operations with error handling
 */
export async function safeAsync<T>(
  operation: () => Promise<T>,
  errorHandler?: (error: unknown) => void,
  entityType: string = 'entity'
): Promise<T | null> {
  try {
    return await operation();
  } catch (error) {
    const entityError = handleEntityError(error, 'execute', entityType);
    
    if (errorHandler) {
      errorHandler(entityError);
    } else {
      showErrorToast(entityError);
    }
    
    return null;
  }
}

/**
 * Form submission error handler
 */
export function handleFormSubmissionError(error: unknown, entityType: string): Record<string, string> {
  const submissionError = handleEntityError(error, 'save', entityType);
  const fieldErrors: Record<string, string> = {};

  // Extract field-specific errors if available
  if (submissionError.context && typeof submissionError.context === 'object') {
    const context = submissionError.context as any;
    if (context.validationErrors && Array.isArray(context.validationErrors)) {
      context.validationErrors.forEach((validationError: ValidationError) => {
        fieldErrors[validationError.field] = validationError.message;
      });
    }
  }

  // Show general error toast
  showErrorToast(submissionError, `Failed to Save ${entityType}`);
  
  return fieldErrors;
}