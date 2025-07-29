/**
 * Unified AI Generation Service
 * Consolidates all AI generation functionality with consistent patterns
 */

import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize AI service with correct API key
const getAIService = () => {
  const apiKey = process.env.GEMINI_X || process.env.GOOGLE_API_KEY || process.env.GEMINI_API_KEY;
  console.log('🔑 Checking API keys:', {
    GEMINI_X: !!process.env.GEMINI_X,
    GOOGLE_API_KEY: !!process.env.GOOGLE_API_KEY,
    GEMINI_API_KEY: !!process.env.GEMINI_API_KEY
  });
  
  if (!apiKey) {
    console.error('❌ No AI API key found in environment variables');
    throw new Error('No AI API key available');
  }
  
  console.log('✅ Using API key:', apiKey.substring(0, 10) + '...');
  return new GoogleGenerativeAI(apiKey);
};

// Standard AI configuration for consistent results
export const AI_CONFIG = {
  model: "gemini-1.5-flash",
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

// Test function to verify AI setup
export async function testAIConnection(): Promise<boolean> {
  try {
    console.log('🧪 Testing AI connection...');
    const ai = getAIService();
    const model = ai.getGenerativeModel({ model: AI_CONFIG.model });
    
    const result = await model.generateContent({
      contents: [{ role: 'user', parts: [{ text: 'Say "AI test successful"' }] }],
      generationConfig: {
        temperature: 0.1,
        maxOutputTokens: 20,
      }
    });
    
    const response = await result.response;
    const text = response.text();
    console.log('🎉 AI test response:', text);
    return text.toLowerCase().includes('test') || text.toLowerCase().includes('successful');
  } catch (error) {
    console.error('❌ AI test failed:', error.message);
    return false;
  }
}

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
  const model = ai.getGenerativeModel({ model: config.model });
  
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      console.log(`AI attempt ${attempt + 1}/${maxRetries}`);
      
      const result = await model.generateContent({
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: config.temperature,
          maxOutputTokens: config.maxOutputTokens,
          candidateCount: config.candidateCount,
        },
        safetySettings: config.safetySettings
      });

      const response = await result.response;
      const content = response.text()?.trim() || '';
      
      // Handle safety filter blocking
      if (response.candidates?.[0]?.finishReason === 'SAFETY') {
        console.log(`Response blocked by safety filters, trying simpler prompt`);
        
        const safePrompt = `Generate appropriate content: ${prompt.substring(0, 100)}`;
        const safeResult = await model.generateContent({
          contents: [{ role: 'user', parts: [{ text: safePrompt }] }],
          generationConfig: { 
            temperature: 0.7, 
            maxOutputTokens: 100,
            candidateCount: 1,
          },
          safetySettings: config.safetySettings
        });
        
        const safeResponse = await safeResult.response;
        const safeContent = safeResponse.text()?.trim() || '';
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

/**
 * Generate a complete character from a descriptive prompt
 */
export async function generateCharacterFromPrompt(prompt: string): Promise<any> {
  try {
    console.log('🎭 Generating character from prompt:', prompt.substring(0, 100) + '...');
    
    const ai = getAIService();
    const model = ai.getGenerativeModel({ model: AI_CONFIG.model });
    
    const systemPrompt = `You are a creative character generator for storytelling. Generate a detailed character based on the user's description.

Return the response as a valid JSON object with the following structure:
{
  "name": "Character Name",
  "age": "Age or age range",
  "species": "Human/Elf/etc",
  "gender": "Gender",
  "physicalDescription": "Detailed physical appearance",
  "personality": "Key personality traits",
  "motivations": "What drives them",
  "fears": "What they fear",
  "backstory": "Their background story",
  "skills": "Notable abilities and skills",
  "flaws": "Character weaknesses",
  "goals": "What they want to achieve",
  "occupation": "Job or role",
  "relationships": "Important relationships",
  "quirks": "Unique characteristics",
  "secrets": "Hidden aspects",
  "voice": "How they speak",
  "mannerisms": "Physical habits",
  "clothing": "Style of dress",
  "equipment": "Important possessions",
  "strengths": "What they excel at",
  "weaknesses": "Areas of struggle"
}

Make the character compelling, three-dimensional, and suitable for storytelling. Ensure all fields are filled with relevant, creative content.`;

    const result = await model.generateContent({
      contents: [
        { role: 'system', parts: [{ text: systemPrompt }] },
        { role: 'user', parts: [{ text: prompt }] }
      ],
      generationConfig: {
        temperature: 0.8,
        maxOutputTokens: 2000,
        candidateCount: 1
      }
    });

    const responseText = result.response.text();
    console.log('🎭 Raw AI response:', responseText.substring(0, 200) + '...');
    
    // Try to parse JSON from the response
    let characterData;
    try {
      // Find JSON content in the response
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        characterData = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error('No JSON found in response');
      }
    } catch (parseError) {
      console.warn('🎭 Failed to parse AI response as JSON, using fallback structure');
      // Fallback: create a basic structure from the text
      characterData = {
        name: extractNameFromText(responseText) || 'Generated Character',
        physicalDescription: responseText.substring(0, 200),
        personality: 'Dynamically generated personality',
        backstory: 'Rich backstory created by AI',
        motivations: 'Compelling motivations',
        skills: 'Unique abilities and talents'
      };
    }
    
    console.log('🎭 Generated character:', characterData.name);
    return characterData;
    
  } catch (error) {
    console.error('❌ Error generating character:', error);
    throw new Error(`Character generation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Helper function to extract a name from text
 */
function extractNameFromText(text: string): string | null {
  // Simple name extraction patterns
  const namePatterns = [
    /name[:\s]+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)?)/i,
    /called[:\s]+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)?)/i,
    /^([A-Z][a-z]+(?:\s+[A-Z][a-z]+)?)/
  ];
  
  for (const pattern of namePatterns) {
    const match = text.match(pattern);
    if (match) {
      return match[1].trim();
    }
  }
  
  return null;
}