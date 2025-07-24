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

    // Generate field-specific prompt
    const prompt = `You are a professional character development expert helping writers create detailed, compelling characters.

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
      // Provide fallback content based on field type
      const fallbacks: { [key: string]: string } = {
        name: 'Character Name',
        title: 'Noble Title',
        age: '25',
        role: 'Protagonist',
        race: 'Human',
        class: 'Warrior',
        occupation: 'Adventurer'
      };
      const fallbackContent = fallbacks[fieldKey] || `Generated ${fieldLabel}`;
      return { [fieldKey]: fallbackContent };
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