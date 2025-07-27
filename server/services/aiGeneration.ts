/**
 * Unified AI Generation Service
 * Consolidates all AI generation functionality with consistent patterns
 */

import { GoogleGenerativeAI } from '@google/generative-ai';

// Rate limiting and queue management
interface QueueItem {
  id: string;
  prompt: string;
  resolve: (value: string) => void;
  reject: (error: Error) => void;
  priority: number;
  timestamp: number;
}

class AIRequestQueue {
  private queue: QueueItem[] = [];
  private processing = false;
  private readonly maxConcurrent = 3;
  private readonly rateLimit = 60; // requests per minute
  private readonly requestTimes: number[] = [];
  private currentProcessing = 0;

  async addRequest(prompt: string, priority: number = 1): Promise<string> {
    return new Promise((resolve, reject) => {
      const item: QueueItem = {
        id: `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        prompt,
        resolve,
        reject,
        priority,
        timestamp: Date.now()
      };

      // Insert based on priority (higher priority first)
      const insertIndex = this.queue.findIndex(q => q.priority < priority);
      if (insertIndex === -1) {
        this.queue.push(item);
      } else {
        this.queue.splice(insertIndex, 0, item);
      }

      this.processQueue();
    });
  }

  private async processQueue() {
    if (this.processing || this.currentProcessing >= this.maxConcurrent) return;
    if (this.queue.length === 0) return;

    // Check rate limit
    const now = Date.now();
    const oneMinuteAgo = now - 60 * 1000;
    this.requestTimes.splice(0, this.requestTimes.findIndex(time => time > oneMinuteAgo));

    if (this.requestTimes.length >= this.rateLimit) {
      const oldestRequest = this.requestTimes[0];
      const waitTime = 60 * 1000 - (now - oldestRequest) + 1000; // Add 1s buffer
      console.log(`Rate limit reached, waiting ${waitTime}ms`);
      setTimeout(() => this.processQueue(), waitTime);
      return;
    }

    const item = this.queue.shift();
    if (!item) return;

    this.currentProcessing++;
    this.requestTimes.push(now);

    try {
      const result = await this.makeAIRequest(item.prompt);
      item.resolve(result);
    } catch (error) {
      item.reject(error instanceof Error ? error : new Error(String(error)));
    } finally {
      this.currentProcessing--;
      // Continue processing queue
      setTimeout(() => this.processQueue(), 100);
    }
  }

  private async makeAIRequest(prompt: string): Promise<string> {
    const apiKey = process.env.GOOGLE_API_KEY_1 || process.env.GOOGLE_API_KEY || process.env.GEMINI_API_KEY;
    
    if (!apiKey) {
      throw new Error('Gemini API key is not configured');
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const result = await model.generateContent({
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 0.8,
        topK: 40,
        topP: 0.9,
        maxOutputTokens: 8192,
      },
    });

    const response = await result.response;
    return response.text();
  }

  getQueueStats() {
    return {
      queueLength: this.queue.length,
      processing: this.currentProcessing,
      recentRequests: this.requestTimes.length
    };
  }
}

// Response caching
interface CacheEntry {
  content: string;
  timestamp: number;
  ttl: number;
}

class AIResponseCache {
  private cache = new Map<string, CacheEntry>();
  private readonly defaultTTL = 24 * 60 * 60 * 1000; // 24 hours

  private generateCacheKey(prompt: string): string {
    // Create a stable hash from the prompt for caching
    let hash = 0;
    for (let i = 0; i < prompt.length; i++) {
      const char = prompt.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return `ai_${Math.abs(hash).toString(36)}`;
  }

  get(prompt: string): string | null {
    const key = this.generateCacheKey(prompt);
    const entry = this.cache.get(key);
    
    if (!entry) return null;
    
    if (Date.now() - entry.timestamp > entry.ttl) {
      this.cache.delete(key);
      return null;
    }
    
    return entry.content;
  }

  set(prompt: string, content: string, ttl: number = this.defaultTTL): void {
    const key = this.generateCacheKey(prompt);
    this.cache.set(key, {
      content,
      timestamp: Date.now(),
      ttl
    });
  }

  clear(): void {
    this.cache.clear();
  }

  getStats() {
    return {
      size: this.cache.size,
      entries: Array.from(this.cache.keys()).slice(0, 10) // Sample keys
    };
  }
}

// Global instances
const aiQueue = new AIRequestQueue();
const aiCache = new AIResponseCache();

export interface AIGenerationOptions {
  prompt: string;
  priority?: number;
  useCache?: boolean;
  cacheHours?: number;
  maxRetries?: number;
  temperature?: number;
}

export async function generateAIContent(options: AIGenerationOptions): Promise<string> {
  const {
    prompt,
    priority = 1,
    useCache = true,
    cacheHours = 24,
    maxRetries = 3,
    temperature = 0.8
  } = options;

  // Check cache first
  if (useCache) {
    const cached = aiCache.get(prompt);
    if (cached) {
      console.log('Returning cached AI response');
      return cached;
    }
  }

  // Retry logic with exponential backoff
  let lastError: Error | null = null;
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      console.log(`AI attempt ${attempt}/${maxRetries}`);
      
      // Add to queue for processing
      const content = await aiQueue.addRequest(prompt, priority);
      
      if (!content || content.trim().length === 0) {
        throw new Error('Empty response from AI service');
      }

      // Cache successful response
      if (useCache) {
        aiCache.set(prompt, content, cacheHours * 60 * 60 * 1000);
      }

      console.log(`Generated content (attempt ${attempt}): ${content.substring(0, 100)}...`);
      return content;

    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));
      console.log(`AI request failed (attempt ${attempt}):`, lastError.message);
      
      if (attempt < maxRetries) {
        const waitTime = Math.min(1000 * Math.pow(2, attempt - 1), 10000); // Exponential backoff, max 10s
        console.log(`Empty response, waiting ${waitTime}ms before retry...`);
        await new Promise(resolve => setTimeout(resolve, waitTime));
      }
    }
  }

  throw new Error(`AI generation failed after ${maxRetries} attempts: ${lastError?.message}`);
}

// Legacy function for backward compatibility
export async function generateCharacterContent(
  prompt: string,
  maxRetries: number = 3,
  temperature: number = 0.8
): Promise<string> {
  return generateAIContent({
    prompt,
    maxRetries,
    temperature,
    priority: 2, // Higher priority for character generation
    useCache: true,
    cacheHours: 12 // Shorter cache for character content
  });
}

// Enhanced bulk generation with batching
export async function generateBulkContent(
  prompts: string[],
  options: Partial<AIGenerationOptions> = {}
): Promise<string[]> {
  const batchSize = 5; // Process in batches to avoid overwhelming the queue
  const results: string[] = [];
  
  for (let i = 0; i < prompts.length; i += batchSize) {
    const batch = prompts.slice(i, i + batchSize);
    const batchPromises = batch.map(prompt => 
      generateAIContent({ ...options, prompt })
    );
    
    const batchResults = await Promise.allSettled(batchPromises);
    
    for (const result of batchResults) {
      if (result.status === 'fulfilled') {
        results.push(result.value);
      } else {
        console.error('Batch generation error:', result.reason);
        results.push(''); // Empty fallback for failed generation
      }
    }
  }
  
  return results;
}

// Monitoring and health check functions
export function getAIServiceStats() {
  return {
    queue: aiQueue.getQueueStats(),
    cache: aiCache.getStats(),
    timestamp: new Date().toISOString()
  };
}

export function clearAICache() {
  aiCache.clear();
}

// Preload commonly used prompts
export async function preloadCommonPrompts() {
  const commonPrompts = [
    "Generate a fantasy character name",
    "Create a character backstory",
    "Describe a character's appearance"
  ];
  
  // Pre-warm cache with low priority
  await Promise.allSettled(
    commonPrompts.map(prompt => 
      generateAIContent({ prompt, priority: 0, useCache: true })
    )
  );
}