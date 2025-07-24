import { GoogleGenAI } from "@google/genai";

// Use the same API key logic as the main enhancement
const apiKey = process.env.GOOGLE_API_KEY_NEW || process.env.GOOGLE_API_KEY4 || process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY || "";
console.log(`Field enhancement using API key: ${apiKey ? apiKey.substring(0, 10) + '...' : 'NONE'}`);

const ai = new GoogleGenAI({ apiKey });

export async function enhanceCharacterField(character: any, fieldKey: string, fieldLabel: string, currentValue: any) {
  try {
    console.log(`\n=== Processing Individual Field Enhancement ===`);
    console.log(`Field: ${fieldKey} (${fieldLabel})`);
    console.log(`Current value: ${currentValue || 'empty'}`);

    // Don't enhance if field already has content (non-destructive)
    if (currentValue && currentValue !== '' && (!Array.isArray(currentValue) || currentValue.length > 0)) {
      console.log(`Field ${fieldKey} already has content, skipping enhancement`);
      return { [fieldKey]: currentValue };
    }

    // Create context from existing character data
    const characterContext = `
Character Name: ${character.name || 'Unknown'}
Role: ${character.role || 'Character'}
Race/Species: ${character.race || 'Unknown'}
Class/Profession: ${character.class || 'Unknown'}
Age: ${character.age || 'Unknown'}
Background: ${character.background || 'Unknown'}
Description: ${character.description || 'Unknown'}
Personality: ${character.personality || character.personalityTraits?.join(', ') || 'Unknown'}
    `.trim();

    // Generate field-specific prompts based on field type
    let prompt = '';
    
    if (fieldKey === 'name') {
      prompt = `Generate a fitting full name for this character based on: ${characterContext}
      
      Create a realistic name that matches their race/species, background, and setting. Return only the full name, no quotes or explanations.`;
    } else if (fieldKey === 'nicknames') {
      prompt = `Generate appropriate nicknames for this character: ${characterContext}
      
      Consider their personality, relationships, and background. Examples: "Red", "The Fox", "Doc", "Ace". Return only the nickname, no quotes.`;
    } else if (fieldKey === 'title') {
      prompt = `Generate an appropriate title for this character: ${characterContext}
      
      Examples: "Sir", "Dr.", "Captain", "Lord", "The Wise", "Shadow Walker". Return only the title, no quotes.`;
    } else if (fieldKey === 'aliases') {
      prompt = `Generate a secret identity or false name for this character: ${characterContext}
      
      Consider if they need to hide their identity. Examples: "John Smith", "The Phantom", "Agent Zero". Return only the alias, no quotes.`;
    } else if (fieldKey === 'age') {
      prompt = `Generate an appropriate age for this character: ${characterContext}
      
      Consider their role and background. Return only the age like "25" or "appears to be in their 30s", no quotes.`;
    } else if (fieldKey === 'race') {
      prompt = `Generate an appropriate race/species for this character: ${characterContext}
      
      Consider the story setting. Examples: "Human", "Half-Elf", "Dwarf", "Android". Return only the race, no quotes.`;
    } else if (fieldKey === 'class') {
      prompt = `Generate an appropriate class/profession for this character: ${characterContext}
      
      Consider their background and story role. Examples: "Warrior", "Detective", "Scholar", "Thief". Return only the class, no quotes.`;
    } else {
      prompt = `You are a professional character development expert helping writers create detailed, compelling characters.

CONTEXT:
${characterContext}

TASK: Generate appropriate content for the character field "${fieldLabel}" (field key: ${fieldKey}).

REQUIREMENTS:
- Content must fit naturally with the existing character context
- Be specific and detailed, not generic
- Match the character's established personality, background, and role
- Provide realistic, believable details
- Keep response concise but meaningful
- For array fields (comma-separated values), provide 3-5 relevant items

FIELD TO GENERATE: ${fieldLabel}

Generate only the content for this specific field. Do not include labels, explanations, or other text - just the raw content that should go in this field.`;
    }

    console.log(`Generating content for field: ${fieldKey}`);
    
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      config: {
        temperature: 0.8,
        maxOutputTokens: 200
      },
      contents: prompt,
    });

    const generatedContent = response.text?.trim() || '';
    console.log(`Generated content for ${fieldKey}: ${generatedContent}`);

    if (!generatedContent) {
      console.log(`Empty response from AI for field ${fieldKey}, trying fallback`);
      // Return error instead of fallback - let frontend handle it
      throw new Error(`AI returned empty response for field ${fieldKey}`);
    }

    // Process array fields
    if (['personalityTraits', 'abilities', 'skills', 'talents', 'expertise', 'languages', 'archetypes', 'tropes', 'tags'].includes(fieldKey)) {
      const arrayContent = generatedContent.split(',').map(s => s.trim()).filter(s => s.length > 0);
      return { [fieldKey]: arrayContent };
    }

    return { [fieldKey]: generatedContent };

  } catch (error) {
    console.error(`Error enhancing field ${fieldKey}:`, error);
    throw new Error(`Failed to enhance field ${fieldKey}: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}