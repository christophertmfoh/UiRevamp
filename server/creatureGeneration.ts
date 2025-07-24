import { GoogleGenerativeAI } from '@google/generative-ai';
import type { Project, Creature } from '../shared/schema';

interface CreatureGenerationOptions {
  creatureType: string;
  habitat: string;
  customPrompt: string;
  rarity: string;
  size: string;
}

interface CreatureGenerationContext {
  project: Project;
  locations?: any[];
  existingCharacters?: any[];  
  existingCreatures?: any[];
  generationOptions?: CreatureGenerationOptions;
}

function getGeminiClient() {
  const apiKey = process.env.GOOGLE_API_KEY_1 || process.env.GOOGLE_API_KEY;
  
  if (!apiKey) {
    throw new Error('Google API key not found. Please set GOOGLE_API_KEY_1 or GOOGLE_API_KEY environment variable.');
  }
  
  return new GoogleGenerativeAI(apiKey);
}

function buildProjectContext(context: CreatureGenerationContext): string {
  const { project, locations, existingCharacters, existingCreatures, generationOptions } = context;
  
  let contextPrompt = `Create a creature for the story project: "${project.name}"`;
  
  if (project.description) {
    contextPrompt += `\n\nProject Description: ${project.description}`;
  }
  
  if (project.genre) {
    contextPrompt += `\nGenre: ${project.genre}`;
  }
  
  if (locations && locations.length > 0) {
    contextPrompt += `\n\nKey Locations:`;
    locations.slice(0, 5).forEach(location => {
      contextPrompt += `\n- ${location.name}: ${location.description || 'A significant location'}`;
    });
  }
  
  if (existingCreatures && existingCreatures.length > 0) {
    contextPrompt += `\n\nExisting Creatures:`;
    existingCreatures.slice(0, 5).forEach(creature => {
      contextPrompt += `\n- ${creature.name}: ${creature.description || 'A creature in this world'}`;
    });
  }
  
  if (generationOptions) {
    if (generationOptions.creatureType) {
      contextPrompt += `\n\nCreature Type: ${generationOptions.creatureType}`;
    }
    if (generationOptions.habitat) {
      contextPrompt += `\nHabitat: ${generationOptions.habitat}`;
    }
    if (generationOptions.size) {
      contextPrompt += `\nSize: ${generationOptions.size}`;
    }
    if (generationOptions.rarity) {
      contextPrompt += `\nRarity: ${generationOptions.rarity}`;
    }
    if (generationOptions.customPrompt) {
      contextPrompt += `\n\nSpecial Instructions: ${generationOptions.customPrompt}`;
    }
  }
  
  return contextPrompt;
}

export async function generateContextualCreature(
  context: CreatureGenerationContext
): Promise<Partial<Creature>> {
  try {
    const projectContext = buildProjectContext(context);
    
    const client = getGeminiClient();
    const model = client.getGenerativeModel({ model: "gemini-1.5-flash" });
    
    const prompt = `You are a creative writing assistant specializing in creature creation. Generate a detailed creature that fits naturally into the provided story world.

Your response must be valid JSON in this exact format:
{
  "name": "Creature Name",
  "description": "Detailed physical description of the creature",
  "habitat": "Where this creature lives and thrives",
  "behavior": "How the creature acts and behaves",
  "abilities": "Special powers or notable capabilities",
  "diet": "What the creature eats and how it feeds",
  "intelligence": "The creature's level of intelligence and awareness",
  "cultural_significance": "How this creature is viewed by civilizations",
  "threats": "What dangers this creature poses or faces",
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
      const creatureData = JSON.parse(jsonString);
      
      const finalCreature = {
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
        projectId: context.project.id,
        name: creatureData.name || 'Generated Creature',
        species: creatureData.species || '',
        classification: creatureData.classification || '',
        description: creatureData.description || 'A mysterious creature with unknown origins.',
        habitat: creatureData.habitat || '',
        behavior: creatureData.behavior || '',
        abilities: Array.isArray(creatureData.abilities) ? creatureData.abilities : creatureData.abilities ? [creatureData.abilities] : [],
        weaknesses: [],
        threat: creatureData.threats || '',
        significance: creatureData.cultural_significance || '',
        tags: Array.isArray(creatureData.tags) ? creatureData.tags : [],
      };

      return finalCreature;
      
    } catch (parseError) {
      const fallbackCreature = {
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
        projectId: context.project.id,
        name: 'Generated Creature',
        species: 'Unknown Species',
        classification: 'Mystical Beast',
        description: 'A mysterious beast that roams the wild places of the world.',
        habitat: 'Dense forests and shadowy valleys.',
        behavior: 'Elusive and intelligent, avoiding contact with civilization.',
        abilities: ['Supernatural senses', 'Uncanny stealth'],
        weaknesses: [],
        threat: 'A formidable predator when threatened or hungry.',
        significance: 'Regarded with both fear and reverence by local peoples.',
        tags: ['mysterious', 'intelligent', 'dangerous'],
      };

      return fallbackCreature;
    }

  } catch (error) {
    console.error('Creature generation error:', error);
    throw new Error('Failed to generate creature with AI');
  }
}