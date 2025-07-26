import { ExtractedCharacterData } from './characterExtractor';

export async function extractCharacterFromText(textContent: string): Promise<ExtractedCharacterData> {
  console.log('Sudowrite-style intelligent field mapping...');
  
  const characterData: ExtractedCharacterData = {};
  
  // IDENTITY FIELDS - Clean extraction without contamination
  const nameMatch = textContent.match(/CHARACTER SHEET\s*[–-]\s*([^(]+?)(?:\s*\(|$)/i);
  if (nameMatch) {
    characterData.name = nameMatch[1].trim();
  }
  
  const ageMatch = textContent.match(/●\s*Age\s*:\s*([^\n\r●]+)/i);
  if (ageMatch) {
    characterData.age = ageMatch[1].trim();
  }
  
  const occupationMatch = textContent.match(/●\s*Occupation\s*:\s*([^\n\r●]+)/i);
  if (occupationMatch) {
    const cleanOccupation = occupationMatch[1].trim();
    characterData.profession = cleanOccupation;
    characterData.occupation = cleanOccupation;
  }
  
  // PERSONALITY - Clean extraction and trait parsing
  const personalityMatch = textContent.match(/●\s*Personality\s*:\s*([^\n●]+)/i);
  if (personalityMatch) {
    const personalityText = personalityMatch[1].trim();
    characterData.personalityOverview = personalityText;
    
    // Parse individual personality traits
    const traits = personalityText
      .split(/[,;]/)
      .map(t => t.trim().replace(/^and\s+/i, ''))
      .filter(t => t.length > 2 && !t.includes('●'))
      .slice(0, 6);
    characterData.personalityTraits = traits;
  }
  
  // APPEARANCE - Extract clean individual fields
  const heightMatch = textContent.match(/●\s*Height\s*:\s*([^\n●]+)/i);
  if (heightMatch) {
    characterData.height = heightMatch[1].trim();
  }
  
  const buildMatch = textContent.match(/●\s*Build\s*:\s*([^.●]+)/i);
  if (buildMatch) {
    characterData.build = buildMatch[1].trim();
  }
  
  const hairMatch = textContent.match(/●\s*Hair\s*:\s*([^.●]+)/i);
  if (hairMatch) {
    const hairText = hairMatch[1].trim();
    characterData.hairColor = extractColorFromDescription(hairText);
    characterData.hairStyle = hairText;
  }
  
  const eyesMatch = textContent.match(/●\s*Eyes\s*:\s*([^.●]+)/i);
  if (eyesMatch) {
    const eyeText = eyesMatch[1].trim();
    characterData.eyeColor = extractColorFromDescription(eyeText);
    characterData.facialFeatures = eyeText;
  }
  
  const skinMatch = textContent.match(/●\s*Skin\s*:\s*([^.●]+)/i);
  if (skinMatch) {
    characterData.skinTone = skinMatch[1].trim();
  }
  
  // DISTINGUISHING FEATURES - Parse as array
  const featuresSection = textContent.match(/●\s*Distinguishing Features\s*:([^●]+?)(?=●|Backstory|$)/is);
  if (featuresSection) {
    const features = featuresSection[1]
      .split(/○/)
      .map(f => f.trim())
      .filter(f => f.length > 0 && f !== '' && !f.match(/^\s*$/))
      .map(f => f.replace(/^\s*/, '').replace(/\.$/, ''));
    
    if (features.length > 0) {
      characterData.distinguishingMarks = features;
    }
  }
  
  // BACKSTORY - Extract comprehensive background
  const backstorySection = textContent.match(/Backstory\s*([^●]*?)(?=●|\n\n|$)/is);
  if (backstorySection) {
    const backstoryText = backstorySection[1].trim();
    characterData.backstory = backstoryText;
    characterData.background = backstoryText.substring(0, 500).trim();
  }
  
  // STORY FUNCTION - From parentheses
  const storyFunctionMatch = textContent.match(/\(([^)]+)\)/i);
  if (storyFunctionMatch) {
    characterData.storyFunction = storyFunctionMatch[1].trim();
  }
  
  // PHYSICAL DESCRIPTION - Compose from individual fields
  const physicalParts = [];
  if (characterData.height) physicalParts.push(`Height: ${characterData.height}`);
  if (characterData.build) physicalParts.push(`Build: ${characterData.build}`);
  if (characterData.hairStyle) physicalParts.push(`Hair: ${characterData.hairStyle}`);
  if (characterData.facialFeatures) physicalParts.push(`Eyes: ${characterData.facialFeatures}`);
  if (characterData.skinTone) physicalParts.push(`Skin: ${characterData.skinTone}`);
  
  if (physicalParts.length > 0) {
    characterData.physicalDescription = physicalParts.join('. ');
  }
  
  // CLEAN DESCRIPTION - Not the whole document
  characterData.description = characterData.personalityOverview || characterData.storyFunction || 'Imported character';
  
  // IMPORT NOTES
  characterData.notes = `Character imported from document: ${characterData.name || 'Unknown Character'}`;
  
  console.log('✓ Field mapping complete:', {
    name: characterData.name,
    age: characterData.age,
    profession: characterData.profession,
    height: characterData.height,
    build: characterData.build,
    hairColor: characterData.hairColor,
    eyeColor: characterData.eyeColor,
    skinTone: characterData.skinTone,
    personalityTraits: characterData.personalityTraits?.length || 0,
    distinguishingMarks: characterData.distinguishingMarks?.length || 0,
    hasBackstory: !!characterData.backstory
  });
  
  return characterData;
}

function extractColorFromDescription(text: string): string {
  const colorMatch = text.match(/(black|brown|blonde|red|auburn|dark|light|blue|green|hazel|gray|grey|gold|amber|deep|pale)/i);
  return colorMatch ? colorMatch[1] : '';
}