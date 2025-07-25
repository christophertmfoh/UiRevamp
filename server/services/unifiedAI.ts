/**
 * Unified AI Service - Central AI generation with optimized prompts and error handling
 * Consolidates all AI generation across character, world-building, and content systems
 */

import { GoogleGenAI, HarmCategory, HarmBlockThreshold } from "@google/genai";

// Centralized AI configuration with optimized settings
export const UNIFIED_AI_CONFIG = {
  model: "gemini-2.5-flash",
  temperature: 0.8,
  maxOutputTokens: 300,
  safetySettings: [
    { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH },
    { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH },
    { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH },
    { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH }
  ]
};

// API key management with automatic fallback
const getOptimizedAIService = () => {
  const apiKeys = [
    process.env.GOOGLE_API_KEY_NEW,
    process.env.GOOGLE_API_KEY4, 
    process.env.GOOGLE_API_KEY,
    process.env.GEMINI_API_KEY
  ].filter(Boolean);
  
  if (apiKeys.length === 0) {
    throw new Error('No AI API keys available');
  }
  
  const apiKey = apiKeys[0];
  return new GoogleGenAI({ apiKey });
};

// Enhanced generation with smart retry and safety handling
export async function generateContentUnified(
  prompt: string,
  config: Partial<typeof UNIFIED_AI_CONFIG> = {}
): Promise<string> {
  const ai = getOptimizedAIService();
  const finalConfig = { ...UNIFIED_AI_CONFIG, ...config };
  
  try {
    const response = await ai.models.generateContent({
      model: finalConfig.model,
      contents: prompt,
      config: {
        temperature: finalConfig.temperature,
        maxOutputTokens: finalConfig.maxOutputTokens,
        safetySettings: finalConfig.safetySettings,
      },
    });

    const content = response.text?.trim();
    
    if (content && content.length > 5) {
      return content;
    }
    
    // If response is blocked or empty, try ultra-simple prompt
    console.log('Empty response, trying ultra-simple prompt');
    const ultraSimplePrompt = prompt.includes('nicknames') ? 'List nicknames' : 
                             prompt.includes('personality') ? 'Describe personality' :
                             prompt.includes('goals') ? 'List goals' : 'Generate content';
    
    const fallbackResponse = await ai.models.generateContent({
      model: finalConfig.model,
      contents: ultraSimplePrompt,
      config: {
        temperature: 0.6,
        maxOutputTokens: 50,
        safetySettings: [
          { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_NONE },
          { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_NONE },
          { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_NONE },
          { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_NONE }
        ],
      },
    });
    
    const fallbackContent = fallbackResponse.text?.trim();
    if (fallbackContent && fallbackContent.length > 2) {
      console.log(`Ultra-simple prompt succeeded: ${fallbackContent}`);
      return fallbackContent;
    }
    
    throw new Error('Unable to generate content');
    
  } catch (error) {
    console.error('AI generation failed:', error);
    throw error;
  }
}

// Optimized prompts for different content types
export const PROMPT_TEMPLATES = {
  characterField: (fieldKey: string, fieldLabel: string, character: any) => {
    const name = character?.name || 'Character';
    const context = `${character?.race || 'Human'} ${character?.class || character?.profession || 'character'}`;
    
    const fieldPrompts: Record<string, string> = {
      nicknames: `List 3 creative nicknames for ${name}, a ${context}. Format as quoted list: "Nick1", "Nick2", "Nick3"`,
      title: `Create a fitting title or epithet for ${name}, a ${context}`,
      aliases: `Create 2 aliases for ${name}, a ${context}. Format as quoted list: "Alias1", "Alias2"`,
      personality: `Describe the personality of ${name}, a ${context}. Include traits, quirks, and behavior patterns`,
      backstory: `Write a compelling backstory for ${name}, a ${context}. Explain their past and how they became who they are`,
      goals: `What are the primary goals and motivations of ${name}, a ${context}?`,
      skills: `List the key skills and abilities of ${name}, a ${context}`,
      flaws: `What are the character flaws and weaknesses of ${name}, a ${context}?`
    };
    
    return fieldPrompts[fieldKey] || `Generate ${fieldLabel.toLowerCase()} for ${name}, a ${context}`;
  },
  
  worldElement: (elementType: string, context: any) => {
    const templates: Record<string, string> = {
      location: `Create a detailed location for a story. Include description, atmosphere, and notable features`,
      faction: `Design an interesting faction or organization. Include goals, structure, and influence`,
      item: `Generate a unique item with special properties, history, and significance`,
      magicsystem: `Create a magic system with clear rules, limitations, and cultural impact`,
      prophecy: `Write a cryptic but meaningful prophecy that could drive story events`,
      theme: `Develop a story theme with depth and narrative significance`
    };
    
    return templates[elementType] || `Create a ${elementType} for a story`;
  }
};

// Enhanced character field generation
export async function generateCharacterField(
  fieldKey: string,
  fieldLabel: string,
  character: any
): Promise<string> {
  const prompt = PROMPT_TEMPLATES.characterField(fieldKey, fieldLabel, character);
  return generateContentUnified(prompt);
}

// World element generation
export async function generateWorldElement(
  elementType: string,
  context: any = {}
): Promise<string> {
  const prompt = PROMPT_TEMPLATES.worldElement(elementType, context);
  return generateContentUnified(prompt, { maxOutputTokens: 500 });
}

export default {
  generateContentUnified,
  generateCharacterField,
  generateWorldElement,
  UNIFIED_AI_CONFIG,
  PROMPT_TEMPLATES
};