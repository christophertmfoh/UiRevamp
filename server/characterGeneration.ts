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

Your response must be valid JSON in this exact format. Fill EVERY field with detailed, template-appropriate content. Use only regular double quotes, avoid smart quotes or special characters:

{
  "name": "Character Name",
  "nicknames": "Common nicknames or pet names",
  "title": "Character Title, Epithet, or Professional Title", 
  "aliases": "Other names they might use or be known by",
  "role": "protagonist/antagonist/supporting/etc",
  "class": "Character Class, Profession, or Job",
  "age": "25",
  "race": "Character Race/Species",
  "gender": "Character's gender identity",
  "oneLine": "One-sentence character description",
  "physicalDescription": "Complete detailed physical appearance including height, weight, build, posture, distinctive features",
  "height": "Character's height (e.g., 5'8\", 175cm)",
  "build": "Body type (slim, athletic, stocky, etc.)",
  "eyeColor": "Eye color and any distinctive features",
  "hairColor": "Hair color and style",
  "hairStyle": "Detailed hair style description",
  "skinTone": "Skin tone and any distinctive markings",
  "distinguishingMarks": "Scars, tattoos, birthmarks, unique features",
  "clothingStyle": "Fashion sense and typical attire",
  "personalityOverview": "Comprehensive personality summary",
  "temperament": "Core temperament (calm, fiery, melancholic, etc.)",
  "personalityTraits": ["trait1", "trait2", "trait3", "trait4", "trait5"],
  "worldview": "How they see the world and their place in it",
  "values": "Core beliefs and principles that guide decisions",
  "goals": "Specific short-term and long-term objectives",
  "motivations": "Deep driving forces and core desires",
  "fears": "What terrifies them most, both rational and irrational",
  "desires": "What they want most in life",
  "vices": "Bad habits, addictions, or moral failings",
  "coreAbilities": "Primary abilities and talents",
  "skills": ["skill1", "skill2", "skill3", "skill4"],
  "talents": ["talent1", "talent2", "talent3"],
  "specialAbilities": "Unique or supernatural abilities",
  "powers": "Special powers or magical abilities",
  "strengths": "Character's key strengths and positive traits",
  "weaknesses": "Vulnerabilities and areas of struggle",
  "training": "Formal education, apprenticeships, or training",
  "backstory": "Rich background history explaining how they became who they are",
  "childhood": "Early life experiences and upbringing",
  "familyHistory": "Family background and lineage",
  "education": "Formal and informal learning experiences",
  "formativeEvents": "Key events that shaped their character",
  "socialClass": "Economic and social standing",
  "occupation": "Current job or primary activity",
  "spokenLanguages": ["language1", "language2"],
  "family": "Family members and relationships",
  "friends": "Close friendships and bonds",
  "allies": "Political or strategic alliances",
  "enemies": "Adversaries and opponents",
  "rivals": "Competitive relationships",
  "mentors": "Teachers and guides",
  "relationships": "Romantic and significant relationships",
  "socialCircle": "Broader social connections",
  "storyFunction": "Role this character serves in the narrative",
  "personalTheme": "Central theme this character represents",
  "symbolism": "What this character symbolizes in the story",
  "inspiration": "Real-world or fictional inspirations",
  "archetypes": ["archetype1", "archetype2"],
  "notes": "Additional writer notes and development ideas",
  "flaws": "Character weaknesses and negative traits that create conflict",
  "secrets": "Hidden aspects, past events, or knowledge they conceal",
  "equipment": "Notable possessions, tools, weapons, or gear",
  "habits": "Daily routines, mannerisms, and behavioral patterns",
  "quirks": "Unique behavioral traits and eccentricities"
}

CRITICAL: Generate detailed, specific content for EVERY field above. Do not leave any field empty or use placeholder text. Base all content on the template requirements provided. Ensure all text is properly escaped and JSON is valid.

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
    
    // Map ALL generated fields to character schema - comprehensive field mapping
    const processedData = {
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      // Identity fields
      name: generatedData.name || 'Generated Character',
      nicknames: generatedData.nicknames || '',
      title: generatedData.title || '',
      aliases: generatedData.aliases || '',
      age: generatedData.age ? String(generatedData.age) : '',
      race: generatedData.race || '',
      class: generatedData.class || '',
      role: generatedData.role || 'supporting',
      gender: generatedData.gender || '',
      
      // Appearance fields
      physicalDescription: generatedData.physicalDescription || generatedData.description || '',
      height: generatedData.height || '',
      build: generatedData.build || '',
      eyeColor: generatedData.eyeColor || '',
      hairColor: generatedData.hairColor || '',
      hairStyle: generatedData.hairStyle || '',
      skinTone: generatedData.skinTone || '',
      distinguishingMarks: generatedData.distinguishingMarks || '',
      clothingStyle: generatedData.clothingStyle || '',
      
      // Personality fields
      personalityOverview: generatedData.personalityOverview || generatedData.personality || '',
      temperament: generatedData.temperament || '',
      personalityTraits: Array.isArray(generatedData.personalityTraits) ? generatedData.personalityTraits : 
        (generatedData.personalityTraits ? generatedData.personalityTraits.split(',').map((s: string) => s.trim()) : []),
      worldview: generatedData.worldview || '',
      values: generatedData.values || '',
      goals: generatedData.goals || '',
      motivations: generatedData.motivations || '',
      fears: generatedData.fears || '',
      desires: generatedData.desires || '',
      vices: generatedData.vices || '',
      
      // Abilities fields
      coreAbilities: generatedData.coreAbilities || '',
      skills: Array.isArray(generatedData.skills) ? generatedData.skills : 
        (generatedData.skills ? generatedData.skills.split(',').map((s: string) => s.trim()) : []),
      talents: Array.isArray(generatedData.talents) ? generatedData.talents :
        (generatedData.talents ? generatedData.talents.split(',').map((s: string) => s.trim()) : []),
      specialAbilities: generatedData.specialAbilities || '',
      powers: generatedData.powers || '',
      strengths: generatedData.strengths || '',
      weaknesses: generatedData.weaknesses || '',
      training: generatedData.training || '',
      
      // Background fields
      backstory: generatedData.backstory || '',
      background: generatedData.backstory || '', // Duplicate mapping for compatibility
      childhood: generatedData.childhood || '',
      familyHistory: generatedData.familyHistory || '',
      education: generatedData.education || '',
      formativeEvents: generatedData.formativeEvents || '',
      socialClass: generatedData.socialClass || '',
      occupation: generatedData.occupation || '',
      spokenLanguages: Array.isArray(generatedData.spokenLanguages) ? generatedData.spokenLanguages :
        (generatedData.spokenLanguages ? generatedData.spokenLanguages.split(',').map((s: string) => s.trim()) : []),
      
      // Relationships fields
      family: generatedData.family || '',
      friends: generatedData.friends || '',
      allies: generatedData.allies || '',
      enemies: generatedData.enemies || '',
      rivals: generatedData.rivals || '',
      mentors: generatedData.mentors || '',
      relationships: generatedData.relationships || '',
      socialCircle: generatedData.socialCircle || '',
      
      // Meta fields
      storyFunction: generatedData.storyFunction || '',
      personalTheme: generatedData.personalTheme || '',
      symbolism: generatedData.symbolism || '',
      inspiration: generatedData.inspiration || '',
      archetypes: Array.isArray(generatedData.archetypes) ? generatedData.archetypes :
        (generatedData.archetypes ? generatedData.archetypes.split(',').map((s: string) => s.trim()) : []),
      notes: generatedData.notes || '',
      
      // Additional character fields
      flaws: generatedData.flaws || '',
      secrets: generatedData.secrets || '',
      equipment: generatedData.equipment || '',
      habits: generatedData.habits || '',
      quirks: generatedData.quirks || '',
      
      // Legacy compatibility fields
      oneLine: generatedData.oneLine || '',
      description: generatedData.physicalDescription || generatedData.description || '',
      personality: generatedData.personalityOverview || generatedData.personality || '',
      
      // System fields
      imageUrl: null,
      projectId: null // Will be set by calling function
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