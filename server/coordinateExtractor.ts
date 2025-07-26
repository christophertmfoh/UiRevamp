import { ExtractedCharacterData } from './characterExtractor';

// Field definitions with keyword patterns for intelligent mapping
const FIELD_PATTERNS = {
  // IDENTITY FIELDS
  name: {
    patterns: [/CHARACTER SHEET\s*[–-]\s*([^(]+?)(?:\s*\(|$)/i, /Name\s*:\s*([^\n\r]+)/i],
    type: 'string'
  },
  age: {
    patterns: [/Age\s*:\s*([^\n\r]+)/i, /(\d+)\s*years?\s*old/i, /(late|early)\s*\d+s/i],
    type: 'string'
  },
  profession: {
    patterns: [/Occupation\s*:\s*([^\n\r]+)/i, /Job\s*:\s*([^\n\r]+)/i, /Work\s*:\s*([^\n\r]+)/i],
    type: 'string'
  },
  
  // APPEARANCE FIELDS
  height: {
    patterns: [/Height\s*:\s*([^\n\r]+)/i, /(\d+['′]\s*\d+["″]?)/],
    type: 'string'
  },
  build: {
    patterns: [/Build\s*:\s*([^.\n\r]+)/i, /Body\s*:\s*([^.\n\r]+)/i],
    type: 'string'
  },
  hairStyle: {
    patterns: [/Hair\s*:\s*([^.\n\r]+)/i],
    type: 'string'
  },
  eyeColor: {
    patterns: [/Eyes?\s*:\s*([^.\n\r]+)/i, /(blue|brown|green|hazel|gray|grey|gold|amber)\s+eyes?/i],
    type: 'string'
  },
  skinTone: {
    patterns: [/Skin\s*:\s*([^.\n\r]+)/i, /Complexion\s*:\s*([^.\n\r]+)/i],
    type: 'string'
  },
  
  // PERSONALITY FIELD
  personalityOverview: {
    patterns: [/Personality\s*:\s*([^\n\r●]+)/i],
    type: 'string'
  },
  
  // STORY ELEMENTS
  storyFunction: {
    patterns: [/\(([^)]+)\)/i],
    type: 'string'
  }
};

// Array fields that should be split into multiple items
const ARRAY_FIELD_PATTERNS = {
  personalityTraits: {
    patterns: [/Personality\s*:\s*([^\n\r●]+)/i],
    splitters: [',', ';', ' and ']
  },
  distinguishingMarks: {
    patterns: [/Distinguishing Features?\s*:([^●]+?)(?=●|$)/is],
    splitters: ['○', '\n']
  },
  skills: {
    patterns: [/Skills?\s*[&:]?\s*Abilities?([^●]+?)(?=●|$)/is],
    splitters: ['\n', '–', '-']
  }
};

export async function extractCharacterFromText(textContent: string): Promise<ExtractedCharacterData> {
  console.log('Production-grade field extraction with pattern matching...');
  
  const characterData: ExtractedCharacterData = {};
  
  // Extract single-value fields
  for (const [fieldName, config] of Object.entries(FIELD_PATTERNS)) {
    for (const pattern of config.patterns) {
      const match = textContent.match(pattern);
      if (match && match[1]) {
        characterData[fieldName] = cleanExtractedText(match[1]);
        break; // Use first successful match
      }
    }
  }
  
  // Extract array fields
  for (const [fieldName, config] of Object.entries(ARRAY_FIELD_PATTERNS)) {
    for (const pattern of config.patterns) {
      const match = textContent.match(pattern);
      if (match && match[1]) {
        const rawText = match[1];
        const items = extractArrayItems(rawText, config.splitters);
        if (items.length > 0) {
          characterData[fieldName] = items;
          break;
        }
      }
    }
  }
  
  // Extract and clean specific color information
  if (characterData.hairStyle) {
    characterData.hairColor = extractColor(characterData.hairStyle);
  }
  
  if (characterData.eyeColor && !characterData.eyeColor.match(/blue|brown|green|hazel|gray|grey|gold|amber/i)) {
    const colorMatch = characterData.eyeColor.match(/(blue|brown|green|hazel|gray|grey|gold|amber|deep)/i);
    if (colorMatch) {
      characterData.eyeColor = colorMatch[1];
    }
  }
  
  // Create composite physical description
  const physicalParts = [];
  if (characterData.height) physicalParts.push(`Height: ${characterData.height}`);
  if (characterData.build) physicalParts.push(`Build: ${characterData.build}`);
  if (characterData.hairStyle) physicalParts.push(`Hair: ${characterData.hairStyle}`);
  if (characterData.eyeColor) physicalParts.push(`Eyes: ${characterData.eyeColor}`);
  if (characterData.skinTone) physicalParts.push(`Skin: ${characterData.skinTone}`);
  
  if (physicalParts.length > 0) {
    characterData.physicalDescription = physicalParts.join('. ');
  }
  
  // Set clean description
  characterData.description = characterData.personalityOverview || characterData.storyFunction || 'Imported character';
  
  // Set profession fields
  if (characterData.profession) {
    characterData.occupation = characterData.profession;
  }
  
  // Add notes
  characterData.notes = `Character imported from document: ${characterData.name || 'Unknown Character'}`;
  
  console.log('✓ Production extraction complete:', {
    name: characterData.name,
    age: characterData.age,
    profession: characterData.profession,
    height: characterData.height,
    build: characterData.build,
    personalityTraits: characterData.personalityTraits?.length || 0,
    distinguishingMarks: characterData.distinguishingMarks?.length || 0,
    skills: characterData.skills?.length || 0,
    fieldsExtracted: Object.keys(characterData).length
  });
  
  return characterData;
}

function cleanExtractedText(text: string): string {
  return text
    .trim()
    .replace(/^[●○]\s*/, '') // Remove bullet points
    .replace(/\s+/g, ' ') // Normalize whitespace
    .replace(/[""]/g, '"') // Normalize quotes
    .substring(0, 500); // Limit length
}

function extractArrayItems(text: string, splitters: string[]): string[] {
  let items = [text];
  
  // Split by each splitter
  for (const splitter of splitters) {
    const newItems = [];
    for (const item of items) {
      newItems.push(...item.split(splitter));
    }
    items = newItems;
  }
  
  // Clean and filter items
  return items
    .map(item => cleanExtractedText(item))
    .filter(item => item.length > 2 && item.length < 200)
    .filter(item => !item.match(/^[●○\s]*$/))
    .slice(0, 10); // Limit to reasonable number
}

function extractColor(text: string): string {
  const colorMatch = text.match(/(black|brown|blonde|red|auburn|dark|light|blue|green|hazel|gray|grey|gold|amber|deep|pale)/i);
  return colorMatch ? colorMatch[1] : '';
}