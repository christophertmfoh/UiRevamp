import { GoogleGenAI } from "@google/genai";

// Log which API key is being used for debugging
const apiKey = process.env.GOOGLE_API_KEY_NEW || process.env.GOOGLE_API_KEY4 || process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY || "";
console.log(`Character enhancement using API key: ${apiKey ? apiKey.substring(0, 10) + '...' : 'NONE'}`);

const ai = new GoogleGenAI({ apiKey });

interface EnhanceCharacterParams {
  currentData: any;
  project: any;
  character: any;
}

export async function enhanceCharacterWithAI({ currentData, project, character }: EnhanceCharacterParams) {
  // Comprehensive scan through all character categories
  const categorizedData = {
    identity: [] as string[],
    physical: [] as string[],
    personality: [] as string[],
    background: [] as string[],
    relationships: [] as string[],
    skills: [] as string[],
    story: [] as string[]
  };
  
  const filledFields: string[] = [];
  const emptyFields: string[] = [];
  
  // Define field categories for better organization
  const fieldCategories = {
    identity: ['name', 'nicknames', 'title', 'aliases', 'race', 'ethnicity', 'nationality', 'class', 'occupation', 'role', 'age', 'gender', 'sexuality', 'status'],
    physical: ['height', 'weight', 'build', 'eyeColor', 'hairColor', 'skinTone', 'scars', 'tattoos', 'clothing', 'accessories', 'physicalDescription', 'distinctiveFeatures'],
    personality: ['personality', 'temperament', 'traits', 'quirks', 'mannerisms', 'speechPattern', 'voice', 'likes', 'dislikes', 'hobbies', 'habits', 'values', 'beliefs'],
    background: ['backstory', 'childhood', 'education', 'family', 'pastEvents', 'socialClass', 'homeland', 'culturalBackground'],
    relationships: ['allies', 'enemies', 'mentors', 'rivals', 'romanticInterests', 'family', 'friends'],
    skills: ['skills', 'abilities', 'talents', 'magicalAbilities', 'equipment', 'weapons', 'strengths', 'weaknesses'],
    story: ['motivations', 'goals', 'fears', 'secrets', 'flaws', 'character_arc', 'narrativeRole', 'plotImportance', 'internal_conflict', 'external_conflict']
  };
  
  // Scan through all fields and categorize them
  Object.entries(currentData).forEach(([key, value]) => {
    if (value && value !== '' && (!Array.isArray(value) || value.length > 0)) {
      const displayValue = Array.isArray(value) ? value.join(', ') : value;
      filledFields.push(`${key}: ${displayValue}`);
      
      // Categorize the filled field
      for (const [category, fields] of Object.entries(fieldCategories)) {
        if (fields.includes(key)) {
          categorizedData[category as keyof typeof categorizedData].push(`${key}: ${displayValue}`);
          break;
        }
      }
    } else if (!['id', 'projectId', 'createdAt', 'updatedAt', 'imageUrl', 'displayImageId', 'imageGallery', 'portraits'].includes(key)) {
      emptyFields.push(key);
    }
  });

  // Create detailed analysis of what we have
  const analysisReport = `
IDENTITY INFORMATION: ${categorizedData.identity.length > 0 ? categorizedData.identity.join(', ') : 'None provided'}
PHYSICAL DETAILS: ${categorizedData.physical.length > 0 ? categorizedData.physical.join(', ') : 'None provided'}  
PERSONALITY TRAITS: ${categorizedData.personality.length > 0 ? categorizedData.personality.join(', ') : 'None provided'}
BACKGROUND INFO: ${categorizedData.background.length > 0 ? categorizedData.background.join(', ') : 'None provided'}
RELATIONSHIPS: ${categorizedData.relationships.length > 0 ? categorizedData.relationships.join(', ') : 'None provided'}
SKILLS/ABILITIES: ${categorizedData.skills.length > 0 ? categorizedData.skills.join(', ') : 'None provided'}
STORY ELEMENTS: ${categorizedData.story.length > 0 ? categorizedData.story.join(', ') : 'None provided'}`;

  const systemPrompt = `You are an expert creative writing assistant specializing in character development. Your task is to intelligently fill out missing character details based on existing information.

PROJECT CONTEXT:
- Project: ${project.name} (${project.type})
- Genre: ${project.genre?.join(', ') || 'Not specified'}
- Project Description: ${project.description || 'Not provided'}

CHARACTER ANALYSIS:
${analysisReport}

EMPTY FIELDS TO FILL: ${emptyFields.join(', ')}

ENHANCEMENT INSTRUCTIONS:
1. Analyze the existing character data across all categories (identity, physical, personality, background, relationships, skills, story)
2. Use this context to create logical, consistent details for ALL empty fields
3. Maintain consistency with established traits, genre, and project setting
4. For array fields (like skills, traits, fears), provide 2-4 relevant items
5. Keep descriptions vivid but concise (typically 1-3 sentences)
6. Ensure all new details enhance the character's depth and story potential
7. Consider how each field connects to others (e.g., background influences personality, personality affects relationships)

Return ONLY a complete JSON object with both existing and enhanced character data. Fill every empty field with contextually appropriate content.`;

  // Focus only on identity fields for now - comprehensive list
  const identityFields = ['title', 'aliases', 'race', 'species', 'ethnicity', 'nationality', 'class', 'profession', 'occupation', 'role', 'age', 'gender', 'sexuality', 'status', 'birthdate', 'zodiacSign'];
  const emptyIdentityFields = emptyFields.filter(field => identityFields.includes(field));
  
  // Also check for fields that are null, undefined, or empty strings
  const additionalEmptyFields = identityFields.filter(field => {
    const value = currentData[field];
    return !value || value === '' || value === null || value === undefined;
  });
  
  // Combine and deduplicate
  const allEmptyIdentityFields = [...new Set([...emptyIdentityFields, ...additionalEmptyFields])];
  
  console.log(`Enhancing ${allEmptyIdentityFields.length} identity fields: ${allEmptyIdentityFields.join(', ')}`);
  
  if (allEmptyIdentityFields.length === 0) {
    console.log('No empty identity fields to enhance');
    return currentData;
  }
  
  // Create focused prompt for identity fields only
  const prompt = `Character Enhancement Task:

EXISTING CHARACTER DATA:
- Name: ${currentData.name || 'Unknown'}
- Nicknames: ${currentData.nicknames || 'None'}
- Physical Description: ${currentData.physicalDescription || 'Not provided'}
- Clothing: ${currentData.clothingStyle || 'Not specified'}

FIELDS TO GENERATE: ${allEmptyIdentityFields.join(', ')}

Generate appropriate values for each empty identity field. Make the character feel authentic and consistent.

Return JSON object with ONLY the specified fields filled with realistic, contextual data.`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      config: {
        systemInstruction: `You are a character development expert. Generate realistic identity details for ALL specified fields. 

CRITICAL: You must provide a value for EVERY field listed in the request. Do not skip any fields.

For each field:
- title: A descriptive title/epithet that fits the character (e.g., "The Silent Watcher", "Street Fighter", "Former Noble")
- aliases: Alternative names or nicknames beyond what's already provided
- race: Human or fantasy race (default Human if unclear)  
- species: Biological species (usually same as race)
- ethnicity: Cultural/ethnic background (e.g., "Central European", "Nordic", "Mediterranean")
- nationality: Where they're from (be creative but fitting)
- class: Social class (Working Class, Middle Class, Noble, Outcast, etc.)
- profession: General profession category
- occupation: Specific job/profession (e.g., "Private Investigator", "Blacksmith", "Scholar")
- role: Story role (Protagonist, Antagonist, Supporting Character, Anti-hero, etc.)
- age: Specific age number (e.g., 34, 28, 45)
- gender: Gender identity (Male, Female, Non-binary, etc.)
- sexuality: Sexual orientation (Heterosexual, Homosexual, Bisexual, etc.)
- status: Social/legal status (Citizen, Outlaw, Noble, Exile, etc.)
- birthdate: Specific birthdate if relevant
- zodiacSign: Astrological sign if relevant to world

Return a JSON object with ALL requested fields filled. Every field must have a meaningful, specific value.`,
        responseMimeType: "application/json",
      },
      contents: prompt,
    });

    const result = response.text;
    if (result) {
      const identityData = JSON.parse(result);
      console.log(`✓ Enhanced identity fields:`, Object.keys(identityData));
      
      // Merge only the identity enhancements with current data
      const enhancedData = {
        ...currentData,
        ...identityData
      };
      
      console.log('Returning enhanced data:', Object.keys(enhancedData));
      return enhancedData;
    } else {
      throw new Error("Empty response from AI");
    }
  } catch (error: any) {
    console.error('Identity enhancement error:', error.message);
    return currentData; // Return unchanged data on error
  }
}