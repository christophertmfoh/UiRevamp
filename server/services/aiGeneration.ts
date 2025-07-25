/**
 * Unified AI Generation Service
 * Consolidates all AI generation functionality with consistent patterns
 */

import { GoogleGenAI } from "@google/genai";

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
    { category: "HARM_CATEGORY_HARASSMENT" as any, threshold: "BLOCK_ONLY_HIGH" as any },
    { category: "HARM_CATEGORY_HATE_SPEECH" as any, threshold: "BLOCK_ONLY_HIGH" as any },
    { category: "HARM_CATEGORY_SEXUALLY_EXPLICIT" as any, threshold: "BLOCK_ONLY_HIGH" as any },
    { category: "HARM_CATEGORY_DANGEROUS_CONTENT" as any, threshold: "BLOCK_ONLY_HIGH" as any }
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

  // ================================
  // LOCATION FIELD ENHANCEMENT
  // ================================

  static async enhanceLocationField(
    location: any,
    fieldKey: string,
    fieldLabel: string,
    context: string = ''
  ): Promise<string> {
    const prompt = this.buildLocationFieldPrompt(location, fieldKey, fieldLabel, context);
    const result = await generateWithRetry(prompt);
    return result;
  }

  private static buildLocationFieldPrompt(
    location: any,
    fieldKey: string,
    fieldLabel: string,
    context: string
  ): string {
    const locationContext = this.buildLocationContext(location);
    
    const fieldPrompts: Record<string, string> = {
      // Identity fields
      name: "Generate a memorable, evocative name that fits the location type and world setting",
      nicknames: "Create believable nicknames locals would use for this place",
      locationType: "Determine the most appropriate type classification for this location",
      description: "Write a vivid, immersive description that captures the essence and atmosphere",
      
      // Physical & Geographic fields  
      physicalDescription: "Create detailed physical appearance with specific visual elements",
      geography: "Describe geographic features, positioning, and natural characteristics",
      terrain: "Detail the land features, elevation changes, and ground composition",
      climate: "Explain weather patterns, seasonal changes, and atmospheric conditions",
      atmosphere: "Capture the mood, feeling, and emotional impact of being in this place",
      
      // Architecture & Infrastructure
      architecture: "Describe building styles, construction methods, and architectural features",
      buildings: "Detail specific structures, their purposes, and notable characteristics",
      layout: "Explain the spatial organization and how areas connect to each other",
      districts: "Identify different areas or neighborhoods within the location",
      
      // Society & Culture
      population: "Describe the inhabitants, their numbers, and demographic composition",
      culture: "Detail customs, traditions, and way of life of the people here",
      governance: "Explain how the location is ruled, organized, and administered",
      
      // History & Significance
      history: "Create a rich backstory explaining how this place came to be",
      founding: "Tell the origin story of how this location was established",
      significance: "Explain why this location is important to the story and world",
      legends: "Generate myths, tales, and folklore associated with this place",
      
      // Story Elements
      narrativeRole: "Define this location's function and purpose in the story structure",
      mysteries: "Create intriguing secrets or unexplained phenomena hidden here",
      scenes: "Describe potential dramatic events or encounters that could happen here"
    };
    
    const fieldPrompt = fieldPrompts[fieldKey] || `Generate appropriate ${fieldLabel.toLowerCase()} for this location`;
    
    return `You are a professional world-building expert. ${fieldPrompt}.

LOCATION CONTEXT:
${locationContext}

${context}

Generate ${fieldLabel.toLowerCase()}:`;
  }
  
  private static buildLocationContext(location: any): string {
    const name = location.name || 'Unknown Location';
    const locationType = location.locationType || 'Unknown';
    const description = location.description || '';
    const atmosphere = location.atmosphere || '';
    const history = location.history || '';
    const significance = location.significance || '';
    
    return `=== LOCATION ANALYSIS ===
Name: ${name}
Type: ${locationType}
Description: ${description}
Atmosphere: ${atmosphere}
History: ${history}
Significance: ${significance}

This location context should inform all generated content.`;
  }
}