import { GoogleGenerativeAI } from '@google/generative-ai';
import type { Project, Character } from '../shared/schema';

interface CharacterGenerationOptions {
  characterType: string;
  role: string;
  customPrompt: string;
  personality: string;
  archetype: string;
}

interface CharacterGenerationContext {
  project: Project;
  locations: any[];
  existingCharacters: Character[];
  generationOptions?: CharacterGenerationOptions;
}

// Initialize Gemini client
function getGeminiClient(): GoogleGenerativeAI {
  const apiKey = process.env.GOOGLE_API_KEY || process.env.GEMINI_API_KEY;
  
  if (!apiKey) {
    throw new Error('Gemini API key is not configured. Please add GOOGLE_API_KEY or GEMINI_API_KEY to your environment variables.');
  }
  
  console.log('Server: Initializing Gemini client with API key found');
  return new GoogleGenerativeAI(apiKey);
}

export async function generateContextualCharacter(
  context: CharacterGenerationContext
): Promise<Partial<Character>> {
  try {
    // Build context from project data
    const projectContext = buildProjectContext(context);
    
    const client = getGeminiClient();
    const model = client.getGenerativeModel({ model: "gemini-1.5-flash" });
    
    const prompt = `You are a creative writing assistant specializing in character creation. Generate a fully-developed character that fits naturally into the provided story world. The character should feel authentic and integral to the story.

Your response must be valid JSON in this exact format:
{
  "name": "Character Name",
  "title": "Character Title or Epithet",
  "role": "protagonist/antagonist/supporting/etc",
  "class": "Character Class or Profession",
  "age": "Character Age",
  "race": "Character Race/Species",
  "oneLine": "One-sentence character description",
  "description": "Detailed physical description",
  "personality": "Personality traits and quirks",
  "backstory": "Character's background and history",
  "motivations": "What drives this character",
  "goals": "What they want to achieve",
  "fears": "What they're afraid of",
  "flaws": "Character weaknesses and flaws",
  "secrets": "Hidden aspects of the character",
  "skills": "Abilities and talents",
  "equipment": "Notable possessions or gear"
}

${projectContext}`;

    console.log('Server: Sending prompt to Gemini');
    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();
    
    console.log('Server: Gemini response received:', text.substring(0, 200) + '...');
    
    // Extract JSON from the response (in case there's extra text)
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      console.error('Server: No JSON found in response:', text);
      throw new Error('No valid JSON found in response');
    }
    
    const generatedData = JSON.parse(jsonMatch[0]);
    console.log('Server: Parsed character data successfully');
    
    return generatedData;
  } catch (error) {
    console.error('Server: Error generating character:', error);
    throw new Error('Failed to generate character. Please try again.');
  }
}

function buildProjectContext(context: CharacterGenerationContext): string {
  const { project, locations, existingCharacters, generationOptions } = context;
  
  let contextPrompt = `Create a character for the story project: "${project.title || project.name}"`;
  
  if (project.description) {
    contextPrompt += `\n\nProject Description: ${project.description}`;
  }
  
  if (project.genre) {
    contextPrompt += `\nGenre: ${project.genre}`;
  }
  
  if (project.type) {
    contextPrompt += `\nType: ${project.type}`;
  }
  
  if (locations && locations.length > 0) {
    contextPrompt += `\n\nKey Locations in this world:`;
    locations.slice(0, 5).forEach(location => {
      contextPrompt += `\n- ${location.name}: ${location.description || 'A significant location in the story'}`;
    });
  }
  
  if (existingCharacters && existingCharacters.length > 0) {
    contextPrompt += `\n\nExisting Characters in this story:`;
    existingCharacters.slice(0, 5).forEach(character => {
      contextPrompt += `\n- ${character.name} (${character.role || 'character'}): ${character.personality || character.backstory || 'An important character in the story'}`;
    });
  }
  
  // Add user-specified generation options
  if (generationOptions) {
    if (generationOptions.characterType) {
      contextPrompt += `\n\nCharacter Type: ${generationOptions.characterType}`;
    }
    if (generationOptions.role) {
      contextPrompt += `\nRole: ${generationOptions.role}`;
    }
    if (generationOptions.archetype) {
      contextPrompt += `\nArchetype: ${generationOptions.archetype}`;
    }
    if (generationOptions.personality) {
      contextPrompt += `\nPersonality Traits: ${generationOptions.personality}`;
    }
    if (generationOptions.customPrompt) {
      contextPrompt += `\nAdditional Requirements: ${generationOptions.customPrompt}`;
    }
  }

  contextPrompt += `\n\nGenerate a character that:
1. Fits naturally into this world and story
2. Has clear motivations that could drive plot
3. Has potential for interesting relationships with existing characters
4. Brings something unique to the story
5. Has both strengths and flaws that create compelling conflict
6. Feels authentic to the genre and tone
7. Has a backstory that explains their current situation and goals
8. Matches the specified character type, role, and personality traits above

Make the character detailed enough to feel real, with specific traits, quirks, and a clear voice. Ensure they have both external goals and internal conflicts.`;

  return contextPrompt;
}