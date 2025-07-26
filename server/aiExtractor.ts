import { ExtractedCharacterData } from './characterExtractor';

export async function extractCharacterFromText(textContent: string): Promise<ExtractedCharacterData> {
  console.log('AI-powered structured extraction with Gemini...');
  
  try {
    const { GoogleGenAI } = await import('@google/genai');
    const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY || '' });
    
    const prompt = `Extract character information from this character sheet text and return ONLY a JSON object with these exact fields (use empty string "" for missing text fields, empty array [] for missing array fields):

{
  "name": "Character's full name",
  "age": "Character's age",
  "profession": "Character's job/occupation",
  "height": "Character's height", 
  "build": "Character's build/body type",
  "hairStyle": "Hair description",
  "hairColor": "Hair color only",
  "eyeColor": "Eye color only", 
  "skinTone": "Skin tone/complexion",
  "personalityOverview": "Main personality description",
  "personalityTraits": ["trait1", "trait2", "trait3"],
  "distinguishingMarks": ["mark1", "mark2"],
  "skills": ["skill1", "skill2"],
  "backstory": "Character's background story",
  "storyFunction": "Character's role in story",
  "description": "Brief character summary"
}

Text to extract from:
${textContent}

Return ONLY the JSON object, no other text:`;

    const response = await genAI.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        temperature: 0.1,
        responseMimeType: 'application/json'
      }
    });

    const jsonText = response.text;
    if (!jsonText) {
      throw new Error('Empty response from AI');
    }

    const characterData = JSON.parse(jsonText);
    
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
    
    console.log('✓ AI extraction successful:', {
      name: characterData.name,
      age: characterData.age,
      profession: characterData.profession,
      personalityTraits: characterData.personalityTraits?.length || 0,
      distinguishingMarks: characterData.distinguishingMarks?.length || 0,
      skills: characterData.skills?.length || 0,
      fieldsExtracted: Object.keys(characterData).length
    });

    return characterData;
    
  } catch (error) {
    console.error('AI extraction failed:', error);
    
    // Fallback to pattern-based extraction
    const { extractCharacterFromText: patternExtract } = await import('./coordinateExtractor');
    return patternExtract(textContent);
  }
}