import { GoogleGenerativeAI } from '@google/generative-ai';
import type { Project, Character } from '../shared/schema';

interface CharacterGenerationOptions {
  characterType: string;
  role: string;
  customPrompt: string;
  personality: string;
  archetype: string;
}

interface CharacterGenerationContext {
  project: Project;
  existingCharacters: Character[];
  generationOptions?: CharacterGenerationOptions;
}

// Initialize Gemini client
function getGeminiClient(): GoogleGenerativeAI {
  const apiKey = process.env.GOOGLE_API_KEY_1 || process.env.GOOGLE_API_KEY || process.env.GEMINI_API_KEY;
  
  if (!apiKey) {
    throw new Error('Gemini API key is not configured. Please add GOOGLE_API_KEY_1, GOOGLE_API_KEY or GEMINI_API_KEY to your environment variables.');
  }
  
  console.log('Server: Initializing Gemini client with API key found');
  return new GoogleGenerativeAI(apiKey);
}

export async function generateContextualCharacter(
  context: CharacterGenerationContext
): Promise<Partial<Character>> {
  try {
    // Build context from project data
    const projectContext = buildProjectContext(context);
    
    const client = getGeminiClient();
    const model = client.getGenerativeModel({ model: "gemini-1.5-flash" });
    
    const prompt = `You are an expert character development specialist and creative writing consultant. Your expertise lies in creating psychologically complex, narratively compelling characters that feel authentic and three-dimensional.

🚨 CRITICAL INSTRUCTION: You MUST create a completely UNIQUE character for each request. NEVER reuse names, traits, or characteristics from previous generations. Each character must be distinctly different and reflect the specific user inputs provided.

MISSION: Generate a complete, publication-ready character that seamlessly integrates into the provided story world with rich internal life, compelling motivations, and realistic contradictions that drive narrative tension.

CHARACTER DEVELOPMENT PRINCIPLES:
- Every trait must serve a narrative purpose
- Internal conflicts should create external story opportunities  
- Strengths and flaws must be interconnected and create compelling drama
- Background details should directly inform present-day behaviors and goals
- Physical appearance should reflect personality and life experiences
- Relationships should reveal character depth and create plot potential

Your response must be valid JSON in this exact format. Generate vivid, specific content for EVERY field - no generic placeholders or vague descriptions. Each field should feel authentic to the character's world and circumstances:

{
  "name": "Distinctive name that fits the world and hints at character essence",
  "nicknames": "Meaningful nicknames earned through actions or relationships - include origin stories",
  "title": "Earned titles, ranks, or epithets that reflect achievements or reputation", 
  "aliases": "False identities or alternate personas with specific purposes",
  "role": "Narrative function (protagonist/antagonist/mentor/catalyst/etc) with clear story purpose",
  "class": "Profession or role that defines their skills, social position, and daily life",
  "age": "Specific age that explains their capabilities, experience level, and life stage",
  "race": "Species/ethnicity with cultural implications for worldview and background",
  "gender": "Gender identity that may influence their experiences and perspectives",
  "oneLine": "Compelling elevator pitch that captures their essence and main conflict",
  "physicalDescription": "Vivid head-to-toe description showing how their body tells their life story - scars from battles, calluses from work, posture from confidence/trauma, etc.",
  "height": "Specific height with implications for their presence and capabilities",
  "build": "Body type that reflects their lifestyle, genetics, and life experiences",
  "eyeColor": "Eye color with emotional or supernatural significance if relevant",
  "hairColor": "Hair color and any changes due to stress, magic, or deliberate styling",
  "hairStyle": "Specific hairstyle that reflects personality, culture, or practical needs",
  "skinTone": "Skin appearance affected by environment, genetics, lifestyle, or magical influences",
  "distinguishingMarks": "Specific scars, tattoos, birthmarks with stories behind each mark",
  "clothingStyle": "Fashion choices that reveal class, personality, practical needs, and cultural background",
  "personalityOverview": "Rich psychological profile revealing the core contradictions and complexities that make them human",
  "temperament": "Fundamental emotional baseline with triggers that change their behavior dramatically",
  "personalityTraits": ["specific behavioral patterns", "emotional tendencies", "social behaviors", "moral inclinations", "unique quirks"],
  "worldview": "Philosophy shaped by formative experiences - how trauma, success, or revelations changed their perspective",
  "values": "Non-negotiable principles they'll die for versus convenient beliefs they'll abandon under pressure",
  "goals": "Specific, measurable objectives with deadlines and personal stakes - what happens if they fail?",
  "motivations": "Deep psychological drivers rooted in childhood, trauma, love, or existential needs",
  "fears": "Primal terrors that paralyze them and rational concerns that drive smart decisions",
  "desires": "Secret longings they might never admit - what they'd sacrifice everything to achieve",
  "vices": "Specific addictions, compulsions, or moral compromises that create vulnerability and conflict",
  "coreAbilities": "Primary abilities and talents",
  "skills": ["skill1", "skill2", "skill3", "skill4"],
  "talents": ["talent1", "talent2", "talent3"],
  "specialAbilities": "Unique or supernatural abilities",
  "powers": "Special powers or magical abilities",
  "strengths": "Character's key strengths and positive traits",
  "weaknesses": "Vulnerabilities and areas of struggle",
  "training": "Formal education, apprenticeships, or training",
  "backstory": "Rich background history explaining how they became who they are",
  "childhood": "Early life experiences and upbringing",
  "familyHistory": "Family background and lineage",
  "education": "Formal and informal learning experiences",
  "formativeEvents": "Key events that shaped their character",
  "socialClass": "Economic and social standing",
  "occupation": "Current job or primary activity",
  "spokenLanguages": ["language1", "language2"],
  "family": "Family members and relationships",
  "friends": "Close friendships and bonds",
  "allies": "Political or strategic alliances",
  "enemies": "Adversaries and opponents",
  "rivals": "Competitive relationships",
  "mentors": "Teachers and guides",
  "relationships": "Romantic and significant relationships",
  "socialCircle": "Broader social connections",
  "storyFunction": "Role this character serves in the narrative",
  "personalTheme": "Central theme this character represents",
  "symbolism": "What this character symbolizes in the story",
  "inspiration": "Real-world or fictional inspirations",
  "archetypes": ["archetype1", "archetype2"],
  "notes": "Additional writer notes and development ideas",
  "flaws": "Character weaknesses and negative traits that create conflict",
  "secrets": "Hidden aspects, past events, or knowledge they conceal",
  "equipment": "Notable possessions, tools, weapons, or gear",
  "habits": "Daily routines, mannerisms, and behavioral patterns",
  "quirks": "Unique behavioral traits and eccentricities"
}

QUALITY STANDARDS:
- Every detail must feel researched and authentic to the world
- Contradictions should create internal tension (kind but ruthless, brave but insecure)
- Backstory elements should connect to create a cohesive life story
- Physical traits should reflect their life experiences and personality
- All relationships should have specific history and emotional stakes
- Goals and fears should create clear story potential and character arcs

CRITICAL REQUIREMENTS:
1. 🚨 MANDATORY: Create a COMPLETELY UNIQUE character - NO reused names, traits, or details from any previous generation
2. Generate publication-quality, specific content for EVERY SINGLE field above (all 67 fields)  
3. NO generic descriptions, placeholder text, or vague statements allowed
4. Each response should feel like it came from deep character research
5. Base all content on the user's specific inputs and story context provided below
6. Ensure all text is properly escaped and JSON is completely valid
7. Arrays must be properly formatted with quoted strings: ["item1", "item2", "item3"]
8. No trailing commas, no unescaped quotes, no incomplete fields
9. Every field must have meaningful content - empty strings "" are acceptable only when contextually appropriate

RESPONSE FORMAT: Return ONLY valid JSON with no markdown, no explanations, no additional text - just the complete character object with all 67 fields populated.

${projectContext}`;

    console.log('Server: Sending prompt to Gemini with enhanced JSON configuration');
    
    // Enhanced model configuration for better JSON output
    const result = await model.generateContent({
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 0.7, // Lower temperature for more consistent structure
        topK: 40,
        topP: 0.8,
        maxOutputTokens: 4096, // Increased for full character data
        responseMimeType: "application/json" // Request JSON format
      }
    });
    
    const response = result.response;
    const text = response.text();
    
    console.log('Server: Gemini response received:', text.substring(0, 200) + '...');
    console.log('Server: Full response length:', text.length);
    
    // Log the raw response for debugging
    if (text.length < 1000) {
      console.log('Server: Full response:', text);
    }
    
    // Enhanced JSON cleaning and extraction
    let cleanText = text;
    
    // Remove markdown code blocks if present
    cleanText = cleanText.replace(/```json\s*\n?/g, '').replace(/```\s*$/g, '');
    
    // Extract JSON from the response (in case there's extra text)
    const jsonMatch = cleanText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      console.error('Server: No JSON found in response:', text);
      throw new Error('No valid JSON found in response');
    }
    
    let jsonString = jsonMatch[0];
    
    // Enhanced JSON cleaning for robust parsing
    // Replace smart quotes with regular quotes
    jsonString = jsonString.replace(/[""]/g, '"');
    jsonString = jsonString.replace(/['']/g, "'");
    
    // Fix array formatting issues - handle complex array structures
    jsonString = jsonString.replace(/:\s*\[([^\]]*)\]/g, (match, content) => {
      // Clean up array content and fix colon issues in arrays
      let cleanContent = content.replace(/["""]/g, '"').trim();
      
      // Fix cases where colons appear instead of commas in arrays (e.g., "item1" : "description", "item2")
      cleanContent = cleanContent.replace(/"\s*:\s*"[^"]*",?\s*"/g, (colonMatch: string) => {
        // Extract just the key part before the colon
        const keyMatch = colonMatch.match(/^"([^"]*?)"/);
        return keyMatch ? `"${keyMatch[1]}"` : colonMatch;
      });
      
      if (cleanContent && !cleanContent.startsWith('"')) {
        // Split by comma and wrap items in quotes if they aren't already
        const items = cleanContent.split(',').map((item: string) => {
          const trimmed = item.trim().replace(/^"(.*)"$/, '$1'); // Remove existing quotes
          return trimmed ? `"${trimmed}"` : '';
        }).filter((item: string) => item);
        return `: [${items.join(', ')}]`;
      }
      return `: [${cleanContent}]`;
    });
    
    // Fix object key-value formatting issues
    jsonString = jsonString.replace(/([{,]\s*)([^"}\s][^":]*?)(\s*:)/g, '$1"$2"$3');
    
    // Remove trailing commas before closing braces/brackets  
    jsonString = jsonString.replace(/,\s*([}\]])/g, '$1');
    
    // Fix incomplete JSON by ensuring it ends properly
    if (!jsonString.trim().endsWith('}')) {
      console.log('Server: JSON appears incomplete, attempting to complete it');
      // Find the last complete field and close the JSON
      const lastCommaIndex = jsonString.lastIndexOf(',');
      const lastQuoteIndex = jsonString.lastIndexOf('"');
      if (lastCommaIndex > lastQuoteIndex) {
        // Remove trailing comma and close
        jsonString = jsonString.substring(0, lastCommaIndex) + '}';
      } else {
        jsonString = jsonString + '}';
      }
    }
    
    console.log('Server: Attempting to parse JSON:', jsonString.substring(0, 500) + '...');
    
    let generatedData;
    
    // Multiple parsing attempts with progressive cleaning
    for (let attempt = 1; attempt <= 3; attempt++) {
      try {
        generatedData = JSON.parse(jsonString);
        console.log(`Server: Parsed character data successfully on attempt ${attempt}`);
        break;
      } catch (parseError: any) {
        console.log(`Server: JSON parse attempt ${attempt} failed:`, parseError.message);
        
        if (attempt < 3) {
          // Progressive cleaning for next attempt
          if (attempt === 1) {
            // Second attempt: Fix escaped quotes in values specifically
            jsonString = jsonString.replace(/:\s*"([^"]*\\"[^"]*)*"/g, (match, value) => {
              // Fix escaped quotes within string values
              const cleanValue = value.replace(/\\"/g, '"');
              return `: "${cleanValue.replace(/"/g, '\\"')}"`;
            });
          } else if (attempt === 2) {
            // Third attempt: More aggressive cleaning - rebuild the JSON structure
            try {
              // Extract all key-value pairs using regex
              const pairs = jsonString.match(/"[^"]+"\s*:\s*"[^"]*(?:\\.[^"]*)*"/g) || [];
              const simpleObject: any = {};
              
              pairs.forEach(pair => {
                const colonIndex = pair.indexOf(':');
                if (colonIndex > 0) {
                  let key = pair.substring(0, colonIndex).replace(/[^\w]/g, '');
                  let value = pair.substring(colonIndex + 1).replace(/^[\s"]+|[\s"]+$/g, '');
                  value = value.replace(/\\"/g, '"'); // Unescape quotes
                  simpleObject[key] = value;
                }
              });
              
              if (Object.keys(simpleObject).length > 0) {
                jsonString = JSON.stringify(simpleObject);
                console.log('Server: Rebuilt JSON structure for attempt 3');
              }
            } catch (rebuildError) {
              console.log('Server: Failed to rebuild JSON structure:', rebuildError);
            }
          }
        }
      }
    }
    
    if (!generatedData) {
      console.error('Server: All JSON parsing attempts failed');
      console.error('Server: Problematic JSON (first 500 chars):', jsonString.substring(0, 500));
      console.error('Server: Problematic JSON (last 500 chars):', jsonString.substring(Math.max(0, jsonString.length - 500)));
      
      // Try to salvage partial data by manually extracting key fields
      try {
        const nameMatch = jsonString.match(/"name"\s*:\s*"([^"]+)"/);
        const titleMatch = jsonString.match(/"title"\s*:\s*"([^"]+)"/);
        const roleMatch = jsonString.match(/"role"\s*:\s*"([^"]+)"/);
        const descMatch = jsonString.match(/"description"\s*:\s*"([^"]+)"/);
        
        if (nameMatch) {
          console.log('Server: Attempting to salvage partial character data');
          generatedData = {
            name: nameMatch[1] || 'Generated Character',
            title: titleMatch?.[1] || '',
            role: roleMatch?.[1] || 'supporting',
            description: descMatch?.[1] || '',
            class: '',
            age: '25',
            race: 'Human',
            oneLine: 'A mysterious character from the world.',
            personality: '',
            backstory: '',
            motivations: '',
            goals: '',
            fears: '',
            flaws: '',
            secrets: '',
            skills: '',
            equipment: ''
          };
        } else {
          throw new Error('Failed to parse character data. Please try again.');
        }
      } catch (salvageError) {
        throw new Error('Failed to parse character data. Please try again.');
      }
    }
    
    // Map ALL generated fields to character schema - comprehensive field mapping
    const processedData = {
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      // Identity fields
      name: generatedData.name || 'Generated Character',
      nicknames: generatedData.nicknames || '',
      title: generatedData.title || '',
      aliases: generatedData.aliases || '',
      age: generatedData.age ? String(generatedData.age) : '',
      race: generatedData.race || '',
      class: generatedData.class || '',
      role: generatedData.role || 'supporting',
      gender: generatedData.gender || '',
      
      // Appearance fields
      physicalDescription: generatedData.physicalDescription || generatedData.description || '',
      height: generatedData.height || '',
      build: generatedData.build || '',
      eyeColor: generatedData.eyeColor || '',
      hairColor: generatedData.hairColor || '',
      hairStyle: generatedData.hairStyle || '',
      skinTone: generatedData.skinTone || '',
      distinguishingMarks: generatedData.distinguishingMarks || '',
      clothingStyle: generatedData.clothingStyle || '',
      
      // Personality fields
      personalityOverview: generatedData.personalityOverview || generatedData.personality || '',
      temperament: generatedData.temperament || '',
      personalityTraits: Array.isArray(generatedData.personalityTraits) ? generatedData.personalityTraits : 
        (generatedData.personalityTraits ? generatedData.personalityTraits.split(',').map((s: string) => s.trim()) : []),
      worldview: generatedData.worldview || '',
      values: generatedData.values || '',
      goals: generatedData.goals || '',
      motivations: generatedData.motivations || '',
      fears: generatedData.fears || '',
      desires: generatedData.desires || '',
      vices: generatedData.vices || '',
      
      // Abilities fields
      coreAbilities: generatedData.coreAbilities || '',
      skills: Array.isArray(generatedData.skills) ? generatedData.skills : 
        (generatedData.skills ? generatedData.skills.split(',').map((s: string) => s.trim()) : []),
      talents: Array.isArray(generatedData.talents) ? generatedData.talents :
        (generatedData.talents ? generatedData.talents.split(',').map((s: string) => s.trim()) : []),
      specialAbilities: generatedData.specialAbilities || '',
      powers: generatedData.powers || '',
      strengths: generatedData.strengths || '',
      weaknesses: generatedData.weaknesses || '',
      training: generatedData.training || '',
      
      // Background fields
      backstory: generatedData.backstory || '',
      background: generatedData.backstory || '', // Duplicate mapping for compatibility
      childhood: generatedData.childhood || '',
      familyHistory: generatedData.familyHistory || '',
      education: generatedData.education || '',
      formativeEvents: generatedData.formativeEvents || '',
      socialClass: generatedData.socialClass || '',
      occupation: generatedData.occupation || '',
      spokenLanguages: Array.isArray(generatedData.spokenLanguages) ? generatedData.spokenLanguages :
        (generatedData.spokenLanguages ? generatedData.spokenLanguages.split(',').map((s: string) => s.trim()) : []),
      
      // Relationships fields
      family: generatedData.family || '',
      friends: generatedData.friends || '',
      allies: generatedData.allies || '',
      enemies: generatedData.enemies || '',
      rivals: generatedData.rivals || '',
      mentors: generatedData.mentors || '',
      relationships: generatedData.relationships || '',
      socialCircle: generatedData.socialCircle || '',
      
      // Meta fields
      storyFunction: generatedData.storyFunction || '',
      personalTheme: generatedData.personalTheme || '',
      symbolism: generatedData.symbolism || '',
      inspiration: generatedData.inspiration || '',
      archetypes: Array.isArray(generatedData.archetypes) ? generatedData.archetypes :
        (generatedData.archetypes ? generatedData.archetypes.split(',').map((s: string) => s.trim()) : []),
      notes: generatedData.notes || '',
      
      // Additional character fields
      flaws: generatedData.flaws || '',
      secrets: generatedData.secrets || '',
      equipment: generatedData.equipment || '',
      habits: generatedData.habits || '',
      quirks: generatedData.quirks || '',
      
      // Legacy compatibility fields
      oneLine: generatedData.oneLine || '',
      description: generatedData.physicalDescription || generatedData.description || '',
      personality: generatedData.personalityOverview || generatedData.personality || '',
      
      // System fields
      imageUrl: null
    };
    
    console.log('Server: Processed character data:', processedData);
    return processedData;
  } catch (error) {
    console.error('Server: Error generating character:', error);
    if (error instanceof Error) {
      console.error('Server: Error details:', error.message);
      console.error('Server: Error stack:', error.stack);
    }
    throw new Error('Failed to generate character. Please try again.');
  }
}

function buildProjectContext(context: CharacterGenerationContext): string {
  const { project, existingCharacters, generationOptions } = context;
  
  // Build comprehensive story world foundation similar to template system
  let contextPrompt = `\n\nCOMPREHENSIVE STORY WORLD FOUNDATION:\n`;
  contextPrompt += `Project Title: "${project.name}"\n`;
  contextPrompt += `Manuscript Type: ${(project.type || 'Novel').toUpperCase()}\n`;
  
  if (project.description) {
    contextPrompt += `Story World: ${project.description}\n`;
  }
  
  if (project.synopsis) {
    contextPrompt += `Narrative Synopsis: ${project.synopsis}\n`;
  }
  
  // Enhanced genre context with development guidance
  if (project.genre) {
    const genres = Array.isArray(project.genre) ? project.genre.join(', ') : project.genre;
    contextPrompt += `Story Genres: ${genres}\n`;
    
    // Add genre-specific character development context
    const genreGuidance = getGenreCharacterContext(genres);
    if (genreGuidance) {
      contextPrompt += `${genreGuidance}\n`;
    }
  }
  
  // Comprehensive character ecosystem context
  if (existingCharacters && existingCharacters.length > 0) {
    contextPrompt += `\nESTABLISHED CHARACTER ECOSYSTEM (create unique, complementary character):\n`;
    existingCharacters.slice(0, 6).forEach(char => {
      contextPrompt += `- ${char.name}`;
      if (char.title) contextPrompt += ` "${char.title}"`;
      if (char.role) contextPrompt += ` (${char.role})`;
      if (char.race && char.class) contextPrompt += ` [${char.race} ${char.class}]`;
      else if (char.race) contextPrompt += ` [${char.race}]`;
      else if (char.class) contextPrompt += ` [${char.class}]`;
      
      // Add personality and goals for context
      const details = [];
      if (char.personality) details.push(`Personality: ${char.personality.substring(0, 80)}...`);
      if (char.goals) details.push(`Goals: ${char.goals.substring(0, 60)}...`);
      if (char.personalityTraits && Array.isArray(char.personalityTraits) && char.personalityTraits.length > 0) {
        details.push(`Traits: ${char.personalityTraits.slice(0, 3).join(', ')}`);
      }
      
      if (details.length > 0) {
        contextPrompt += `\n  ${details.join(' | ')}\n`;
      } else {
        contextPrompt += `\n`;
      }
    });
    
    if (existingCharacters.length > 6) {
      contextPrompt += `- Plus ${existingCharacters.length - 6} additional established characters\n`;
    }
  }
  
  // Enhanced character creation requirements with comprehensive context
  if (generationOptions) {
    contextPrompt += `\nCOMPREHENSIVE CHARACTER DEVELOPMENT BRIEF:\n`;
    
    if (generationOptions.characterType) {
      const typeGuidance = getCharacterTypeGuidance(generationOptions.characterType);
      contextPrompt += `Character Type: ${generationOptions.characterType.toUpperCase()}`;
      if (typeGuidance) contextPrompt += ` - ${typeGuidance}`;
      contextPrompt += `\n`;
    }
    
    if (generationOptions.archetype) {
      const archetypeGuidance = getArchetypeGuidance(generationOptions.archetype);
      contextPrompt += `Core Archetype: ${generationOptions.archetype.toUpperCase()}`;
      if (archetypeGuidance) contextPrompt += ` - ${archetypeGuidance}`;
      contextPrompt += `\n`;
    }
    
    if (generationOptions.role) {
      contextPrompt += `🎭 REQUIRED ROLE: ${generationOptions.role} - serve this specific function in the story structure\n`;
    }
    
    if (generationOptions.personality) {
      contextPrompt += `🧠 REQUIRED PERSONALITY: ${generationOptions.personality} - build comprehensive personality around this core\n`;
    }
    
    if (generationOptions.customPrompt) {
      // Check if this is a template-based generation
      if (generationOptions.customPrompt.includes('TEMPLATE-BASED CHARACTER GENERATION')) {
        contextPrompt += `\n${generationOptions.customPrompt}\n`;
      } else {
        contextPrompt += `\n🎯 PRIMARY CREATIVE DIRECTION: ${generationOptions.customPrompt}\n`;
        contextPrompt += `\n⚠️ MANDATORY: Use the above creative direction as the PRIMARY FOUNDATION for this character. Do NOT ignore or override these user specifications.\n`;
        
        // Add enhanced requirements for custom generation to match template quality
        contextPrompt += `\nCRITICAL CUSTOM CHARACTER REQUIREMENTS:
• The character MUST reflect the user's creative direction and specific details above
• Generate a completely UNIQUE character based on the user's specifications
• NEVER reuse names, traits, or details from previous generations
• Generate publication-quality content for ALL 67 character fields listed in the JSON format
• Every single field must contain meaningful, specific, contextual content
• NO generic placeholders, empty fields, or vague descriptions
• Create authentic details that feel researched and lived-in
• Build interconnected traits where strengths create weaknesses
• Ensure backstory elements explain current abilities and fears
• Physical appearance must reflect their life experiences
• All relationships need specific history and emotional stakes`;
      }
    }
  }

  // Enhanced character development requirements matching template system quality
  contextPrompt += `\nCHARACTER DEVELOPMENT INTEGRATION REQUIREMENTS:
- Build character authentically within "${project.name}" story world using all provided context
- Ensure character fits naturally into ${(project.type || 'novel').toLowerCase()} narrative structure and pacing
- Create meaningful potential relationships with existing characters (allies, rivals, mentors, etc.)
- Develop rich backstory explaining how they arrived at current situation and future trajectory
- Ground all traits, abilities, and relationships in the established world context and genre conventions
- Design internal conflicts that create external story opportunities and character growth arcs
- Ensure physical appearance reflects personality, life experiences, and cultural background
- Build skills and abilities that serve narrative purposes while creating authentic limitations
- Create goals and motivations that could drive plot forward and intersect with other characters
- Develop flaws and secrets that create vulnerability, relatability, and story complications

NARRATIVE INTEGRATION MANDATE:
Generate a character who doesn't just exist in this world, but actively enhances it through their presence, relationships, potential conflicts, and unique perspective. Every trait should contribute to story potential while feeling authentic to the character's individual journey.

Based on all the above comprehensive context - including the story world, existing characters, specific character requirements, and creative direction - generate a complete, publication-ready character with rich internal life and clear narrative purpose.`;

  return contextPrompt;
}

// Enhanced character type guidance for comprehensive prompting
function getCharacterTypeGuidance(characterType: string): string {
  const guidance: { [key: string]: string } = {
    'protagonist': 'Central figure who drives the story forward, faces the main conflict, and undergoes the most significant character development',
    'antagonist': 'Primary source of conflict, not necessarily evil but opposes the protagonist\'s goals with legitimate motivations',
    'anti-hero': 'Morally ambiguous protagonist with significant flaws, questionable methods, but ultimately works toward positive outcomes',
    'supporting': 'Crucial secondary character who influences main plot, provides specific skills/knowledge, and has their own subplot',
    'mentor': 'Wise guide with experience relevant to protagonist\'s journey, provides wisdom and training before crucial challenges',
    'love-interest': 'Romantic connection with agency and goals beyond romance, creates emotional stakes and character growth',
    'villain': 'Actively evil or destructive force, seeks power, revenge, or chaos, represents what protagonist must overcome',
    'sidekick': 'Loyal companion with complementary skills, provides support, comic relief, and alternative perspective',
    'comic-relief': 'Provides humor through timing, personality quirks, or situational comedy while serving plot functions',
    'mysterious-figure': 'Unknown motives and background, reveals information gradually, creates intrigue and uncertainty',
    'wise-elder': 'Ancient wisdom keeper, has witnessed historical events, provides perspective on long-term consequences',
    'innocent': 'Pure motivations, naive perspective, represents what others fight to protect or what corruption threatens',
    'rebel': 'Challenges authority and status quo, catalyst for change, questions established systems and traditions',
    'guardian': 'Protects specific people, places, or principles, strong sense of duty, willing to sacrifice for others',
    'trickster': 'Uses cunning over strength, enjoys chaos and clever solutions, challenges others through wit and deception'
  };
  
  return guidance[characterType] || '';
}

// Enhanced archetype guidance for psychological depth
function getArchetypeGuidance(archetype: string): string {
  const guidance: { [key: string]: string } = {
    'hero': 'Driven by duty and courage, seeks to prove worthiness, faces tests of strength and character',
    'innocent': 'Maintains optimism despite adversity, trusts others, seeks harmony and simple pleasures',
    'explorer': 'Values freedom and discovery, restless spirit, seeks new experiences and authentic self',
    'sage': 'Pursues truth and understanding, shares wisdom, seeks to comprehend the world\'s mysteries',
    'outlaw': 'Breaks rules for justice, rebels against oppression, seeks to overthrow corrupt systems',
    'magician': 'Transforms reality through will/knowledge, visionary, seeks to make dreams real',
    'everyman': 'Relatable and down-to-earth, seeks belonging and acceptance, fears being left out',
    'lover': 'Driven by passion and connection, seeks romantic fulfillment, fears loneliness and abandonment',
    'jester': 'Brings joy and humor, lives in the moment, uses wit to reveal truth and cope with pain',
    'caregiver': 'Protects and nurtures others, self-sacrificing, fears helplessness and ingratitude',
    'creator': 'Expresses vision through art/innovation, fears having no original vision, seeks lasting legacy',
    'ruler': 'Takes responsibility and control, creates order, fears chaos and being overthrown'
  };
  
  return guidance[archetype] || '';
}

// Genre-specific character development context
function getGenreCharacterContext(genres: string): string {
  const genreGuidance: { [key: string]: string } = {
    'fantasy': 'Genre Context: Characters should have clear relationships to magic systems, mythical creatures, and ancient histories. Consider how supernatural elements shape their worldview and abilities.',
    'science fiction': 'Genre Context: Characters must navigate technological advancement, space travel, AI, or future societies. Ground their backgrounds in how technology affects daily life and social structures.',
    'mystery': 'Genre Context: Characters need secrets, hidden motives, and complex relationships. Each should have knowledge that could solve or complicate the central mystery.',
    'romance': 'Genre Context: Characters require clear romantic goals, obstacles to love, and emotional growth arcs. Past relationships and intimacy fears should drive character development.',
    'thriller': 'Genre Context: Characters need high stakes, dangerous secrets, and survival instincts. Paranoia, trust issues, and pressure responses should define their psychology.',
    'horror': 'Genre Context: Characters need realistic reactions to supernatural threats, trauma responses, and survival mechanisms. Fear and past experiences should influence all decisions.',
    'contemporary': 'Genre Context: Characters should reflect modern social issues, technology integration, and current cultural dynamics. Make them relatable to contemporary audiences.',
    'historical': 'Genre Context: Characters must authentically reflect their time period\'s values, restrictions, and opportunities. Historical context should shape all aspects of their identity.'
  };
  
  const lowerGenres = genres.toLowerCase();
  for (const [genre, guidance] of Object.entries(genreGuidance)) {
    if (lowerGenres.includes(genre)) {
      return guidance;
    }
  }
  
  return '';
}