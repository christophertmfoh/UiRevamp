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

🎯 NAME CONSISTENCY REQUIREMENT: Once you choose a character's name, use EXACTLY that same name consistently throughout ALL fields. Do NOT use variations, nicknames, or different names in the descriptions. If the character's name is "Jasper", refer to them as "Jasper" in ALL text fields, not "Jack" or any other variation.

MISSION: Generate a complete, publication-ready character that seamlessly integrates into the provided story world with rich internal life, compelling motivations, and realistic contradictions that drive narrative tension.

CHARACTER DEVELOPMENT PRINCIPLES:
- Every trait must serve a narrative purpose
- Internal conflicts should create external story opportunities  
- Strengths and flaws must be interconnected and create compelling drama
- Background details should directly inform present-day behaviors and goals
- Physical appearance should reflect personality and life experiences
- Relationships should reveal character depth and create plot potential

Your response must be valid JSON in this exact format. Generate vivid, specific content for EVERY field - no generic placeholders or vague descriptions. Each field should feel authentic to the character's world and circumstances.

⚠️ CRITICAL: The name you choose in the "name" field MUST be used consistently throughout ALL description fields. Never refer to the character by a different name in any field.

{
  // ===== IDENTITY SECTION =====
  "name": "Distinctive name that fits the world and hints at character essence",
  "nicknames": "Meaningful nicknames earned through actions or relationships",
  "pronouns": "Character's pronouns (he/him, she/her, they/them, etc.)",
  "age": "Specific age that explains their capabilities, experience level, and life stage",
  "species": "Species/race with cultural implications for worldview and background",
  "gender": "Gender identity that may influence their experiences and perspectives",
  "occupation": "Current job or primary activity that defines their skills and social position",
  "title": "Earned titles, ranks, or epithets that reflect achievements or reputation",
  "birthdate": "When they were born (can be specific date or general timeframe)",
  "birthplace": "Where they were born - influences accent, early memories, cultural foundation",
  "currentLocation": "Where they live now - reflects current circumstances and choices",
  "nationality": "Cultural or national identity that shapes worldview and allegiances",

  // ===== APPEARANCE SECTION =====
  "height": "Specific height with implications for their presence and capabilities",
  "weight": "Weight or build description that reflects lifestyle and health",
  "bodyType": "Body type that reflects their lifestyle, genetics, and life experiences",
  "hairColor": "Hair color and any changes due to stress, magic, or deliberate styling",
  "hairStyle": "Specific hairstyle that reflects personality, culture, or practical needs",
  "hairTexture": "Hair texture (straight, wavy, curly, coiled) and condition",
  "eyeColor": "Eye color with emotional or supernatural significance if relevant",
  "eyeShape": "Eye shape and expression that reflects personality or heritage",
  "skinTone": "Skin appearance affected by environment, genetics, lifestyle, or magical influences",
  "facialFeatures": "Distinctive facial characteristics (nose shape, cheekbones, jaw line, etc.)",
  "physicalFeatures": "Notable physical characteristics and body language",
  "scarsMarkings": "Specific scars, tattoos, birthmarks with stories behind each mark",
  "clothing": "Typical fashion choices that reveal class, personality, and practical needs",
  "accessories": "Jewelry, tools, or personal items they regularly carry",
  "generalAppearance": "Overall impression and how they present themselves to the world",

  // ===== PERSONALITY SECTION =====
  "personalityTraits": ["specific behavioral patterns", "emotional tendencies", "social behaviors", "moral inclinations"],
  "positiveTraits": ["character strengths", "admirable qualities", "virtues"],
  "negativeTraits": ["character flaws", "weaknesses", "problematic behaviors"],
  "quirks": ["unique habits", "amusing eccentricities", "distinctive mannerisms"],
  "mannerisms": "Physical habits and behavioral patterns in speech and movement",
  "temperament": "Fundamental emotional baseline with triggers that change their behavior",
  "emotionalState": "Current emotional condition and mental stability",
  "sense_of_humor": "Type of humor they enjoy and how they use comedy in social situations",
  "speech_patterns": "How they speak - accent, vocabulary level, speech quirks, favorite phrases",

  // ===== PSYCHOLOGY SECTION =====
  "intelligence": "Type and level of intellectual capacity (analytical, creative, emotional, etc.)",
  "education": "Formal and informal learning experiences and educational background",
  "mentalHealth": "Psychological well-being, mental conditions, coping mechanisms",
  "phobias": ["specific fears", "irrational terrors", "trauma responses"],
  "motivations": ["deep psychological drivers", "what pushes them forward", "core needs"],
  "goals": ["specific objectives", "what they want to achieve", "deadlines and stakes"],
  "desires": ["secret longings", "things they crave", "what they'd sacrifice for"],
  "regrets": ["past mistakes", "missed opportunities", "things they wish they could change"],
  "secrets": ["hidden knowledge", "concealed past events", "information they protect"],
  "moral_code": "Ethical principles and moral framework that guides their decisions",
  "worldview": "Philosophy shaped by formative experiences and how they see reality",
  "philosophy": "Personal beliefs about life, meaning, and how the world should work",

  // ===== ABILITIES SECTION =====
  "skills": ["learned abilities", "trained competencies", "professional expertise"],
  "talents": ["natural gifts", "innate abilities", "things they excel at without training"],
  "powers": ["supernatural abilities", "magical powers", "extraordinary capabilities"],
  "weaknesses": ["vulnerabilities", "areas of struggle", "things that hold them back"],
  "strengths": ["character assets", "reliable capabilities", "what they can depend on"],
  "combat_skills": ["fighting abilities", "weapon training", "martial expertise"],
  "magical_abilities": ["spells", "magical knowledge", "supernatural techniques"],
  "languages": ["spoken languages", "written languages", "communication abilities"],
  "hobbies": ["personal interests", "leisure activities", "things they enjoy"],

  // ===== BACKGROUND SECTION =====
  "backstory": "Rich background history explaining how they became who they are today",
  "childhood": "Early life experiences, upbringing, and formative childhood events",
  "formative_events": ["key life-changing events", "pivotal moments", "defining experiences"],
  "trauma": "Significant traumatic experiences and how they've affected the character",
  "achievements": ["major accomplishments", "proud moments", "successful endeavors"],
  "failures": ["significant setbacks", "mistakes with consequences", "learning experiences"],
  "education_background": "Formal schooling, training programs, academic achievements",
  "work_history": "Career progression, job experiences, professional development",
  "military_service": "Military experience, rank achieved, combat exposure, discharge status",
  "criminal_record": "Legal troubles, crimes committed, time served, ongoing legal issues",

  // ===== RELATIONSHIPS SECTION =====
  "family": ["family members", "family dynamics", "blood relatives and their relationships"],
  "friends": ["close friendships", "trusted companions", "social bonds"],
  "enemies": ["adversaries", "people who oppose them", "antagonistic relationships"],
  "allies": ["political allies", "strategic partnerships", "people who support their goals"],
  "mentors": ["teachers", "guides", "people who shaped their development"],
  "romantic_interests": ["past relationships", "current romantic connections", "love interests"],
  "relationship_status": "Current romantic situation and availability",
  "social_connections": ["broader network", "acquaintances", "professional contacts"],
  "children": ["offspring", "adopted children", "parental relationships"],
  "pets": ["animal companions", "familiar creatures", "beloved animals"],

  // ===== CULTURAL SECTION =====
  "culture": "Cultural background, traditions, and heritage that shape their identity",
  "religion": "Religious beliefs, spiritual practices, relationship with the divine",
  "traditions": ["cultural practices", "family traditions", "ceremonial observances"],
  "values": ["core values", "non-negotiable principles", "what they believe is important"],
  "customs": ["social customs", "behavioral expectations", "cultural norms they follow"],
  "social_class": "Economic and social standing within their society",
  "political_views": "Political beliefs, affiliations, and stance on governance",
  "economic_status": "Financial situation, wealth level, economic security",

  // ===== STORY ROLE SECTION =====
  "role": "Narrative function (Protagonist/Antagonist/Supporting Character/Side Character/Background Character)",
  "character_arc": "How this character changes and grows throughout the story",
  "narrative_function": "Specific role they serve in advancing the plot and themes",
  "story_importance": "Level of importance to the story (Critical/Important/Moderate/Minor)",
  "first_appearance": "When and how they first appear in the narrative",
  "last_appearance": "When and how they exit the story (if applicable)",
  "character_growth": "Areas where they develop and change throughout the story",
  "internal_conflict": "Inner struggles, personal dilemmas, psychological conflicts",
  "external_conflict": "Outside forces they must overcome, obstacles they face",

  // ===== META INFORMATION SECTION =====
  "inspiration": "Real-world or fictional inspirations that informed this character",
  "creation_notes": "Writer's notes about the character's development and purpose",
  "character_concept": "Core concept or central idea that defines this character",
  "design_notes": "Visual design considerations, appearance inspirations",
  "voice_notes": "How they should sound, speech patterns, vocal characteristics",
  "themes": ["thematic elements", "symbolic meanings", "story themes they represent"],
  "symbolism": "What this character symbolizes within the broader narrative",
  "author_notes": "Additional development ideas, future story potential, creative thoughts"
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
2. 🎯 NAME CONSISTENCY: Use the EXACT same name throughout ALL fields - never switch between different names in descriptions
3. Generate publication-quality, specific content for EVERY SINGLE field above (all 86 fields across 10 categories)  
4. NO generic descriptions, placeholder text, or vague statements allowed
5. Each response should feel like it came from deep character research
6. Base all content on the user's specific inputs and story context provided below
7. Ensure all text is properly escaped and JSON is completely valid
8. Arrays must be properly formatted with quoted strings: ["item1", "item2", "item3"]
9. No trailing commas, no unescaped quotes, no incomplete fields
10. Every field must have meaningful content - empty strings "" are acceptable only when contextually appropriate

RESPONSE FORMAT: Return ONLY valid JSON with no markdown, no explanations, no additional text - just the complete character object with all 86 fields populated across the 10 defined categories.

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