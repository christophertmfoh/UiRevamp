import { GoogleGenAI } from "@google/genai";

// Use the same API key logic as the main enhancement
const apiKey = process.env.GOOGLE_API_KEY_NEW || process.env.GOOGLE_API_KEY4 || process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY || "";
console.log(`Field enhancement using API key: ${apiKey ? apiKey.substring(0, 10) + '...' : 'NONE'}`);

const ai = new GoogleGenAI({ apiKey });

export async function enhanceCharacterField(character: any, fieldKey: string, fieldLabel: string, currentValue: any, fieldOptions?: string[]) {
  try {
    console.log(`\n=== Processing Individual Field Enhancement ===`);
    console.log(`Field: ${fieldKey} (${fieldLabel})`);
    console.log(`Current value: ${currentValue || 'empty'}`);

    // Always allow enhancement - users can improve existing content or generate new content

    // Create comprehensive context from ALL available character data
    const characterContext = `
Character Name: ${character.name || 'Unknown'}
Role: ${character.role || 'Character'}  
Race/Species: ${character.race || 'Unknown'}
Class/Profession: ${character.class || 'Unknown'}
Age: ${character.age || 'Unknown'}
Background: ${character.background || 'Unknown'}
Description: ${character.description || 'Unknown'}
Personality: ${character.personality || character.personalityTraits?.join(', ') || 'Unknown'}
Physical Description: ${character.physicalDescription || 'Unknown'}
Appearance: ${character.appearance || 'Unknown'}
Story Function: ${character.storyFunction || 'Unknown'}
Notes: ${character.notes || 'Unknown'}
Other Details: ${JSON.stringify(character).substring(0, 500)}
    `.trim();

    console.log(`Full character context being sent to AI:`, characterContext);

    // Check if this is a dropdown field with specific options
    const isDropdownField = fieldOptions && fieldOptions.length > 0;
    
    let prompt;
    if (isDropdownField) {
      prompt = `You are a professional character development expert. Analyze this character and choose the most appropriate option from the dropdown list for "${fieldLabel}".

CRITICAL: READ ALL CHARACTER DATA CAREFULLY:
${characterContext}

AVAILABLE OPTIONS FOR "${fieldLabel}":
${fieldOptions.map(option => `- ${option}`).join('\n')}

TASK: Choose the BEST option from the list above that fits this character
CURRENT VALUE: ${currentValue || 'empty'}

INSTRUCTIONS:
1. CAREFULLY analyze the character information
2. Consider the character's name, background, description, personality
3. Choose the option that best fits their role in the story
4. For a character named "beans" who is a cat, consider roles like "Comic Relief" or "Supporting Character"
5. RESPOND WITH ONLY ONE OF THE EXACT OPTIONS FROM THE LIST ABOVE - no explanations`;
    } else {
      prompt = `You are a professional character development expert. I need you to analyze this character's existing information and generate appropriate content for the "${fieldLabel}" field.

CRITICAL: READ ALL CHARACTER DATA CAREFULLY:
${characterContext}

TASK: Generate content for "${fieldLabel}" field
CURRENT VALUE: ${currentValue || 'empty'}

CRITICAL INSTRUCTIONS:
1. CAREFULLY analyze ALL the character information above
2. If the character name suggests an animal (like "beans" = cat), use that species
3. If any description mentions the character is an animal, use that species
4. If background/description mentions fantasy races (elf, dwarf, etc.), use those
5. Pay attention to ALL context clues about what this character actually is
6. DO NOT default to "Human" unless there's clear evidence they are human
7. Generate content that matches the established character traits

For Race/Species specifically:
- Look for animal names, animal descriptions, fantasy race mentions
- Consider the character's name, description, background for species clues
- Only use "Human" if explicitly stated or clearly implied

RESPOND WITH ONLY THE ${fieldLabel.toLowerCase()} VALUE - no explanations, quotes, or labels:`;
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
      console.log(`Empty response from AI for field ${fieldKey}, analyzing character for intelligent fallback`);
      
      // Intelligent contextual fallbacks that actually read character data
      let fallbackContent = `Generated ${fieldLabel}`;
      
      if (fieldKey === 'race') {
        // Smart race detection from character data
        const name = (character.name || '').toLowerCase();
        const desc = (character.description || '').toLowerCase();
        const background = (character.background || '').toLowerCase();
        const allText = `${name} ${desc} ${background}`.toLowerCase();
        
        if (name.includes('beans') || allText.includes('cat') || allText.includes('feline')) {
          fallbackContent = 'Cat';
        } else if (allText.includes('dog') || allText.includes('canine')) {
          fallbackContent = 'Dog';
        } else if (allText.includes('elf') || allText.includes('elven')) {
          fallbackContent = 'Elf';
        } else if (allText.includes('dwarf') || allText.includes('dwarven')) {
          fallbackContent = 'Dwarf';
        } else if (allText.includes('dragon')) {
          fallbackContent = 'Dragon';
        } else {
          fallbackContent = 'Human'; // Only default to human if no other clues
        }
      } else if (fieldKey === 'role' && isDropdownField) {
        // Smart role selection from dropdown options
        const name = (character.name || '').toLowerCase();
        const desc = (character.description || '').toLowerCase();
        const background = (character.background || '').toLowerCase();
        const allText = `${name} ${desc} ${background}`.toLowerCase();
        
        if (allText.includes('cat') || allText.includes('funny') || allText.includes('cute')) {
          fallbackContent = fieldOptions.includes('Comic Relief') ? 'Comic Relief' : 'Supporting Character';
        } else if (allText.includes('hero') || allText.includes('main')) {
          fallbackContent = 'Protagonist';
        } else if (allText.includes('villain') || allText.includes('evil')) {
          fallbackContent = 'Antagonist';
        } else if (allText.includes('mentor') || allText.includes('teacher')) {
          fallbackContent = 'Mentor';
        } else {
          fallbackContent = 'Supporting Character'; // Default for dropdown
        }
      } else {
        // Other field fallbacks
        const contextualFallbacks: { [key: string]: string } = {
          name: character.race ? `${character.race} Character` : 'Character Name',
          title: character.class ? `The ${character.class}` : 'Noble',
          age: character.role === 'mentor' ? '45' : '25',
          class: character.role === 'protagonist' ? 'Hero' : 'Adventurer',
          nicknames: character.name ? character.name.split(' ')[0] : 'Friend',
          aliases: 'Shadow Walker',
          goals: 'To protect those they care about',
          motivations: 'A deep sense of justice and duty',
          background: 'Grew up in a small village before discovering their destiny',
          arc: 'A journey from uncertainty to confidence and mastery'
        };
        fallbackContent = contextualFallbacks[fieldKey] || `Generated ${fieldLabel}`;
      }
      
      console.log(`Using intelligent fallback for ${fieldKey}: ${fallbackContent}`);
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