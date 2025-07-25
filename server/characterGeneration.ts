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
      // Create a structured fallback character
      return createFallbackCharacterObject(context.generationOptions, context.project.id);
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
    console.log('Server: Using fallback character due to generation failure');
    return createFallbackCharacterObject(context.generationOptions, context.project.id);
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

// Create a comprehensive fallback character when AI generation fails
function createFallbackCharacterObject(options: CharacterGenerationOptions | undefined, projectId: string): Partial<Character> {
  const customPrompt = options?.customPrompt || '';
  const personality = options?.personality || 'mysterious and intriguing';
  const role = options?.role || 'supporting';
  const characterType = options?.characterType || 'adventurer';
  const archetype = options?.archetype || 'innocent';
  
  // Create contextual character based on provided options
  const isFirebreather = customPrompt.toLowerCase().includes('fire');
  const isSorcerer = role.toLowerCase().includes('sorcerer');
  const isWitty = personality.toLowerCase().includes('witty');
  
  const name = isFirebreather ? 'Ember Flamewright' : 
               isSorcerer ? 'Arcturus Spellweaver' : 
               'Sage Mystraleon';
               
  const title = isFirebreather ? 'The Flame Bearer' :
                isSorcerer ? 'Master of Arcane Arts' :
                'The Enigmatic One';
                
  const description = isFirebreather ? 
    'A striking figure with ember-bright eyes and hair that seems to flicker like flames. Their confident stance and warm presence suggest someone comfortable with both fire and leadership.' :
    isSorcerer ?
    'An elegant spellcaster with intelligent eyes that seem to hold ancient knowledge. Their robes bear subtle magical sigils, and their hands move with practiced precision.' :
    'A mysterious individual with an air of wisdom and hidden depths. Their presence commands attention while maintaining an aura of intrigue.';
    
  const personalityDesc = isWitty && isSorcerer ?
    'Witty and sarcastic with a sharp tongue that matches their magical prowess. Quick with both spells and clever retorts, they use humor to mask deeper vulnerabilities.' :
    personality.charAt(0).toUpperCase() + personality.slice(1) + ', with depth and complexity that emerges through their actions and decisions.';
    
  const backstory = isFirebreather ?
    'Born in a village known for its metalworkers, they discovered their unique ability to control fire during a dangerous forge accident. This gift set them apart and led them on a journey of self-discovery.' :
    isSorcerer ?
    'Trained in the ancient arts from a young age, they mastered spells that others could only dream of. However, their journey toward true wisdom has just begun.' :
    'Their origins remain shrouded in mystery, with only fragments of their past known to them. Each day brings new revelations about their true nature and purpose.';

  return {
    id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
    projectId: projectId,
    name: name,
    title: title,
    role: role,
    class: characterType.charAt(0).toUpperCase() + characterType.slice(1),
    age: '27',
    race: 'Human',
    oneLine: `A ${personality} ${role} with ${customPrompt || 'hidden depths and untold potential'}.`,
    description: description,
    personality: personalityDesc,
    background: backstory,
    motivations: isFirebreather ? 
      'To master their fire abilities and protect those they care about from the dangers that their power might attract.' :
      'To understand the full extent of their capabilities and use them for a greater purpose.',
    goals: `To fulfill their role as a ${role} while staying true to their core values and the relationships that matter most.`,
    fears: isFirebreather ? 
      'Losing control of their fire abilities and accidentally harming innocent people.' :
      'That their growing power might corrupt them or distance them from their humanity.',
    flaws: isWitty ?
      'Their sarcastic nature sometimes offends people when they most need allies.' :
      'Can be overly secretive and reluctant to trust others with their true thoughts.',
    secrets: isFirebreather ?
      'Their fire abilities are far stronger than they let on, and they fear what might happen if they lost control.' :
      'Harbors knowledge about their past that could change everything if revealed.',
    skills: isFirebreather ?
      'Fire manipulation, metalworking, combat training, heat resistance, and strategic thinking.' :
      isSorcerer ?
      'Advanced spellcasting, arcane knowledge, elemental magic, ritual preparation, and magical research.' :
      'Investigation, intuition, adaptability, problem-solving, and reading people.',
    equipment: isFirebreather ?
      'Flame-resistant clothing, a specially forged weapon that channels fire, and protective charms.' :
      isSorcerer ?
      'Spell component pouch, enchanted staff or wand, arcane focuses, and ancient tomes.' :
      'Travel gear, personal mementos of unknown significance, and tools suited to their profession.'
  };
}