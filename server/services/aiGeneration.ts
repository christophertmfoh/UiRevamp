/**
 * Unified AI Generation Service
 * Consolidates all AI generation functionality with consistent patterns
 */

import { GoogleGenAI, HarmCategory, HarmBlockThreshold } from "@google/genai";

// Initialize AI service with multiple fallback API keys
const getAIService = () => {
  const apiKeys = [
    process.env.GOOGLE_API_KEY_NEW,
    process.env.GOOGLE_API_KEY4, 
    process.env.GOOGLE_API_KEY,
    process.env.GEMINI_API_KEY
  ].filter(Boolean);
  
  if (apiKeys.length === 0) {
    throw new Error('No AI API keys available');
  }
  
  // Try keys in order
  const apiKey = apiKeys[0];
  console.log(`Using API key: ${apiKey?.substring(0, 10)}...`);
  return new GoogleGenAI({ apiKey });
};

// Standard AI configuration for consistent results
export const AI_CONFIG = {
  model: "gemini-2.5-flash",
  temperature: 0.8,
  maxOutputTokens: 200,
  candidateCount: 1,
  safetySettings: [
    { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH },
    { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH },
    { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH },
    { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH }
  ]
};

// Rate limiting state
const rateLimitState = {
  requests: [] as number[],
  maxRequests: 8,
  windowMs: 60000
};

export function checkRateLimit(): boolean {
  const now = Date.now();
  rateLimitState.requests = rateLimitState.requests.filter(
    time => now - time < rateLimitState.windowMs
  );
  
  if (rateLimitState.requests.length >= rateLimitState.maxRequests) {
    return false;
  }
  
  rateLimitState.requests.push(now);
  return true;
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
      
      // Handle safety filter blocking with ultra-simple prompts
      if (response.candidates?.[0]?.finishReason === 'SAFETY') {
        console.log(`Response blocked by safety filters, trying ultra-simple prompt`);
        
        // Extract just the character name and field type for minimal prompt
        const charName = prompt.includes('Character:') ? prompt.split('Character:')[1]?.split('(')[0]?.trim() || 'Character' : 'Character';
        const fieldType = prompt.includes('Task:') ? prompt.split('Task:')[1]?.split('\n')[0]?.toLowerCase().includes('nickname') ? 'nicknames' : 'content' : 'content';
        
        const ultraSimplePrompt = fieldType === 'nicknames' ? 
          `What are good nicknames for someone named ${charName}?` :
          `Describe ${charName}`;
          
        const safeResponse = await ai.models.generateContent({
          model: config.model,
          config: { 
            temperature: 0.5, 
            maxOutputTokens: 50,
            candidateCount: 1,
            safetySettings: [
              { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_NONE },
              { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_NONE },
              { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_NONE },
              { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_NONE }
            ]
          },
          contents: ultraSimplePrompt,
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
    
    // Simple, direct field-specific prompts that work better with safety filters
    const fieldPrompts: Record<string, string> = {
      nicknames: `Generate 2-3 appropriate nicknames for ${character.name}. Return only the nicknames, separated by commas.`,
      aliases: `Generate 1-2 suitable aliases or code names for ${character.name}. Return only the aliases, separated by commas.`,
      title: `Generate an appropriate professional title for ${character.name}. Return only the title.`,
      personality: "Generate a personality description with specific traits and behavioral patterns",
      background: "Create a compelling backstory that explains how this character became who they are",
      goals: "Define clear, specific objectives that drive this character's actions",
      motivations: "Explain the deep emotional or psychological reasons behind their goals",
      talents: "List natural gifts and innate abilities this character was born with",
      skills: "Describe learned abilities and trained competencies",
      strengths: "Identify what this character excels at physically, mentally, and socially",
      flaws: "Create meaningful character flaws that create internal conflict and growth opportunities"
    };
    
    const prompt = fieldPrompts[fieldKey] || 
      `Generate appropriate ${fieldLabel.toLowerCase()} for this character.`;
    
    // Simplified prompt format that avoids safety filter triggers
    return `Character: ${character.name} (${character.race || 'Human'})
Role: ${character.role || 'Character'}

Task: ${prompt}

Response:`;
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