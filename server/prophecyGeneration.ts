import { GoogleGenerativeAI } from '@google/generative-ai';
import type { Project, Prophecy } from '../shared/schema';

interface ProphecyGenerationOptions {
  prophecyType: string;
  scope: string;
  customPrompt: string;
  clarity: string;
  origin: string;
}

interface ProphecyGenerationContext {
  project: Project;
  locations?: any[];
  existingCharacters?: any[];
  existingProphecies?: any[];
  generationOptions?: ProphecyGenerationOptions;
}

function getGeminiClient() {
  const apiKey = process.env.GOOGLE_API_KEY_1 || process.env.GOOGLE_API_KEY;
  
  if (!apiKey) {
    throw new Error('Google API key not found. Please set GOOGLE_API_KEY_1 or GOOGLE_API_KEY environment variable.');
  }
  
  return new GoogleGenerativeAI(apiKey);
}

function buildProjectContext(context: ProphecyGenerationContext): string {
  const { project, locations, existingCharacters, existingProphecies, generationOptions } = context;
  
  let contextPrompt = `Create a prophecy for the story project: "${project.name}"`;
  
  if (project.description) {
    contextPrompt += `\n\nProject Description: ${project.description}`;
  }
  
  if (project.genre) {
    contextPrompt += `\nGenre: ${project.genre}`;
  }
  
  if (existingProphecies && existingProphecies.length > 0) {
    contextPrompt += `\n\nExisting Prophecies:`;
    existingProphecies.slice(0, 5).forEach(prophecy => {
      contextPrompt += `\n- ${prophecy.name}: ${prophecy.description || 'A prophecy in this world'}`;
    });
  }
  
  if (generationOptions) {
    if (generationOptions.prophecyType) {
      contextPrompt += `\n\nProphecy Type: ${generationOptions.prophecyType}`;
    }
    if (generationOptions.scope) {
      contextPrompt += `\nScope: ${generationOptions.scope}`;
    }
    if (generationOptions.clarity) {
      contextPrompt += `\nClarity: ${generationOptions.clarity}`;
    }
    if (generationOptions.origin) {
      contextPrompt += `\nOrigin: ${generationOptions.origin}`;
    }
    if (generationOptions.customPrompt) {
      contextPrompt += `\n\nSpecial Instructions: ${generationOptions.customPrompt}`;
    }
  }
  
  return contextPrompt;
}

export async function generateContextualProphecy(
  context: ProphecyGenerationContext
): Promise<Partial<Prophecy>> {
  try {
    const projectContext = buildProjectContext(context);
    
    const client = getGeminiClient();
    const model = client.getGenerativeModel({ model: "gemini-1.5-flash" });
    
    const prompt = `You are a creative writing assistant specializing in prophecy creation. Generate a detailed prophecy that fits naturally into the provided story world.

Your response must be valid JSON in this exact format:
{
  "name": "Prophecy Name or Title",
  "text": "The actual prophetic text or verse",
  "description": "Explanation of what this prophecy means or refers to",
  "origin": "Who spoke or wrote this prophecy and when",
  "interpretation": "How different people understand or interpret this prophecy",
  "fulfillment": "Signs or conditions for the prophecy to come true",
  "impact": "How this prophecy affects people and events in the world",
  "status": "Whether it's fulfilled, pending, or disputed",
  "symbols": "Important symbolic elements or metaphors used",
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
      const prophecyData = JSON.parse(jsonString);
      
      const finalProphecy = {
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
        projectId: context.project.id,
        name: prophecyData.name || 'Generated Prophecy',
        text: prophecyData.text || 'A foretelling of events yet to come.',
        origin: prophecyData.origin || '',
        interpretation: prophecyData.interpretation || '',
        fulfillment: prophecyData.fulfillment || '',
        significance: prophecyData.impact || '',
        relatedEvents: [],
        relatedCharacters: [],
        status: prophecyData.status || '',
        tags: Array.isArray(prophecyData.tags) ? prophecyData.tags : [],
      };

      return finalProphecy;
      
    } catch (parseError) {
      const fallbackProphecy = {
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
        projectId: context.project.id,
        name: 'Generated Prophecy',
        text: 'When shadow and light converge, the chosen shall rise to restore balance.',
        origin: 'Spoken by the Oracle in ages past.',
        interpretation: 'Scholars debate its meaning, but many believe it speaks of coming trials.',
        fulfillment: 'Awaits the convergence of specific cosmic events.',
        significance: 'Influences the actions of both heroes and villains.',
        relatedEvents: [],
        relatedCharacters: [],
        status: 'Unfulfilled but showing signs of beginning.',
        tags: ['ancient', 'mystical', 'unfulfilled'],
      };

      return fallbackProphecy;
    }

  } catch (error) {
    console.error('Prophecy generation error:', error);
    throw new Error('Failed to generate prophecy with AI');
  }
}