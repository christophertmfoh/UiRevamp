import { GoogleGenerativeAI } from '@google/generative-ai';
import type { Project, Character } from '../types';

// Check if we're in browser environment
const isClient = typeof window !== 'undefined';

// Lazy initialization of Gemini client to avoid API key errors on module load
let gemini: GoogleGenerativeAI | null = null;

function getGeminiClient(): GoogleGenerativeAI {
  if (!gemini) {
    // Try different possible environment variable names since user mentioned GOOGLE_API_KEY
    const apiKey = isClient ? 
      (import.meta.env.VITE_GEMINI_API_KEY || import.meta.env.VITE_GOOGLE_API_KEY) : 
      (process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY);
    
    console.log('Environment check:', {
      isClient,
      VITE_GEMINI_API_KEY: isClient ? !!import.meta.env.VITE_GEMINI_API_KEY : 'server',
      VITE_GOOGLE_API_KEY: isClient ? !!import.meta.env.VITE_GOOGLE_API_KEY : 'server',
      GEMINI_API_KEY: !isClient ? !!process.env.GEMINI_API_KEY : 'client',
      GOOGLE_API_KEY: !isClient ? !!process.env.GOOGLE_API_KEY : 'client',
      foundKey: !!apiKey
    });
    
    if (!apiKey) {
      throw new Error('Gemini API key is not configured. Please add GEMINI_API_KEY or GOOGLE_API_KEY to your environment variables.');
    }
    
    console.log('Initializing Gemini client with API key found');
    gemini = new GoogleGenerativeAI(apiKey);
  }
  return gemini;
}

interface CharacterGenerationOptions {
  characterType: string;
  role: string;
  customPrompt: string;
  personality: string;
  archetype: string;
}

interface CharacterGenerationContext {
  project: Project;
  
  existingCharacters: Character[];
  generationOptions?: CharacterGenerationOptions;
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
  "role": "protagonist/antagonist/supporting/etc",
  "race": "human/elf/dwarf/etc",
  "age": "age or age range",
  "occupation": "their job or role in society",
  "physicalDescription": "detailed physical appearance",
  "personality": "personality traits and quirks",
  "backstory": "rich background that explains who they are",
  "motivations": "what drives them",
  "fears": "what they're afraid of",
  "secrets": "hidden aspects of their character",
  "relationships": "connections to other characters or groups",
  "goals": "what they want to achieve",
  "flaws": "character weaknesses that create conflict",
  "skills": "abilities and talents",
  "equipment": "items they carry or own",
  "notes": "additional character details"
}

${projectContext}`;

    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();
    
    console.log('Gemini response:', text);
    
    // Extract JSON from the response (in case there's extra text)
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      console.error('No JSON found in response:', text);
      throw new Error('No valid JSON found in response');
    }
    
    const generatedData = JSON.parse(jsonMatch[0]);
    console.log('Parsed character data:', generatedData);
    
    return {
      ...generatedData,
      imageUrl: '', // Will be generated separately if needed
      portraits: []
    };

  } catch (error) {
    console.error('Error generating contextual character:', error);
    throw new Error('Failed to generate character. Please try again.');
  }
}

function buildProjectContext(context: CharacterGenerationContext): string {
  const { project, 
  
  let contextPrompt = `Create a character for the story project: "${project.title || project.name}"`;
  
  if (project.genre) {
    const genreStr = Array.isArray(project.genre) ? project.genre.join(', ') : project.genre;
    contextPrompt += `\nGenre: ${genreStr}`;
  }
  
  if (project.tone) {
    contextPrompt += `\nTone: ${project.tone}`;
  }
  
  if (project.description) {
    contextPrompt += `\nProject Description: ${project.description}`;
  }
  
  if (
    
      contextPrompt += `\n- ${
    });
  }
  
  if (existingCharacters.length > 0) {
    contextPrompt += `\n\nExisting Characters (create someone who could interact with these):`;
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