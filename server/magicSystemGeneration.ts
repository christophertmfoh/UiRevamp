import { GoogleGenerativeAI } from '@google/generative-ai';
import type { Project, MagicSystem } from '../shared/schema';

interface MagicSystemGenerationOptions {
  systemType: string;
  complexity: string;
  customPrompt: string;
  source: string;
  restrictions: string;
}

interface MagicSystemGenerationContext {
  project: Project;
  existingCharacters?: any[];
  existingMagicSystems?: any[];
  generationOptions?: MagicSystemGenerationOptions;
}

function getGeminiClient() {
  const apiKey = process.env.GOOGLE_API_KEY_1 || process.env.GOOGLE_API_KEY;
  
  if (!apiKey) {
    throw new Error('Google API key not found. Please set GOOGLE_API_KEY_1 or GOOGLE_API_KEY environment variable.');
  }
  
  return new GoogleGenerativeAI(apiKey);
}

function buildProjectContext(context: MagicSystemGenerationContext): string {
  const { project, existingCharacters, existingMagicSystems, generationOptions } = context;
  
  let contextPrompt = `Create a magic system for the story project: "${project.name}"`;
  
  if (project.description) {
    contextPrompt += `\n\nProject Description: ${project.description}`;
  }
  
  if (project.genre) {
    contextPrompt += `\nGenre: ${project.genre}`;
  }
  
      contextPrompt += `\n- ${location.name}: ${location.description || 'A significant location'}`;
    });
  }
  
  if (existingCharacters && existingCharacters.length > 0) {
    contextPrompt += `\n\nExisting Characters:`;
    existingCharacters.slice(0, 5).forEach(character => {
      contextPrompt += `\n- ${character.name} (${character.role || 'character'})`;
    });
  }
  
  if (existingMagicSystems && existingMagicSystems.length > 0) {
    contextPrompt += `\n\nExisting Magic Systems:`;
    existingMagicSystems.slice(0, 5).forEach(system => {
      contextPrompt += `\n- ${system.name}: ${system.description || 'A magical system'}`;
    });
  }
  
  if (generationOptions) {
    if (generationOptions.systemType) {
      contextPrompt += `\n\nSystem Type: ${generationOptions.systemType}`;
    }
    if (generationOptions.complexity) {
      contextPrompt += `\nComplexity: ${generationOptions.complexity}`;
    }
    if (generationOptions.source) {
      contextPrompt += `\nSource: ${generationOptions.source}`;
    }
    if (generationOptions.restrictions) {
      contextPrompt += `\nRestrictions: ${generationOptions.restrictions}`;
    }
    if (generationOptions.customPrompt) {
      contextPrompt += `\n\nSpecial Instructions: ${generationOptions.customPrompt}`;
    }
  }
  
  return contextPrompt;
}

export async function generateContextualMagicSystem(
  context: MagicSystemGenerationContext
): Promise<Partial<MagicSystem>> {
  try {
    const projectContext = buildProjectContext(context);
    
    const client = getGeminiClient();
    const model = client.getGenerativeModel({ model: "gemini-1.5-flash" });
    
    const prompt = `You are a creative writing assistant specializing in magic system creation. Generate a detailed magic system that fits naturally into the provided story world.

Your response must be valid JSON in this exact format:
{
  "name": "Magic System Name",
  "description": "Comprehensive description of how this magic system works",
  "source": "Where the magical power comes from (internal, external, divine, etc.)",
  "mechanics": "The specific rules and mechanics of how magic is used",
  "limitations": "What restrictions or costs are involved in using this magic",
  "practitioners": "Who can use this magic and how they learn it",
  "manifestations": "How the magic appears and affects the world",
  "cultural_impact": "How this magic system affects society and culture",
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
      const magicData = JSON.parse(jsonString);
      
      const finalMagicSystem = {
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
        projectId: context.project.id,
        name: magicData.name || 'Generated Magic System',
        description: magicData.description || 'A mysterious form of magic with unknown origins.',
        source: magicData.source || '',
        mechanics: magicData.mechanics || '',
        limitations: magicData.limitations || '',
        practitioners: magicData.practitioners || '',
        manifestations: magicData.manifestations || '',
        cultural_impact: magicData.cultural_impact || '',
        tags: Array.isArray(magicData.tags) ? magicData.tags : [],
      };

      return finalMagicSystem;
      
    } catch (parseError) {
      const fallbackMagicSystem = {
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
        projectId: context.project.id,
        name: 'Generated Magic System',
        description: 'An ancient form of magic that flows through the very fabric of reality.',
        source: 'The magical energy stems from mysterious cosmic forces.',
        mechanics: 'Practitioners must channel their inner essence to manipulate reality.',
        limitations: 'Overuse can lead to exhaustion and dangerous backlash.',
        practitioners: 'Only those born with the gift can learn to wield this power.',
        manifestations: 'Magic appears as shimmering energy that bends the laws of nature.',
        cultural_impact: 'This magic has shaped entire civilizations and their beliefs.',
        tags: ['ancient', 'cosmic', 'powerful'],
      };

      return fallbackMagicSystem;
    }

  } catch (error) {
    console.error('Magic system generation error:', error);
    throw new Error('Failed to generate magic system with AI');
  }
}