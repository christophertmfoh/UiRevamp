import { GoogleGenAI } from "@google/genai";
import SecurityLogger from './utils/securityLogger';

// Log which API key is being used for debugging
const apiKey = process.env.GEMINI_X || process.env.GOOGLE_API_KEY_NEW || process.env.GOOGLE_API_KEY4 || process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY || "";
SecurityLogger.logAPIKeyValidation('gemini', !!apiKey, !!apiKey);

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
    skills: ['skills', 'abilities', 'talents', 'powers', 'equipment', 'weapons', 'strengths', 'weaknesses'],
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

  // Define sequential category processing order
  const ENHANCEMENT_CATEGORIES = [
    {
      id: 'identity',
      name: 'identity',
      fields: ['title', 'aliases', 'race', 'species', 'ethnicity', 'nationality', 'class', 'profession', 'occupation', 'role', 'age', 'gender', 'sexuality', 'status', 'birthdate', 'zodiacSign'],
      instruction: `Generate realistic identity details for ALL specified fields.`
    },
    {
      id: 'physical',
      name: 'physical',
      fields: ['height', 'weight', 'build', 'bodyType', 'facialFeatures', 'eyes', 'eyeColor', 'hair', 'hairColor', 'hairStyle', 'facialHair', 'skin', 'skinTone', 'complexion', 'scars', 'tattoos', 'piercings', 'birthmarks', 'distinguishingMarks', 'attire', 'clothingStyle', 'accessories', 'posture', 'gait', 'gestures', 'mannerisms'],
      instruction: `Generate detailed physical appearance traits for ALL specified fields.`
    },
    {
      id: 'personality',
      name: 'personality',
      fields: ['personality', 'personalityTraits', 'temperament', 'disposition', 'worldview', 'beliefs', 'values', 'principles', 'morals', 'ethics', 'virtues', 'vices', 'habits', 'quirks', 'idiosyncrasies', 'petPeeves', 'likes', 'dislikes', 'hobbies', 'interests', 'passions'],
      instruction: `Generate comprehensive personality traits for ALL specified fields.`
    },
    {
      id: 'psychology',
      name: 'psychology',
      fields: ['motivations', 'desires', 'needs', 'drives', 'ambitions', 'fears', 'phobias', 'anxieties', 'insecurities', 'secrets', 'shame', 'guilt', 'regrets', 'trauma', 'wounds', 'copingMechanisms', 'defenses', 'vulnerabilities', 'weaknesses', 'blindSpots', 'mentalHealth', 'emotionalState', 'maturityLevel', 'intelligenceType', 'learningStyle'],
      instruction: `Generate deep psychological elements for ALL specified fields.`
    },
    {
      id: 'background',
      name: 'background',
      fields: ['background', 'backstory', 'origin', 'upbringing', 'childhood', 'familyHistory', 'socialClass', 'economicStatus', 'education', 'formativeEvents', 'pastTrauma', 'achievements', 'failures', 'reputation', 'currentSituation'],
      instruction: `Generate rich background details for ALL specified fields.`
    },
    {
      id: 'relationships',
      name: 'relationships',
      fields: ['relationships', 'family', 'friends', 'enemies', 'allies', 'rivals', 'mentors', 'proteges', 'romanticHistory', 'currentRelationships', 'socialConnections'],
      instruction: `Generate meaningful relationship details for ALL specified fields.`
    },
    {
      id: 'abilities',
      name: 'abilities',
      fields: ['skills', 'talents', 'abilities', 'strengths', 'expertise', 'training', 'experience', 'specializations', 'powers', 'specialAbilities', 'combatSkills', 'intellectualPursuits', 'artisticTalents', 'technicalSkills'],
      instruction: `Generate comprehensive abilities for ALL specified fields. Focus on realistic skills and talents appropriate to the character.`
    },
    {
      name: 'story',
      fields: ['storyRole', 'narrative', 'characterArc', 'goals', 'conflicts', 'stakes', 'obstacles', 'growthPotential', 'thematicSignificance', 'symbolism', 'plotRelevance', 'relationshipDynamics', 'characterFunction'],
      instruction: `Generate story elements for ALL specified fields.`
    }
  ];

  // Filter categories based on selectedCategories from frontend
  const selectedCategories = currentData.selectedCategories || [];
  console.log('Processing selected categories:', selectedCategories);
  
  const categoriesToProcess = selectedCategories.length > 0 
    ? ENHANCEMENT_CATEGORIES.filter(cat => selectedCategories.includes(cat.id))
    : ENHANCEMENT_CATEGORIES;
  
  console.log('Will process categories:', categoriesToProcess.map(c => c.name));

  let workingData = { ...currentData };
  
  // Process each selected category sequentially
  for (const category of categoriesToProcess) {
    console.log(`\n=== Processing ${category.name.toUpperCase()} Category ===`);
    
    // Find empty fields in this category
    const emptyFieldsInCategory = category.fields.filter(field => {
      const value = workingData[field];
      return !value || value === '' || value === null || value === undefined || (Array.isArray(value) && value.length === 0);
    });
    
    if (emptyFieldsInCategory.length === 0) {
      console.log(`No empty ${category.name} fields to enhance, skipping...`);
      continue;
    }
    
    console.log(`Enhancing ${emptyFieldsInCategory.length} ${category.name} fields: ${emptyFieldsInCategory.join(', ')}`);
    
    // Create category-specific prompt with existing data context
    const existingData = Object.entries(workingData)
      .filter(([key, value]) => value && value !== '' && !emptyFieldsInCategory.includes(key))
      .map(([key, value]) => `- ${key}: ${Array.isArray(value) ? value.join(', ') : value}`)
      .slice(0, 20) // Limit to prevent prompt overflow
      .join('\n');

    const prompt = `Character Enhancement - ${category.name.toUpperCase()} Category:

EXISTING CHARACTER DATA:
${existingData || '- Limited existing data'}

FIELDS TO GENERATE: ${emptyFieldsInCategory.join(', ')}

Generate appropriate values for each empty ${category.name} field. Make the character feel authentic and consistent with existing data.

Return JSON object with ONLY the specified fields filled with realistic, contextual data.`;

    try {
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        config: {
          systemInstruction: `You are a character development expert specializing in ${category.name} details. ${category.instruction}

CRITICAL: You must provide a value for EVERY field listed in the request. Do not skip any fields.

Use the existing character data as context to ensure consistency and authenticity. Build upon what's already established.

Return a JSON object with ALL requested fields filled. Every field must have a meaningful, specific value that fits the character.`,
          responseMimeType: "application/json",
        },
        contents: prompt,
      });

      const result = response.text;
      if (result) {
        const categoryData = JSON.parse(result);
        SecurityLogger.dev(`Enhanced ${category.name} fields`, { fieldCount: Object.keys(categoryData).length });
        
        // Merge category enhancements with working data
        workingData = {
          ...workingData,
          ...categoryData
        };
        
        // Small delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 1000));
      } else {
        console.log(`⚠ Empty response for ${category.name} category`);
      }
    } catch (error: any) {
      console.error(`${category.name} enhancement error:`, error.message);
      // Continue with next category even if one fails
    }
  }
  
  console.log('\n=== Character Enhancement Complete ===');
  SecurityLogger.dev('Character enhancement completed', { fieldCount: Object.keys(workingData).length });
  return workingData;
}