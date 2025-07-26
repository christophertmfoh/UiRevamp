import { ExtractedCharacterData } from './characterExtractor';

// Define all 59+ character fields for comprehensive extraction
const CHARACTER_FIELD_MAPPING = {
  // IDENTITY (14 fields)
  identity: {
    name: ['name', 'character name', 'called'],
    nicknames: ['nickname', 'nick', 'called', 'known as'],
    title: ['title', 'sir', 'lady', 'lord', 'dr', 'professor'],
    aliases: ['alias', 'goes by', 'also known as', 'aka'],
    age: ['age', 'years old', 'born'],
    race: ['race', 'species', 'ethnicity', 'human', 'elf', 'dwarf'],
    class: ['class', 'fighter', 'mage', 'rogue', 'cleric', 'warrior'],
    profession: ['occupation', 'job', 'work', 'profession', 'career'],
    role: ['role', 'protagonist', 'antagonist', 'hero', 'villain']
  },
  
  // APPEARANCE (28 fields)
  appearance: {
    physicalDescription: ['physical', 'appearance', 'looks like', 'description'],
    height: ['height', 'tall', 'short', 'feet', 'inches', "'", '"'],
    build: ['build', 'body', 'frame', 'physique', 'lean', 'muscular', 'thin', 'heavy'],
    eyeColor: ['eye color', 'eyes', 'blue eyes', 'brown eyes', 'green eyes'],
    hairColor: ['hair color', 'blonde', 'brunette', 'black hair', 'red hair'],
    hairStyle: ['hair', 'hairstyle', 'long hair', 'short hair', 'curly', 'straight'],
    skinTone: ['skin', 'complexion', 'pale', 'tan', 'dark', 'fair'],
    distinguishingMarks: ['scar', 'birthmark', 'tattoo', 'mark', 'feature'],
    clothingStyle: ['clothes', 'dress', 'outfit', 'style', 'wears'],
    posture: ['posture', 'stands', 'walks', 'carries himself', 'bearing'],
    mannerisms: ['mannerism', 'habit', 'gesture', 'tic', 'way of'],
    voiceDescription: ['voice', 'speaks', 'accent', 'tone', 'sounds'],
    facialFeatures: ['face', 'facial', 'features', 'jaw', 'nose', 'cheeks'],
    bodyLanguage: ['body language', 'moves', 'gestures', 'fidgets'],
    scars: ['scar', 'scarred', 'mark', 'wound', 'injury']
  },
  
  // PERSONALITY (35 fields)
  personality: {
    personalityOverview: ['personality', 'character', 'nature', 'temperament'],
    personalityTraits: ['trait', 'characteristic', 'quality', 'attribute'],
    temperament: ['temperament', 'disposition', 'mood', 'attitude'],
    worldview: ['worldview', 'philosophy', 'believes', 'thinks'],
    values: ['values', 'principles', 'morals', 'ethics', 'important'],
    beliefs: ['believes', 'faith', 'religion', 'conviction'],
    goals: ['goal', 'wants', 'seeks', 'aims', 'objective'],
    motivations: ['motivated', 'drives', 'reason', 'why'],
    fears: ['fear', 'afraid', 'scared', 'phobia', 'terrified'],
    desires: ['desire', 'wants', 'wishes', 'yearns', 'craves'],
    quirks: ['quirk', 'odd', 'strange', 'unusual', 'peculiar'],
    likes: ['likes', 'enjoys', 'loves', 'fond of', 'prefers'],
    dislikes: ['dislikes', 'hates', 'despises', 'cannot stand'],
    habits: ['habit', 'routine', 'always', 'tends to', 'often'],
    vices: ['vice', 'weakness', 'addiction', 'bad habit', 'flaw']
  },
  
  // ABILITIES (11 fields)
  abilities: {
    coreAbilities: ['ability', 'capable', 'can do', 'skilled at'],
    skills: ['skill', 'skilled', 'good at', 'talent', 'trained'],
    talents: ['talent', 'gifted', 'natural', 'born with'],
    specialAbilities: ['special', 'unique', 'extraordinary', 'powers'],
    powers: ['power', 'magic', 'supernatural', 'ability'],
    strengths: ['strength', 'strong', 'good at', 'advantage'],
    weaknesses: ['weakness', 'weak', 'bad at', 'struggles'],
    training: ['trained', 'education', 'learned', 'studied']
  },
  
  // BACKGROUND (10 fields)
  background: {
    backstory: ['backstory', 'history', 'past', 'background', 'story'],
    childhood: ['childhood', 'child', 'young', 'grew up', 'raised'],
    familyHistory: ['family', 'parents', 'mother', 'father', 'siblings'],
    education: ['education', 'school', 'university', 'learned', 'studied'],
    formativeEvents: ['event', 'happened', 'experience', 'shaped'],
    socialClass: ['class', 'wealthy', 'poor', 'noble', 'commoner', 'status'],
    occupation: ['occupation', 'job', 'work', 'profession', 'career'],
    spokenLanguages: ['language', 'speaks', 'tongue', 'dialect']
  },
  
  // RELATIONSHIPS (8 fields)
  relationships: {
    family: ['family', 'relative', 'mother', 'father', 'sibling', 'parent'],
    friends: ['friend', 'companion', 'ally', 'close to'],
    allies: ['ally', 'alliance', 'partner', 'supporter'],
    enemies: ['enemy', 'foe', 'rival', 'opponent', 'against'],
    rivals: ['rival', 'competition', 'compete', 'adversary'],
    mentors: ['mentor', 'teacher', 'guide', 'master', 'learned from'],
    relationships: ['relationship', 'connected', 'bond', 'tie'],
    socialCircle: ['social', 'circle', 'group', 'community', 'belongs']
  },
  
  // META (9 fields)
  meta: {
    storyFunction: ['function', 'role', 'purpose', 'serves', 'meant to'],
    personalTheme: ['theme', 'represents', 'symbolizes', 'embodies'],
    symbolism: ['symbol', 'symbolic', 'represents', 'stands for'],
    inspiration: ['inspired', 'based on', 'influenced', 'drawn from'],
    archetypes: ['archetype', 'type', 'kind of', 'represents'],
    notes: ['note', 'additional', 'important', 'remember']
  }
};

export async function extractCharacterFromText(textContent: string): Promise<ExtractedCharacterData> {
  console.log('Comprehensive sentence-by-sentence field categorization...');
  
  const characterData: ExtractedCharacterData = {};
  
  // Split document into sentences and bullet points
  const sentences = parseDocumentIntoSentences(textContent);
  
  // Categorize each sentence into appropriate fields
  for (const sentence of sentences) {
    categorizeSentence(sentence, characterData);
  }
  
  // Post-process and clean up the data
  cleanupAndOrganizeData(characterData);
  
  console.log('✓ Comprehensive extraction complete:', {
    totalSentences: sentences.length,
    fieldsPopulated: Object.keys(characterData).length,
    name: characterData.name,
    age: characterData.age,
    profession: characterData.profession,
    personalityTraits: characterData.personalityTraits?.length || 0,
    distinguishingMarks: characterData.distinguishingMarks?.length || 0,
    backstory: characterData.backstory ? 'Yes' : 'No'
  });
  
  return characterData;
}

function parseDocumentIntoSentences(text: string): string[] {
  const sentences: string[] = [];
  
  // Split by bullet points first
  const bulletSections = text.split(/●/);
  
  for (const section of bulletSections) {
    if (section.trim().length === 0) continue;
    
    // Further split by sentences within each bullet
    const sectionSentences = section
      .split(/[.!?]/)
      .map(s => s.trim())
      .filter(s => s.length > 3);
    
    sentences.push(...sectionSentences);
  }
  
  // Also handle sub-bullets (○)
  const subBullets = text.split(/○/).map(s => s.trim()).filter(s => s.length > 3);
  sentences.push(...subBullets);
  
  return sentences;
}

function categorizeSentence(sentence: string, characterData: ExtractedCharacterData): void {
  const lowerSentence = sentence.toLowerCase();
  
  // Check each category and field
  for (const [category, fields] of Object.entries(CHARACTER_FIELD_MAPPING)) {
    for (const [fieldName, keywords] of Object.entries(fields)) {
      // Check if sentence contains any of the keywords for this field
      const hasKeyword = keywords.some(keyword => 
        lowerSentence.includes(keyword.toLowerCase())
      );
      
      if (hasKeyword) {
        // Extract and assign the relevant information
        assignToField(fieldName, sentence, characterData, keywords);
        break; // Move to next sentence once categorized
      }
    }
  }
}

function assignToField(fieldName: string, sentence: string, characterData: ExtractedCharacterData, keywords: string[]): void {
  const cleanSentence = sentence.trim().replace(/^[●○]\s*/, '');
  
  // Handle array fields
  const arrayFields = ['personalityTraits', 'distinguishingMarks', 'nicknames', 'aliases', 
                      'values', 'beliefs', 'goals', 'motivations', 'fears', 'desires', 
                      'quirks', 'likes', 'dislikes', 'habits', 'vices', 'coreAbilities', 
                      'skills', 'talents', 'formativeEvents', 'family', 'friends', 
                      'allies', 'enemies', 'rivals', 'mentors', 'relationships', 'archetypes'];
  
  if (arrayFields.includes(fieldName)) {
    if (!characterData[fieldName]) {
      characterData[fieldName] = [];
    }
    
    // Parse multiple items from the sentence
    const items = parseMultipleItems(cleanSentence, keywords);
    characterData[fieldName].push(...items);
  } else {
    // Handle single value fields - only assign if not already filled
    if (!characterData[fieldName]) {
      characterData[fieldName] = extractSpecificValue(cleanSentence, fieldName, keywords);
    }
  }
}

function parseMultipleItems(sentence: string, keywords: string[]): string[] {
  // Split by common separators and clean up
  const items = sentence
    .split(/[,;]|\sand\s/)
    .map(item => item.trim())
    .filter(item => item.length > 2 && !item.match(/^[●○]\s*$/))
    .slice(0, 5); // Limit to reasonable number
  
  return items;
}

function extractSpecificValue(sentence: string, fieldName: string, keywords: string[]): string {
  // Remove the keyword prefix if present
  let value = sentence;
  
  for (const keyword of keywords) {
    const regex = new RegExp(`^.*?${keyword}\\s*:?\\s*`, 'i');
    value = value.replace(regex, '').trim();
  }
  
  // Handle specific field types
  if (fieldName === 'age') {
    const ageMatch = value.match(/(\d+|twenty|thirty|forty|fifty|late \d+s|early \d+s)/i);
    return ageMatch ? ageMatch[0] : value;
  }
  
  if (fieldName === 'height') {
    const heightMatch = value.match(/(\d+'?\d*"?|\d+\s*feet|\d+\s*ft)/i);
    return heightMatch ? heightMatch[0] : value;
  }
  
  return value.substring(0, 200).trim(); // Limit length
}

function cleanupAndOrganizeData(characterData: ExtractedCharacterData): void {
  // Remove duplicates from arrays
  for (const field of Object.keys(characterData)) {
    if (Array.isArray(characterData[field])) {
      characterData[field] = [...new Set(characterData[field])];
    }
  }
  
  // Create composite descriptions
  if (!characterData.physicalDescription && (characterData.height || characterData.build || characterData.hairStyle)) {
    const physicalParts = [];
    if (characterData.height) physicalParts.push(`Height: ${characterData.height}`);
    if (characterData.build) physicalParts.push(`Build: ${characterData.build}`);
    if (characterData.hairStyle) physicalParts.push(`Hair: ${characterData.hairStyle}`);
    if (characterData.facialFeatures) physicalParts.push(`Eyes: ${characterData.facialFeatures}`);
    if (characterData.skinTone) physicalParts.push(`Skin: ${characterData.skinTone}`);
    
    characterData.physicalDescription = physicalParts.join('. ');
  }
  
  // Set clean description
  if (!characterData.description) {
    characterData.description = characterData.personalityOverview || characterData.storyFunction || 'Imported character';
  }
  
  // Add import notes
  if (!characterData.notes && characterData.name) {
    characterData.notes = `Character imported from document: ${characterData.name}`;
  }
}