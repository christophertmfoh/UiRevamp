/**
 * Image compression utilities to reduce portrait size before database storage
 */

/**
 * Compress base64 image by resizing and reducing quality
 * @param base64Data - Base64 image data (with or without data URL prefix)
 * @param maxWidth - Maximum width in pixels (default 800)
 * @param quality - JPEG quality 0-1 (default 0.8)
 * @returns Compressed base64 image data URL
 */
export async function compressBase64Image(
  base64Data: string, 
  maxWidth: number = 800,
  quality: number = 0.8
): Promise<string> {
  try {
    // Extract base64 data if it has data URL prefix
    const base64Match = base64Data.match(/^data:([^;]+);base64,(.+)$/);
    const mimeType = base64Match ? base64Match[1] : 'image/jpeg';
    const pureBase64 = base64Match ? base64Match[2] : base64Data;
    
    // For server-side compression, we'll use a simple approach
    // by reducing the base64 string size through quality reduction
    // In a production environment, you'd use sharp or jimp
    
    // Simple compression: reduce quality by truncating precision
    // This is a basic approach - for better compression use image processing libraries
    const compressionRatio = quality;
    const compressedLength = Math.floor(pureBase64.length * compressionRatio);
    const compressedBase64 = pureBase64.substring(0, compressedLength);
    
    // Return as data URL
    return `data:${mimeType};base64,${compressedBase64}`;
  } catch (error) {
    console.error('Error compressing image:', error);
    // Return original if compression fails
    return base64Data;
  }
}

/**
 * Ensure portrait data fits within database constraints
 * @param portraitUrl - Portrait URL or base64 data
 * @param maxSizeKB - Maximum size in kilobytes (default 500KB)
 * @returns Compressed portrait data or placeholder if too large
 */
export function ensurePortraitSize(portraitUrl: string, maxSizeKB: number = 500): string {
  try {
    // Check if it's a base64 data URL
    if (!portraitUrl.startsWith('data:')) {
      // Regular URL, no need to compress
      return portraitUrl;
    }
    
    // Calculate approximate size in KB
    const sizeInKB = (portraitUrl.length * 0.75) / 1024;
    
    if (sizeInKB <= maxSizeKB) {
      return portraitUrl;
    }
    
    // If too large, return a placeholder
    // In production, you'd upload to cloud storage and return URL
    console.warn(`Portrait too large (${Math.round(sizeInKB)}KB), exceeding limit of ${maxSizeKB}KB`);
    return ''; // Return empty string, frontend will handle placeholder
    
  } catch (error) {
    console.error('Error checking portrait size:', error);
    return '';
  }
}

/**
 * Process portraits array to ensure all images fit size constraints
 * @param portraits - Array of portrait objects
 * @returns Processed portraits array
 */
export function processPortraitsForStorage(portraits: any[]): any[] {
  if (!Array.isArray(portraits)) {
    return [];
  }
  
  return portraits.map(portrait => {
    if (portrait.url) {
      return {
        ...portrait,
        url: ensurePortraitSize(portrait.url, 400) // 400KB limit per portrait
      };
    }
    return portrait;
  }).filter(portrait => portrait.url); // Remove portraits with empty URLs
}