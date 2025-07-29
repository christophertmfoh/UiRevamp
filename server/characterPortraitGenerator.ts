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
 * Builds a comprehensive character description for portrait generation using the new 10-category system
 */
function buildCharacterPrompt(character: Partial<Character>): string {
  const parts: string[] = [];

  // ===== IDENTITY INFORMATION =====
  if (character.name) {
    parts.push(`Character named ${character.name}`);
  }
  
  if (character.age) {
    parts.push(`${character.age} years old`);
  }

  if (character.gender) {
    parts.push(`${character.gender}`);
  }

  if (character.species && character.species !== 'Human') {
    parts.push(`${character.species}`);
  }

  if (character.pronouns) {
    parts.push(`pronouns: ${character.pronouns}`);
  }

  // ===== COMPREHENSIVE APPEARANCE DETAILS =====
  // Physical build and stature
  if (character.height) {
    parts.push(`height: ${character.height}`);
  }

  if (character.weight) {
    parts.push(`weight/build: ${character.weight}`);
  }

  if (character.bodyType) {
    parts.push(`body type: ${character.bodyType}`);
  }

  // Detailed hair characteristics
  if (character.hairColor) {
    parts.push(`${character.hairColor} hair`);
  }

  if (character.hairStyle) {
    parts.push(`hair styled: ${character.hairStyle}`);
  }

  if (character.hairTexture) {
    parts.push(`${character.hairTexture} hair texture`);
  }

  // Comprehensive eye details
  if (character.eyeColor) {
    parts.push(`${character.eyeColor} eyes`);
  }

  // Handle both new and legacy field names
  const eyeShapeField = (character as any).eyeShape;
  if (eyeShapeField) {
    parts.push(`${eyeShapeField} eye shape`);
  }

  // Skin and facial features
  if (character.skinTone) {
    parts.push(`${character.skinTone} skin`);
  }

  const facialFeaturesField = (character as any).facialFeatures;
  if (facialFeaturesField) {
    parts.push(`facial features: ${facialFeaturesField}`);
  }

  const physicalFeaturesField = (character as any).physicalFeatures;
  if (physicalFeaturesField) {
    parts.push(`physical characteristics: ${physicalFeaturesField}`);
  }

  // Legacy physicalDescription field fallback
  if (character.physicalDescription) {
    parts.push(`physical description: ${character.physicalDescription}`);
  }

  // Distinctive markings and scars (handle both new and legacy field names)
  const scarsMarkingsField = (character as any).scarsMarkings;
  if (scarsMarkingsField) {
    parts.push(`distinguishing marks: ${scarsMarkingsField}`);
  } else if (character.distinguishingMarks && Array.isArray(character.distinguishingMarks)) {
    const marks = character.distinguishingMarks.join(', ');
    parts.push(`distinguishing marks: ${marks}`);
  }

  // Clothing and accessories (handle both new and legacy field names)
  const clothingField = (character as any).clothing;
  if (clothingField) {
    parts.push(`dressed in ${clothingField}`);
  } else if (character.clothingStyle) {
    parts.push(`dressed in ${character.clothingStyle}`);
  }

  const accessoriesField = (character as any).accessories;
  if (accessoriesField) {
    parts.push(`wearing: ${accessoriesField}`);
  }

  const generalAppearanceField = (character as any).generalAppearance;
  if (generalAppearanceField) {
    parts.push(`overall appearance: ${generalAppearanceField}`);
  }

  // ===== PERSONALITY-DRIVEN VISUAL ELEMENTS =====
  if (character.temperament) {
    parts.push(`${character.temperament} temperament visible in expression`);
  }

  if (character.emotionalState) {
    parts.push(`emotional state: ${character.emotionalState}`);
  }

  if (character.mannerisms) {
    parts.push(`typical mannerisms: ${character.mannerisms}`);
  }

  // ===== PROFESSIONAL/OCCUPATION VISUAL CUES =====
  if (character.occupation) {
    parts.push(`works as ${character.occupation}`);
  }

  if (character.title) {
    parts.push(`holds title: ${character.title}`);
  }

  // ===== STORY ROLE VISUAL INFLUENCE =====
  if (character.role) {
    parts.push(`character role: ${character.role}`);
  }

  const storyImportanceField = (character as any).story_importance;
  if (storyImportanceField) {
    parts.push(`story importance: ${storyImportanceField}`);
  }

  // ===== CULTURAL BACKGROUND VISUAL ELEMENTS =====
  const cultureField = (character as any).culture;
  if (cultureField) {
    parts.push(`cultural background: ${cultureField}`);
  }

  // Handle both social_class and socialClass field names
  const socialClassField = (character as any).social_class || character.socialClass;
  if (socialClassField) {
    parts.push(`social class: ${socialClassField}`);
  }

  return parts.join(', ');
}

/**
 * Builds style prompts with professional portrait specifications based on character traits
 */
function buildStylePrompt(character: Partial<Character>): string {
  const baseStyle = 'High-quality portrait photography, professional studio lighting, highly detailed facial features, sharp focus, photorealistic quality, dramatic lighting, masterpiece quality, cinematic composition, expressive eyes, realistic proportions';
  
  const styleEnhancements: string[] = [baseStyle];

  // Add genre-appropriate styling based on character occupation/role
  if (character.occupation) {
    const occupationLower = character.occupation.toLowerCase();
    
    if (occupationLower.includes('warrior') || occupationLower.includes('fighter') || occupationLower.includes('knight') || occupationLower.includes('soldier')) {
      styleEnhancements.push('strong confident pose, battle-hardened appearance, determined expression');
    } else if (occupationLower.includes('mage') || occupationLower.includes('wizard') || occupationLower.includes('sorcerer') || occupationLower.includes('scholar')) {
      styleEnhancements.push('wise mysterious expression, ethereal lighting, intellectual bearing');
    } else if (occupationLower.includes('rogue') || occupationLower.includes('thief') || occupationLower.includes('assassin') || occupationLower.includes('spy')) {
      styleEnhancements.push('shadowy atmospheric lighting, cunning expression, alert posture');
    } else if (occupationLower.includes('healer') || occupationLower.includes('cleric') || occupationLower.includes('priest') || occupationLower.includes('doctor')) {
      styleEnhancements.push('serene compassionate expression, soft warm lighting, gentle demeanor');
    } else if (occupationLower.includes('noble') || occupationLower.includes('lord') || occupationLower.includes('lady') || occupationLower.includes('royal')) {
      styleEnhancements.push('regal bearing, elegant composition, refined atmosphere');
    } else if (occupationLower.includes('merchant') || occupationLower.includes('trader') || occupationLower.includes('businessman')) {
      styleEnhancements.push('confident expression, well-groomed appearance, professional bearing');
    } else if (occupationLower.includes('artist') || occupationLower.includes('bard') || occupationLower.includes('musician')) {
      styleEnhancements.push('creative expression, artistic lighting, passionate demeanor');
    }
  }

  // Add story role-based styling
  if (character.role) {
    const roleLower = character.role.toLowerCase();
    
    if (roleLower.includes('protagonist')) {
      styleEnhancements.push('heroic lighting, determined expression, central composition');
    } else if (roleLower.includes('antagonist')) {
      styleEnhancements.push('dramatic shadows, intense gaze, commanding presence');
    } else if (roleLower.includes('supporting')) {
      styleEnhancements.push('balanced lighting, approachable expression, confident pose');
    }
  }

  // Add temperament-based lighting/mood
  if (character.temperament) {
    const tempLower = character.temperament.toLowerCase();
    
    if (tempLower.includes('cheerful') || tempLower.includes('optimistic') || tempLower.includes('joyful')) {
      styleEnhancements.push('bright warm lighting, gentle smile, open expression');
    } else if (tempLower.includes('serious') || tempLower.includes('stoic') || tempLower.includes('stern')) {
      styleEnhancements.push('strong directional lighting, intense gaze, composed demeanor');
    } else if (tempLower.includes('mysterious') || tempLower.includes('enigmatic') || tempLower.includes('secretive')) {
      styleEnhancements.push('dramatic shadows, half-lit face, intriguing expression');
    } else if (tempLower.includes('passionate') || tempLower.includes('fiery') || tempLower.includes('intense')) {
      styleEnhancements.push('dynamic lighting, intense emotional expression, vibrant energy');
    } else if (tempLower.includes('calm') || tempLower.includes('peaceful') || tempLower.includes('serene')) {
      styleEnhancements.push('soft even lighting, tranquil expression, relaxed posture');
    } else if (tempLower.includes('melancholy') || tempLower.includes('sad') || tempLower.includes('brooding')) {
      styleEnhancements.push('muted lighting, contemplative expression, subtle shadows');
    }
  }

  // Add emotional state influence
  if (character.emotionalState) {
    const emotionLower = character.emotionalState.toLowerCase();
    
    if (emotionLower.includes('confident') || emotionLower.includes('determined')) {
      styleEnhancements.push('strong eye contact, upright posture, clear sharp lighting');
    } else if (emotionLower.includes('troubled') || emotionLower.includes('conflicted')) {
      styleEnhancements.push('subtle tension in expression, complex lighting, thoughtful pose');
    } else if (emotionLower.includes('hopeful') || emotionLower.includes('optimistic')) {
      styleEnhancements.push('bright clear lighting, forward-looking gaze, open expression');
    }
  }

  // Add social class styling influence
  const socialClassField = (character as any).social_class || character.socialClass;
  if (socialClassField) {
    const classLower = socialClassField.toLowerCase();
    
    if (classLower.includes('upper') || classLower.includes('nobility') || classLower.includes('elite')) {
      styleEnhancements.push('refined composition, elegant lighting, sophisticated bearing');
    } else if (classLower.includes('working') || classLower.includes('common') || classLower.includes('peasant')) {
      styleEnhancements.push('honest expression, natural lighting, authentic demeanor');
    } else if (classLower.includes('merchant') || classLower.includes('middle')) {
      styleEnhancements.push('professional appearance, balanced composition, practical elegance');
    }
  }

  return styleEnhancements.join(', ');
}