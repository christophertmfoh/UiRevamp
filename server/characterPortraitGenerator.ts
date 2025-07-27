import type { Character } from '../shared/schema';
import { generateCharacterImage } from './imageGeneration';

/**
 * Automatically generates a character portrait based on comprehensive character data
 * Used during character creation to provide an immediate visual representation
 */
export async function generateCharacterPortrait(character: Partial<Character>): Promise<string | null> {
  try {
    console.log('Generating automatic portrait for character:', character.name);

    // Build comprehensive character prompt from all available data
    const characterPrompt = buildCharacterPrompt(character);
    
    // Use professional portrait styling with character-specific enhancements
    const stylePrompt = buildStylePrompt(character);

    console.log('Portrait generation prompt:', characterPrompt);
    console.log('Style prompt:', stylePrompt);

    // Generate the portrait using the existing image generation system
    const result = await generateCharacterImage({
      characterPrompt,
      stylePrompt,
      aiEngine: 'gemini' // Use Gemini for consistent generation
    });

    console.log('Portrait generated successfully:', result);
    return result.url;

  } catch (error) {
    console.error('Failed to generate automatic portrait:', error);
    // Don't throw - character creation should continue even if portrait fails
    return null;
  }
}

/**
 * Builds a comprehensive character description for portrait generation
 */
function buildCharacterPrompt(character: Partial<Character>): string {
  const parts: string[] = [];

  // Identity information
  if (character.name) {
    parts.push(`Character named ${character.name}`);
  }
  
  if (character.age) {
    parts.push(`${character.age} years old`);
  }

  // Gender field check - using the correct field name
  const genderField = (character as any).gender;
  if (genderField) {
    parts.push(`${genderField}`);
  }

  if (character.race && character.race !== 'Human') {
    parts.push(`${character.race}`);
  }

  // Physical appearance details
  if (character.physicalDescription) {
    parts.push(character.physicalDescription);
  }

  if (character.height) {
    parts.push(`height: ${character.height}`);
  }

  if (character.build) {
    parts.push(`build: ${character.build}`);
  }

  if (character.eyeColor) {
    parts.push(`${character.eyeColor} eyes`);
  }

  if (character.hairColor) {
    parts.push(`${character.hairColor} hair`);
  }

  if (character.hairStyle) {
    parts.push(`hair styled: ${character.hairStyle}`);
  }

  if (character.skinTone) {
    parts.push(`${character.skinTone} skin`);
  }

  if (character.distinguishingMarks && Array.isArray(character.distinguishingMarks)) {
    const marks = character.distinguishingMarks.join(', ');
    parts.push(`distinguishing features: ${marks}`);
  }

  if (character.clothingStyle) {
    parts.push(`dressed in ${character.clothingStyle}`);
  }

  // Personality that affects appearance
  if (character.temperament) {
    parts.push(`${character.temperament} temperament`);
  }

  // Professional/class information that affects appearance
  if (character.class) {
    parts.push(`${character.class}`);
  }

  if (character.profession || character.occupation) {
    const job = character.profession || character.occupation;
    parts.push(`works as ${job}`);
  }

  // Story role information
  if (character.role) {
    parts.push(`character role: ${character.role}`);
  }

  return parts.join(', ');
}

/**
 * Builds style prompts with professional portrait specifications
 */
function buildStylePrompt(character: Partial<Character>): string {
  const baseStyle = 'High-quality portrait photography, professional studio lighting, highly detailed facial features, sharp focus, photorealistic quality, dramatic lighting, masterpiece quality, cinematic composition, expressive eyes, realistic proportions';
  
  const styleEnhancements: string[] = [baseStyle];

  // Add genre-appropriate styling based on character class/role
  if (character.class) {
    const classLower = character.class.toLowerCase();
    
    if (classLower.includes('warrior') || classLower.includes('fighter') || classLower.includes('knight')) {
      styleEnhancements.push('strong confident pose, battle-hardened appearance');
    } else if (classLower.includes('mage') || classLower.includes('wizard') || classLower.includes('sorcerer')) {
      styleEnhancements.push('wise mysterious expression, ethereal lighting');
    } else if (classLower.includes('rogue') || classLower.includes('thief') || classLower.includes('assassin')) {
      styleEnhancements.push('shadowy atmospheric lighting, cunning expression');
    } else if (classLower.includes('healer') || classLower.includes('cleric') || classLower.includes('priest')) {
      styleEnhancements.push('serene compassionate expression, soft warm lighting');
    } else if (classLower.includes('noble') || classLower.includes('lord') || classLower.includes('lady')) {
      styleEnhancements.push('regal bearing, elegant composition, refined atmosphere');
    }
  }

  // Add temperament-based lighting/mood
  if (character.temperament) {
    const tempLower = character.temperament.toLowerCase();
    
    if (tempLower.includes('cheerful') || tempLower.includes('optimistic')) {
      styleEnhancements.push('bright warm lighting, gentle smile');
    } else if (tempLower.includes('serious') || tempLower.includes('stoic')) {
      styleEnhancements.push('strong directional lighting, intense gaze');
    } else if (tempLower.includes('mysterious') || tempLower.includes('enigmatic')) {
      styleEnhancements.push('dramatic shadows, half-lit face, intriguing expression');
    } else if (tempLower.includes('passionate') || tempLower.includes('fiery')) {
      styleEnhancements.push('dynamic lighting, intense emotional expression');
    }
  }

  return styleEnhancements.join(', ');
}