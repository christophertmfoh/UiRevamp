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
  existingCharacters: Character[];
  generationOptions?: CharacterGenerationOptions;
}

// Initialize Gemini client
function getGeminiClient(): GoogleGenerativeAI {
  const apiKey = process.env.GOOGLE_API_KEY_1 || process.env.GOOGLE_API_KEY || process.env.GEMINI_API_KEY;
  
  if (!apiKey) {
    throw new Error('Gemini API key is not configured. Please add GOOGLE_API_KEY_1, GOOGLE_API_KEY or GEMINI_API_KEY to your environment variables.');
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

Your response must be valid JSON in this exact format. Use only regular double quotes, avoid smart quotes or special characters:
{
  "name": "Character Name",
  "title": "Character Title or Epithet", 
  "role": "protagonist/antagonist/supporting/etc",
  "class": "Character Class or Profession",
  "age": "25",
  "race": "Character Race/Species",
  "oneLine": "One-sentence character description",
  "description": "Detailed physical description including height, build, distinctive features, clothing style, and any notable characteristics",
  "personality": "Detailed personality traits, quirks, mannerisms, speech patterns, and behavioral tendencies", 
  "backstory": "Rich background history explaining how they became who they are today",
  "motivations": "Deep driving forces and core desires that compel their actions",
  "goals": "Specific short-term and long-term objectives they want to achieve",
  "fears": "What terrifies them most, both rational and irrational fears",
  "flaws": "Character weaknesses, blind spots, and negative traits that create conflict",
  "secrets": "Hidden aspects, past events, or knowledge they don't want others to discover",
  "skills": "Specific abilities, talents, training, and areas of expertise",
  "equipment": "Notable possessions, tools, weapons, or gear they carry or own",
  "personalityTraits": "Array of 3-5 core personality traits that define this character",
  "strengths": "Character's key strengths and positive abilities",
  "weaknesses": "Character's vulnerabilities and areas of struggle",
  "physicalDescription": "Complete physical appearance details",
  "values": "Core beliefs and principles that guide their decisions",
  "habits": "Daily routines, mannerisms, and behavioral patterns"
}

IMPORTANT: Ensure all text within quotes is properly escaped. Avoid using quotes within the character descriptions or use single quotes instead. Make sure the JSON is valid and complete.

${projectContext}`;

    console.log('Server: Sending prompt to Gemini');
    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();
    
    console.log('Server: Gemini response received:', text.substring(0, 200) + '...');
    
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
      weaknesses: generatedData.weaknesses || generatedData.flaws || '', // Use dedicated weaknesses or fallback to flaws
      secrets: generatedData.secrets || '',
      skills: generatedData.skills ? generatedData.skills.split(',').map((s: string) => s.trim()) : [], // Convert string to array
      equipment: generatedData.equipment || '',
      // Enhanced fields for template-based generation
      personalityTraits: generatedData.personalityTraits ? 
        (Array.isArray(generatedData.personalityTraits) ? generatedData.personalityTraits : generatedData.personalityTraits.split(',').map((s: string) => s.trim())) : [],
      strengths: generatedData.strengths || '',
      physicalDescription: generatedData.physicalDescription || generatedData.description || '',
      values: generatedData.values || '',
      habits: generatedData.habits || '',
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
  const { project, existingCharacters, generationOptions } = context;
  
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
      // Check if this is a template-based generation
      if (generationOptions.customPrompt.includes('TEMPLATE-BASED CHARACTER GENERATION')) {
        contextPrompt += `\n\n${generationOptions.customPrompt}`;
      } else {
        contextPrompt += `\nAdditional Requirements: ${generationOptions.customPrompt}`;
      }
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