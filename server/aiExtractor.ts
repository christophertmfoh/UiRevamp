import { ExtractedCharacterData } from './characterExtractor';

export async function extractCharacterFromText(textContent: string): Promise<ExtractedCharacterData> {
  console.log('AI-powered structured extraction with Gemini...');
  
  try {
    const { GoogleGenAI } = await import('@google/genai');
    const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY || '' });
    
    const prompt = `You are an expert character sheet analyst. Extract comprehensive character information from this document and return ONLY a JSON object with ALL possible fields filled (use empty string "" for missing text fields, empty array [] for missing array fields):

COMPREHENSIVE CHARACTER EXTRACTION:
{
  "name": "Character's full name",
  "nicknames": ["nickname1", "nickname2"],
  "title": "Character's title (Dr, Sir, etc)",
  "aliases": ["alias1", "alias2"],
  "age": "Character's age or age range",
  "race": "Character's race/species",
  "class": "Character class (fighter, rogue, etc)",
  "profession": "Job/occupation",
  "role": "Story role (protagonist, villain, etc)",
  
  "height": "Character's height",
  "weight": "Character's weight", 
  "build": "Body build/physique",
  "eyeColor": "Eye color only",
  "hairColor": "Hair color only",
  "hairStyle": "Hair style/length description",
  "skinTone": "Skin tone/complexion",
  "facialFeatures": "Facial feature details",
  "distinguishingMarks": ["scar1", "tattoo1", "birthmark1"],
  "clothingStyle": "Typical clothing/attire",
  "mannerisms": ["gesture1", "habit1"],
  
  "personalityOverview": "Complete personality description",
  "personalityTraits": ["trait1", "trait2", "trait3", "trait4", "trait5"],
  "temperament": "Overall temperament",
  "worldview": "Character's worldview/philosophy", 
  "values": ["value1", "value2"],
  "beliefs": ["belief1", "belief2"],
  "goals": ["goal1", "goal2"],
  "motivations": ["motivation1", "motivation2"],
  "fears": ["fear1", "fear2"],
  "desires": ["desire1", "desire2"],
  "quirks": ["quirk1", "quirk2"],
  "likes": ["like1", "like2"],
  "dislikes": ["dislike1", "dislike2"],
  "habits": ["habit1", "habit2"],
  "vices": ["vice1", "vice2"],
  
  "coreAbilities": ["ability1", "ability2"],
  "skills": ["skill1", "skill2", "skill3"],
  "talents": ["talent1", "talent2"],
  "specialAbilities": ["power1", "power2"],
  "strengths": ["strength1", "strength2"],
  "weaknesses": ["weakness1", "weakness2"],
  "training": "Training background",
  
  "backstory": "Complete background story",
  "childhood": "Childhood details",
  "familyHistory": "Family background",
  "education": "Educational background",
  "formativeEvents": ["event1", "event2"],
  "socialClass": "Social/economic class",
  "spokenLanguages": ["language1", "language2"],
  
  "family": ["family member1", "family member2"],
  "friends": ["friend1", "friend2"],
  "allies": ["ally1", "ally2"],
  "enemies": ["enemy1", "enemy2"],
  "rivals": ["rival1", "rival2"],
  "mentors": ["mentor1", "mentor2"],
  
  "storyFunction": "Role/purpose in story",
  "personalTheme": "Character's theme",
  "symbolism": "What character represents",
  "inspiration": "Real-world inspiration",
  "archetypes": ["archetype1", "archetype2"],
  "notes": "Additional notes",
  
  "description": "Brief character summary"
}

INSTRUCTIONS:
- Extract EVERY piece of information from the document
- Split lists and descriptions into individual array items
- Use specific, detailed descriptions rather than generic terms
- Fill as many fields as possible from the available text
- For personality traits, extract 5-8 specific traits
- For distinguishing marks, include scars, tattoos, unique features
- For relationships, extract specific names and relationships mentioned

TEXT TO ANALYZE:
${textContent}

Return ONLY the JSON object with maximum field coverage:`;

    const response = await genAI.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        temperature: 0.3, // Slightly higher for more detailed extraction
        responseMimeType: 'application/json',
        maxOutputTokens: 8192 // Allow longer responses for comprehensive data
      }
    });

    const jsonText = response.text;
    if (!jsonText) {
      throw new Error('Empty response from AI');
    }

    const characterData = JSON.parse(jsonText);
    
    // Clean up array fields that might be returned as objects or strings
    const arrayFields = [
      'nicknames', 'aliases', 'personalityTraits', 'distinguishingMarks', 'skills', 
      'coreAbilities', 'talents', 'specialAbilities', 'strengths', 'weaknesses',
      'values', 'beliefs', 'goals', 'motivations', 'fears', 'desires', 'quirks',
      'likes', 'dislikes', 'habits', 'vices', 'mannerisms', 'formativeEvents',
      'family', 'friends', 'allies', 'enemies', 'rivals', 'mentors',
      'archetypes', 'spokenLanguages'
    ];
    
    for (const field of arrayFields) {
      if (characterData[field] !== undefined && characterData[field] !== null) {
        // Handle various data types that might be returned
        if (typeof characterData[field] === 'string') {
          const stringValue = characterData[field].trim();
          
          // Check for malformed JSON objects like "{}" or "[]"
          if (stringValue === '{}' || stringValue === '[]' || stringValue === '') {
            characterData[field] = [];
          } else {
            try {
              // Try to parse if it's a JSON string
              const parsed = JSON.parse(stringValue);
              if (Array.isArray(parsed)) {
                characterData[field] = parsed;
              } else if (typeof parsed === 'object' && parsed !== null) {
                // Convert object to array of values
                characterData[field] = Object.values(parsed).filter(val => val && String(val).trim().length > 0);
              } else {
                // Single value, convert to array
                characterData[field] = [String(parsed)];
              }
            } catch {
              // If parsing fails, split by common delimiters
              characterData[field] = stringValue
                .split(/[,;|]/)
                .map(item => item.trim())
                .filter(item => item.length > 0);
            }
          }
        } else if (typeof characterData[field] === 'object' && !Array.isArray(characterData[field])) {
          // Convert object to array of values
          characterData[field] = Object.values(characterData[field]).filter(val => val && String(val).trim().length > 0);
        } else if (!Array.isArray(characterData[field])) {
          // Convert any other type to array
          characterData[field] = characterData[field] ? [String(characterData[field])] : [];
        }
        
        // Ensure it's always an array and clean items
        if (!Array.isArray(characterData[field])) {
          characterData[field] = [];
        }
        
        // Clean array items
        characterData[field] = characterData[field]
          .map(item => typeof item === 'string' ? item.trim() : String(item).trim())
          .filter(item => item.length > 0 && item !== '{}' && item !== '[]' && item !== 'null' && item !== 'undefined')
          .slice(0, 10); // Limit to reasonable number
      } else {
        characterData[field] = [];
      }
    }
    
    // Ensure required processing
    if (characterData.profession) {
      characterData.occupation = characterData.profession;
    }
    
    // Create physical description if missing
    if (!characterData.physicalDescription && (characterData.height || characterData.build)) {
      const physicalParts = [];
      if (characterData.height) physicalParts.push(`Height: ${characterData.height}`);
      if (characterData.build) physicalParts.push(`Build: ${characterData.build}`);
      if (characterData.hairStyle) physicalParts.push(`Hair: ${characterData.hairStyle}`);
      if (characterData.eyeColor) physicalParts.push(`Eyes: ${characterData.eyeColor}`);
      if (characterData.skinTone) physicalParts.push(`Skin: ${characterData.skinTone}`);
      
      characterData.physicalDescription = physicalParts.join('. ');
    }
    
    // Add notes
    characterData.notes = `Character imported from document: ${characterData.name || 'Unknown Character'}`;
    
    // Debug array field processing
    console.log('Array field processing debug:', {
      nicknames: { type: typeof characterData.nicknames, value: characterData.nicknames, isArray: Array.isArray(characterData.nicknames) },
      aliases: { type: typeof characterData.aliases, value: characterData.aliases, isArray: Array.isArray(characterData.aliases) },
      distinguishingMarks: { type: typeof characterData.distinguishingMarks, value: characterData.distinguishingMarks, isArray: Array.isArray(characterData.distinguishingMarks) }
    });
    
    console.log('✓ Comprehensive AI extraction successful:', {
      name: characterData.name,
      age: characterData.age,
      profession: characterData.profession,
      nicknames: characterData.nicknames?.length || 0,
      personalityTraits: characterData.personalityTraits?.length || 0,
      distinguishingMarks: characterData.distinguishingMarks?.length || 0,
      skills: characterData.skills?.length || 0,
      abilities: characterData.coreAbilities?.length || 0,
      relationships: (characterData.family?.length || 0) + (characterData.friends?.length || 0),
      fieldsPopulated: Object.keys(characterData).filter(key => {
        const value = characterData[key];
        return value !== "" && value !== null && value !== undefined && 
               (!Array.isArray(value) || value.length > 0);
      }).length,
      totalFields: Object.keys(characterData).length,
      arrayFieldsFixed: arrayFields.filter(field => Array.isArray(characterData[field]) && characterData[field].length > 0).length
    });

    return characterData;
    
  } catch (error) {
    console.error('AI extraction failed:', error);
    
    // Fallback to pattern-based extraction
    const { extractCharacterFromText: patternExtract } = await import('./coordinateExtractor');
    return patternExtract(textContent);
  }
}