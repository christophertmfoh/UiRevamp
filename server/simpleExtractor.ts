import { ExtractedCharacterData } from './characterExtractor';

export async function extractCharacterFromText(textContent: string): Promise<ExtractedCharacterData> {
  console.log('Extracting character data using rule-based parsing...');
  
  const characterData: ExtractedCharacterData = {};
  
  // Extract name - look for patterns like "CHARACTER SHEET – NAME" or "Name:" 
  const nameMatch = textContent.match(/CHARACTER SHEET\s*[–-]\s*([^(]+?)(?:\s*\(|$)/i) ||
                   textContent.match(/Name\s*:\s*([^\n\r]+)/i) ||
                   textContent.match(/^([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)/);
  if (nameMatch) {
    characterData.name = nameMatch[1].trim();
  }
  
  // Extract age
  const ageMatch = textContent.match(/Age\s*:\s*([^\n\r]+)/i);
  if (ageMatch) {
    characterData.age = ageMatch[1].trim();
  }
  
  // Extract occupation/profession
  const occupationMatch = textContent.match(/Occupation\s*:\s*([^\n\r]+)/i) ||
                         textContent.match(/Profession\s*:\s*([^\n\r]+)/i);
  if (occupationMatch) {
    characterData.profession = occupationMatch[1].trim();
    characterData.occupation = occupationMatch[1].trim();
  }
  
  // Extract personality description
  const personalityMatch = textContent.match(/Personality\s*:\s*([^\n\r]+(?:\s*[^\n\r•●]+)*)/i);
  if (personalityMatch) {
    characterData.personalityOverview = personalityMatch[1].trim();
    
    // Extract personality traits from the description
    const traits = personalityMatch[1].split(/[,;]/).map(t => t.trim()).filter(t => t.length > 0);
    characterData.personalityTraits = traits;
  }
  
  // Extract height
  const heightMatch = textContent.match(/Height\s*:\s*([^\n\r]+)/i);
  if (heightMatch) {
    characterData.height = heightMatch[1].trim();
  }
  
  // Extract build
  const buildMatch = textContent.match(/Build\s*:\s*([^\n\r]+)/i);
  if (buildMatch) {
    characterData.build = buildMatch[1].trim();
  }
  
  // Extract physical description - look for detailed descriptions
  const physicalSections = textContent.match(/Physical Description\s*([^•●]*?)(?=\n\s*[•●]|\n\s*[A-Z][a-z]+\s*:|$)/is);
  if (physicalSections) {
    characterData.physicalDescription = physicalSections[1].trim();
  }
  
  // Extract backstory or background sections
  const backstoryMatch = textContent.match(/(?:Backstory|Background|History)\s*:?\s*([^•●]*?)(?=\n\s*[•●]|\n\s*[A-Z][a-z]+\s*:|$)/is);
  if (backstoryMatch) {
    characterData.backstory = backstoryMatch[1].trim();
    characterData.background = backstoryMatch[1].trim();
  }
  
  // For Evelyn specifically, extract the descriptor from parentheses
  const descriptorMatch = textContent.match(/\(([^)]+who[^)]+)\)/i);
  if (descriptorMatch) {
    characterData.storyFunction = descriptorMatch[1].trim();
  }
  
  // Create a comprehensive description from all available text
  characterData.description = textContent.substring(0, 1000).trim();
  
  // Add some default fields to make the character more complete
  if (characterData.name) {
    characterData.notes = `Character imported from document: ${characterData.name}`;
  }
  
  console.log('Extracted character data:', {
    name: characterData.name,
    age: characterData.age,
    profession: characterData.profession,
    height: characterData.height,
    personalityTraits: characterData.personalityTraits?.length || 0,
    hasDescription: !!characterData.description
  });
  
  return characterData;
}