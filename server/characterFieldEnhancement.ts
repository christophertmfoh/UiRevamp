import { generateCharacterField } from './services/unifiedAI';
import { FallbackGenerator } from './utils/fallbackGenerator';
import { storage } from './storage';

// Simple contextual fallback system
function generateContextualFallback(fieldKey: string, character: any): string {
  const name = character?.name || '';
  const role = character?.role || '';
  const profession = character?.profession || character?.class || '';
  
  const contextualFallbacks: Record<string, string> = {
    nicknames: name.toLowerCase().includes('xander') ? '"X", "Rex", "Xan"' : 
               role.toLowerCase().includes('ceo') ? '"Chief", "Boss", "Executive"' : 
               '"Ace", "Chief"',
    
    title: role.toLowerCase().includes('ceo') || profession.toLowerCase().includes('ceo') ? 'Chief Executive Officer' :
           role.toLowerCase().includes('love') ? 'Romantic Lead' :
           profession.toLowerCase().includes('entrepreneur') ? 'Business Executive' :
           'Distinguished Professional',
           
    aliases: role.toLowerCase().includes('ceo') ? '"The Executive", "Mr. Corporate"' :
             name.toLowerCase().includes('xander') ? '"The Billionaire", "X-Man"' :
             '"The Professional", "Shadow"',
             
    personality: `Confident and ambitious, with strong leadership qualities. ${name} is analytical and strategic in their approach to challenges, but can sometimes be overly focused on goals at the expense of relationships.`,
    
    goals: `Primary goal: Achieve professional excellence and build lasting success. Secondary goals: Maintain important relationships and make a positive impact in their field.`,
    
    backstory: `${name} grew up in a middle-class family where hard work and determination were valued. Through dedication and strategic thinking, they've built their current position and continue striving for greater achievements.`,
    
    skills: `Strategic planning, leadership, problem-solving, communication, and analytical thinking. Experienced in their professional field with strong interpersonal abilities.`
  };
  
  return contextualFallbacks[fieldKey] || `Generated ${fieldKey}`;
}

// Rate limiting specifically for individual field enhancements
let fieldRequestTimes: number[] = [];
const FIELD_RATE_LIMIT_WINDOW = 60000; // 1 minute
const MAX_FIELD_REQUESTS_PER_MINUTE = 8; // Conservative for individual clicks

function canMakeFieldRequest(): boolean {
  const now = Date.now();
  fieldRequestTimes = fieldRequestTimes.filter(time => time > now - FIELD_RATE_LIMIT_WINDOW);
  
  console.log(`Rate limit check: ${fieldRequestTimes.length}/${MAX_FIELD_REQUESTS_PER_MINUTE} requests in last minute`);
  return fieldRequestTimes.length < MAX_FIELD_REQUESTS_PER_MINUTE;
}

function recordFieldRequest(): void {
  const now = Date.now();
  fieldRequestTimes.push(now);
  console.log(`Recorded field request at ${now}, total: ${fieldRequestTimes.length}`);
}

export async function enhanceCharacterField(character: any, fieldKey: string, fieldLabel: string, currentValue: any, fieldOptions?: string[], isIndividualRequest: boolean = true) {
  try {
    console.log(`\n=== Processing ${isIndividualRequest ? 'Individual' : 'Bulk'} Field Enhancement ===`);
    console.log(`Field: ${fieldKey} (${fieldLabel})`);
    console.log(`Current value: ${currentValue || 'empty'}`);
    console.log(`Character data:`, { name: character?.name, race: character?.race, id: character?.id });

    // Ensure character data exists
    if (!character) {
      console.error('No character data provided to enhanceCharacterField');
      return { [fieldKey]: FallbackGenerator.generateFallback(fieldKey, fieldLabel, {}) };
    }

    // Rate limiting check for individual requests
    const canProceed = canMakeFieldRequest();
    if (isIndividualRequest && !canProceed) {
      console.log(`Individual field rate limit reached, using intelligent fallback for ${fieldKey}`);
      const fallbackContent = FallbackGenerator.generateFallback(fieldKey, fieldLabel, character);
      console.log(`Using contextual fallback for ${fieldKey}: ${fallbackContent}`);
      return { [fieldKey]: fallbackContent };
    }

    // Record the field request for rate limiting
    if (isIndividualRequest) {
      recordFieldRequest();
    }

    // Use unified AI generation service
    try {
      const enhancedContent = await generateCharacterField(
        fieldKey,
        fieldLabel,
        character
      );
      
      console.log(`AI generated content for ${fieldKey}: ${enhancedContent.substring(0, 100)}...`);
      return { [fieldKey]: enhancedContent };
      
    } catch (error) {
      console.log(`AI generation failed for ${fieldKey}, using contextual fallback:`, error);
      const fallbackContent = generateContextualFallback(fieldKey, character);
      return { [fieldKey]: fallbackContent };
    }
  } catch (error) {
    console.error(`Error in enhanceCharacterField for ${fieldKey}:`, error);
    const fallbackContent = generateContextualFallback(fieldKey, character);
    return { [fieldKey]: fallbackContent };
  }
}
