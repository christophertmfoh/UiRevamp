import { generateContentUnified } from './services/unifiedAI';
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

// Optimized character generation using unified AI service

export async function generateContextualCharacter(
  context: CharacterGenerationContext
): Promise<Partial<Character>> {
  try {
    // Build context from project data
    const projectContext = buildProjectContext(context);
    
    const prompt = `Create a fully-developed character for a story project. Generate valid JSON with these fields:

{
  "name": "Character Name",
  "title": "Character Title", 
  "role": "protagonist/antagonist/supporting",
  "class": "Character Class or Profession",
  "age": "25",
  "race": "Character Race/Species",
  "oneLine": "One-sentence character description",
  "description": "Detailed physical description",
  "personality": "Personality traits and behaviors", 
  "backstory": "Background history",
  "motivations": "Core driving forces",
  "goals": "Primary objectives",
  "fears": "Main fears",
  "flaws": "Character weaknesses",
  "secrets": "Hidden aspects",
  "skills": "Abilities and expertise",
  "equipment": "Notable possessions"
}

${projectContext}`;

    console.log('Server: Generating character with unified AI service');
    let text: string;
    
    try {
      text = await generateContentUnified(prompt, { maxOutputTokens: 800 });
      console.log('Server: AI response received:', text.substring(0, 200) + '...');
    } catch (error) {
      console.log('Server: AI generation failed, creating fallback character');
      // Create a structured fallback character based on the generation options
      text = createFallbackCharacterJSON(context.generationOptions);
    }
    
    // Clean and extract JSON from the response
    let cleanText = text;
    
    // Remove markdown code blocks if present
    cleanText = cleanText.replace(/```json\s*\n?/g, '').replace(/```\s*$/g, '');
    
    // Extract JSON from the response (in case there's extra text)
    const jsonMatch = cleanText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      console.error('Server: No JSON found in response:', text);
      throw new Error('No valid JSON found in response');
    }
    
    let jsonString = jsonMatch[0];
    
    // Fix common JSON issues
    // Replace smart quotes with regular quotes
    jsonString = jsonString.replace(/[""]/g, '"');
    jsonString = jsonString.replace(/['']/g, "'");
    
    // Fix incomplete JSON by ensuring it ends properly
    if (!jsonString.trim().endsWith('}')) {
      console.log('Server: JSON appears incomplete, attempting to complete it');
      // Find the last complete field and close the JSON
      const lastCommaIndex = jsonString.lastIndexOf(',');
      const lastQuoteIndex = jsonString.lastIndexOf('"');
      if (lastCommaIndex > lastQuoteIndex) {
        // Remove trailing comma and close
        jsonString = jsonString.substring(0, lastCommaIndex) + '}';
      } else {
        jsonString = jsonString + '}';
      }
    }
    
    console.log('Server: Attempting to parse JSON:', jsonString.substring(0, 200) + '...');
    
    let generatedData;
    try {
      generatedData = JSON.parse(jsonString);
      console.log('Server: Parsed character data successfully');
    } catch (parseError) {
      console.error('Server: JSON parse error:', parseError);
      console.error('Server: Problematic JSON (first 500 chars):', jsonString.substring(0, 500));
      console.error('Server: Problematic JSON (last 500 chars):', jsonString.substring(Math.max(0, jsonString.length - 500)));
      
      // Try to salvage partial data by manually extracting key fields
      try {
        const nameMatch = jsonString.match(/"name"\s*:\s*"([^"]+)"/);
        const titleMatch = jsonString.match(/"title"\s*:\s*"([^"]+)"/);
        const roleMatch = jsonString.match(/"role"\s*:\s*"([^"]+)"/);
        const descMatch = jsonString.match(/"description"\s*:\s*"([^"]+)"/);
        
        if (nameMatch) {
          console.log('Server: Attempting to salvage partial character data');
          generatedData = {
            name: nameMatch[1] || 'Generated Character',
            title: titleMatch?.[1] || '',
            role: roleMatch?.[1] || 'supporting',
            description: descMatch?.[1] || '',
            class: '',
            age: '25',
            race: 'Human',
            oneLine: 'A mysterious character from the world.',
            personality: '',
            backstory: '',
            motivations: '',
            goals: '',
            fears: '',
            flaws: '',
            secrets: '',
            skills: '',
            equipment: ''
          };
        } else {
          throw new Error('Failed to parse character data. Please try again.');
        }
      } catch (salvageError) {
        throw new Error('Failed to parse character data. Please try again.');
      }
    }
    
    // Ensure the data matches our schema expectations
    const processedData = {
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9), // Generate unique ID
      name: generatedData.name || 'Generated Character',
      title: generatedData.title || '',
      role: generatedData.role || 'supporting',
      class: generatedData.class || '',
      age: generatedData.age ? String(generatedData.age) : '',
      race: generatedData.race || '',
      oneLine: generatedData.oneLine || '',
      description: generatedData.description || '',
      personality: generatedData.personality || '',
      background: generatedData.backstory || '', // Map backstory to background field
      motivations: generatedData.motivations || '',
      goals: generatedData.goals || '',
      fears: generatedData.fears || '',
      flaws: generatedData.flaws || '',
      weaknesses: generatedData.flaws || '', // Also map to weaknesses field
      secrets: generatedData.secrets || '',
      skills: generatedData.skills ? generatedData.skills.split(',').map((s: string) => s.trim()) : [], // Convert string to array
      equipment: generatedData.equipment || '',
      // Physical appearance fields from description
      physicalDescription: generatedData.description || '',
      // Ensure required fields are present
      imageUrl: null,
      relationships: '', // String field, not array
      notes: ''
    };
    
    console.log('Server: Processed character data:', processedData);
    return processedData;
  } catch (error) {
    console.error('Server: Error generating character:', error);
    throw new Error('Failed to generate character. Please try again.');
  }
}

function buildProjectContext(context: CharacterGenerationContext): string {
  const { project, locations, existingCharacters, generationOptions } = context;
  
  let contextPrompt = `Create a character for the story project: "${project.name}"`;
  
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