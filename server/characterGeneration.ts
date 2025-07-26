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

CRITICAL: Generate publication-quality, specific content for EVERY field above. No generic descriptions, placeholder text, or vague statements. Each response should feel like it came from deep character research. Base all content on template requirements and story context. Ensure all text is properly escaped and JSON is valid.

${projectContext}`;

    console.log('Server: Sending prompt to Gemini');
    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();
    
    console.log('Server: Gemini response received:', text.substring(0, 200) + '...');
    
    // Clean and extract JSON from the response
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
    
    // Fix common JSON issues
    // Replace smart quotes with regular quotes
    jsonString = jsonString.replace(/[""]/g, '"');
    jsonString = jsonString.replace(/['']/g, "'");
    
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
    
    console.log('Server: Attempting to parse JSON:', jsonString.substring(0, 200) + '...');
    
    let generatedData;
    try {
      generatedData = JSON.parse(jsonString);
      console.log('Server: Parsed character data successfully');
    } catch (parseError) {
      console.error('Server: JSON parse error:', parseError);
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
      imageUrl: null,
      projectId: null // Will be set by calling function
    };
    
    console.log('Server: Processed character data:', processedData);
    return processedData;
  } catch (error) {
    console.error('Server: Error generating character:', error);
    throw new Error('Failed to generate character. Please try again.');
  }
}

function buildProjectContext(context: CharacterGenerationContext): string {
  const { project, existingCharacters, generationOptions } = context;
  
  let contextPrompt = `\n\nSTORY WORLD CONTEXT:\n`;
  contextPrompt += `Project: "${project.name}" (${project.type || 'Story'})\n`;
  
  if (project.description) {
    contextPrompt += `World Description: ${project.description}\n`;
  }
  
  if (project.synopsis) {
    contextPrompt += `Story Synopsis: ${project.synopsis}\n`;
  }
  
  if (project.genres && project.genres.length > 0) {
    contextPrompt += `Genres: ${project.genres.join(', ')} - ensure character fits these genre conventions and reader expectations\n`;
  }
  
  if (existingCharacters && existingCharacters.length > 0) {
    contextPrompt += `\nExisting Cast (create meaningful relationships and avoid redundancy):\n`;
    existingCharacters.forEach(char => {
      contextPrompt += `- ${char.name}`;
      if (char.role) contextPrompt += ` (${char.role})`;
      if (char.class) contextPrompt += ` [${char.class}]`;
      if (char.oneLine) contextPrompt += `: ${char.oneLine}`;
      if (char.personalityTraits && Array.isArray(char.personalityTraits)) {
        contextPrompt += ` | Traits: ${char.personalityTraits.slice(0, 3).join(', ')}`;
      }
      contextPrompt += `\n`;
    });
  }
  
  if (generationOptions) {
    contextPrompt += `\nCHARACTER CREATION REQUIREMENTS:\n`;
    if (generationOptions.characterType) contextPrompt += `Character Type: ${generationOptions.characterType} - fulfill this role's narrative purpose\n`;
    if (generationOptions.role) contextPrompt += `Story Role: ${generationOptions.role} - serve this function in the narrative structure\n`;
    if (generationOptions.personality) contextPrompt += `Personality Foundation: ${generationOptions.personality} - build upon this core personality\n`;
    if (generationOptions.archetype) contextPrompt += `Archetype: ${generationOptions.archetype} - embody this archetypal pattern with unique twists\n`;
    if (generationOptions.customPrompt) {
      // Check if this is a template-based generation
      if (generationOptions.customPrompt.includes('TEMPLATE-BASED CHARACTER GENERATION')) {
        contextPrompt += `\n\n${generationOptions.customPrompt}`;
      } else {
        contextPrompt += `\nAdditional Requirements: ${generationOptions.customPrompt}`;
      }
    }
  }

  contextPrompt += `\n\nGenerate a character that:
1. Fits naturally into this world and story
2. Has clear motivations that could drive plot
3. Has potential for interesting relationships with existing characters
4. Brings something unique to the story
5. Has both strengths and flaws that create compelling conflict
6. Feels authentic to the genre and tone
7. Has a backstory that explains their current situation and goals
8. Matches the specified character type, role, and personality traits above

Make the character detailed enough to feel real, with specific traits, quirks, and a clear voice. Ensure they have both external goals and internal conflicts.`;

  return contextPrompt;
}