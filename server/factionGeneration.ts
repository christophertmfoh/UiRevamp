import { GoogleGenerativeAI } from '@google/generative-ai';
import type { Project, Faction } from '../shared/schema';

interface FactionGenerationOptions {
  factionType: string;
  role: string;
  customPrompt: string;
  goals: string;
  scale: string;
}

interface FactionGenerationContext {
  project: Project;
  existingCharacters?: any[];
  existingFactions?: any[];
  generationOptions?: FactionGenerationOptions;
}

function getGeminiClient() {
  const apiKey = process.env.GOOGLE_API_KEY_1 || process.env.GOOGLE_API_KEY;
  
  if (!apiKey) {
    throw new Error('Google API key not found. Please set GOOGLE_API_KEY_1 or GOOGLE_API_KEY environment variable.');
  }
  
  return new GoogleGenerativeAI(apiKey);
}

function buildProjectContext(context: FactionGenerationContext): string {
  const { project, existingCharacters, existingFactions, generationOptions } = context;
  
  let contextPrompt = `Create a faction for the story project: "${project.name}"`;
  
  if (project.description) {
    contextPrompt += `\n\nProject Description: ${project.description}`;
  }
  
  if (project.genre) {
    contextPrompt += `\nGenre: ${project.genre}`;
  }
  
  if (project.type) {
    contextPrompt += `\nType: ${project.type}`;
  }
  
    });
  }
  
  if (existingCharacters && existingCharacters.length > 0) {
    contextPrompt += `\n\nExisting Characters in this story:`;
    existingCharacters.slice(0, 5).forEach(character => {
      contextPrompt += `\n- ${character.name} (${character.role || 'character'}): ${character.personality || character.backstory || 'An important character in the story'}`;
    });
  }
  
  if (existingFactions && existingFactions.length > 0) {
    contextPrompt += `\n\nExisting Factions (create something that could interact with these):`;
    existingFactions.slice(0, 5).forEach(faction => {
      contextPrompt += `\n- ${faction.name}: ${faction.description || 'A significant faction in the story'}`;
    });
  }
  
  // Add user-specified generation options
  if (generationOptions) {
    if (generationOptions.factionType) {
      contextPrompt += `\n\nFaction Type: ${generationOptions.factionType}`;
    }
    if (generationOptions.role) {
      contextPrompt += `\nRole: ${generationOptions.role}`;
    }
    if (generationOptions.scale) {
      contextPrompt += `\nScale: ${generationOptions.scale}`;
    }
    if (generationOptions.goals) {
      contextPrompt += `\nGoals: ${generationOptions.goals}`;
    }
    if (generationOptions.customPrompt) {
      contextPrompt += `\n\nSpecial Instructions: ${generationOptions.customPrompt}`;
    }
  }
  
  return contextPrompt;
}

export async function generateContextualFaction(
  context: FactionGenerationContext
): Promise<Partial<Faction>> {
  try {
    // Build context from project data
    const projectContext = buildProjectContext(context);
    
    const client = getGeminiClient();
    const model = client.getGenerativeModel({ model: "gemini-1.5-flash" });
    
    const prompt = `You are a creative writing assistant specializing in faction creation. Generate a fully-developed faction that fits naturally into the provided story world. The faction should feel authentic and integral to the story.

Your response must be valid JSON in this exact format. Use only regular double quotes, avoid smart quotes or special characters:
{
  "name": "Faction Name",
  "description": "Detailed description of what this faction is and represents",
  "goals": "What the faction seeks to achieve, both short-term and long-term objectives",
  "methods": "How they operate, their tactics, and approach to achieving their goals",
  "history": "Rich background explaining how this faction formed and evolved",
  "leadership": "Key leaders, structure, and how the faction is organized",
  "resources": "What assets, capabilities, and advantages they possess", 
  "relationships": "How they interact with other factions, groups, or individuals",
  "tags": ["tag1", "tag2", "tag3"]
}

IMPORTANT: Ensure all text within quotes is properly escaped. Avoid using quotes within the faction descriptions or use single quotes instead. Make sure the JSON is valid and complete.

${projectContext}`;

    console.log('Server: Sending faction prompt to Gemini');
    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();
    
    console.log('Server: Gemini faction response received:', text.substring(0, 200) + '...');
    
    // Clean and extract JSON from the response
    let cleanText = text;
    
    // Remove markdown code blocks if present
    cleanText = cleanText.replace(/```json\s*\n?/g, '').replace(/```\s*$/g, '');
    
    // Extract JSON from the response (in case there's extra text)
    const jsonMatch = cleanText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      console.error('Server: No JSON found in faction response:', text);
      throw new Error('No valid JSON found in response');
    }
    
    let jsonString = jsonMatch[0];
    
    // Fix common JSON issues
    jsonString = jsonString.replace(/[""]/g, '"');
    jsonString = jsonString.replace(/['']/g, "'");
    
    try {
      const factionData = JSON.parse(jsonString);
      console.log('Server: Successfully parsed faction data:', factionData);
      
      // Ensure required fields exist
      const finalFaction = {
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
        projectId: context.project.id,
        name: factionData.name || 'Generated Faction',
        description: factionData.description || 'A mysterious faction with hidden agendas.',
        goals: factionData.goals || '',
        methods: factionData.methods || '',
        history: factionData.history || '',
        leadership: factionData.leadership || '',
        resources: factionData.resources || '',
        relationships: factionData.relationships || '',
        tags: Array.isArray(factionData.tags) ? factionData.tags : [],
      };

      return finalFaction;
      
    } catch (parseError) {
      console.error('Server: Failed to parse faction JSON:', parseError);
      console.error('Server: Problematic JSON string:', jsonString);
      
      // Create fallback faction
      const fallbackFaction = {
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
        projectId: context.project.id,
        name: 'Generated Faction',
        description: 'A mysterious faction that emerged from the chaos of the world.',
        goals: 'To achieve their mysterious objectives through any means necessary.',
        methods: 'They operate with cunning and strategic planning.',
        history: 'Their origins are shrouded in mystery and legend.',
        leadership: 'Led by enigmatic figures who pull the strings from the shadows.',
        resources: 'They possess significant influence and hidden assets.',
        relationships: 'Their relationships with other groups are complex and ever-changing.',
        tags: ['mysterious', 'powerful', 'secretive'],
      };

      return fallbackFaction;
    }

  } catch (error) {
    console.error('Faction generation error:', error);
    throw new Error('Failed to generate faction with AI');
  }
}