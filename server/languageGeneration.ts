import { GoogleGenerativeAI } from '@google/generative-ai';
import type { Project, Language } from '../shared/schema';

interface LanguageGenerationOptions {
  languageType: string;
  complexity: string;
  customPrompt: string;
  origin: string;
  speakers: string;
}

interface LanguageGenerationContext {
  project: Project;
  locations?: any[];
  existingCharacters?: any[];
  existingLanguages?: any[];
  generationOptions?: LanguageGenerationOptions;
}

function getGeminiClient() {
  const apiKey = process.env.GOOGLE_API_KEY_1 || process.env.GOOGLE_API_KEY;
  
  if (!apiKey) {
    throw new Error('Google API key not found. Please set GOOGLE_API_KEY_1 or GOOGLE_API_KEY environment variable.');
  }
  
  return new GoogleGenerativeAI(apiKey);
}

function buildProjectContext(context: LanguageGenerationContext): string {
  const { project, locations, existingCharacters, existingLanguages, generationOptions } = context;
  
  let contextPrompt = `Create a language for the story project: "${project.name}"`;
  
  if (project.description) {
    contextPrompt += `\n\nProject Description: ${project.description}`;
  }
  
  if (project.genre) {
    contextPrompt += `\nGenre: ${project.genre}`;
  }
  
  if (existingLanguages && existingLanguages.length > 0) {
    contextPrompt += `\n\nExisting Languages:`;
    existingLanguages.slice(0, 5).forEach(lang => {
      contextPrompt += `\n- ${lang.name}: ${lang.description || 'A language in this world'}`;
    });
  }
  
  if (generationOptions) {
    if (generationOptions.languageType) {
      contextPrompt += `\n\nLanguage Type: ${generationOptions.languageType}`;
    }
    if (generationOptions.complexity) {
      contextPrompt += `\nComplexity: ${generationOptions.complexity}`;
    }
    if (generationOptions.origin) {
      contextPrompt += `\nOrigin: ${generationOptions.origin}`;
    }
    if (generationOptions.speakers) {
      contextPrompt += `\nSpeakers: ${generationOptions.speakers}`;
    }
    if (generationOptions.customPrompt) {
      contextPrompt += `\n\nSpecial Instructions: ${generationOptions.customPrompt}`;
    }
  }
  
  return contextPrompt;
}

export async function generateContextualLanguage(
  context: LanguageGenerationContext
): Promise<Partial<Language>> {
  try {
    const projectContext = buildProjectContext(context);
    
    const client = getGeminiClient();
    const model = client.getGenerativeModel({ model: "gemini-1.5-flash" });
    
    const prompt = `You are a creative writing assistant specializing in language creation. Generate a detailed constructed language that fits naturally into the provided story world.

Your response must be valid JSON in this exact format:
{
  "name": "Language Name",
  "description": "Overview of what this language is and represents",
  "speakers": "Who speaks this language and where",
  "origins": "How this language developed historically",
  "characteristics": "Unique features, sounds, and linguistic properties", 
  "writing_system": "How the language is written (if it has writing)",
  "cultural_role": "The language's importance in society and culture",
  "examples": "Sample words, phrases, or expressions in this language",
  "status": "Current state of the language (thriving, dying, secret, etc.)",
  "tags": ["tag1", "tag2", "tag3"]
}

${projectContext}`;

    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();
    
    let cleanText = text.replace(/```json\s*\n?/g, '').replace(/```\s*$/g, '');
    const jsonMatch = cleanText.match(/\{[\s\S]*\}/);
    
    if (!jsonMatch) {
      throw new Error('No valid JSON found in response');
    }
    
    let jsonString = jsonMatch[0].replace(/[""]/g, '"').replace(/['']/g, "'");
    
    try {
      const languageData = JSON.parse(jsonString);
      
      const finalLanguage = {
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
        projectId: context.project.id,
        name: languageData.name || 'Generated Language',
        family: languageData.family || '',
        speakers: Array.isArray(languageData.speakers) ? languageData.speakers : languageData.speakers ? [languageData.speakers] : [],
        description: languageData.description || 'An ancient language with mysterious origins.',
        script: languageData.writing_system || '',
        grammar: languageData.characteristics || '',
        vocabulary: languageData.vocabulary || '',
        culturalSignificance: languageData.cultural_role || '',
        examples: languageData.examples || '',
        tags: Array.isArray(languageData.tags) ? languageData.tags : [],
      };

      return finalLanguage;
      
    } catch (parseError) {
      const fallbackLanguage = {
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
        projectId: context.project.id,
        name: 'Generated Language',
        family: 'Ancient Family',
        speakers: ['Scholars', 'Mystics', 'Ancient bloodlines'],
        description: 'An ancient tongue spoken by few in the modern age.',
        script: 'Written in flowing script with symbolic elements.',
        grammar: 'Melodic with complex grammar and magical undertones.',
        vocabulary: 'Rich vocabulary with many archaic terms.',
        culturalSignificance: 'Used in ritual, scholarship, and formal ceremonies.',
        examples: 'Common phrases include greetings and blessings.',
        tags: ['ancient', 'mystical', 'formal'],
      };

      return fallbackLanguage;
    }

  } catch (error) {
    console.error('Language generation error:', error);
    throw new Error('Failed to generate language with AI');
  }
}