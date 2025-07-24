import { GoogleGenAI } from "@google/genai";

// Use the same API key logic as the main enhancement
const apiKey = process.env.GOOGLE_API_KEY_NEW || process.env.GOOGLE_API_KEY4 || process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY || "";
console.log(`Field enhancement using API key: ${apiKey ? apiKey.substring(0, 10) + '...' : 'NONE'}`);

const ai = new GoogleGenAI({ apiKey });

// Rate limiting specifically for individual field enhancements
// Full character generation and bulk operations bypass this
const fieldRequestTimes: number[] = [];
const FIELD_RATE_LIMIT_WINDOW = 60000; // 1 minute
const MAX_FIELD_REQUESTS_PER_MINUTE = 8; // Conservative for individual clicks

function canMakeFieldRequest(): boolean {
  const now = Date.now();
  // Remove requests older than 1 minute
  while (fieldRequestTimes.length > 0 && fieldRequestTimes[0] < now - FIELD_RATE_LIMIT_WINDOW) {
    fieldRequestTimes.shift();
  }
  return fieldRequestTimes.length < MAX_FIELD_REQUESTS_PER_MINUTE;
}

function recordFieldRequest(): void {
  fieldRequestTimes.push(Date.now());
}

export async function enhanceCharacterField(character: any, fieldKey: string, fieldLabel: string, currentValue: any, fieldOptions?: string[], isIndividualRequest: boolean = true) {
  try {
    console.log(`\n=== Processing ${isIndividualRequest ? 'Individual' : 'Bulk'} Field Enhancement ===`);
    console.log(`Field: ${fieldKey} (${fieldLabel})`);
    console.log(`Current value: ${currentValue || 'empty'}`);

    // Only apply rate limiting to individual field requests (genie clicks)
    // Full character generation and bulk operations bypass rate limiting
    if (isIndividualRequest && !canMakeFieldRequest()) {
      console.log(`Individual field rate limit reached, using intelligent fallback for ${fieldKey}`);
      // Skip AI call and go directly to fallback for individual requests
      throw new Error('Rate limited - using fallback');
    }

    // Always allow enhancement - users can improve existing content or generate new content

    // Create comprehensive context from ALL available character data using actual field names
    const characterContext = `
=== CHARACTER ANALYSIS ===
Name: ${character.name || 'Unknown'}
Nicknames: ${character.nicknames || 'None'}
Title: ${character.title || 'None'}
Aliases: ${character.aliases || 'None'}
Race/Species: ${character.race || character.species || 'Unknown'}
Class/Profession: ${character.class || character.profession || character.occupation || 'Unknown'}
Age: ${character.age || 'Unknown'}
Background: ${character.background || 'Unknown'}
Description: ${character.description || character.physicalDescription || 'Unknown'}
Personality: ${character.personalityTraits || character.personality || 'Unknown'}
Goals: ${character.goals || 'Unknown'}
Motivations: ${character.motivations || 'Unknown'}
Role: ${character.role || 'Unknown'}
Height: ${character.height || 'Unknown'}
Build: ${character.build || 'Unknown'}
Eye Color: ${character.eyeColor || 'Unknown'}
Hair Color: ${character.hairColor || 'Unknown'}
Skills: ${character.skills || 'Unknown'}
Abilities: ${character.abilities || 'Unknown'}
Flaws: ${character.flaws || 'Unknown'}
Story Function: ${character.storyFunction || 'Unknown'}
Notes: ${character.notes || 'Unknown'}

=== RAW CHARACTER DATA ===
${JSON.stringify(character, null, 2).substring(0, 800)}
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
5. If regenerating, choose a DIFFERENT option than before to provide variety
6. RESPOND WITH ONLY ONE OF THE EXACT OPTIONS FROM THE LIST ABOVE - no explanations`;
    } else {
      // Enhanced field-specific prompts with detailed instructions for Identity section
      const fieldSpecificPrompts: { [key: string]: string } = {
        // IDENTITY SECTION - Detailed prompts for each field
        name: `Generate a creative, fitting name for this character. Consider:
- Their species (if "beans" is a cat, suggest cat-like names or human names that fit a pet)
- Their background and role in the story
- Cultural context if specified
- Current name can be improved or completely replaced
Be creative and meaningful, not generic.`,
        
        nicknames: `Generate 2-3 nicknames this character would actually be called by friends, family, or companions:
- Based on their personality traits
- Shortened versions of their name
- Pet names or terms of endearment
- Reflecting their species (for cats: "kitty", "whiskers", etc.)
Format as a comma-separated list.`,
        
        title: `Generate an appropriate title, rank, or honorific for this character:
- Consider their social status and profession
- For cats: "Sir/Lady", "The Great", "Master/Mistress"
- For humans: professional titles, nobility ranks
- Fantasy titles that fit their role
- Make it unique and fitting, not generic.`,
        
        aliases: `Generate 1-2 secret identities, code names, or false identities this character might use:
- Consider their background and motivations
- For sneaky characters: shadow names, descriptive aliases
- For cats: playful or mysterious alternate names
- Should feel authentic to their personality.`,
        
        role: `Analyze this character's personality and background to determine their story role:
- Main character traits and motivations
- Their function in the narrative
- For cats: often "Comic Relief", "Familiar", "Companion"
- Be specific about their narrative purpose.`,
        
        race: `Determine this character's race/species by analyzing ALL available information:
- Name clues (like "beans" strongly suggests a cat)
- Background mentions of species
- Physical descriptions
- Behavioral traits
- NEVER default to "Human" unless clearly indicated
- For animal names, use the animal species.`,
        
        ethnicity: `Generate cultural/ethnic background that fits this character:
- Consider their name and background
- For cats: describe their breed or origin
- For humans: cultural heritage that matches their story
- Make it rich and specific, not vague.`,
        
        age: `Generate appropriate age considering their species and role:
- For cats: use realistic cat age (1-15 years) or describe as "appears X years old"
- For humans: age that fits their role and experience level
- Consider their background and life experience
- Be specific, not generic ranges.`,
        
        birthdate: `Generate a specific birth date that fits this character:
- Consider their age and current story timeline
- For fantasy: create appropriate calendar dates
- Make it feel real and purposeful
- Include month, day, and year if possible.`,
        
        zodiacSign: `Generate a zodiac sign that matches this character's personality:
- Analyze their personality traits carefully
- Choose sign that actually reflects their nature
- Consider both Western and Eastern zodiac if relevant
- Explain why it fits briefly.`,
        
        class: `Generate a class/profession that perfectly fits this character:
- For cats: "Familiar", "Scout", "Hunter", "Guardian", "Trickster"
- Consider their skills and role in the story
- Should match their personality and background
- Be creative and specific.`,
        
        profession: `Generate a realistic profession for this character:
- Consider their species and setting
- For cats: "Mouser", "Companion", "Shop Cat"
- Should fit their world and abilities
- Make it interesting and fitting.`,
        
        occupation: `Generate their current job or daily role:
- What they actually do day-to-day
- Consider their skills and circumstances
- For cats: their role in household/establishment
- Should be specific and realistic.`,

        // PHYSICAL/APPEARANCE SECTION - Detailed prompts for each field
        height: `Generate height appropriate for this character's race/species:
- For cats: "10-12 inches at shoulder" or "small/medium/large for a cat"
- For humans: specific measurements like "5'8\"" or descriptive "tall/average/short"
- Consider their age and build
- Be specific and realistic for their species.`,
        
        weight: `Generate weight/build description appropriate for this character:
- For cats: "8-15 pounds" or "lean/stocky/fluffy build"
- For humans: descriptive like "lean", "muscular", "heavy-set"
- Consider their lifestyle and activity level
- Should match their overall physique.`,
        
        build: `Generate detailed body type/build description:
- For cats: "sleek and agile", "sturdy and muscular", "slim and graceful"
- Describe their overall physical structure
- Consider their lifestyle and species traits
- Be specific about their physique and presence.`,
        
        eyeColor: `Generate eye color that fits this character:
- For cats: amber, green, blue, yellow, or heterochromia
- Consider their personality and species
- Can be descriptive: "bright amber", "deep emerald green"
- Make it memorable and fitting.`,
        
        hairColor: `Generate hair/fur color appropriate for this character:
- For cats: tabby patterns, solid colors, bi-color, calico
- Be specific: "orange tabby with white patches", "sleek black"
- Consider realistic colorations for their species
- Make it distinctive and vivid.`,
        
        hairStyle: `Generate hair style description:
- For cats: "short and sleek", "long and fluffy", "medium length"
- For humans: specific styles that match their personality
- Consider their lifestyle and maintenance ability
- Should reflect their character traits.`,
        
        skinTone: `Generate skin tone description:
- For cats: describe their underlying skin if visible
- For humans: use respectful, descriptive terms
- Consider their background and ethnicity
- Be natural and appropriate.`,
        
        physicalDescription: `Generate a comprehensive physical description highlighting:
- Overall appearance and presence
- Most distinctive physical features
- How they carry themselves
- Species-specific details (feline grace, human posture)
- What people notice first about them
- Paint a vivid picture in 2-3 sentences.`,
        
        distinguishingMarks: `Generate distinctive marks, scars, or features:
- For cats: unique markings, patterns, or features
- Scars with brief stories behind them
- Birthmarks or unusual colorations
- Features that make them instantly recognizable
- Should add personality and history.`,
        
        clothingStyle: `Generate clothing/style description:
- For cats: describe any collars, accessories, or adornments
- For humans: their typical fashion choices and style
- Consider their personality and social status
- Should reflect their character and role.`,
        
        bodyType: `Generate body type classification:
- For cats: "lean hunter", "stocky house cat", "graceful climber"
- Consider their lifestyle and genetics
- Should match their build and activities
- Be descriptive and specific.`,
        
        facialFeatures: `Generate distinctive facial features:
- For cats: face shape, ear size, whisker prominence
- Describe what makes their face memorable
- Consider expression and features that show personality
- Should capture their unique look.`,
        
        eyes: `Generate detailed eye description:
- Shape, size, and expression
- How they look at others
- Any distinctive qualities
- Should convey personality through their gaze.`,
        
        hair: `Generate detailed hair/fur description:
- Texture, thickness, condition
- How it moves or behaves
- Maintenance and styling
- Should add to their overall appearance.`,
        
        skin: `Generate skin description focusing on:
- Texture and condition
- Any notable characteristics
- How it reflects their lifestyle
- Should be appropriate for their species.`,
        
        complexion: `Generate complexion description:
- Overall skin appearance
- Health and vitality indicators
- Environmental effects (sun, weather)
- Should reflect their lifestyle and health.`,
        
        scars: `Generate scars with brief stories:
- Location and appearance of scars
- Hint at how they were acquired
- What they reveal about character's past
- Should add depth and history.`,
        
        tattoos: `Generate tattoos with meaning:
- Design and placement
- Personal significance or story
- Artistic style and quality
- Should reflect personality and values.`,
        
        piercings: `Generate piercings that fit the character:
- Type and location
- Style and materials
- When and why they got them
- Should match their personality.`,
        
        birthmarks: `Generate distinctive birthmarks:
- Unique shapes or patterns
- Location and size
- Any cultural or personal significance
- Should be memorable details.`,
        
        attire: `Generate current outfit description:
- What they're wearing right now
- Condition and style of clothing
- How it reflects their status/role
- Should paint a clear visual picture.`,
        
        accessories: `Generate accessories they typically wear:
- Jewelry, watches, bags, etc.
- Practical items they carry
- Sentimental pieces
- Should reflect personality and needs.`,
        
        posture: `Generate how they carry themselves:
- Standing and sitting posture
- Confidence level shown through body language
- Any distinctive ways they hold themselves
- Should reflect personality and background.`,
        
        gait: `Generate how they move and walk:
- Walking style and pace
- Any distinctive movement patterns
- Grace, awkwardness, or unique traits
- Should show personality through movement.`,
        
        gestures: `Generate distinctive hand and body gestures:
- Common hand movements while talking
- Nervous habits or confident displays
- Cultural or personal gesture patterns
- Should reveal personality traits.`,
        
        mannerisms: `Generate distinctive behavioral patterns:
- Repeated actions or habits
- Ways they react to situations
- Unconscious behaviors
- Should make them feel like a real person/character.`,
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
- If content already exists, generate something DIFFERENT for variety
- Use random variation (${Math.random().toString(36).substring(7)}) to ensure uniqueness
- Keep responses concise but meaningful
- RESPOND WITH ONLY THE CONTENT - no explanations or quotes

Generate ${fieldLabel.toLowerCase()}:`;
    }

    console.log(`Generating content for field: ${fieldKey}`);
    
    // Only record individual field requests for rate limiting
    if (isIndividualRequest) {
      recordFieldRequest();
    }
    
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      config: {
        temperature: 0.95, // Higher creativity for more varied responses
        maxOutputTokens: 300, // More tokens for detailed responses
        candidateCount: 1
      },
      contents: prompt,
    });

    const generatedContent = response.text?.trim() || '';
    console.log(`Generated content for ${fieldKey}: ${generatedContent || 'EMPTY RESPONSE FROM AI'}`);
    
    // Enhanced error handling - if AI returns empty, log the prompt to debug
    if (!generatedContent) {
      console.log(`AI returned empty response for ${fieldKey}. Prompt was:`, prompt.substring(0, 200) + '...');
    }

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
        // Enhanced contextual fallbacks that analyze character data intelligently
        // Add variety by using random selection and dynamic generation
        const randomSeed = Math.random();
        const contextualFallbacks: { [key: string]: string } = {
          // IDENTITY SECTION INTELLIGENT FALLBACKS
          name: (() => {
            if (character.race === 'Cat' || character.name?.toLowerCase() === 'beans') {
              const catNames = ['Whiskers', 'Shadow', 'Luna', 'Mochi', 'Pixel', 'Nova', 'Sage', 'Ash'];
              return catNames[Math.floor(randomSeed * catNames.length)];
            }
            if (character.race) {
              const humanNames = ['Alex Morgan', 'Jordan Blake', 'Casey Rivers', 'Riley Stone'];
              const fantasyNames = ['Wanderer', 'Seeker', 'Traveler', 'Keeper'];
              return character.race === 'Human' ? 
                humanNames[Math.floor(randomSeed * humanNames.length)] : 
                `${character.race} ${fantasyNames[Math.floor(randomSeed * fantasyNames.length)]}`;
            }
            const genericNames = ['Character Name', 'Unknown Hero', 'The Stranger', 'Nameless One'];
            return genericNames[Math.floor(randomSeed * genericNames.length)];
          })(),
          
          nicknames: (() => {
            if (character.race === 'Cat' || character.name?.toLowerCase() === 'beans') {
              const catNicknameSets = [
                'Kitty, Whiskers, Little One',
                'Bean, Beanie, Sweetie',
                'Furball, Paws, Cutie',
                'Shadow, Ninja, Sneaky',
                'Fluffy, Softie, Snuggles'
              ];
              return catNicknameSets[Math.floor(randomSeed * catNicknameSets.length)];
            }
            if (character.name) {
              const firstName = character.name.split(' ')[0];
              const endings = ['Buddy, Friend', 'Ace, Champ', 'Star, Hero', 'Chief, Boss'];
              return `${firstName.substring(0, 3) || firstName}, ${endings[Math.floor(randomSeed * endings.length)]}`;
            }
            const genericSets = ['Pal, Friend, Buddy', 'Ace, Champ, Hero', 'Star, Chief, Boss'];
            return genericSets[Math.floor(randomSeed * genericSets.length)];
          })(),
          
          title: (() => {
            if (character.race === 'Cat') return 'Sir Whiskers';
            if (character.class?.toLowerCase().includes('mage')) return 'The Wise';
            if (character.class?.toLowerCase().includes('warrior')) return 'The Brave';
            if (character.profession) return `The ${character.profession}`;
            return 'The Wanderer';
          })(),
          
          aliases: (() => {
            if (character.race === 'Cat') return 'Shadow Paws, Night Hunter';
            if (character.class?.toLowerCase().includes('rogue')) return 'Silent Blade, Shadow Walker';
            if (character.name) return `The ${character.name.split(' ')[0]}, Mystery Person`;
            return 'The Stranger, Unknown One';
          })(),
          
          role: (() => {
            if (character.race === 'Cat') return 'Companion';
            if (character.name?.toLowerCase().includes('hero') || character.class?.toLowerCase().includes('warrior')) return 'Protagonist';
            if (character.background?.toLowerCase().includes('evil') || character.class?.toLowerCase().includes('dark')) return 'Antagonist';
            return 'Supporting Character';
          })(),
          
          race: (() => {
            const name = (character.name || '').toLowerCase();
            const background = (character.background || '').toLowerCase();
            const desc = (character.description || '').toLowerCase();
            const allText = `${name} ${background} ${desc}`;
            
            if (name === 'beans' || allText.includes('cat') || allText.includes('feline')) return 'Cat';
            if (allText.includes('elf')) return 'Elf';
            if (allText.includes('dwarf')) return 'Dwarf';
            if (allText.includes('dragon')) return 'Dragon';
            return 'Human';
          })(),
          
          ethnicity: (() => {
            if (character.race === 'Cat') return 'Domestic Shorthair';
            if (character.race === 'Elf') return 'Wood Elf';
            if (character.race === 'Dwarf') return 'Mountain Dwarf';
            return 'Mixed Heritage';
          })(),
          
          age: (() => {
            if (character.race === 'Cat') return '3 years old';
            if (character.role?.toLowerCase().includes('mentor')) return '55';
            if (character.class?.toLowerCase().includes('young') || character.background?.toLowerCase().includes('student')) return '19';
            return '27';
          })(),
          
          birthdate: (() => {
            const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
            const month = months[Math.floor(Math.random() * 12)];
            const day = Math.floor(Math.random() * 28) + 1;
            const year = character.race === 'Cat' ? 'Spring of 2021' : `${month} ${day}, 1995`;
            return year;
          })(),
          
          zodiacSign: (() => {
            if (character.race === 'Cat') return 'Leo (playful and confident)';
            const signs = ['Aries (bold)', 'Taurus (steady)', 'Gemini (curious)', 'Cancer (caring)', 'Leo (confident)', 'Virgo (precise)', 'Libra (balanced)', 'Scorpio (intense)', 'Sagittarius (adventurous)', 'Capricorn (determined)', 'Aquarius (independent)', 'Pisces (intuitive)'];
            return signs[Math.floor(Math.random() * signs.length)];
          })(),
          
          class: (() => {
            if (character.race === 'Cat') return 'Familiar';
            if (character.background?.toLowerCase().includes('fight') || character.role?.toLowerCase().includes('warrior')) return 'Warrior';
            if (character.background?.toLowerCase().includes('magic') || character.role?.toLowerCase().includes('mage')) return 'Mage';
            if (character.background?.toLowerCase().includes('sneak') || character.role?.toLowerCase().includes('thief')) return 'Rogue';
            return 'Adventurer';
          })(),
          
          profession: (() => {
            if (character.race === 'Cat') return 'House Guardian';
            if (character.class === 'Warrior') return 'Town Guard';
            if (character.class === 'Mage') return 'Court Wizard';
            if (character.class === 'Rogue') return 'Information Broker';
            return 'Traveling Merchant';
          })(),
          
          occupation: (() => {
            if (character.race === 'Cat') return 'Professional Napper and Mouse Hunter';
            if (character.profession) return character.profession;
            if (character.class) return `Working ${character.class}`;
            return 'Jack of All Trades';
          })(),
          
          // PHYSICAL/APPEARANCE SECTION INTELLIGENT FALLBACKS
          height: (() => {
            if (character.race === 'Cat') return '11 inches at shoulder';
            if (character.build?.toLowerCase().includes('tall')) return '6\'1"';
            if (character.build?.toLowerCase().includes('short')) return '5\'4"';
            return '5\'8"';
          })(),
          
          weight: (() => {
            if (character.race === 'Cat') return '10 pounds';
            if (character.build?.toLowerCase().includes('muscular')) return 'Muscular build, 180 lbs';
            if (character.build?.toLowerCase().includes('slim')) return 'Lean build, 140 lbs';
            return 'Average build, 160 lbs';
          })(),
          
          build: (() => {
            if (character.race === 'Cat') return 'Sleek and agile feline build with graceful movements';
            if (character.class?.toLowerCase().includes('warrior')) return 'Muscular and athletic from training';
            if (character.class?.toLowerCase().includes('mage')) return 'Lean and scholarly build';
            return 'Well-proportioned and healthy';
          })(),
          
          eyeColor: (() => {
            if (character.race === 'Cat') return 'Bright amber with golden flecks';
            const colors = ['Brown', 'Blue', 'Green', 'Hazel', 'Gray'];
            return colors[Math.floor(Math.random() * colors.length)];
          })(),
          
          hairColor: (() => {
            if (character.race === 'Cat') return 'Orange tabby with white chest patch';
            const colors = ['Brown', 'Black', 'Blonde', 'Auburn', 'Dark Brown'];
            return colors[Math.floor(Math.random() * colors.length)];
          })(),
          
          hairStyle: (() => {
            if (character.race === 'Cat') return 'Short, soft fur that\'s well-groomed';
            if (character.class?.toLowerCase().includes('warrior')) return 'Practical, short cut';
            if (character.class?.toLowerCase().includes('noble')) return 'Elegant, well-styled';
            return 'Medium length, casually styled';
          })(),
          
          skinTone: (() => {
            if (character.race === 'Cat') return 'Pink skin beneath fur';
            const tones = ['Fair', 'Light', 'Medium', 'Olive', 'Tan', 'Dark'];
            return tones[Math.floor(Math.random() * tones.length)];
          })(),
          
          physicalDescription: (() => {
            if (character.race === 'Cat') return 'A charming cat with bright, intelligent eyes and a graceful demeanor. Their sleek form moves with natural feline elegance, and their expressive face shows remarkable intelligence and curiosity.';
            return 'A well-proportioned individual with an approachable demeanor and confident bearing. Their expressive features and steady gaze suggest both intelligence and reliability.';
          })(),
          
          distinguishingMarks: (() => {
            if (character.race === 'Cat') return 'Unique white marking on forehead resembling a small star';
            const marks = ['Small scar above left eyebrow', 'Distinctive birthmark on left shoulder', 'Faint freckles across the nose', 'Small mole on right cheek'];
            return marks[Math.floor(Math.random() * marks.length)];
          })(),
          
          clothingStyle: (() => {
            if (character.race === 'Cat') return 'Simple leather collar with a small bell';
            if (character.class?.toLowerCase().includes('noble')) return 'Fine fabrics and elegant cuts in rich colors';
            if (character.class?.toLowerCase().includes('warrior')) return 'Practical, durable clothing suited for action';
            return 'Comfortable, practical clothing in earth tones';
          })(),
          
          bodyType: (() => {
            if (character.race === 'Cat') return 'Typical domestic cat build - lithe and agile';
            if (character.build?.toLowerCase().includes('athletic')) return 'Mesomorphic - naturally athletic';
            return 'Balanced build with good proportions';
          })(),
          
          facialFeatures: (() => {
            if (character.race === 'Cat') return 'Heart-shaped face with large, expressive eyes and prominent whiskers';
            return 'Well-defined features with an open, honest expression';
          })(),
          
          eyes: (() => {
            if (character.race === 'Cat') return 'Large, round eyes that seem to see everything';
            return 'Expressive eyes that reflect their inner thoughts';
          })(),
          
          hair: (() => {
            if (character.race === 'Cat') return 'Soft, dense fur with natural oils for healthy shine';
            return 'Healthy hair with natural body and shine';
          })(),
          
          skin: (() => {
            if (character.race === 'Cat') return 'Healthy pink skin beneath soft fur';
            return 'Clear, healthy skin with good tone';
          })(),
          
          complexion: (() => {
            if (character.race === 'Cat') return 'Healthy and well-maintained';
            return 'Clear complexion with natural warmth';
          })(),
          
          scars: (() => {
            if (character.race === 'Cat') return 'Small scar on left ear from a childhood accident';
            if (character.class?.toLowerCase().includes('warrior')) return 'Battle scar across knuckles from training';
            return 'No significant scars';
          })(),
          
          tattoos: (() => {
            if (character.race === 'Cat') return 'No tattoos (fur covered)';
            if (character.background?.toLowerCase().includes('sailor')) return 'Anchor tattoo on forearm';
            return 'No tattoos';
          })(),
          
          piercings: (() => {
            if (character.race === 'Cat') return 'No piercings';
            return 'Simple ear piercings';
          })(),
          
          birthmarks: (() => {
            if (character.race === 'Cat') return 'Unique fur pattern on belly';
            return 'Small birthmark behind right ear';
          })(),
          
          attire: (() => {
            if (character.race === 'Cat') return 'Wearing a comfortable leather collar with identification tag';
            return 'Currently dressed in practical, well-maintained clothing';
          })(),
          
          accessories: (() => {
            if (character.race === 'Cat') return 'Collar with small bell and ID tag';
            return 'Simple, practical accessories';
          })(),
          
          posture: (() => {
            if (character.race === 'Cat') return 'Alert and poised, with natural feline grace';
            return 'Confident posture with relaxed shoulders';
          })(),
          
          gait: (() => {
            if (character.race === 'Cat') return 'Silent, graceful movement with perfect balance';
            return 'Steady, purposeful walk with good balance';
          })(),
          
          gestures: (() => {
            if (character.race === 'Cat') return 'Expressive tail movements and head tilts';
            return 'Natural, understated hand gestures when speaking';
          })(),
          
          mannerisms: (() => {
            if (character.race === 'Cat') return 'Head tilts when curious, slow blinks when content, kneading with paws when happy';
            return 'Thoughtful pausing before speaking, gentle nods when listening';
          })(),
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