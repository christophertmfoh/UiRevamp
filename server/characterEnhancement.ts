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

  // Sequential enhancement to avoid rate limits (250k tokens/minute)
  const enhancedData = { ...currentData };
  let processedFields = 0;
  const totalFields = emptyFields.length;
  
  console.log(`Starting sequential enhancement of ${totalFields} fields to avoid rate limits...`);

  // Process fields in small batches to respect API limits
  const batchSize = 4;
  for (let i = 0; i < emptyFields.length; i += batchSize) {
    const batchFields = emptyFields.slice(i, i + batchSize);
    
    const prompt = `PROJECT: ${project.name} (${project.type}, ${project.genre?.join(', ') || 'General'})

EXISTING CHARACTER DATA:
${analysisReport}

TASK: Fill only these fields: ${batchFields.join(', ')}

Current data: ${JSON.stringify(enhancedData, null, 2)}

Return JSON with ONLY the specified fields filled contextually.`;

    try {
      console.log(`Processing batch ${Math.floor(i/batchSize) + 1}/${Math.ceil(emptyFields.length/batchSize)}: ${batchFields.join(', ')}`);
      
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        config: {
          systemInstruction: `Fill specific character fields based on existing data. Keep responses brief but vivid. For arrays, provide 2-3 items.`,
          responseMimeType: "application/json",
        },
        contents: prompt,
      });

      const result = response.text;
      if (result) {
        const batchData = JSON.parse(result);
        Object.assign(enhancedData, batchData);
        processedFields += batchFields.length;
        console.log(`✓ Completed ${processedFields}/${totalFields} fields`);
      }

      // Add delay between batches to respect rate limits
      if (i + batchSize < emptyFields.length) {
        console.log('Waiting 3 seconds to respect rate limits...');
        await new Promise(resolve => setTimeout(resolve, 3000));
      }

    } catch (error: any) {
      console.error(`Error in batch ${Math.floor(i/batchSize) + 1}:`, error.message);
      // Continue with next batch
    }
  }

  // Preserve system fields
  const finalData = {
    ...enhancedData,
    id: currentData.id,
    projectId: currentData.projectId,
    imageUrl: currentData.imageUrl || '',
    displayImageId: currentData.displayImageId || '',
    imageGallery: currentData.imageGallery || [],
    createdAt: currentData.createdAt,
    updatedAt: currentData.updatedAt
  };

  console.log(`✅ Sequential enhancement completed: ${processedFields}/${totalFields} fields enhanced`);
  return finalData;
}