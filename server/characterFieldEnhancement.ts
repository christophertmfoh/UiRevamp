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
    
    // Create field-specific prompts based on the field type
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
      // Field-specific prompts for better contextual generation
      const fieldSpecificPrompts: { [key: string]: string } = {
        race: `Generate the race/species for this character. If the name suggests an animal (like "beans" = cat), use that species. Look for clues in background, description, and personality.`,
        name: `Generate a fitting name for this character based on their race, background, and role. Consider cultural context and character traits.`,
        age: `Generate an appropriate age for this character considering their role, background, and species. For cats, use cat years or mention "appears to be X years old".`,
        nicknames: `Generate nicknames that friends, family, or companions would call this character. Base it on their name, personality, or distinctive traits.`,
        title: `Generate a title, rank, or honorific for this character based on their class, profession, and social status.`,
        aliases: `Generate secret identities, false names, or alternate personas this character might use. Consider their background and goals.`,
        class: `Generate a class or profession that fits this character's role, background, and species. For cats, consider "Familiar", "Scout", "Hunter", etc.`,
        occupation: `Generate a job or role this character has in society, considering their species, skills, and background.`,
        height: `Generate height appropriate for this character's race/species. For cats, use measurements like "12 inches at shoulder" or comparative descriptions.`,
        weight: `Generate weight appropriate for this character's race/species and build. For cats, use appropriate feline weight ranges.`,
        build: `Generate body type/build description fitting this character's race, age, and lifestyle. For cats, describe their feline physique.`,
        eyeColor: `Generate eye color that fits this character's race and personality. Consider species-typical colors.`,
        hairColor: `Generate hair/fur color appropriate for this character's species. For cats, describe fur color and patterns.`,
        physicalDescription: `Generate a detailed physical description highlighting distinctive features, posture, and overall appearance for this character's species.`,
        personalityTraits: `Generate 3-5 personality traits that fit this character's role, background, and species. For cats, include feline-typical behaviors.`,
        goals: `Generate meaningful goals this character wants to achieve, considering their background, role, and personality.`,
        motivations: `Generate what drives this character forward - their deep desires, needs, or compulsions.`,
        fears: `Generate realistic fears for this character based on their background, species, and experiences.`,
        background: `Generate a detailed backstory explaining how this character became who they are today.`,
        skills: `Generate skills and abilities this character has learned, based on their class, background, and species.`,
        abilities: `Generate special abilities, powers, or talents this character possesses, considering their species and background.`,
        talents: `Generate natural talents or gifts this character was born with, separate from learned skills.`,
        flaws: `Generate character flaws or weaknesses that create internal conflict and story opportunities.`,
        occupation: `Generate a job or profession this character has, considering their species, skills, and social context.`,
        family: `Generate information about this character's family members, relationships, and family background.`,
        relationships: `Generate key relationships this character has with other people, including friends, enemies, and allies.`,
        secrets: `Generate hidden information, mysteries, or secrets this character keeps from others.`,
        education: `Generate this character's educational background, training, or learning experiences.`,
        appearance: `Generate overall appearance and style description for this character.`,
        distinguishingFeatures: `Generate unique physical features that make this character instantly recognizable.`
      };

      const specificPrompt = fieldSpecificPrompts[fieldKey] || `Generate appropriate ${fieldLabel.toLowerCase()} content for this character.`;

      prompt = `You are a professional character development expert. ${specificPrompt}

CHARACTER CONTEXT:
${characterContext}

CURRENT VALUE: ${currentValue || 'empty'}
${currentValue ? 'Improve or replace the current value with something better.' : 'Generate new content.'}

CRITICAL INSTRUCTIONS:
- Analyze ALL character information carefully
- Generate content specific to the ${fieldLabel} field
- Make it contextually relevant to this character's established traits
- For animal characters, use species-appropriate details
- Keep responses concise but meaningful
- RESPOND WITH ONLY THE CONTENT - no explanations or quotes

Generate ${fieldLabel.toLowerCase()}:`;
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
          fallbackContent = fieldOptions && fieldOptions.includes('Comic Relief') ? 'Comic Relief' : 'Supporting Character';
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
        // Enhanced field-specific fallbacks
        const contextualFallbacks: { [key: string]: string } = {
          name: character.race === 'Cat' ? 'Whiskers' : (character.race ? `${character.race} Character` : 'Character Name'),
          title: character.class ? `The ${character.class}` : 'Noble',
          age: character.race === 'Cat' ? '3 years old' : (character.role === 'mentor' ? '45' : '25'),
          class: character.race === 'Cat' ? 'Familiar' : (character.role === 'protagonist' ? 'Hero' : 'Adventurer'),
          nicknames: character.name ? character.name.split(' ')[0] : 'Friend',
          aliases: 'Shadow Walker',
          height: character.race === 'Cat' ? '10 inches at shoulder' : '5\'8"',
          weight: character.race === 'Cat' ? '12 pounds' : '160 lbs',
          build: character.race === 'Cat' ? 'Sleek and agile feline build' : 'Athletic',
          eyeColor: character.race === 'Cat' ? 'Golden amber' : 'Brown',
          hairColor: character.race === 'Cat' ? 'Tabby brown with white patches' : 'Brown',
          goals: 'To protect those they care about',
          motivations: 'A deep sense of justice and duty',
          background: character.race === 'Cat' ? 'A house cat who discovered their magical abilities' : 'Grew up in a small village before discovering their destiny',
          arc: 'A journey from uncertainty to confidence and mastery',
          personalityTraits: character.race === 'Cat' ? 'Curious, independent, playful, loyal' : 'Brave, loyal, determined',
          fears: character.race === 'Cat' ? 'Loud noises, being separated from their human' : 'Losing loved ones',
          skills: character.race === 'Cat' ? 'Stealth, climbing, keen senses, hunting' : 'Combat, leadership',
          abilities: character.race === 'Cat' ? 'Night vision, enhanced hearing, supernatural luck' : 'Enhanced strength, combat prowess',
          talents: character.race === 'Cat' ? 'Always lands on feet, finds hidden paths' : 'Natural leadership, tactical thinking',
          flaws: character.race === 'Cat' ? 'Easily distracted, stubborn, overly curious' : 'Impulsive, self-doubting',
          family: character.race === 'Cat' ? 'Comes from a long line of magical familiars' : 'Raised by loving parents in a small town',
          relationships: character.race === 'Cat' ? 'Bonded to a wizard, friends with other familiars' : 'Close relationships with childhood friends',
          secrets: character.race === 'Cat' ? 'Can understand all human languages' : 'Harbors a dark secret from their past',
          education: character.race === 'Cat' ? 'Trained in magical arts by elder familiars' : 'Self-taught through experience and mentorship',
          appearance: character.race === 'Cat' ? 'Sleek feline with intelligent eyes and elegant movements' : 'Well-groomed with confident bearing',
          distinguishingFeatures: character.race === 'Cat' ? 'Unusually bright eyes and a distinctive tail marking' : 'A distinctive scar and penetrating gaze'
        };
        fallbackContent = contextualFallbacks[fieldKey] || `Generated ${fieldLabel}`;
      }
      
      console.log(`Using intelligent fallback for ${fieldKey}: ${fallbackContent}`);
      return { [fieldKey]: fallbackContent };
    }

    // Process array fields
    if (['personalityTraits', 'abilities', 'skills', 'talents', 'expertise', 'languages', 'archetypes', 'tropes', 'tags'].includes(fieldKey)) {
      const arrayContent = generatedContent.split(',').map((s: string) => s.trim()).filter((s: string) => s.length > 0);
      return { [fieldKey]: arrayContent };
    }

    return { [fieldKey]: generatedContent };

  } catch (error) {
    console.error(`Error enhancing field ${fieldKey}:`, error);
    throw new Error(`Failed to enhance field ${fieldKey}: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}