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

    // Create a more robust prompt that works better with Gemini
    const prompt = `You are a professional character development expert. Generate content for the "${fieldLabel}" field for this character:

CHARACTER CONTEXT:
${characterContext}

TASK: Generate appropriate content for "${fieldLabel}" that fits this character.

IMPORTANT: 
- Return ONLY the content for this field
- No quotes, no explanations, no labels
- Make it specific to this character
- Keep it concise but meaningful

Generate the ${fieldLabel.toLowerCase()} now:`;

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
      console.log(`Empty response from AI for field ${fieldKey}, providing contextual fallback`);
      // Provide better contextual fallbacks based on field and character info
      const contextualFallbacks: { [key: string]: string } = {
        name: character.race ? `${character.race} Character` : 'Character Name',
        title: character.class ? `The ${character.class}` : 'Noble',
        age: character.role === 'mentor' ? '45' : '25',
        race: 'Human',
        class: character.role === 'protagonist' ? 'Hero' : 'Adventurer',
        nicknames: character.name ? character.name.split(' ')[0] : 'Friend',
        aliases: 'Shadow Walker',
        goals: 'To protect those they care about',
        motivations: 'A deep sense of justice and duty',
        background: 'Grew up in a small village before discovering their destiny',
        arc: 'A journey from uncertainty to confidence and mastery'
      };
      const fallbackContent = contextualFallbacks[fieldKey] || `Generated ${fieldLabel}`;
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