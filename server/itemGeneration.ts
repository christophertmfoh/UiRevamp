import { GoogleGenerativeAI } from '@google/generative-ai';
import type { Project, Item } from '../shared/schema';

interface ItemGenerationOptions {
  itemType: string;
  rarity: string;
  customPrompt: string;
  powers: string;
  category: string;
}

interface ItemGenerationContext {
  project: Project;
  existingCharacters?: any[];
  existingItems?: any[];
  generationOptions?: ItemGenerationOptions;
}

function getGeminiClient() {
  const apiKey = process.env.GOOGLE_API_KEY_1 || process.env.GOOGLE_API_KEY;
  
  if (!apiKey) {
    throw new Error('Google API key not found. Please set GOOGLE_API_KEY_1 or GOOGLE_API_KEY environment variable.');
  }
  
  return new GoogleGenerativeAI(apiKey);
}

function buildProjectContext(context: ItemGenerationContext): string {
  const { project, existingCharacters, existingItems, generationOptions } = context;
  
  let contextPrompt = `Create an item for the story project: "${project.name}"`;
  
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
  
  if (existingItems && existingItems.length > 0) {
    contextPrompt += `\n\nExisting Items (create something that fits this world):`;
    existingItems.slice(0, 5).forEach(item => {
      contextPrompt += `\n- ${item.name}: ${item.description || 'A significant item'}`;
    });
  }
  
  if (generationOptions) {
    if (generationOptions.itemType) {
      contextPrompt += `\n\nItem Type: ${generationOptions.itemType}`;
    }
    if (generationOptions.category) {
      contextPrompt += `\nCategory: ${generationOptions.category}`;
    }
    if (generationOptions.rarity) {
      contextPrompt += `\nRarity: ${generationOptions.rarity}`;
    }
    if (generationOptions.powers) {
      contextPrompt += `\nPowers: ${generationOptions.powers}`;
    }
    if (generationOptions.customPrompt) {
      contextPrompt += `\n\nSpecial Instructions: ${generationOptions.customPrompt}`;
    }
  }
  
  return contextPrompt;
}

export async function generateContextualItem(
  context: ItemGenerationContext
): Promise<Partial<Item>> {
  try {
    const projectContext = buildProjectContext(context);
    
    const client = getGeminiClient();
    const model = client.getGenerativeModel({ model: "gemini-1.5-flash" });
    
    const prompt = `You are a creative writing assistant specializing in item creation. Generate a detailed item that fits naturally into the provided story world.

Your response must be valid JSON in this exact format:
{
  "name": "Item Name",
  "description": "Detailed description of the item's appearance and nature",
  "history": "Rich background of how this item came to be and its past",
  "powers": "What magical or special abilities this item possesses",
  "significance": "Why this item is important to the story or world",
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
      const itemData = JSON.parse(jsonString);
      
      const finalItem = {
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
        projectId: context.project.id,
        name: itemData.name || 'Generated Item',
        description: itemData.description || 'A mysterious item with unknown properties.',
        history: itemData.history || '',
        powers: itemData.powers || '',
        significance: itemData.significance || '',
        tags: Array.isArray(itemData.tags) ? itemData.tags : [],
      };

      return finalItem;
      
    } catch (parseError) {
      const fallbackItem = {
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
        projectId: context.project.id,
        name: 'Generated Item',
        description: 'A mysterious artifact with unknown origins.',
        history: 'Its past is shrouded in mystery and legend.',
        powers: 'Its true capabilities remain to be discovered.',
        significance: 'This item holds great importance to the story.',
        tags: ['mysterious', 'artifact', 'powerful'],
      };

      return fallbackItem;
    }

  } catch (error) {
    console.error('Item generation error:', error);
    throw new Error('Failed to generate item with AI');
  }
}