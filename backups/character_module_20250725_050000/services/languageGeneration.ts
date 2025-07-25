import { GoogleGenerativeAI } from '@google/generative-ai';

export interface LanguageGenerationOptions {
  type?: string;
  style?: string;
  theme?: string;
  setting?: string;
  existingContext?: {
    characters?: any[];
    locations?: any[];
    [key: string]: any[];
  };
}

interface Language {
  name: string;
  description: string;
  [key: string]: any;
}

export async function generateContextualLanguage(
  projectName: string,
  projectDescription: string,
  options: LanguageGenerationOptions = {}
): Promise<Language> {
  const apiKey = import.meta.env.VITE_GOOGLE_API_KEY_1 || import.meta.env.VITE_GOOGLE_API_KEY;
  
  if (!apiKey) {
    throw new Error('Google API key not found. Please set VITE_GOOGLE_API_KEY_1 or VITE_GOOGLE_API_KEY in your environment variables.');
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

  const contextInfo = options.existingContext ? `
    Existing Characters: ${options.existingContext.characters?.map(c => `${c.name} (${c.role})`).join(', ') || 'None'}
    Existing Locations: ${options.existingContext.locations?.map(l => l.name).join(', ') || 'None'}
  ` : '';

  const prompt = `You are a creative writing assistant specializing in world-building. Create a detailed, original language for the project "${projectName}".

Project Description: ${projectDescription}

${module_pascal} Requirements:
- Type: ${options.type || 'appropriate for the story'}
- Style: ${options.style || 'fitting for the world'}
- Theme: ${options.theme || 'matches project tone'}

${contextInfo}

Generate a language that:
1. Fits seamlessly into the existing world context
2. Has rich, evocative details that spark imagination
3. Connects meaningfully to the story world
4. Is original and compelling

Return ONLY a JSON object with appropriate fields for a language.

Make it creative, original, and compelling!`;

  try {
    const result = await model.generateContent(prompt);
    const text = result.response.text();
    
    // Extract JSON from the response
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('No valid JSON found in the response');
    }
    
    const languageData = JSON.parse(jsonMatch[0]);
    
    return languageData as Language;
  } catch (error) {
    console.error('Language generation error:', error);
    throw new Error(`Failed to generate language: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}
