/**
 * Unified AI Generation Service
 * Consolidates all AI generation functionality with consistent patterns
 */

import { GoogleGenAI } from "@google/genai";
import memoizee from 'memoizee';

// Initialize AI service with fallback API keys
const getAIService = () => {
  const apiKey = process.env.GOOGLE_API_KEY || process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('No AI API key available');
  }
  return new GoogleGenAI({ apiKey });
};

// Standard AI configuration for consistent results
export const AI_CONFIG = {
  model: "gemini-2.5-flash",
  temperature: 0.8,
  maxOutputTokens: 200,
  candidateCount: 1,
  safetySettings: [
    { category: "HARM_CATEGORY_HARASSMENT", threshold: "BLOCK_ONLY_HIGH" },
    { category: "HARM_CATEGORY_HATE_SPEECH", threshold: "BLOCK_ONLY_HIGH" },
    { category: "HARM_CATEGORY_SEXUALLY_EXPLICIT", threshold: "BLOCK_ONLY_HIGH" },
    { category: "HARM_CATEGORY_DANGEROUS_CONTENT", threshold: "BLOCK_ONLY_HIGH" }
  ]
};

// Enhanced rate limiting with sliding window
const rateLimitState = {
  requests: [] as number[],
  maxRequests: 8,
  windowMs: 60000,
  burstLimit: 3,
  burstWindow: 10000
};

export function checkRateLimit(isBurst = false): boolean {
  const now = Date.now();
  
  // Clean old requests
  rateLimitState.requests = rateLimitState.requests.filter(
    time => now - time < rateLimitState.windowMs
  );
  
  // Check burst limit
  if (isBurst) {
    const recentRequests = rateLimitState.requests.filter(
      time => now - time < rateLimitState.burstWindow
    );
    if (recentRequests.length >= rateLimitState.burstLimit) {
      return false;
    }
  }
  
  if (rateLimitState.requests.length >= rateLimitState.maxRequests) {
    return false;
  }
  
  rateLimitState.requests.push(now);
  return true;
}

// Memoized AI generation for repeated prompts
export const memoizedAIGeneration = memoizee(
  async (prompt: string, options = {}) => {
    const ai = getAIService();
    const model = ai.getGenerativeModel(AI_CONFIG);
    const result = await model.generateContent(prompt);
    return result.response.text();
  },
  {
    maxAge: 1000 * 60 * 15, // 15 minutes cache
    max: 100, // Cache up to 100 responses
    promise: true,
    normalizer: ([prompt]) => prompt.toLowerCase().trim()
  }
);

// Batch processing for multiple AI requests
export async function batchAIGeneration(
  prompts: string[], 
  options: { batchSize?: number; delay?: number } = {}
): Promise<string[]> {
  const { batchSize = 3, delay = 1000 } = options;
  const results: string[] = [];
  
  for (let i = 0; i < prompts.length; i += batchSize) {
    const batch = prompts.slice(i, i + batchSize);
    
    const batchPromises = batch.map(async (prompt) => {
      if (!checkRateLimit()) {
        throw new Error('Rate limit exceeded');
      }
      return memoizedAIGeneration(prompt);
    });
    
    const batchResults = await Promise.all(batchPromises);
    results.push(...batchResults);
    
    // Add delay between batches to respect rate limits
    if (i + batchSize < prompts.length) {
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  
  return results;
}

// Enhanced retry logic with exponential backoff
export async function generateWithRetry(
  prompt: string,
  maxRetries: number = 3,
  customConfig?: Partial<typeof AI_CONFIG>
): Promise<string> {
  const ai = getAIService();
  const config = { ...AI_CONFIG, ...customConfig };
  const safetySettings = [...config.safetySettings];
  
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      console.log(`AI attempt ${attempt + 1}/${maxRetries}`);
      
      const response = await ai.models.generateContent({
        model: config.model,
        config: {
          temperature: config.temperature,
          maxOutputTokens: config.maxOutputTokens,
          candidateCount: config.candidateCount,
          safetySettings: safetySettings
        },
        contents: prompt,
      });

      const content = response.text?.trim() || '';
      
      // Handle safety filter blocking
      if (response.candidates?.[0]?.finishReason === 'SAFETY') {
        console.log(`Response blocked by safety filters, trying simpler prompt`);
        
        const safePrompt = `Generate appropriate content: ${prompt.substring(0, 100)}`;
        const safeResponse = await ai.models.generateContent({
          model: config.model,
          config: { 
            temperature: 0.7, 
            maxOutputTokens: 100,
            candidateCount: 1,
            safetySettings: safetySettings
          },
          contents: safePrompt,
        });
        
        const safeContent = safeResponse.text?.trim() || '';
        if (safeContent) return safeContent;
      }
      
      if (content) {
        console.log(`Generated content (attempt ${attempt + 1}): ${content.substring(0, 100)}...`);
        return content;
      }
      
      // Exponential backoff
      if (attempt < maxRetries - 1) {
        const waitTime = Math.pow(2, attempt) * 1000;
        console.log(`Empty response, waiting ${waitTime}ms before retry...`);
        await new Promise(resolve => setTimeout(resolve, waitTime));
      }
      
    } catch (error) {
      console.log(`AI request failed (attempt ${attempt + 1}):`, error);
      if (attempt < maxRetries - 1) {
        const waitTime = Math.pow(2, attempt) * 1000;
        await new Promise(resolve => setTimeout(resolve, waitTime));
      }
    }
  }
  
  throw new Error(`Failed to generate content after ${maxRetries} attempts`);
}

// Specialized generation functions
export class AIGenerationService {
  static async generateCharacterField(
    fieldKey: string,
    fieldLabel: string,
    character: any,
    context: string = ''
  ): Promise<string> {
    const prompt = this.buildCharacterFieldPrompt(fieldKey, fieldLabel, character, context);
    return generateWithRetry(prompt);
  }
  
  static async generateWorldElement(
    elementType: string,
    context: any,
    additionalPrompt: string = ''
  ): Promise<string> {
    const prompt = this.buildWorldElementPrompt(elementType, context, additionalPrompt);
    return generateWithRetry(prompt);
  }
  
  private static buildCharacterFieldPrompt(
    fieldKey: string,
    fieldLabel: string,
    character: any,
    context: string
  ): string {
    // Build contextual character analysis
    const characterContext = this.buildCharacterContext(character);
    
    // Field-specific prompting
    const fieldPrompts: Record<string, string> = {
      personality: "Generate a rich personality description with specific traits, quirks, and behavioral patterns",
      background: "Create a compelling backstory that explains how this character became who they are",
      goals: "Define clear, specific objectives that drive this character's actions",
      motivations: "Explain the deep emotional or psychological reasons behind their goals",
      talents: "List natural gifts and innate abilities this character was born with",
      skills: "Describe learned abilities and trained competencies",
      strengths: "Identify what this character excels at physically, mentally, and socially",
      flaws: "Create meaningful character flaws that create internal conflict and growth opportunities",
    };
    
    const fieldPrompt = fieldPrompts[fieldKey] || `Generate appropriate ${fieldLabel.toLowerCase()} for this character`;
    
    return `You are a professional character development expert. ${fieldPrompt}.

CHARACTER CONTEXT:
${characterContext}

${context}

Generate ${fieldLabel.toLowerCase()}:`;
  }
  
  private static buildWorldElementPrompt(
    elementType: string,
    context: any,
    additionalPrompt: string
  ): string {
    return `You are a world-building expert. Create a detailed ${elementType} that fits naturally into this world.

CONTEXT:
${JSON.stringify(context, null, 2)}

${additionalPrompt}

Generate ${elementType}:`;
  }
  
  private static buildCharacterContext(character: any): string {
    const name = character.name || 'Unknown';
    const race = character.race || 'Unknown';
    const role = character.role || 'Unknown';
    const background = character.background || '';
    const goals = character.goals || '';
    const personality = character.personality || '';
    
    return `=== CHARACTER ANALYSIS ===
Name: ${name}
Race/Species: ${race}
Role: ${role}
Background: ${background}
Personality: ${personality}
Goals: ${goals}

This character context should inform all generated content.`;
  }
}