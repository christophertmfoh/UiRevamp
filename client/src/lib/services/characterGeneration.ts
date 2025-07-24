import OpenAI from 'openai';
import type { Project, Character } from '../types';

// Check if we're in browser environment
const isClient = typeof window !== 'undefined';

// Lazy initialization of OpenAI client to avoid API key errors on module load
let openai: OpenAI | null = null;

function getOpenAIClient(): OpenAI {
  if (!openai) {
    const apiKey = isClient ? import.meta.env.VITE_OPENAI_API_KEY : process.env.OPENAI_API_KEY;
    if (!apiKey) {
      throw new Error('OpenAI API key is not configured. Please add VITE_OPENAI_API_KEY to your environment variables.');
    }
    // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
    openai = new OpenAI({ 
      apiKey,
      dangerouslyAllowBrowser: true
    });
  }
  return openai;
}

interface CharacterGenerationContext {
  project: Project;
  locations: any[];
  existingCharacters: Character[];
}

export async function generateContextualCharacter(
  context: CharacterGenerationContext
): Promise<Partial<Character>> {
  try {
    // Build context from project data
    const projectContext = buildProjectContext(context);
    
    const client = getOpenAIClient();
    const response = await client.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: `You are a creative writing assistant specializing in character creation. Generate a fully-developed character that fits naturally into the provided story world. The character should feel authentic and integral to the story.

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
}`
        },
        {
          role: "user",
          content: projectContext
        }
      ],
      response_format: { type: "json_object" },
      max_tokens: 2000,
    });

    const generatedData = JSON.parse(response.choices[0].message.content || '{}');
    
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
  const { project, locations, existingCharacters } = context;
  
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
  
  if (locations.length > 0) {
    contextPrompt += `\n\nKey Locations in this world:`;
    locations.slice(0, 5).forEach(location => {
      contextPrompt += `\n- ${location.name}: ${location.description || 'A significant location in the story'}`;
    });
  }
  
  if (existingCharacters.length > 0) {
    contextPrompt += `\n\nExisting Characters (create someone who could interact with these):`;
    existingCharacters.slice(0, 5).forEach(character => {
      contextPrompt += `\n- ${character.name} (${character.role || 'character'}): ${character.personality || character.backstory || 'An important character in the story'}`;
    });
  }
  
  contextPrompt += `\n\nGenerate a character that:
1. Fits naturally into this world and story
2. Has clear motivations that could drive plot
3. Has potential for interesting relationships with existing characters
4. Brings something unique to the story
5. Has both strengths and flaws that create compelling conflict
6. Feels authentic to the genre and tone
7. Has a backstory that explains their current situation and goals

Make the character detailed enough to feel real, with specific traits, quirks, and a clear voice. Ensure they have both external goals and internal conflicts.`;

  return contextPrompt;
}