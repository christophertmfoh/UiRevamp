export function generateCharacterPrompt({
  projectName,
  projectDescription,
  characterType,
  role,
  customPrompt,
  personality,
  archetype
}: {
  projectName: string;
  projectDescription?: string;
  characterType?: string;
  role?: string;
  customPrompt?: string;
  personality?: string;
  archetype?: string;
}) {
  let prompt = `Generate a detailed character for the project "${projectName}"`;
  
  if (projectDescription) {
    prompt += `\n\nProject description: ${projectDescription}`;
  }
  
  if (characterType) {
    prompt += `\n\nCharacter type: ${characterType}`;
  }
  
  if (role) {
    prompt += `\nRole in story: ${role}`;
  }
  
  if (personality) {
    prompt += `\nPersonality traits: ${personality}`;
  }
  
  if (archetype) {
    prompt += `\nArchetype: ${archetype}`;
  }
  
  if (customPrompt) {
    prompt += `\n\nAdditional requirements: ${customPrompt}`;
  }
  
  prompt += `\n\nReturn a comprehensive character profile in JSON format with ALL of these fields populated:

  {
    "name": "character's full name",
    "nicknames": "any nicknames or aliases",
    "title": "official title or designation",
    "race": "species or ethnicity",
    "age": "age or apparent age",
    "class": "class, profession, or occupation",
    "profession": "specific job or role",
    "storyRole": "role in the narrative (protagonist, antagonist, mentor, etc.)",
    "description": "brief overall description",
    "physicalDescription": "detailed physical appearance",
    "height": "height description",
    "build": "body type",
    "eyeColor": "eye color",
    "hairColor": "hair color",
    "hairStyle": "hair style",
    "skinTone": "skin tone",
    "distinguishingMarks": "scars, tattoos, etc.",
    "clothingStyle": "typical clothing and style",
    "personalityTraits": ["array", "of", "personality", "traits"],
    "personality": "personality overview",
    "temperament": "general temperament",
    "worldview": "how they see the world",
    "values": "core values",
    "goals": "what they want to achieve",
    "motivations": "what drives them",
    "fears": "what they fear",
    "desires": "what they desire",
    "vices": "flaws or vices",
    "abilities": ["array", "of", "abilities"],
    "skills": ["array", "of", "skills"],
    "talents": ["array", "of", "talents"],
    "expertise": ["array", "of", "expertise"],
    "specialAbilities": "unique or special abilities",
    "powers": "supernatural powers if any",
    "strengths": "character strengths",
    "weaknesses": "character weaknesses",
    "training": "training or education",
    "backstory": "character's history",
    "childhood": "childhood experiences",
    "familyHistory": "family background",
    "education": "educational background",
    "formativeEvents": "key events that shaped them",
    "socialClass": "social or economic class",
    "occupation": "current occupation",
    "spokenLanguages": ["array", "of", "languages"],
    "family": "immediate family members",
    "friends": "close friends",
    "allies": "allies and supporters",
    "enemies": "enemies or rivals",
    "rivals": "competitors or rivals",
    "mentors": "teachers or mentors",
    "relationships": "other important relationships",
    "socialCircle": "broader social connections",
    "storyFunction": "purpose in the story",
    "personalTheme": "personal theme or arc",
    "symbolism": "what they represent",
    "inspiration": "inspiration for the character",
    "archetypes": ["array", "of", "archetypes"],
    "notes": "additional notes"
  }

  Ensure all fields are populated with relevant, creative content. Arrays should contain multiple items.`;

  return prompt;
}