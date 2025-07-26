import { GoogleGenerativeAI } from '@google/generative-ai';
import type { Project, Culture } from '../shared/schema';

interface CultureGenerationOptions {
  cultureType: string;
  development: string;
  customPrompt: string;
  values: string;
  technology: string;
}

interface CultureGenerationContext {
  project: Project;
  existingCharacters?: any[];
  existingCultures?: any[];
  generationOptions?: CultureGenerationOptions;
}

function getGeminiClient() {
  const apiKey = process.env.GOOGLE_API_KEY_1 || process.env.GOOGLE_API_KEY;
  
  if (!apiKey) {
    throw new Error('Google API key not found. Please set GOOGLE_API_KEY_1 or GOOGLE_API_KEY environment variable.');
  }
  
  return new GoogleGenerativeAI(apiKey);
}

function buildProjectContext(context: CultureGenerationContext): string {
  const { project, existingCharacters, existingCultures, generationOptions } = context;
  
  let contextPrompt = `Create a culture for the story project: "${project.name}"`;
  
  if (project.description) {
    contextPrompt += `\n\nProject Description: ${project.description}`;
  }
  
  if (project.genre) {
    contextPrompt += `\nGenre: ${project.genre}`;
  }
  
    });
  }
  
  if (existingCultures && existingCultures.length > 0) {
    contextPrompt += `\n\nExisting Cultures:`;
    existingCultures.slice(0, 5).forEach(culture => {
      contextPrompt += `\n- ${culture.name}: ${culture.description || 'A culture in this world'}`;
    });
  }
  
  if (generationOptions) {
    if (generationOptions.cultureType) {
      contextPrompt += `\n\nCulture Type: ${generationOptions.cultureType}`;
    }
    if (generationOptions.development) {
      contextPrompt += `\nDevelopment Level: ${generationOptions.development}`;
    }
    if (generationOptions.values) {
      contextPrompt += `\nCore Values: ${generationOptions.values}`;
    }
    if (generationOptions.technology) {
      contextPrompt += `\nTechnology Level: ${generationOptions.technology}`;
    }
    if (generationOptions.customPrompt) {
      contextPrompt += `\n\nSpecial Instructions: ${generationOptions.customPrompt}`;
    }
  }
  
  return contextPrompt;
}

export async function generateContextualCulture(
  context: CultureGenerationContext
): Promise<Partial<Culture>> {
  try {
    const projectContext = buildProjectContext(context);
    
    const client = getGeminiClient();
    const model = client.getGenerativeModel({ model: "gemini-1.5-flash" });
    
    const prompt = `You are a creative writing assistant specializing in culture creation. Generate a detailed culture that fits naturally into the provided story world.

Your response must be valid JSON in this exact format:
{
  "name": "Culture Name",
  "description": "Overview of this culture and its people",
  "values": "Core beliefs, principles, and values this culture holds",
  "traditions": "Important customs, rituals, and traditional practices",
  "social_structure": "How society is organized and governed",
  "economy": "How they make a living and organize trade",
  "arts": "Cultural expressions through art, music, literature, etc.",
  "religion": "Spiritual beliefs and religious practices",
  "technology": "Level of technological development and notable innovations",
  "challenges": "Current struggles or conflicts this culture faces",
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
      const cultureData = JSON.parse(jsonString);
      
      const finalCulture = {
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
        projectId: context.project.id,
        name: cultureData.name || 'Generated Culture',
        description: cultureData.description || 'A unique culture with rich traditions.',
        values: Array.isArray(cultureData.values) ? cultureData.values : cultureData.values ? [cultureData.values] : [],
        traditions: cultureData.traditions || '',
        customs: cultureData.customs || '',
        religion: cultureData.religion || '',
        government: cultureData.social_structure || '',
        economy: cultureData.economy || '',
        technology: cultureData.technology || '',
        conflicts: cultureData.challenges || '',
        tags: Array.isArray(cultureData.tags) ? cultureData.tags : [],
      };

      return finalCulture;
      
    } catch (parseError) {
      const fallbackCulture = {
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
        projectId: context.project.id,
        name: 'Generated Culture',
        description: 'A proud people with ancient traditions and strong community bonds.',
        values: ['Honor', 'Wisdom', 'Harmony with nature'],
        traditions: 'Seasonal festivals and coming-of-age ceremonies mark important moments.',
        customs: 'Daily rituals honoring ancestors and nature.',
        religion: 'Revere ancestral spirits and natural forces.',
        government: 'Organized around extended family groups with elected elders.',
        economy: 'Skilled artisans and traders known for their craftsmanship.',
        technology: 'Advanced metalworking with sustainable practices.',
        conflicts: 'Balancing tradition with changing world circumstances.',
        tags: ['traditional', 'artistic', 'community-focused'],
      };

      return fallbackCulture;
    }

  } catch (error) {
    console.error('Culture generation error:', error);
    throw new Error('Failed to generate culture with AI');
  }
}