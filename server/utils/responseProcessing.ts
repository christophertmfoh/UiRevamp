/**
 * Response Processing Utilities
 * Handles AI response processing and data type conversions
 */

export function processAIResponse(response: string, fieldKey: string): any {
  if (!response || response.trim() === '') {
    return '';
  }

  const cleanResponse = response.trim();
  
  // Handle array fields that might come back as comma-separated strings
  const arrayFields = [
    'personalityTraits', 'abilities', 'skills', 'talents', 'expertise', 
    'archetypes', 'tropes', 'tags', 'likes', 'dislikes',
    'strengths', 'weaknesses'
  ];
  
  if (arrayFields.includes(fieldKey)) {
    // Check if response looks like a list (contains commas, semicolons, or bullet points)
    if (cleanResponse.includes(',') || cleanResponse.includes(';') || cleanResponse.includes('•') || cleanResponse.includes('-')) {
      return cleanResponse
        .split(/[,;•\-\n]/)
        .map(item => item.trim())
        .filter(item => item.length > 0 && !item.match(/^\d+\.?\s*$/))
        .slice(0, 6); // Limit to 6 items for UI clarity
    }
    
    // If it's a single phrase, treat as single-item array
    return [cleanResponse];
  }
  
  // For text fields, clean up and return as string
  return cleanResponse;
}

export function safeJsonParse(jsonString: string, fallback: any = {}): any {
  try {
    return JSON.parse(jsonString);
  } catch (error) {
    console.warn('Failed to parse JSON:', error);
    return fallback;
  }
}

export function convertDataForDatabase(data: any): any {
  const converted = { ...data };
  
  // Convert arrays to JSON strings for database storage
  Object.keys(converted).forEach(key => {
    const value = converted[key];
    if (Array.isArray(value)) {
      converted[key] = JSON.stringify(value);
    } else if (typeof value === 'object' && value !== null) {
      converted[key] = JSON.stringify(value);
    }
  });
  
  return converted;
}

export function convertDataFromDatabase(data: any): any {
  const converted = { ...data };
  
  // Convert JSON strings back to arrays/objects
  const arrayFields = [
    'personalityTraits', 'abilities', 'skills', 'talents', 'expertise',
    'archetypes', 'tropes', 'tags', 'likes', 'dislikes',
    'strengths', 'weaknesses'
  ];
  
  arrayFields.forEach(field => {
    if (converted[field] && typeof converted[field] === 'string') {
      try {
        const parsed = JSON.parse(converted[field]);
        if (Array.isArray(parsed)) {
          converted[field] = parsed;
        }
      } catch (error) {
        // If parsing fails, try to split as comma-separated string
        if (converted[field].includes(',')) {
          converted[field] = converted[field]
            .split(',')
            .map((item: string) => item.trim())
            .filter((item: string) => item.length > 0);
        } else {
          // Single item array
          converted[field] = [converted[field]];
        }
      }
    }
  });
  
  return converted;
}

export function sanitizeResponse(response: string): string {
  return response
    .replace(/^["'`]|["'`]$/g, '') // Remove surrounding quotes
    .replace(/\n{3,}/g, '\n\n')    // Limit consecutive newlines
    .replace(/\s{3,}/g, ' ')       // Limit consecutive spaces
    .trim();
}